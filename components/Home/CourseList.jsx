import {View, Text, Platform, FlatList} from 'react-native'
import React from 'react'
import Header from '../../components/Home/header'
import Button from '../../components/Shared/Button'
import Colors from '../../constants/Colors'

export default function CourseList(){
    
    return (
        <View style={{
            padding: 10
        }}>
            <Text style={{
                fontFamily: 'output-bold',
                fontSize: 25
            }}>Courses</Text>

            <FlatList
                data={[
                    {key: 'Tecnica vocal'},
                    {key: 'Ejercitar voz'},
                    {key: 'Vocalizacion'},
                    {key: 'Resonancia'},
                    {key: 'Intensidad'},
                    {key: 'Respiración'},
                    ]}
                horizontal={true}
                renderItem={({item,index}) => (
                    <View> 
                      <Text>{item.key}</Text>
                    </View>

                )
            }  
            />
        </View>
    )
}
