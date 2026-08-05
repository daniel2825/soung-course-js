import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import ProgressCourseList from "./ProgressCourseList";
import ProgressContentCourse from "../Content/content";
import { useRoute } from '@react-navigation/native';
import client from '../../clients/apolloClient';
import { ApolloProvider } from '@apollo/client';


const Stack = createNativeStackNavigator();

const ProgressContentNavigator = () => {
  const route = useRoute();
  const { email } = route.params;

  const dataToSend = {
    email: email
  }

  return (
    <ApolloProvider client={client}>
      <Stack.Navigator initialRouteName="ProgressCourseList"
                       screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ProgressCourseList" component={ProgressCourseList} initialParams={dataToSend}/>
        <Stack.Screen name="ProgressContentCourse" component={ProgressContentCourse} />
      </Stack.Navigator>
    </ApolloProvider>
  );
};

export default ProgressContentNavigator;