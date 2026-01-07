import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { useRoute } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout(){

    return (
        <Tabs screenOptions={{
            headerShown:false 
        }} >
            <Tabs.Screen name='home' 
            options={{
                tabBarIcon:({color,size})=><Ionicons name="home-sharp" size={size} color={color} />,
                tabBarLabel: "Menu" 
            }}
            />
            <Tabs.Screen name='explore'
            options={{
                tabBarIcon:({color,size})=><Ionicons name="airplane" size={size} color={color} />,
                tabBarLabel: "Cursos" 
            }} />
            <Tabs.Screen name='progress'
            options={{
                tabBarIcon:({color,size})=><Ionicons name="bar-chart" size={size} color={color} />,
                tabBarLabel: "Mi progreso" 
            }} />
            {/*
            <Tabs.Screen name='fans' 
            options={{
                tabBarIcon:({color,size})=><Ionicons name="people-circle" size={size} color={color} />,
                tabBarLabel: "Fans" 
            }}/>
            */}
        </Tabs>
    )

}