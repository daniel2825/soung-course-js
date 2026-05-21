import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import CourseList from "./CourseList";
import client from '../../clients/apolloClient';
import ContentCourse from "../Content/content"
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

      <Stack.Navigator initialRouteName="CourseList"
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name="CourseList" component={CourseList} initialParams={dataToSend} />
        <Stack.Screen name="ContentCourse" component={ContentCourse} />
      </Stack.Navigator>
    </ApolloProvider>

  );
};

export default ContentNavigator;