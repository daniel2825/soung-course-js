import {View, Text, Platform, FlatList, Image} from 'react-native'
import React from 'react'
import { imageAssets } from '../../constants/Options'
import { Storage } from 'aws-amplify';

export default function CourseList(){

    const getFile = async (fileName) => {
        try {
          const signedUrl = await Storage.get(fileName); // returns a signed URL
          console.log('File URL:', signedUrl);
          // You can now open this URL or display it in your app
        } catch (err) {
          console.error('Error getting file:', err);
        }
      };

    getFile("jairsantrich.png");

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
