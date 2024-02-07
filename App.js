import * as React from 'react';
import { Text, View, StyleSheet, Button, TextInput, TouchableWithoutFeedback, Keyboard, Animated, Easing } from 'react-native';
import { Audio } from 'expo-av';

export default function App() {
  const [sound, setSound] = React.useState();
  const [intervalId, setIntervalId] = React.useState(null);
  const [intervalDuration, setIntervalDuration] = React.useState(60); // 初期値は1秒
  const swingAnimation = React.useRef(new Animated.Value(0)).current;

  async function playSound() {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync(require('./assets/tick.mp3'));
    setSound(sound);

    // 指定されたインターバルでサウンドを再生
    const id = setInterval(async () => {
      console.log('Playing Sound');
      await sound.replayAsync();
      animatePendulum(); // 振り子のアニメーションを再生
    }, 60 * 1000 / intervalDuration);

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

  const changeBPM = (increment) => {
    const newBPM = intervalDuration + increment;
    // BPM を 1 以上かつ 300 以下に制限する
    if (newBPM >= 1 && newBPM <= 300) {
      setIntervalDuration(newBPM);
      // BPM を変更した場合、再生間隔も更新する
      if (intervalId) {
        clearInterval(intervalId);
        playSound();
      }
    }
  };

  // 振り子のアニメーションを定義
  const animatePendulum = () => {
    const duration = (60 * 1000) / intervalDuration; // BPMに連動したdurationの計算

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

  // 振り子の角度を計算
  const pendulumRotation = swingAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['-40deg', '40deg'], // 左右対称に振れるように調整
  });

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <View style={styles.pendulumContainer}>
          <Animated.View style={[styles.pendulum, { transform: [{ rotateZ: pendulumRotation }] }]} />
        </View>
        <Button title="Play Sound" onPress={playSound} />
        <Button title="Stop Sound" onPress={stopSound} />
        <View style={styles.inputContainer}>
          <Button title="-" onPress={() => changeBPM(-10)} />
          <TextInput
            style={styles.input}
            value={intervalDuration.toString()}
            onChangeText={handleIntervalChange}
            keyboardType="numeric"
            onBlur={handleInputBlur}
          />
          <Button title="+" onPress={() => changeBPM(10)} />
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
