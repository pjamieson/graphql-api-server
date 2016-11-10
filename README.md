# graphql-api-server

A GraphQL API server initially supporting the data needs of WestIndiesBooks.com

The data itself is stored in a MongoDB database.

Example GraphQL query:

{
  authorsLibrary {
    id
    authorsConnection {
      edges {
        node {
          id
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
      "id": "QXV0aG9yc0xpYnJhcnk6",
      "authorsConnection": {
        "edges": [
          {
            "node": {
              "id": "QXV0aG9yOjU4MjM5ZWFmNDkwNzkyZDA1MjNhMDYzNA==",
              "last_name": "Aarons",
              "first_name": "Rudolph L. C.",
              "birth_country": "Jamaica"
            }
          },
          {
            "node": {
              "id": "QXV0aG9yOjU4MjM5ZWFmNDkwNzkyZDA1MjNhMDYzNQ==",
              "last_name": "Aboud",
              "first_name": "James",
              "birth_country": "Trinidad and Tobago"
            }
          },
          ...
          {
            "node": {
              "id": "QXV0aG9yOjU4MjM5ZWFmNDkwNzkyZDA1MjNhMDc2Nw==",
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