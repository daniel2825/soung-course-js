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
  PermissionsAndroid, 
  ActivityIndicator,
  useWindowDimensions 
} from 'react-native';

import LivePitchDetection from '@techoptio/react-native-live-pitch-detection';

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
function OnboardingSlide({ item, index, scrollX, screenWidth }) {
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
    <View style={[styles.slide, { width: screenWidth, backgroundColor: item.color }]}>
      <Animated.View style={[styles.card, rSlideStyle]}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.desc}</Text>
      </Animated.View>
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
      setContentsToShow(urls.filter(Boolean));
    } catch (error) {
      console.error('Error al obtener URLs de AWS Storage:', error);
    } finally {
      setLoading(false);
    }
  }, [modules]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Cargando videos del curso...</Text>
      </View>
    );
  }

  return (
     <View style={styles.container}>
      <Animated.FlatList
        data={DATA}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScrollHandler}
        scrollEventThrottle={16}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <OnboardingSlide 
            item={item}
            index={index}
            scrollX={scrollX}
            screenWidth={SCREEN_WIDTH}
          />
        )}
      />
      
      <View style={styles.paginationContainer}>
        {DATA.map((_, index) => (
          <OnboardingDot 
            key={index} 
            index={index} 
            scrollX={scrollX} 
            screenWidth={SCREEN_WIDTH} 
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
