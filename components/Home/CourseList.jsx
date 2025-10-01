import {View, Text, Platform, FlatList, Image} from 'react-native'
import { imageAssets } from '../../constants/Options'
import { getUrl } from '@aws-amplify/storage';
import { StorageImage } from '@aws-amplify/ui-react-storage';
import React, { useEffect, useState } from 'react';
import { BannerItems } from '../../model/BannerItems'; 

const CourseList = () => {

  
    const [items, setItems] = useState<BannerItems>([]);

/*
    [
                    {key: 'Tecnica vocal', banner_image: 'images/banner1.png'},
                    {key: 'Ejercitar voz', banner_image: 'images/banner2.png'},
                    {key: 'Vocalizacion', banner_image: 'images/banner3.png'}
                    //{key: 'Resonancia'},
                    //{key: 'Intensidad'},
                    //{key: 'Respiración'},
                    ]*/
    
    useEffect(() => {
        getFileUrl("Tecnica vocal","images/banner1.png");
        getFileUrl("Ejercitar voz","images/banner2.png");
        getFileUrl("Vocalizacion","images/banner3.png");
      }, []);

    const getFileUrl = async (key,path) => {
      try {
        const urlResult = await getUrl({ path });
        addItem(key,String(urlResult.url))
        return String(urlResult); // this is the signed URL (string)
      } catch (error) {
        console.error('Error getting file URL:', error);
        return null;
      }
    };

    const addItem = (key, banner) => {
    const newItem = {
      key: key,
      banner_image: banner,
    };
    setBannerList([newItem]);
    console.log(banner, typeof banner);
  };

    
/*
    if(!banner){
      return <Text style={{
                fontFamily: 'output-bold',
                fontSize: 25
            }}>loading</Text>;
    }*/



    return (
        <View style={{
            padding: 10
        }}>
            <Text style={{
                fontFamily: 'output-bold',
                fontSize: 25
            }}>Courses</Text>
            {/*
            <Image source={{uri: banner}}
                      style = {{
                        width: '100%',
                        height: 200,
                        borderRadius: 15
                      }} />*/}

             <FlatList
                data={banner}
                horizontal={false}
                renderItem={({item,index}) => (
                    <View> 
                      <Image source={{uri: imageAssets[item.banner_image]}}
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

export default CourseList;
