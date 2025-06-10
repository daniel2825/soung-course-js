import {View, Text, Touchable, TouchableOpacity} from 'react-native'
import React, { useContext, useState} from 'react'
import { UserDetailContext } from '../../context/UserDetailContext'
import Ionicons from '@expo/vector-icons/Ionicons'
import AntDesign from '@expo/vector-icons/AntDesign';
import Colors from '../../constants/Colors'
import { useRouter } from 'expo-router';


export default function Header2(){
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
            <TouchableOpacity onPress={() => router.push('/home')}>
                <AntDesign name="doubleleft" size={24} color="black" />
            </TouchableOpacity>
            <Text style={{
                            fontFamily: 'outfit-bold',
                            fontSize: 20
                        }}>Perfil</Text>
            
        </View>
    )
}
