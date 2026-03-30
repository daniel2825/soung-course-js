import {View, Text, Platform,StyleSheet} from 'react-native'
import React from 'react'
import Header from '../../components/Home/header'
import Colors from '../../constants/Colors'
import ProgressContentNavigator from '../ProgressContent/Progress_content_navigator'

const Home = () => {

    return (
        <View style={{
            backgroundColor: Colors.BACKGROUND,
            height: '100%',
        }}>
            <Header/>
            <ProgressContentNavigator />          
        </View>
    );
  };
  
  export default Home;
