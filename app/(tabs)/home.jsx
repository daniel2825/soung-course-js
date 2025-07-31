import {View, Text, Platform,StyleSheet} from 'react-native'
import React from 'react'
import Header from '../../components/Home/header'
import Button from '../../components/Shared/Button'
import Colors from '../../constants/Colors'
import Courses from '../../components/Home/CourseList'
import NoCourses from '../../components/Home/NoCourses'

export default function Home(){
      
    return (
        
        <View style={{
            backgroundColor: Colors.BACKGROUND,
            height: '100%',
        }}>
            <Header/>
            <Courses/>

            
        </View>
    )
    
}
