import { useRoute } from '@react-navigation/native';
import { useState, useEffect, useRef, useCallback } from 'react';
import { getUrl } from '@aws-amplify/storage';
import VideoItem from '../../components/Video/videoItem';
import { View, Text, Platform, FlatList, StyleSheet, Dimensions, PermissionsAndroid, Button } from 'react-native';

import LivePitchDetection from '@techoptio/react-native-live-pitch-detection';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ContentCourse = () => {
  // Estado para la detección de tono
  const [pitchData, setPitchData] = useState({
    frequency: null,
    note: null,
  });

  // CORRECCIÓN 1: Se añade el estado para controlar si el micrófono está escuchando
  const [isListening, setIsListening] = useState(false);

  const route = useRoute();
  const { titlecourse, videos } = route.params;
  const [loading, setLoading] = useState(true);
  const [contentsToShow, setContentsToShow] = useState([]);

  console.log('Title course:', titlecourse);
  console.log('Videos:', videos);

  useEffect(() => {
    getFileUrl();

    // 1. Configurar ajustes de Pitch Detection
    LivePitchDetection.setOptions({
      bufferSize: 4096,
      minVolume: -30.0,
      updateIntervalMs: 100,
    });

    // 2. Suscribirse a las actualizaciones de audio
    const subscription = LivePitchDetection.addListener((event) => {
      setPitchData({
        frequency: event.frequency,
        note: event.note,
      });
    });

    // Limpieza al desmontar el componente
    return () => {
      subscription.remove();
      LivePitchDetection.stopListening();
    };
  }, []);

  const requestMicrophonePermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const getFileUrl = async () => {
    try {
      // CORRECCIÓN 2: Extraer paths de video de forma segura sin mutar estados intermedios
      const videoPaths = videos.map(item => item.banner_video);

      const urls = await Promise.all(
        videoPaths.map(async (path) => {
          const { url } = await getUrl({
            path,
            options: {
              accessLevel: 'public'
            }
          });
          return { path, url: url.href };
        })
      );
      setContentsToShow(urls);
    } catch (error) {
      console.error('Error fetching image URLs:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleListening = async () => {
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
  };

  const [currentlyPlayingIndex, setCurrentlyPlayingIndex] = useState(0);
  const flatListRef = useRef(null);

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentlyPlayingIndex(viewableItems[0].index);
    }
  }, []);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 70,
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading video...</Text>
      </View>
    );
  }

  const renderVideos = ({ item, index }) => (
    <View style={styles.videoContainer}>
      <Text style={styles.videoTitle}>{item.title || "Video Course"}</Text>
      <VideoItem
        source={item.url}
        isPaused={index !== currentlyPlayingIndex}
      />
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      {/* CORRECCIÓN 3: Panel de control visual superior para el Pitch Detector */}
      <View style={styles.pitchPanel}>
        <Text style={styles.header}>Pitch Detector</Text>
        <Text style={styles.dataLabel}>
          Frecuencia: {pitchData.frequency ? `${pitchData.frequency.toFixed(1)} Hz` : '---'}
        </Text>
        <Text style={styles.dataLabel}>
          Nota: {pitchData.note ?? '---'}
        </Text>
        <Button
          title={isListening ? "Detener Micrófono" : "Iniciar Micrófono"}
          onPress={toggleListening}
          color={isListening ? "#ff5c5c" : "#2196F3"}
        />
      </View>

      <FlatList
        ref={flatListRef}
        data={contentsToShow}
        renderItem={renderVideos}
        keyExtractor={(item) => item.url}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        showsVerticalScrollIndicator={false}
        snapToInterval={300 + 16}
        snapToAlignment={"start"}
        decelerationRate={"fast"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#f5f5f5' 
  },
  pitchPanel: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'center',
  },
  header: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 5 
  },
  dataLabel: { 
    fontSize: 16, 
    marginVertical: 4,
    color: '#333'
  },
  videoContainer: {
    marginBottom: 16,
  },
  videoTitle: {
    padding: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ContentCourse;