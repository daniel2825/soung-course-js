import { useRoute } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import { getUrl } from '@aws-amplify/storage';
import { View,Text, SafeAreaView, Platform, FlatList, StyleSheet, Dimensions } from 'react-native';
import Video from 'react-native-video';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ContentCourse = () => {
    const route = useRoute();
    const { titlecourse } = route.params;
    const [contentsToShow, setContentsToShow] = useState([]);
    

    const video_list = [
    {title: 'Tecnica vocal', banner_video: 'videos/tecnica_vocal/JairS.mp4', id_course:"a"}
   ];

    const [videoUris, setVideoUris] = useState([]);
    
    console.log('Title course:', titlecourse);

     useEffect(() => {
    
          getFileUrl();
          
          }, []);

    const getFileUrl = async () => {
          video_list.map(item => {setVideoUris(videoUris.push(item.banner_video))});
          try {
              const urls = await Promise.all(
                videoUris.map(async (path) => {
                  const { url } = await getUrl({
                    path,
                    options:{
                      accessLevel: 'public'
                    }
                  });
                  console.log("hello video",url);
                  return {path, url: url.href}
                })
              );
          setContentsToShow(urls);
        } catch (error) {
          console.error('Error fetching image URLs:', error);
        } finally {
          setLoading(false);
        }
      };

      if (!videoUris) {
            return <View style={styles.container}><Text>Loading video...</Text></View>;
        }

    const renderVideos = ({ item }) => (
                <Video
                    source={{ uri: item.url }}
                    style={styles.backgroundVideo}
                    controls={true} // Add playback controls
                    resizeMode="contain" // Or "cover", "stretch"
                />
    );        

    return (
        <View style={styles.container}>
            <Text style={{
                fontFamily: 'output-bold',
                fontSize: 25
            }}>Video import</Text>
          {   
          <FlatList
                          data={contentsToShow}
                          keyExtractor={(item) => item.path}
                          renderItem={renderVideos}
                          contentContainerStyle={styles.listContent}
                          initialNumToRender={3}
                          maxToRenderPerBatch={5}
                          windowSize={7}
                          removeClippedSubviews={true}
                        />
            }
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
        videoPlayer: {
          width: SCREEN_WIDTH,
          height: 300, // Adjust height as needed
          marginVertical: 8,
        }

    });
  
  export default ContentCourse;
