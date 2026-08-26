import Animated, { 
  useSharedValue, 
  useAnimatedScrollHandler, 
  useAnimatedStyle, 
  interpolate, 
  Extrapolation 
} from 'react-native-reanimated';

import { useRoute } from '@react-navigation/native';
import { useState, useEffect, useRef, useCallback } from 'react';
import { getUrl } from '@aws-amplify/storage';
import VideoItem from '../../components/Video/videoItem';
import { 
  View, 
  Text, 
  Platform, 
  StyleSheet, 
  FlatList,
  PermissionsAndroid, 
  ActivityIndicator,
  Button,
  useWindowDimensions 
} from 'react-native';

import LivePitchDetection from '@techoptio/react-native-live-pitch-detection';
/*
const DATA = [
  { id: '1', title: 'Welcome!', desc: 'Explore the best features of our app.', color: '#F1f2f6' },
  { id: '2', title: 'Stay Connected', desc: 'Interact with your peers effortlessly.', color: '#eccc68' },
  { id: '3', title: 'Get Started', desc: 'Jump right into your clean new dashboard.', color: '#ff7f50' },
  { id: '4', title: 'Song Started', desc: 'Jump right into your clean new dashboard.', color: '#2c748aff' },

];*/

const DATA = [
  { id: '1', title: 'Welcome!', desc: 'Explore the best features of our app.', color: '#F1f2f6' },
  { id: '2', title: 'Stay Connected', desc: 'Interact with your peers effortlessly.', color: '#eccc68' },
  { id: '3', title: 'Get Started', desc: 'Jump right into your clean new dashboard.', color: '#ff7f50' },
  { id: '4', title: 'Song Started', desc: 'Jump right into your clean new dashboard.', color: '#2c748aff' },

];

/**
 * FIXED SUB-COMPONENT: OnboardingSlide
 * Isolates the hooks for each item render in FlatList to prevent React Hook crashes.
 */
function OnboardingSlide({ item, index, scrollX, screenWidth, currentlyPlayingIndex }) {
  const rSlideStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * screenWidth,
      index * screenWidth,
      (index + 1) * screenWidth
    ];
    
    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.8, 1, 0.8],
      Extrapolation.CLAMP
    );

    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.4, 1, 0.4],
      Extrapolation.CLAMP
    );
 

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <View style={[styles.slide, { width: screenWidth, backgroundColor: item.color}]}>
      <Animated.View style={[styles.card, rSlideStyle]}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.module_title}</Text>

      </Animated.View>
       
      <VideoItem
        source={item.videoUrl}
        isPaused={index !== currentlyPlayingIndex}
      /> 
    </View>
  );
}

/**
 * FIXED SUB-COMPONENT: OnboardingDot
 * Isolates pagination animation hooks cleanly.
 */
function OnboardingDot({ index, scrollX, screenWidth }) {
  const rDotStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * screenWidth,
      index * screenWidth,
      (index + 1) * screenWidth
    ];

    const dotWidth = interpolate(
      scrollX.value,
      inputRange,
      Extrapolation.CLAMP
    );

    return { width: dotWidth };
  });

  return <Animated.View style={[styles.dot, rDotStyle]} />;
}

const ContentCourse = () => {
  const route = useRoute();
  const { titlecourse, modules = [] } = route.params || {};
  
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const scrollX = useSharedValue(0);

  const onScrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const [pitchData, setPitchData] = useState({ frequency: null, note: null });
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(true);
  const [contentsToShow, setContentsToShow] = useState([]);
  const [currentlyPlayingIndex, setCurrentlyPlayingIndex] = useState(0);
  const flatListRef = useRef(null);


  // Inicialización de la detección de tono
  useEffect(() => {
    getFileUrl();
    LivePitchDetection.setOptions({
      bufferSize: 4096,
      minVolume: -50.0,
      updateIntervalMs: 100,
    });

    const subscription = LivePitchDetection.addListener((event) => {
      console.log('🎤 Pitch Event:', event);
      setPitchData({
        frequency: event.frequency,
        note: event.note,
      });
    });

    return () => {
      subscription.remove();
      LivePitchDetection.stopListening();
    };
  }, []);

  // Carga segura de URLs de Amplify
  const getFileUrl = useCallback(async () => {
    try {
      setLoading(true);
      const urls = await Promise.all(
        modules.map(async (item) => {
          try {
            const { url } = await getUrl({
              path: item.banner_video,
              options: { accessLevel: 'public' }
            });
            return {
              ...item,
              videoUrl: url.href
            };
          } catch (err) {
            console.error(`Error procesando video ${item.banner_video}:`, err);
            return null;
          }
        })
      );
      console.log(urls);
      setContentsToShow(urls.filter(Boolean));
    } catch (error) {
      console.error('Error al obtener URLs de AWS Storage:', error);
    } finally {
      setLoading(false);
    }
  }, [modules]);

  const requestMicrophonePermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: "Permiso de Micrófono",
          message: "Esta aplicación necesita acceso al micrófono para la detección de tono en vivo.",
          buttonPositive: "Aceptar",
          buttonNegative: "Cancelar",
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const toggleListening = async () => {
    try {
      if (isListening) {
        await LivePitchDetection.stopListening();
        setIsListening(false);
      } else {
        const hasPermission = await requestMicrophonePermission();
        if (hasPermission) {
          await LivePitchDetection.startListening();
          setIsListening(true);
        }
      }
    } catch (error) {
      console.error("Error al conmutar el micrófono:", error);
    }
  };

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentlyPlayingIndex(viewableItems[0].index);
    }
  }, []);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 70,
  }).current;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Cargando videos del curso...</Text>
      </View>
    );
  }

  const renderVideos = ({ item, index }) => (
    <View style={styles.videoContainer}>
      <Text style={styles.videoTitle}>{item.title || titlecourse || "Video Course"}</Text>
      <VideoItem
        source={item.videoUrl}
        isPaused={index !== currentlyPlayingIndex}
      />
    </View>
  );

  return (
     <View style={styles.container}>
       
{/** 
      <FlatList
        ref={flatListRef}
        data={contentsToShow}
        renderItem={renderVideos}
        keyExtractor={(item, idx) => item.id?.toString() || item.videoUrl || idx.toString()}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        showsVerticalScrollIndicator={false}
        snapToInterval={316}
        snapToAlignment="start"
        decelerationRate="fast"
      />

       review properties to videos.
*/}
      <Animated.FlatList
        data={contentsToShow}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScrollHandler}
        scrollEventThrottle={16}
        keyExtractor={(item, idx) => item.id?.toString() || item.videoUrl || idx.toString()}
        renderItem={({ item, index }) => (
          <OnboardingSlide 
            item={item}
            index={index}
            scrollX={scrollX}
            screenWidth={SCREEN_WIDTH}
            currentlyPlayingIndex
          />
        )}
      />
      
      <View style={styles.paginationContainer}>
        {contentsToShow.map((_, index) => (
          <OnboardingDot 
            key={index} 
            index={index} 
            scrollX={scrollX} 
            screenWidth={SCREEN_WIDTH} 
          />
        ))}
      </View>
      
      <View style={styles.pitchPanel}>
        <Text style={styles.header}>Detección de Tono</Text>
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>
            Frecuencia: <Text style={styles.dataValue}>{pitchData.frequency ? `${pitchData.frequency.toFixed(1)} Hz` : '---'}</Text>
          </Text>
          <Text style={styles.dataLabel}>
            Nota: <Text style={styles.dataValue}>{pitchData.note ?? '---'}</Text>
          </Text>
        </View>
        <Button
          title={isListening ? "Detener Micrófono" : "Iniciar Micrófono"}
          onPress={toggleListening}
          color={isListening ? "#ff5c5c" : "#2196F3"}
        />
      </View>
  
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#f5f5f5' 
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  pitchPanel: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  header: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 8 
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 12,
  },
  dataLabel: { 
    fontSize: 15, 
    color: '#666'
  },
  dataValue: {
    fontWeight: 'bold',
    color: '#111',
  },
  videoContainer: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  videoTitle: {
    padding: 12,
    fontSize: 16,
    fontWeight: '600',
  },
  container: { 
    flex: 1 
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#f5f5f5' 
  },
  slide: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  card: { 
    padding: 24, 
    alignItems: 'center', 
    width: '80%' 
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginBottom: 12, 
    textAlign: 'center' 
  },
  description: { 
    fontSize: 16, 
    color: '#555', 
    textAlign: 'center' 
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 60,
    flexDirection: 'row',
    alignSelf: 'center'
  },
  dot: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#333',
    marginHorizontal: 6
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  }
});

export default ContentCourse;
