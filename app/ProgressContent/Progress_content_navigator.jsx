import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import ProgressCourseList from "./ProgressCourseList";
import ProgressContentCourse from "../Content/content"

const Stack = createNativeStackNavigator();

const ProgressContentNavigator = () => {
  return (
      <Stack.Navigator initialRouteName="ProgressCourseList"
                       screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ProgressCourseList" component={ProgressCourseList} />
        <Stack.Screen name="ProgressContentCourse" component={ProgressContentCourse} />
      </Stack.Navigator>
  );
};

export default ProgressContentNavigator;