import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
//from android devices must be put local ip from machine
//uri: 'http://192.168.49.1:9081/graphql', 
// from local connections
//uri: 'http://localhost:9081/graphql',

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'http://192.168.1.16:9081/graphql',
  }),
  cache: new InMemoryCache()
});

export default client;