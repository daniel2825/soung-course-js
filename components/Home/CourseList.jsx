import {View, Text, Platform,ActivityIndicator, FlatList,StyleSheet ,Image} from 'react-native'
import FastImage from 'react-native-fast-image';
import { getUrl } from '@aws-amplify/storage';
import { StorageImage } from '@aws-amplify/ui-react-storage';
import React, { useEffect, useState } from 'react';
const CourseList = () => {

    const [contentsToShow, setContentsToShow] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bannerPaths, setBannerPaths] = useState([]);


  const courses_list = [
    {title: 'Tecnica vocal', banner_image: 'images/banner1.jpg'},
    {title: 'Ejercitar voz', banner_image: 'images/banner2.png'},
    {title: 'Vocalizacion', banner_image: 'images/banner3.jpg'},
    {title: 'Resonancia', banner_image: 'images/banner4.jpg'}
  ];

    useEffect(() => {

      getFileUrl();
      
      }, []);

    const getFileUrl = async () => {
      courses_list.map(item => {setBannerPaths(bannerPaths.push(item.banner_image))});
      try {
      const urls = await Promise.all(
        bannerPaths.map(async (path) => {
          const search_title = courses_list.find(item => item.banner_image === path);
          const { url } = await getUrl({
            path,
            options: {
              accessLevel: 'public',
            },
          });
          return { title: search_title.title, path, url: url.href };
        })
      );
      setContentsToShow(urls);
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
      <Text style={styles.text}>{item.title}</Text>
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
       
             <FlatList
                data={contentsToShow}
                keyExtractor={(item) => item.path}
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
    color: '#ffffff',
    fontSize: 16,
  },
});


export default CourseList;
