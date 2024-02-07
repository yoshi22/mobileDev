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

  const handleIntervalChange = (text) => {
    const newInterval = parseInt(text);
    if (!isNaN(newInterval)) {
      setIntervalDuration(newInterval);
      // インターバルの更新時に再生間隔を更新する
      if (intervalId) {
        clearInterval(intervalId);
        playSound();
      }
    }
  };

  const handleInputBlur = () => {
    if (intervalId) {
      clearInterval(intervalId);
      playSound();
    }
  };

  const increaseBPM = () => {
    const newBPM = intervalDuration + 1;
    // BPM を 300 以上にしないよう制限する
    if (newBPM <= 300) {
      setIntervalDuration(newBPM);
      // BPM を増加させた場合、再生間隔も更新する
      if (intervalId) {
        clearInterval(intervalId);
        playSound();
      }
    }
  };

  const decreaseBPM = () => {
    const newBPM = intervalDuration - 1;
    // BPM を 1 以下にしないよう制限する
    if (newBPM >= 1) {
      setIntervalDuration(newBPM);
      // BPM を減少させた場合、再生間隔も更新する
      if (intervalId) {
        clearInterval(intervalId);
        playSound();
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <Button title="Play Sound" onPress={playSound} />
        <Button title="Stop Sound" onPress={stopSound} />
        <View style={styles.inputContainer}>
          <Button title="-" onPress={decreaseBPM} />
          <TextInput
            style={styles.input}
            value={intervalDuration.toString()}
            onChangeText={handleIntervalChange}
            keyboardType="numeric"
            onBlur={handleInputBlur}
          />
          <Button title="+" onPress={increaseBPM} />
        </View>
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    width: 100,
    textAlign: 'center',
  },
});
