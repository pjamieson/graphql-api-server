# graphql-api-server

A stand-alone Node.js server providing a Relay-compliant GraphQL API endpoint which serves information about several hundred Caribbean authors and their published books.

Initially, this backend server will be supporting the data needs of WestIndiesBooks.com; it will subsequently also support iBookX.com and iArtX.com.

This is my first GraphQL project, though I have been developing and consuming RESTful APIs for years. I am intrigued by GraphQL's capability to provide exactly the data a client wants (and no more) with a single request/response roundtrip, and with this project that's exactly what I will be doing.

I followed a number of tutorials, and read several books before beginning this project, most notably the JavaScript reference inplementation for GraphQL at https://github.com/graphql/graphql-js, the Relay/GraphQL tutorial at https://facebook.github.io/relay/docs/tutorial.html#content, and the excellent book *Learning GraphQL and Relay* by Samer Buna, published by Packt Publishing in August 2016. Those tutorials and books included both the front-end web app and the back-end GraphQL API server in a single development project. Since I wanted to build a stand-alone API server that's capable of supporting multiple client apps, my first obvious requirement was to create a server independently from any client app. Starting this project with that fundamental requirement also hepled to distinguish the boundries between client and API layers.

My initial observation is that this API layer is smaller than I thought it would be, and the client app layer is larger. (The first client app that leverages this API server is in the sister project **react-relay-client**.) It all starts in *server.js*, but everything that matters happens in *data/schema.js*.


##The data this API accesses is stored in my publicly-available MongoDB database at:
    mongodb://guest:cascadu@ds041561.mlab.com:41561/cascadu


##You can also set up your own local MongoDB for this server to access as follows:

1. Add a database named "cascadu" to your local MongoDB instance
2. Import the seed data found in this project's /data directory to an "authors" collection

    $ *mongoimport -d cascadu -c authors --file /path/to/authors_mongo_seed.json --jsonArray*

3. In this project's server.js file, use the localhost URL


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

**A deeper query:**

    {
      authorsList {
        authorsConnection {
          edges {
            node {
              alpha_order_name
              birth_country
              birth_year
              death_year
              books {
                title
                pub_year
                editions {
                  publisher
                  pub_info
                }
              }
            }
          }
        }
      }
    }


More to come...