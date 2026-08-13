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


const TrackingList = () => {

    const [contentsToShow, setContentsToShow] = useState([]);
    const [loading_screen, setLoading] = useState(true);
    const [getCoursesByPerson,{loading, error, data}] = useLazyQuery(COURSES_BY_PERSON_QUERY);
    const route = useRoute();
    const { email } = route.params;

    

  const navigation = useNavigation();

const seachCoursesRegisteredByPerson = async () => {
  try {
    const { data } = await getCoursesByPerson({
      variables: {
        email: email
      }
    });

    console.log("Respuesta completa:", data);

    return data?.getCourseSubscribePerson ?? [];

  } catch (err) {
    console.log("unexpected error", err);
    return [];
  }
};

    useEffect(() => {
        syncAllCourses();
      }, []);


    const syncAllCourses = async () => {
      try{
      const courses_list_registered_person = await seachCoursesRegisteredByPerson();
      setContentsToShow(courses_list_registered_person);
      }
      catch(error){
      console.error('Error in getting information about progress course by person:', error);
      }
      finally{
        setLoading(false);
      }
    }

      const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity
           onPress={() => navigation.navigate('ProgressContentCourse',{
            titlecourse: item.title
          })}>
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
            }}>Tu progreso</Text>
       
             <FlatList
                data={contentsToShow}
                keyExtractor={(item) => item.idCourse}
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


export default TrackingList;
