import {View, Text, Platform,StyleSheet} from 'react-native'
import { useRoute } from '@react-navigation/native';
import React from 'react'
import Header from '../../components/Home/header'
import Colors from '../../constants/Colors'

const ContentCourse = () => {
    const route = useRoute();
    const { titlecourse } = route.params;
    console.log('Title course:', titlecourse);

    return (
        <View style={{
            backgroundColor: Colors.BACKGROUND,
            height: '100%',
        }}>
            
        </View>
    );
  };
  
  export default ContentCourse;
