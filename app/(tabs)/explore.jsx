import { View, Text } from 'react-native'
import React from 'react'
import Header from '../../components/Home/header'
import Colors from '../../constants/Colors'
import ContentNavigator from '../Content/content_navigator'
import { useRoute } from '@react-navigation/native';



export default function Explore() {
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
            <Header />
            <ContentNavigator params={dataToSend}/>
        </View>
    )
}
