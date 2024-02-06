import * as React from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { Audio } from 'expo-av';

export default function App() {
  const [sound, setSound] = React.useState();
  const [intervalId, setIntervalId] = React.useState(null);

  async function playSound() {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync(require('./assets/tick.mp3'));
    setSound(sound);

    // 1秒ごとにサウンドを再生
    const id = setInterval(async () => {
      console.log('Playing Sound');
      await sound.replayAsync();
    }, 1000);

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
    <View style={styles.container}>
      <Button title="Play Sound" onPress={playSound} />
      <Button title="Stop Sound" onPress={stopSound} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 10,
  },
});
