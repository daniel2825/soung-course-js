import {View, Text, Platform} from 'react-native'
import React from 'react'
import Header from '../../components/Home/header'
import Button from '../../components/Shared/Button'
import Colors from '../../constants/Colors'

export default function Home(){
    return (
        <View style={{
            backgroundColor: Colors.BACKGROUND,
            height: '100%',
        }}>
            <Header/>
            <Button text={'Enviar'} type='outline'/>
        </View>
    )
}
