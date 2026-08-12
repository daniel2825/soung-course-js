import { useRoute } from '@react-navigation/native';
import { useState, useEffect, useRef, useCallback } from 'react';
import { getUrl } from '@aws-amplify/storage';
import VideoItem from '../../components/Video/videoItem';
import { 
  View, 
  Text, 
  Platform, 
  FlatList, 
  StyleSheet, 
  PermissionsAndroid, 
  Button, 
  ActivityIndicator 
} from 'react-native';

import LivePitchDetection from '@techoptio/react-native-live-pitch-detection';

const ContentCourse = () => {
  const route = useRoute();
  const { titlecourse, videos = [] } = route.params || {};

  const [pitchData, setPitchData] = useState({ frequency: null, note: null });
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(true);
  const [contentsToShow, setContentsToShow] = useState([]);
  const [currentlyPlayingIndex, setCurrentlyPlayingIndex] = useState(0);

  const flatListRef = useRef(null);

  // 1. Inicialización de la detección de tono
  useEffect(() => {
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

  // 2. Carga segura de URLs de Amplify conservando la metadata de cada video
  const getFileUrl = useCallback(async () => {
    try {
      setLoading(true);
      const urls = await Promise.all(
        videos.map(async (item) => {
          try {
            const { url } = await getUrl({
              path: item.banner_video,
              options: { accessLevel: 'public' }
            });
            return {
              ...item, // Conserva title, id y demas atributos originales
              videoUrl: url.href
            };
          } catch (err) {
            console.error(`Error procesando video ${item.banner_video}:`, err);
            return null;
          }
        })
      );
      
      // Filtrar elementos fallidos si los hubiera
      setContentsToShow(urls.filter(Boolean));
    } catch (error) {
      console.error('Error al obtener URLs de AWS Storage:', error);
    } finally {
      setLoading(false);
    }
  }, [videos]);

  useEffect(() => {
    getFileUrl();
  }, [getFileUrl]);

  // 3. Manejo de Permisos
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
          setPitchData({ frequency: 440.0, note: 'A4' });
        }
      }
    } catch (error) {
      console.error("Error al conmutar el micrófono:", error);
    }
  };

  // 4. Configuración del visor de lista interactiva
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
      <View style={styles.container}>
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
    <View style={styles.screen}>
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
});

export default ContentCourse;