import React from 'react';
import { View } from 'react-native';
import NFCReader from './components/NFCReader';

const App = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <NFCReader />
    </View>
  );
};

export default App;
