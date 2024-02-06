import * as React from 'react';
import { Text, View, StyleSheet, Button, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Audio } from 'expo-av';

export default function App() {
  const [sound, setSound] = React.useState();
  const [intervalId, setIntervalId] = React.useState(null);
  const [intervalDuration, setIntervalDuration] = React.useState(60); // 初期値は1秒

  async function playSound() {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync(require('./assets/tick.mp3'));
    setSound(sound);

    // 指定されたインターバルでサウンドを再生
    const id = setInterval(async () => {
      console.log('Playing Sound');
      await sound.replayAsync();
    },  60 * 1000 / intervalDuration);

    // サウンド再生中に再生が完了した場合に clearInterval を呼び出す
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) {
        clearInterval(intervalId);
      }
    });

    setIntervalId(id);
  }

  async function stopSound() {
    if (sound) {
      console.log('Stopping Sound');
      await sound.stopAsync();
      if (intervalId) {
        clearInterval(intervalId);
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

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <Button title="Play Sound" onPress={playSound} />
        <Button title="Stop Sound" onPress={stopSound} />
        <TextInput
          style={styles.input}
          value={intervalDuration.toString()}
          onChangeText={(text) => setIntervalDuration(parseInt(text))}
          keyboardType="numeric"
        />
        <Text>BPM</Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
    padding: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginTop: 10,
    width: '50%',
    textAlign: 'center',
  },
});
