import {View, Text, Platform,ActivityIndicator, FlatList,StyleSheet ,Image} from 'react-native'
import FastImage from 'react-native-fast-image';
import { getUrl } from '@aws-amplify/storage';
import { StorageImage } from '@aws-amplify/ui-react-storage';
import React, { useEffect, useState } from 'react';
import { BannerItems } from '../../model/BannerItems'; 

const CourseList = () => {

    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);

    const bannerPaths = [
    'images/banner1.jpg',
    'images/banner2.jpg',
    'images/banner3.jpg'
  ];
    

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

        getFileUrl();
      //  getFileUrl("Ejercitar voz","images/banner2.jpg");
      //  getFileUrl("Vocalizacion","images/banner3.jpg");
      }, []);

    const getFileUrl = async () => {
    try {
      const urls = await Promise.all(
        bannerPaths.map(async (path) => {
          const { url } = await getUrl({
            path,
            options: {
              accessLevel: 'public', // 👈 Important: Do NOT prefix key with "public/"
            },
          });
          console.log(url.href);
          return { path, url: url.href };
        })
      );
      
      setBanners(urls);
    } catch (error) {
      console.error('Error fetching image URLs:', error);
    } finally {
      setLoading(false);
    }
  };

      const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <FastImage
        source={{
          uri: item.url,
          priority: FastImage.priority.normal,
        }}
        style={styles.image}
        resizeMode={FastImage.resizeMode.cover}
      />
      <Text style={styles.text}>{item.key}</Text>
    </View>
  );


  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;



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
      data={images}
      keyExtractor={(item) => item.key}
      renderItem={renderItem}
      contentContainerStyle={styles.listContent}
      initialNumToRender={3}
      maxToRenderPerBatch={5}
      windowSize={7}
      removeClippedSubviews={true}
    />
        </View>
    )
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
  },
  itemContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 12,
  },
  text: {
    marginTop: 8,
    color: '#333',
    fontSize: 16,
  },
});


export default CourseList;
