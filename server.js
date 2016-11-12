const { MongoClient } = require('mongodb');
const assert = require('assert');
const graphqlHTTP = require('express-graphql');
const express = require('express');
const bodyParser = require('body-parser'); // express middleware - parses incoming requests
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json({ type: '*/*'}));

const schema = require('./data/schema');
const MONGO_URL =
  //'mongodb://localhost:27017/cascadu';
  'mongodb://guest:cascadu@ds041561.mlab.com:41561/cascadu';

MongoClient.connect(MONGO_URL, (err, db) => {
  assert.equal(null, err);
  console.log('Connected to MongoDB server');

  app.use('/graphql',
      graphqlHTTP({
        schema: schema,
        context: { db },
        graphiql: true
      })/* : Middleware */
  );

  app.listen(4000, () =>
    console.log('Running a GraphQL API server at localhost:4000/graphql')
  );
});
