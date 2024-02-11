// MetronomeScreen.js

import * as React from 'react';
import {Image, Text, View, StyleSheet, Button, TextInput, TouchableWithoutFeedback, Keyboard, Animated, Easing, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import { useNavigation, useRoute } from '@react-navigation/native';
// import { Image } from 'react-native-elements';

const tickSound = require('./assets/tick.mp3'); // Import tick.mp3

export default function MetronomeScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  
  const [sound, setSound] = React.useState(null);
  const [intervalId, setIntervalId] = React.useState(null);
  const [intervalDuration, setIntervalDuration] = React.useState(60);
  const [isPlaying, setIsPlaying] = React.useState(false); // Add isPlaying state
  const swingAnimation = React.useRef(new Animated.Value(0)).current;

  async function playSound(soundFile) { // Function to play the sound with the given sound file
    console.log('Loading Sound');
    if (sound) {
      await sound.unloadAsync(); // Unload previously loaded sound
    }
    const { sound } = await Audio.Sound.createAsync(soundFile);
    setSound(sound);
    setIsPlaying(true); // Set isPlaying to true
    clearInterval(intervalId); // Clear previous interval before starting new one
  
    const id = setInterval(async () => {
      console.log('Playing Sound');
      await sound.replayAsync();
      animatePendulum();
    }, 60 * 1000 / intervalDuration);

    setIntervalId(id);
  }
  
  
  
  async function stopSound() { // Function to stop the currently playing sound
    setIsPlaying(false); // Set isPlaying to false before stopping sound
    if (sound) {
      console.log('Stopping Sound');
      await sound.stopAsync();
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null); // Reset intervalId after stopping sound
      }
    }
  }
  

  
  React.useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  React.useEffect(() => {
    playSound(route.params?.soundFile || tickSound); // Play the sound when the component mounts
  }, [route.params?.soundFile]);

  const handleIntervalChange = (text) => { // Function to handle changes in interval duration
    const newInterval = parseInt(text);
    if (!isNaN(newInterval)) {
      setIntervalDuration(newInterval);
      if (intervalId) {
        clearInterval(intervalId);
        playSound(route.params?.soundFile || tickSound);
      }
    }
  };

  const handleInputBlur = () => { // Function to handle input blur
    if (intervalId) {
      clearInterval(intervalId);
      playSound(route.params?.soundFile || tickSound);
    }
  };

  const changeBPM = (increment) => { // Function to change BPM
    const newBPM = intervalDuration + increment;
    if (newBPM >= 1 && newBPM <= 300) {
      setIntervalDuration(newBPM);
      if (intervalId) {
        clearInterval(intervalId);
        playSound(route.params?.soundFile || tickSound);
      }
    }
  };

  const animatePendulum = () => { // Function to animate the pendulum
    const duration = (60 * 1000) / intervalDuration;

    Animated.sequence([
      Animated.timing(swingAnimation, {
        toValue: 1,
        duration: duration / 2,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(swingAnimation, {
        toValue: 0,
        duration: duration / 2,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const pendulumRotation = swingAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['-40deg', '40deg'],
  });

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <View style={styles.pendulumContainer}>
          <Animated.View style={[styles.pendulum, { transform: [{ rotateZ: pendulumRotation }] }]} />
        </View>
        <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => (isPlaying ? stopSound() : playSound(route.params?.soundFile || tickSound))} style={styles.button}>
          <Text style={styles.buttonText}>{isPlaying ? 'Stop' : 'Play'}</Text>
        </TouchableOpacity>

        </View>
        <View style={styles.inputContainer}>
          <TouchableOpacity onPress={() => changeBPM(-10)} style={styles.circularButton}>
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={intervalDuration.toString()}
            onChangeText={handleIntervalChange}
            keyboardType="numeric"
            onBlur={handleInputBlur}
          />
          <TouchableOpacity onPress={() => changeBPM(10)} style={styles.circularButton}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
        <Text>BPM</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')} >
          <Image source={require('./assets/Setting.png')}　style={styles.circularButtonImage}></Image>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  pendulumContainer: {
    height: 200,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 20,
  },
  pendulum: {
    width: 2,
    height: 100,
    backgroundColor: 'black',
    transformOrigin: 'bottom',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  button: {
    width: 100,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    elevation: 5, // Set elevation for shadow effect
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    margin: 10,
    width: 100,
    textAlign: 'center',
  },
  circularButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circularButtonImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    margin:10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
