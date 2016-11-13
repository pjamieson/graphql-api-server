# graphql-api-server

A stand-alone Node.js server providing a GraphQL API endpoint which serves information about several hundred Caribbean authors and their published books.

Initially, this backend server will be supporting the data needs of WestIndiesBooks.com; it will subsequently also support iBookX.com and iArtX.com.

This is my first GraphQL project, though I have been developing and consuming RESTful APIs for years. I am intrigued by GraphQL's capability to provide exactly the data a client wants (and no more) with a single request/response roundtrip.

The tutorials I followed and the books I read before beginning this project--most notably the Relay/GraphQL tutorial at https://facebook.github.io/relay/docs/tutorial.html#content, and the excellent book *Learning GraphQL and Relay* by Samer Buna, published by Packt Publishing in August 2016--all included both the front-end web app and the back-end GraphQL API server in a single development project. Since I wanted a stand-alone API server that's capable of supporting multiple client apps, my first obvious task was to create a server independently from any client app; that was the first requirement for this project. Starting there also hepled to distinguish the boundries between application layers.

My initial observation is that this API layer is smaller than I thought it would be, and the client app layer is larger. (The first client app that leverages this API server is in the sister project **react-relay-client**.)


##The data this API accesses is stored in my publicly-available MongoDB database at:

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

**The response to this query:**

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