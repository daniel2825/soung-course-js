import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from "../Home/init";
import Personal from "../Home";

const Stack = createNativeStackNavigator();

const MainNavigator = () => {
  return (
      <Stack.Navigator initialRouteName="Home"
                       screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Personal" component={Personal} />
      </Stack.Navigator>
  );
};

export default MainNavigator;