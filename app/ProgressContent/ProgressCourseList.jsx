import {View, Text, Platform,ActivityIndicator, FlatList,StyleSheet ,TouchableOpacity} from 'react-native'
import { Image } from 'expo-image';
import { getUrl } from '@aws-amplify/storage';
import { useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/data';
const client = generateClient();

const ProgressCourseList = () => {

    const [contentsToShow, setContentsToShow] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bannerPaths, setBannerPaths] = useState([]);

  const navigation = useNavigation();

  const getAllCourses = async () => {
  
    console.log("1. Starting request..."); 
    try {
      console.log("Is model defined?", !!client.models.SongCourseContent);
      const response = await client.models.SongCourseContent.list();
     
      console.log("2. Response received:", response.data);
      
      const { data, errors } = response;
      if (errors) console.error("3. Errors found:", errors);
      return data;
    } catch (err) {
      console.error("4. Catch block triggered:", err);
    }
  
  };

    useEffect(() => {
        syncAllCourses();
      }, []);


    const syncAllCourses = async () => {
      const courses_list = await getAllCourses();
      console.log("all courses await", courses_list);
      getFileUrl(courses_list);
    }

    const getFileUrl = async (courses_list) => {

      courses_list.map(item => {setBannerPaths(bannerPaths.push(item.banner_image))});
      try {
      const urls = await Promise.all(
        bannerPaths.map(async (path) => {

          const search_by_path = courses_list.find(item => item.banner_image === path);
        
          const { url } = await getUrl({
            path,
            options: {
              accessLevel: 'public',
            },
          });
          return { title: search_by_path.title, path, url: url.href, videos: search_by_path.videos };
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
      <TouchableOpacity
           onPress={() => navigation.navigate('ProgressContentCourse',{
            titlecourse: item.title,
            videos: item.videos
          })}>
      <Image
        source={{ uri: item.url }}
        style={styles.image}
        contentFit="cover"
        transition={200}
      />
      <Text style={styles.text}>{item.title}</Text>
      </TouchableOpacity>
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
            }}>Tus cursos</Text>
       
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


export default ProgressCourseList;
