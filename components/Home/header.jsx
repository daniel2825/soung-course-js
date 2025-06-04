import {View, Text, Touchable, TouchableOpacity} from 'react-native'
import React, { useContext, useState} from 'react'
import { UserDetailContext } from '../../context/UserDetailContext'
import Ionicons from '@expo/vector-icons/Ionicons'
import Colors from '../../constants/Colors'
import { useRouter } from 'expo-router';


export default function Header(){
    //const {useDetails,setUseDetails}=useContext(UserDetailContext)
    const router = useRouter();
    
    return (
        <View style={{
            padding:25,
            display: 'flex',
            backgroundColor:Colors.WHITE,
            flexDirection: 'row',
            justifyContent: 'space-between'
        }}>
            <Text style={{
                fontFamily: 'outfit-bold',
                fontSize: 18
            }}>Hello JS</Text>
            <TouchableOpacity onPress={() => router.push('/Profile/profile')}>
                <Ionicons name="person-sharp" size={24} color="black" />
            </TouchableOpacity>
        </View>
    )
}
