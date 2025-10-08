import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import CourseList from "./CourseList";
import ContentCourse from "../Content/content"

const Stack = createNativeStackNavigator();

const ContentNavigator = () => {
  return (
      <Stack.Navigator initialRouteName="CourseList"
                       screenOptions={{ headerShown: false }}>
        <Stack.Screen name="CourseList" component={CourseList} />
        <Stack.Screen name="ContentCourse" component={ContentCourse} />
      </Stack.Navigator>
  );
};

export default ContentNavigator;