import {View, Text, Platform, FlatList, Image} from 'react-native'
import React from 'react'
import Options, { imageAssets } from '../../constants/Options'

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
                    {key: 'Tecnica vocal', banner_image: '/banner1.png'},
                    {key: 'Ejercitar voz', banner_image: '/banner2.png'},
                    {key: 'Vocalizacion', banner_image: '/banner3.png'}
                    //{key: 'Resonancia'},
                    //{key: 'Intensidad'},
                    //{key: 'Respiración'},
                    ]}
                horizontal={false}
                renderItem={({item,index}) => (
                    <View> 
                      <Image source={imageAssets[item.banner_image]}
                      style = {{
                        width: '100%',
                        height: 200,
                        borderRadius: 15
                      }} />  
                      <Text>{item.key}</Text>
                    </View>

                )
            }  
            />
        </View>
    )
}
