import {View, Text, Platform,ActivityIndicator, FlatList,StyleSheet ,TouchableOpacity} from 'react-native'
import { Image } from 'expo-image';
import { getUrl } from '@aws-amplify/storage';
import { useNavigation } from 'expo-router';
import { useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/data';
import { gql, useLazyQuery } from '@apollo/client';
const client = generateClient();

const COURSES_BY_PERSON_QUERY = gql`
   query GetCourseSubscribePerson($email: String!) {
    getCourseSubscribePerson(email: $email) {
      title,
      idCourse
    }
  }`;


const ProgressCourseList = () => {

    const [contentsToShow, setContentsToShow] = useState([]);
    const [loading_screen, setLoading] = useState(true);
    const [bannerPaths, setBannerPaths] = useState([]);
    const [getCoursesByPerson,{loading, error, data}] = useLazyQuery(COURSES_BY_PERSON_QUERY);
    const route = useRoute();
    const { email } = route.params;

    

  const navigation = useNavigation();

  const seachCoursesRegisteredByPerson = async() => {
    
    try{

      const { data } = await 
      getCoursesByPerson({
        variables: {
          email: email
        }
      }
    );

    return data;

    }catch(err){
      console.log("un expected error", err);
    }

  }

  const getAllCourses = async (courses_list_registered_person) => {
  
    console.log("1. Starting request..."); 
    const dataReturn = [];
    try {
      console.log("Is model defined?", !!client.models.SongCourseContent);
      const response = await client.models.SongCourseContent.list();

      console.log("2. Response received:", response.data);
      
      const { data, errors } = response;
      console.log("2. Response data:", data);
      if (errors) console.error("3. Errors found:", errors);

      const dataReturn = courses_list_registered_person.getCourseSubscribePerson
                        .map(item => data.find(itemData => itemData.id === item.idCourse))
                        .filter(Boolean);

      return dataReturn;
    } catch (err) {
      console.error("4. Catch block triggered:", err);
    }
  
  };

    useEffect(() => {
        syncAllCourses();
      }, []);


    const syncAllCourses = async () => {
      const courses_list_registered_person = await seachCoursesRegisteredByPerson();
      console.log("test sync",courses_list_registered_person);
      const courses_list = await getAllCourses(courses_list_registered_person);
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
          return { title: search_by_path.title, path, url: url.href, modules: search_by_path.modules };
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
            modules: item.modules
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


  if (loading_screen) return <ActivityIndicator size="large" color="#0000ff" />;



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
    color: '#000000ff',
    fontSize: 16,
  },
});


export default ProgressCourseList;
