const { MongoClient } = require('mongodb');
const assert = require('assert');
const graphqlHTTP = require('express-graphql');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 4000;

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

  app.listen(PORT, () =>
    console.log('Running GraphQL API server on port:', PORT)
  );
});
