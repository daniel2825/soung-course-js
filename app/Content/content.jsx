import {View, Text, Platform,StyleSheet} from 'react-native'
import { useRoute } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import { getUrl } from '@aws-amplify/storage';
import Video from 'react-native-video';

import Header from '../../components/Home/header'
import Colors from '../../constants/Colors'

const ContentCourse = () => {
    const route = useRoute();
    const { titlecourse } = route.params;
    const [videoUri, setVideoUri] = useState(null);
    console.log('Title course:', titlecourse);

     useEffect(() => {
    
          getFileUrl();
          
          }, []);

    const getFileUrl = async () => {
          path = "videos/JairS.mp4"
          try {
              const { url } = await getUrl({
                path,
                options: {
                  accessLevel: 'public',
                },
              });
          console.log("hello video",url);
          setVideoUri(url.href);
          
        } catch (error) {
          console.error('Error fetching image URLs:', error);
        } finally {
          setLoading(false);
        }
      };

      if (!videoUri) {
            return <View style={styles.container}><Text>Loading video...</Text></View>;
        }

    return (
        <View style={styles.container}>
            <Text style={{
                fontFamily: 'output-bold',
                fontSize: 25
            }}>Video import</Text>
            <Video
                    source={{ uri: videoUri }}
                    style={styles.backgroundVideo}
                    controls={true} // Add playback controls
                    resizeMode="contain" // Or "cover", "stretch"
                />
            
        </View>
    );
  };


    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        backgroundVideo: {
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
        },
    });
  
  export default ContentCourse;
