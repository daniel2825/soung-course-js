import { ApolloClient, InMemoryCache } from '@apollo/client';
//from android devices must be put local ip from machine
//uri: 'http://192.168.49.1:9081/graphql', 
// from local connections
//uri: 'http://localhost:9081/graphql',

const client = new ApolloClient({
  uri: 'http://192.168.49.1:9081/graphql', 
  cache: new InMemoryCache()
});

alert("hola apollo");

export default client;
