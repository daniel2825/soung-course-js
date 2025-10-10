import {View, Text} from 'react-native'
import React from 'react'
import Header from '../../components/Home/header'
import Colors from '../../constants/Colors'
import ProgressContentNavigator from '../ProgressContent/Progress_content_navigator'


export default function Explore(){
    return (
        <View style={{
                    backgroundColor: Colors.BACKGROUND,
                    height: '100%',
                }}>
            <Header/>
            <ProgressContentNavigator/>
        </View>
    )
}
