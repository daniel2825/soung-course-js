import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import client from '../../clients/apolloClient';
import TrackingList from "../Tracking/TrackingList"
import { useRoute } from '@react-navigation/native';
import { ApolloProvider } from '@apollo/client';


const Stack = createNativeStackNavigator();

const ContentNavigator = () => {

  const route = useRoute();
  const { email } = route.params;

  const dataToSend = {
    email: email
  }

  return (
    <ApolloProvider client={client}>

      <Stack.Navigator initialRouteName="TrackingList"
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name="TrackingList" component={TrackingList} initialParams={dataToSend} />
      </Stack.Navigator>
    </ApolloProvider>

  );
};

export default ContentNavigator;