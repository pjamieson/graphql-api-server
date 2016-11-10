# graphql-api-server

A GraphQL API server initially supporting the data needs of WestIndiesBooks.com

The data itself is stored in a MongoDB database:

mongodb://guest:cascadu@ds041561.mlab.com:41561/cascadu

Example GraphQL query:

{
  authorsLibrary {
    authorsConnection {
      edges {
        node {
          last_name
          first_name
          birth_country
        }
      }
    }
  }
}

Response:

{
  "data": {
    "authorsLibrary": {
      "authorsConnection": {
        "edges": [
          {
            "node": {
              "last_name": "Aarons",
              "first_name": "Rudolph L. C.",
              "birth_country": "Jamaica"
            }
          },
          {
            "node": {
              "last_name": "Aboud",
              "first_name": "James",
              "birth_country": "Trinidad and Tobago"
            }
          },
          ...
          {
            "node": {
              "last_name": "Zobel",
              "first_name": "Joseph",
              "birth_country": "Martinique"
            }
          }
        ]
      }
    }
  }
}