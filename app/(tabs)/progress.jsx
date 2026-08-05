import {View, Text} from 'react-native'
import React from 'react'
import Header from '../../components/Home/header'
import { useRoute } from '@react-navigation/native';



export default function Progress(){
    const route = useRoute();
    const { email } = route.params;

    const dataToSend = {
      email: email
    }
    
    return (
        <View>
            <Header/>
            <Text>progress</Text>
        </View>
    )
}
