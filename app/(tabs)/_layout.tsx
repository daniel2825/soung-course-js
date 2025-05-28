import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'

export default function TabLayout(){

    return (
        <Tabs>
            <Tabs.Screen name='menu' />
            <Tabs.Screen name='explorar' />
            <Tabs.Screen name='progreso' />
        </Tabs>
    )

}