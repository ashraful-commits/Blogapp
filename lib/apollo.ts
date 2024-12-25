import { ApolloClient, InMemoryCache } from '@apollo/client'

console.log(process.env.NEXT_GRAPHQL_URL);
const apolloClient = new ApolloClient({

  uri: process.env.NEXT_GRAPHQL_URL,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "no-cache",
    },
    query: {
      fetchPolicy: "no-cache",
    },
  },
})

export default apolloClient
