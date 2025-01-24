import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import React from 'react';
import {FlatList, Image, ScrollView, View} from 'react-native';

import {Appbar, Avatar, Button, Text, TextInput} from 'react-native-paper';

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
        <Appbar.Content color="white" title="" />
        <View style={{borderRadius: 0}}>
          <Image
            source={{
              uri: 'https://www.pngarts.com/files/9/Golden-Prince-Crown-PNG-Image-Background.png',
            }}
            style={{padding: 0, width: 40, height: 40}}
          />
        </View>
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
        Top User
      </Text>
      <ScrollView style={{marginTop: 40, paddingHorizontal: 20}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: 40,
          }}>
          <View>
            <Avatar.Image
              size={90}
              source={{
                uri: 'https://img.freepik.com/free-psd/3d-render-avatar-character_23-2150611765.jpg',
              }}
              style={{
                backgroundColor: 'white',
                alignSelf: 'center',
                marginBottom: 20,
              }}
            />
            <View
              style={{
                backgroundColor: 'gold',
                padding: 10,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 40,
              }}>
              <Text style={{color: 'black', fontWeight: '500'}}>150</Text>
            </View>
          </View>
          <View>
            <Avatar.Image
              size={110}
              source={{
                uri: 'https://img.freepik.com/free-psd/3d-illustration-person-with-punk-hair-jacket_23-2149436198.jpg',
              }}
              style={{
                backgroundColor: 'white',
                alignSelf: 'center',
                marginBottom: 20,
              }}
            />
            <View
              style={{
                backgroundColor: 'gold',
                padding: 10,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 40,
              }}>
              <Text style={{color: 'black', fontWeight: '500'}}>300</Text>
            </View>
          </View>
          <View>
            <Avatar.Image
              size={90}
              source={{
                uri: 'https://img.freepik.com/psd-gratis/render-3d-personaje-avatar_23-2150611707.jpg',
              }}
              style={{
                backgroundColor: 'white',
                alignSelf: 'center',
                marginBottom: 20,
              }}
            />
            <View
              style={{
                backgroundColor: 'gold',
                padding: 10,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 40,
              }}>
              <Text style={{color: 'black', fontWeight: '500'}}>200</Text>
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              columnGap: 20,
            }}>
            <Avatar.Image
              size={50}
              source={{
                uri: 'https://img.freepik.com/psd-premium/illustration-3d-personne-veste-cuir_23-2149436206.jpg?w=360',
              }}
              style={{
                backgroundColor: 'white',
                alignSelf: 'center',
              }}
            />
            <Text
              variant="titleLarge"
              style={{color: 'white', fontWeight: '500'}}>
              Anna
            </Text>
          </View>
          <View
            style={{
              backgroundColor: 'gold',
              padding: 10,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 40,
            }}>
            <Text style={{color: 'black', fontWeight: '500'}}>100</Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              columnGap: 20,
            }}>
            <Avatar.Image
              size={50}
              source={{
                uri: 'https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg',
              }}
              style={{
                backgroundColor: 'white',
                alignSelf: 'center',
              }}
            />
            <Text
              variant="titleLarge"
              style={{color: 'white', fontWeight: '500'}}>
              Artem
            </Text>
          </View>
          <View
            style={{
              backgroundColor: 'gold',
              padding: 10,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 40,
            }}>
            <Text style={{color: 'black', fontWeight: '500'}}>80</Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              columnGap: 20,
            }}>
            <Avatar.Image
              size={50}
              source={{
                uri: 'https://img.freepik.com/free-psd/3d-illustration-person-with-glasses_23-2149436189.jpg',
              }}
              style={{
                backgroundColor: 'white',
                alignSelf: 'center',
              }}
            />
            <Text
              variant="titleLarge"
              style={{color: 'white', fontWeight: '500'}}>
              Andrey
            </Text>
          </View>
          <View
            style={{
              backgroundColor: 'gold',
              padding: 10,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 40,
            }}>
            <Text style={{color: 'black', fontWeight: '500'}}>70</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
