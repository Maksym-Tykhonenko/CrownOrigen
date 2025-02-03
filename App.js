import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, Image, Animated, View, Text, Alert} from 'react-native';
import {Icon, PaperProvider} from 'react-native-paper';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {Home} from './src/screens/home';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Profile} from './src/screens/profile';
import {Top} from './src/screens/top';
import {Statistics} from './src/screens/statistic';
import {Info} from './src/screens/info';
import {CreateCard} from './src/screens/createCard';
import {Support} from './src/screens/support';
import {Questions} from './src/screens/questions';
import {AlbumScreen} from './src/screens/albumScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export const TabNavigation = () => {
  {
    /** */
  }
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {backgroundColor: '#121212'},
      }}>
      <Tab.Screen
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <Icon
                source="home-variant"
                color={focused ? 'gold' : 'white'}
                size={20}
              />
            );
          },
          tabBarLabel: () => {
            return <Text style={{color: 'white'}}>Home</Text>;
          },
        }}
        name="Home"
        component={Home}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <Icon
                source="dock-top"
                color={focused ? 'gold' : 'white'}
                size={20}
              />
            );
          },
          tabBarLabel: () => {
            return <Text style={{color: 'white'}}>Top</Text>;
          },
        }}
        name="Top"
        component={Top}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <Icon
                source="star"
                color={focused ? 'gold' : 'white'}
                size={20}
              />
            );
          },
          tabBarLabel: () => {
            return <Text style={{color: 'white'}}>Quez</Text>;
          },
        }}
        name="Questions"
        component={Questions}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <Icon
                source="camera"
                color={focused ? 'gold' : 'white'}
                size={20}
              />
            );
          },
          tabBarLabel: () => {
            return <Text style={{color: 'white'}}>Album</Text>;
          },
        }}
        name="AlbumScreen"
        component={AlbumScreen}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <Icon
                source="account"
                color={focused ? 'gold' : 'white'}
                size={20}
              />
            );
          },
          tabBarLabel: () => {
            return <Text style={{color: 'white'}}>Profile</Text>;
          },
        }}
        name="Profile"
        component={Profile}
      />
    </Tab.Navigator>
  );
};

export const App = () => {
  ///////// Louder
  const [louderIsEnded, setLouderIsEnded] = useState(false);
  const appearingAnim = useRef(new Animated.Value(0)).current;
  const appearingSecondAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(appearingAnim, {
      toValue: 1,
      duration: 3500,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      Animated.timing(appearingSecondAnim, {
        toValue: 1,
        duration: 7500,
        useNativeDriver: true,
      }).start();
      //setLouderIsEnded(true);
    }, 500);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setLouderIsEnded(true);
    }, 8000);
  }, []);
  {
    /** */
  }
  ///
  return (
    <NavigationContainer>
      <PaperProvider>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="TabNavigation" component={TabNavigation} />
          <Stack.Screen name="Info" component={Info} />
          <Stack.Screen name="CreateCard" component={CreateCard} />
          <Stack.Screen name="Statistics" component={Statistics} />
          <Stack.Screen name="Support" component={Support} />
        </Stack.Navigator>
      </PaperProvider>
    </NavigationContainer>
  );
};
