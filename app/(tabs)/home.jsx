import {View, Text, Platform,StyleSheet} from 'react-native'
import React from 'react'
import Header from '../../components/Home/header'
import Colors from '../../constants/Colors'
import { useRoute } from '@react-navigation/native';
import ProgressContentNavigator from '../ProgressContent/Progress_content_navigator'

const Home = () => {
    const route = useRoute();
    const { email } = route.params;

    const dataToSend = {
      email: email
    }

    return (
        <View style={{
            backgroundColor: Colors.BACKGROUND,
            height: '100%',
        }}>
            <Header/>
            <ProgressContentNavigator params={dataToSend}/>          
        </View>
    );
  };
  
  export default Home;
