// SettingsScreen.js

import * as React from 'react';
import { Text, View, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const tickSound = require('./assets/tick.mp3'); // Import tick.mp3
const clapSound = require('./assets/clap.mp3'); // Import test.mp3
const rainSound = require('./assets/rain.mp3'); // Import test.mp3
const seaSound = require('./assets/sea.mp3'); // Import test.mp3

export default function SettingsScreen() {
  const navigation = useNavigation();
  const [playingSound, setPlayingSound] = React.useState(null); // Add playingSound state

  // Function to handle when the tick button is pressed
  const handleTickButtonPress = () => {
    setPlayingSound(tickSound); // Set the playingSound state to tickSound
    navigation.navigate('Metronome', { soundFile: tickSound }); // Navigate to the Metronome screen with tick sound
  };

  // Function to handle when the clap button is pressed
  const handleClapButtonPress = () => {
    setPlayingSound(clapSound); // Set the playingSound state to testSound
    navigation.navigate('Metronome', { soundFile: clapSound }); // Navigate to the Metronome screen with test sound
  };

    // Function to handle when the rain button is pressed
    const handleRainButtonPress = () => {
      setPlayingSound(rainSound); // Set the playingSound state to testSound
      navigation.navigate('Metronome', { soundFile: rainSound }); // Navigate to the Metronome screen with test sound
    };

    // Function to handle when the rain button is pressed
    const handleSeaButtonPress = () => {
      setPlayingSound(seaSound); // Set the playingSound state to testSound
      navigation.navigate('Metronome', { soundFile: seaSound }); // Navigate to the Metronome screen with test sound
    };

  return (
    <View style={styles.container}>
      <Text>Metronome Sounds</Text>
      {/* Button to set the tick sound */}
      <TouchableOpacity onPress={handleTickButtonPress} style={styles.button}>
            <Text style={styles.buttonText}>Tick</Text>
          </TouchableOpacity>
      {/* Button to set the test sound */}
      <TouchableOpacity onPress={handleClapButtonPress} style={styles.button}>
            <Text style={styles.buttonText}>Clap</Text>
          </TouchableOpacity>
          
      <Text>Natural Sounds</Text>
      {/* Button to set the rain sound */}
      <TouchableOpacity onPress={handleRainButtonPress} style={styles.button}>
        <Text style={styles.buttonText}>Rain</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSeaButtonPress} style={styles.button}>
        <Text style={styles.buttonText}>Sea</Text>
      </TouchableOpacity>

    </View>
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
  button: {
    width: 100,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    margin:5,
    elevation: 5, // Set elevation for shadow effect
  },
});
