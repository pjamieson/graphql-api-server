const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLBoolean,
  GraphQLEnumType
} = require('graphql');

const {
  mutationWithClientMutationId,
  globalIdField,
  fromGlobalId,
  nodeDefinitions,
  connectionDefinitions,
  connectionArgs,
  connectionFromArray,
  connectionFromPromisedArray
} = require('graphql-relay');

const { ObjectID } = require('mongodb');

const globalIdFetcher = (globalId, { db }) => {
  const { type, id } = fromGlobalId(globalId);
  switch (type) {
    case 'AuthorsList':
      // We only have one author list
      return authorsList;
    case 'Author':
      return db.collection('authors').findOne(ObjectID(id));
    default:
      return null;
  }
};

const globalTypeResolver = obj => obj.type || AuthorType;

const { nodeInterface, nodeField } = nodeDefinitions(
  globalIdFetcher,
  globalTypeResolver
);

const EditionType = new GraphQLObjectType({
  name: 'Edition',
  fields: {
    publisher: {
      type: GraphQLString,
      description: 'The publisher of the edition'
    },
    pub_info: {
      type: GraphQLString,
      description: 'The place publised, the publisher, and the publication year.'
    }
  }
});

const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: {
    title: {
      type: GraphQLString,
      description: 'The title of the book'
    },
    pub_year: {
      type: GraphQLString,
      description: 'The year the book was first published.'
    },
    editions: {
      type: new GraphQLList(EditionType),
      description: 'The published editions of the book.'
    }
  }
});

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  interfaces: [ nodeInterface ],
  fields: {
    id: globalIdField('Author', obj => obj._id),
    first_name: {
      type: GraphQLString,
      description: 'The first name of the creator.'
    },
    last_name: {
      type: GraphQLString,
      description: 'The last name of the creator.'
    },
    full_name: {
      type: GraphQLString,
      description: 'The full name of the creator.',
      resolve: obj => obj.first_name + ' ' + obj.last_name
    },
    alpha_order_name: {
      type: GraphQLString,
      description: 'The alpha order name of the creator.',
      resolve: obj => obj.last_name + ', ' + obj.first_name
    },
    birth_country: { type: GraphQLString },
    birth_year: { type: GraphQLString },
    death_year: { type: GraphQLString },
    books: {
      type: new GraphQLList(BookType),
      description: 'The books by an author'
    },
    likesCount: {
      type: GraphQLInt,
      resolve: obj => obj.likesCount || 0
    }
  }
});

const { connectionType: AuthorsConnectionType } =
  connectionDefinitions({
    name: 'Author',
    nodeType: AuthorType
  });

let connectionArgsWithSearch = connectionArgs;
connectionArgsWithSearch.searchTerm = { type: GraphQLString };

const AuthorsListType = new GraphQLObjectType({
  name: 'AuthorsList',
  interfaces: [nodeInterface],
  fields: {
    id: globalIdField('AuthorsList'),
    authorsConnection: {
      type: AuthorsConnectionType,
      description: 'A list of the authors in the database',
      args: connectionArgsWithSearch,
      resolve: (_, args, { db }) => {
        let findParams = {};
        let sortParams = { "last_name": 1, "first_name": 1 }
        if (args.searchTerm) {
          findParams = {
            $or: [
              { "last_name": new RegExp(args.searchTerm, 'i') },
              { "first_name": new RegExp(args.searchTerm, 'i') },
            ]
          };
          //findParams.birth_country = new RegExp('Jamaica', 'i');
        }
        return connectionFromPromisedArray(
          db.collection('authors').find(findParams).sort(sortParams).toArray(),
          args
        );
      }
    }
  }
});

const authorsList = { type: AuthorsListType };

const queryType = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    node: nodeField,
    authorsList: {
      type: AuthorsListType,
      description: 'The Authors List',
      resolve: () => authorsList
    }
  }
});

const thumbsUpMutation = mutationWithClientMutationId({
  name: 'ThumbsUpMutation',
  inputFields: {
    authorId: { type: GraphQLString }
  },
  outputFields: {
    author: {
      type: AuthorType,
      resolve: obj => obj
    }
  },
  mutateAndGetPayload: (params, { db }) => {
    const { id } = fromGlobalId(params.authorId);
    return Promise.resolve(
      db.collection('authors').updateOne(
        { _id: ObjectID(id) },
        { $inc: { likesCount: 1 } }
      )
    ).then(result =>
      db.collection('authors').findOne(ObjectID(id)));
  }
});

const mutationType = new GraphQLObjectType({
  name: 'RootMutation',
  fields: {
    thumbsUp: thumbsUpMutation
  }
});

const cascaduSchema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType
});

module.exports = cascaduSchema;
