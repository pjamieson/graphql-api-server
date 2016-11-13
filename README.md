# graphql-api-server

A stand-alone Node.js server providing a GraphQL API endpoint which serves information about several hundred Caribbean authors and their published books.

Initially, this backend server is supporting the data needs of WestIndiesBooks.com; it will soon also support iBookX.com and iArtX.com.

##The data itself is stored in a publicly-available MongoDB database:

mongodb://guest:cascadu@ds041561.mlab.com:41561/cascadu

##You can also set up your own local MongoDB for this server to access as follows:

1) Add a database named "cascadu" to your local MongoDB instance

2) Import the seed data found in this project's /data directory to an "authors" collection

    $ mongoimport -d cascadu -c authors --file /path/to/authors_mongo_seed.json --jsonArray

3) In this project's server.js file, use the localhost URL


##Here's an example of a simple GraphQL query against this server:

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

More to come...