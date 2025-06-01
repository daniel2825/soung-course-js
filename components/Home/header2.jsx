import {View, Text, Touchable, TouchableOpacity} from 'react-native'
import React, { useContext, useState} from 'react'
import { UserDetailContext } from '../../context/UserDetailContext'
import Ionicons from '@expo/vector-icons/Ionicons'
import AntDesign from '@expo/vector-icons/AntDesign';
import Colors from '../../constants/Colors'
import { useRouter } from 'expo-router';

const router = useRouter();


export default function Header2(){
    //const {useDetails,setUseDetails}=useContext(UserDetailContext)
    
    return (
        <View style={{
            padding:25,
            display: 'flex',
            backgroundColor:Colors.WHITE,
            flexDirection: 'row',
            justifyContent: 'space-between'
        }}>
            <TouchableOpacity onPress={() => router.push('./Home/index')}>
                <AntDesign name="doubleleft" size={24} color="black" />
            </TouchableOpacity>
            <Text style={{
                            fontFamily: 'outfit-bold',
                            fontSize: 20
                        }}>Perfil</Text>
            
        </View>
    )
}
