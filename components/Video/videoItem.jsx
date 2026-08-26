import React, { useState, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import Video from 'react-native-video'; // or use expo-av/Video

const videoItem = ({ source, isPaused }) => {
  const videoPlayer = useRef(null);

  return (
    <View style={styles.videoContainer}>
      <Video
        ref={videoPlayer}
        source={{ uri: source }}
        controls={true}
        style={styles.videoPlayer}
        paused={isPaused} // Control playback with the isPaused prop
        repeat={true} // Loop the video
        resizeMode="cover"
        onError={(e) => console.log('Video error:', e)}
        // Add other props as needed (e.g., controls, muted)
      />
    </View>
  );
};

const styles = StyleSheet.create({
  videoContainer: {
    height: 300, // Customize height
    width: '90%',
    backgroundColor: '#000',
    marginVertical: 8,
  },
  videoPlayer: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default videoItem;