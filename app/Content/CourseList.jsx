import { View, Text, Platform, ActivityIndicator, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import { Image } from 'expo-image';
import { getUrl } from '@aws-amplify/storage';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import Colors from '../../constants/Colors'
import React, { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/data';
import { gql,useMutation } from '@apollo/client';

// https://github.com/techoptio/react-native-live-pitch-detection
// https://github.com/rnheroes/react-native-pitchy

const client = generateClient();

const PERSON_MUTATION = gql`
mutation SubscribePersonToCourse($person: PersonInput!,$course: CourseInput!) {
  subscribePersonToCourse(
    person: $person,
    course: $course
  ) {
    name
  }
}`;

const CourseList = () => {

  const [contentsToShow, setContentsToShow] = useState([]);
  const [subscribePersonToCourse, { error, data }] = useMutation(PERSON_MUTATION);
  const [loading, setLoading] = useState(true);
  const [bannerPaths, setBannerPaths] = useState([]);
  const route = useRoute();
  const { email } = route.params;

  const navigation = useNavigation();

  const getAllCourses = async () => {

    console.log("1. Starting request...");
    console.log("email to send java", email)
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

    const subscribeCourse = async(title,idCourse) => {
    console.log("you are suscribed", title, "id", idCourse);

    try{
      const { data } = await 
      subscribePersonToCourse({
              variables: {
                person:{
                  email: email
                },
                course:{
                  idCourse: idCourse,
                  title: title
                }     
              },
            });
  }

    catch(err){
      console.log("un expected error", err);
    }

  }


  const getFileUrl = async (courses_list) => {

    courses_list.map(item => { setBannerPaths(bannerPaths.push(item.banner_image)) });
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
          console.log("test idcourse", search_by_path.id)
          return { id: search_by_path.id, title: search_by_path.title, path, url: url.href, modules: search_by_path.modules };
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
    <View style={style.itemContainer}>
        <Image
          source={{ uri: item.url }}
          style={style.image}
          contentFit="cover"
          transition={200}
        />
        <Text style={style.text}>{item.title}</Text>

        <TouchableOpacity style={style.button}
        onPress={() => subscribeCourse(item.title,item.id)}>
          <Text style={style.buttonText}>Inscribirme</Text>
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
      }}>Exlora todos los cursos</Text>

      <FlatList
        data={contentsToShow}
        keyExtractor={(item) => item.path}
        renderItem={renderItem}
        contentContainerStyle={style.listContent}
        initialNumToRender={3}
        maxToRenderPerBatch={5}
        windowSize={7}
        removeClippedSubviews={true}
      />
    </View>
  )
}

const style = StyleSheet.create({
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
  button: {
    padding: 15,
    backgroundColor: Colors.WHITE,
    marginTop: 20,
    borderRadius: 30,
    borderWidth: 12,
    borderColor: Colors.WHITE

  },
  buttonText: {
    textAlign: 'center',
    fontSize: 18,
    color: Colors.BLACK
  }
});


export default CourseList;
