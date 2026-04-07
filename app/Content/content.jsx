import { useRoute } from '@react-navigation/native';
import { useState, useEffect, useRef, useCallback } from 'react';
import { getUrl } from '@aws-amplify/storage';
import VideoItem from '../../components/Video/videoItem'
import { View,Text, SafeAreaView, Platform, FlatList, StyleSheet, Dimensions } from 'react-native';
import Video from 'react-native-video';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ContentCourse = () => {
    const route = useRoute();
    const { titlecourse } = route.params;
    const [contentsToShow, setContentsToShow] = useState([]);
    

    const video_list = [
    {title: 'Tecnica vocal', banner_video: 'videos/tecnica_vocal/jair-santrich.mp4', id_course:"a"},
    {title: 'Tecnica vocal', banner_video: 'videos/prueba/JairS.mp4', id_course:"a"},

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
          console.log("url ss",urls);
          setContentsToShow(urls);
          console.log(contentsToShow);
        } catch (error) {
          console.error('Error fetching image URLs:', error);
        } finally {
          setLoading(false);
        }
      };

      if (!videoUris) {
            return <View style={styles.container}><Text>Loading video...</Text></View>;
        }

    const [currentlyPlayingIndex, setCurrentlyPlayingIndex] = useState(0);
    const flatListRef = useRef(null);
      
    
    const onViewableItemsChanged = useCallback(({ viewableItems }) => {
          if (viewableItems && viewableItems.length > 0) {
            setCurrentlyPlayingIndex(viewableItems[0].index);
          }
        }, []);    

    const viewabilityConfig = {
          itemVisiblePercentThreshold: 70, // Play the video when 70% of it is visible
    };
      

    const renderVideos = ({ item, index }) => (
  
      <View>
          <Text style={styles.videoTitle}>{item.title}</Text>
          <VideoItem
            source={item.url}
            isPaused={index !== currentlyPlayingIndex} // Pause if not the current one
          />
    </View>
    );        

    return (
      <FlatList
        ref={flatListRef}
        data={contentsToShow}
        renderItem={renderVideos}
        keyExtractor={(item) => item.url}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        showsVerticalScrollIndicator={false}
        snapToInterval={300 + 16} // (Video height + margin/padding) for TikTok-like snapping
        snapToAlignment={"start"}
        decelerationRate={"fast"}
      />
    );
  };


  const styles = StyleSheet.create({
    videoTitle: {
      padding: 10,
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
  
  export default ContentCourse;
