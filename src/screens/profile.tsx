import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  FlatList,
  Image,
  ImageSourcePropType,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import {
  Asset,
  ImageLibraryOptions,
  ImagePickerResponse,
  launchImageLibrary,
} from 'react-native-image-picker';

import {Appbar, Avatar, Button, Text, TextInput} from 'react-native-paper';

export const Profile = () => {
  const navigation = useNavigation<any>();
  const focused = useIsFocused();
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
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

  const [imageSource, setImageSource] = React.useState<
    ImageSourcePropType | null | any
  >(null);

  const pickImage = () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
    };
    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (!response.didCancel && !response.errorCode) {
        if (response.assets && response.assets.length > 0) {
          const selectedAsset: Asset = response.assets[0];
          setImageSource({uri: selectedAsset.uri});
        }
      }
    });
  };

  const successfullyClean = async () => {
    setTost(true);
    await AsyncStorage.setItem('user', '');
    setUsername('');
    setEmail('');
    setImageSource(null);
  };

  const storeData = async () => {
    const user = {
      username,
      email,
      image: imageSource,
    };
    await AsyncStorage.setItem('user', JSON.stringify(user));
  };
  const getStoreData = async () => {
    const value = await AsyncStorage.getItem('user');
    if (value !== null) {
      const parseValue = JSON.parse(value);

      setUsername(parseValue.username);
      setEmail(parseValue.email);
      setImageSource(parseValue.image);
    }
  };

  const [tost, setTost] = React.useState(false);

  React.useEffect(() => {
    getStoreData();
  }, []);

  React.useEffect(() => {
    if (tost) {
      storeData();
      setTimeout(() => {
        setTost(false);
      }, 3000);
    }
  }, [tost]);

  return (
    <View style={{backgroundColor: '#121212', flex: 1}}>
      {tost && (
        <View
          style={{
            backgroundColor: 'gold',
            position: 'absolute',
            top: '20%',
            paddingVertical: 10,
            paddingHorizontal: 20,
            left: 0,
            zIndex: 1,
          }}>
          <Text
            variant="bodyMedium"
            style={{color: 'white', fontWeight: '600'}}>
            {email.length || username.length || imageSource
              ? 'Successfully save'
              : 'Successfully cleared'}
          </Text>
        </View>
      )}
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
      <Button
        style={{
          borderRadius: 30,
          padding: 5,
          marginHorizontal: 20,
          position: 'absolute',
          right: 0,
          bottom: '5%',
          backgroundColor: 'gold',
          zIndex: 11,
        }}
        mode="elevated"
        onPress={() => navigation.navigate('Support')}>
        <Text variant="bodyLarge">Support</Text>
      </Button>
      <Text
        variant="displaySmall"
        style={{color: 'gold', textAlign: 'center', marginVertical: 20}}>
        Profile
      </Text>
      <ScrollView style={{marginTop: 40, paddingHorizontal: 20}}>
        {!imageSource ? (
          <Pressable onPress={pickImage}>
            <Avatar.Icon
              size={120}
              icon={'camera'}
              color="black"
              style={{
                backgroundColor: 'white',
                alignSelf: 'center',
                marginBottom: 20,
              }}
            />
          </Pressable>
        ) : (
          <Pressable onPress={pickImage}>
            <Avatar.Image
              size={120}
              source={imageSource}
              style={{
                backgroundColor: 'white',
                alignSelf: 'center',
                marginBottom: 20,
              }}
            />
          </Pressable>
        )}
        {/* <TextInput
          label="Email"
          style={{backgroundColor: 'white', marginBottom: 20}}
          value={email}
          onChangeText={text => setEmail(text)}
        /> */}
        <TextInput
          label="Username"
          style={{backgroundColor: 'white', marginBottom: 20}}
          value={username}
          onChangeText={text => setUsername(text)}
        />
        {username.length && username.indexOf(' ') ? (
          <Button
            style={{borderRadius: 5, padding: 5, marginBottom: 20}}
            mode="elevated"
            onPress={() => setTost(true)}>
            <Text variant="bodyLarge">Submit</Text>
          </Button>
        ) : null}
        <Button
          style={{
            borderRadius: 5,
            padding: 5,
            marginBottom: 20,
            backgroundColor: 'gold',
          }}
          mode="elevated"
          onPress={successfullyClean}>
          <Text variant="bodyLarge">Reset</Text>
        </Button>
      </ScrollView>
    </View>
  );
};
