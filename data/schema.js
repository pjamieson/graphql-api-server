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

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  interfaces: [nodeInterface],
  fields: {
    id: globalIdField('Author', obj => obj._id),
    first_name: { type: GraphQLString },
    last_name: { type: GraphQLString },
    full_name: {
      type: GraphQLString,
      resolve: obj => obj.first_name + ' ' + obj.last_name
    },
    alpha_order_name: {
      type: GraphQLString,
      resolve: obj => obj.last_name + ', ' + obj.first_name
    },
    birth_country: { type: GraphQLString },
    birth_year: { type: GraphQLString },
    death_year: { type: GraphQLString },
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
        if (args.searchTerm) {
          findParams.last_name = new RegExp(args.searchTerm, 'i');
        }
        return connectionFromPromisedArray(
          db.collection('authors').find(findParams).toArray(),
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
