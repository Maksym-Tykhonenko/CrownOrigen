import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import React from 'react';
import {FlatList, Image, ScrollView, View} from 'react-native';

import {Appbar, Avatar, Button, Text, TextInput} from 'react-native-paper';
import {TopLeaderboard} from './topLeaderboard';

export const Top = () => {
  const focused = useIsFocused();
  const [point, setPoint] = React.useState(0);

  const getPoint = async () => {
    const value = await AsyncStorage.getItem('point');
    if (value !== null) {
      setPoint(Number(value));
    }
  };

  React.useEffect(() => {
    getPoint();
  }, [focused]);

  return (
    <View style={{backgroundColor: '#121212', flex: 1}}>
      <Appbar.Header style={{backgroundColor: '#121212'}}>
        {/* Ваш існуючий header код */}
      </Appbar.Header>
      <Text
        variant="displaySmall"
        style={{color: 'white', textAlign: 'center', marginVertical: 20}}>
        Top User
      </Text>
      <TopLeaderboard />
    </View>
  );
};
