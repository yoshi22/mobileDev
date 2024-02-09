// SettingsScreen.js

import * as React from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const tickSound = require('./assets/tick.mp3'); // tick.mp3 をインポート
const testSound = require('./assets/test.mp3'); // test.mp3 をインポート

export default function SettingsScreen() {
  const navigation = useNavigation();
  const [playingSound, setPlayingSound] = React.useState(null); // playingSound ステートを追加

  const goBackToMetronome = () => {
    navigation.goBack();
  };

  // tick ボタンが押されたときの処理
  const handleTickButtonPress = () => {
    setPlayingSound(tickSound); // playingSound ステートを設定
    navigation.navigate('Metronome', { soundFile: tickSound });
  };

  // test ボタンが押されたときの処理
  const handleTestButtonPress = () => {
    setPlayingSound(testSound); // playingSound ステートを設定
    navigation.navigate('Metronome', { soundFile: testSound });
  };

  return (
    <View style={styles.container}>
      <Text>Settings Screen</Text>
      {/* tick ボタン */}
      <Button title="Set Tick Sound" onPress={handleTickButtonPress} />
      {/* test ボタン */}
      <Button title="Set Test Sound" onPress={handleTestButtonPress} />
      {/* メトロノーム画面に戻るボタン */}
      <Button title="Go Back" onPress={goBackToMetronome} />
    </View>
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
});
