// import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

// const client = new ApolloClient({
//   link: new HttpLink({
//     uri: "http://localhost:3000/graphql", // ✅ Ensure this is correct
//     headers: {
//       "Content-Type": "application/json",
//     },
//   }),
//   cache: new InMemoryCache(),
//   defaultOptions: {
//     watchQuery: {
//       fetchPolicy: "no-cache", // ✅ Ensure fresh queries
//     },
//   },
// });

// export default client;

import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import fetch from "cross-fetch"; // ✅ Add this line

const client = new ApolloClient({
  link: new HttpLink({
    uri: "http://localhost:3000/graphql",
    fetch, // ✅ Explicitly pass fetch to HttpLink
    headers: {
      "Content-Type": "application/json",
    },
  }),
  cache: new InMemoryCache(),
});

export default client;
