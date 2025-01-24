import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import React from 'react';
import {Dimensions, FlatList, Image, ScrollView, View} from 'react-native';
import {LineChart} from 'react-native-chart-kit';

import {Appbar, Avatar, Button, Text, TextInput} from 'react-native-paper';

export const Statistics = () => {
  const navigation = useNavigation();
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
        <Appbar.BackAction color="white" onPress={() => navigation.goBack()} />

        <Appbar.Content color="white" title="" />
        <View
          style={{
            backgroundColor: 'gold',
            padding: 10,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 40,
          }}>
          <Text style={{color: 'black', fontWeight: '500'}}>{point}</Text>
        </View>
      </Appbar.Header>
      <Text
        variant="displaySmall"
        style={{color: 'white', textAlign: 'center', marginVertical: 20}}>
        My Statistics
      </Text>
      <LineChart
        data={{
          labels: ['January', 'February', 'March', 'April', 'May', 'June'],
          datasets: [
            {
              data: [point],
            },
          ],
        }}
        width={Dimensions.get('window').width}
        height={Dimensions.get('window').height / 1.8}
        yAxisInterval={1}
        chartConfig={{
          backgroundColor: 'black',
          backgroundGradientFrom: 'gold',
          backgroundGradientTo: 'black',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#ffa726',
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </View>
  );
};
