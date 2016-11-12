# graphql-api-server

A GraphQL API server initially supporting the data needs of WestIndiesBooks.com

The data itself is stored in a MongoDB database:

mongodb://guest:cascadu@ds041561.mlab.com:41561/cascadu

Example GraphQL query:

{
  authorsList {
    authorsConnection {
      edges {
        node {
          alpha_order_name
          birth_country
        }
      }
    }
  }
}

Response:

{
  "data": {
    "authorsList": {
      "authorsConnection": {
        "edges": [
          {
            "node": {
              "alpha_order_name": "Aarons, Rudolph L. C.",
              "birth_country": "Jamaica"
            }
          },
          {
            "node": {
              "alpha_order_name": "Aboud, James",
              "birth_country": "Trinidad and Tobago"
            }
          },
          ...
          {
            "node": {
              "alpha_order_name": "Zobel, Joseph",
              "birth_country": "Martinique"
            }
          }
        ]
      }
    }
  }
}