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

export const Support = () => {
  const navigation = useNavigation<any>();
  const focused = useIsFocused();
  const [point, setPoint] = React.useState(0);
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [descriptions, setDescriptions] = React.useState('');
  const [reportName, setReportName] = React.useState('');

  const getPoint = async () => {
    const value = await AsyncStorage.getItem('point');
    if (value !== null) {
      setPoint(Number(value));
    }
  };

  React.useEffect(() => {
    getPoint();
  }, [focused]);

  const [tost, setTost] = React.useState(false);

  React.useEffect(() => {
    if (tost) {
      setUsername('');
      setEmail('');
      setDescriptions('');
      setReportName('');
      setImageSource(null);
      setTimeout(() => {
        setTost(false);
      }, 3000);
    }
  }, [tost]);

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
            Successfully send support
          </Text>
        </View>
      )}
      <Appbar.Header style={{backgroundColor: '#121212'}}>
        <Appbar.BackAction color="white" onPress={() => navigation.goBack()} />
        {/* <Appbar.Content color="white" title="Crown" /> */}
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
        Support
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
        <TextInput
          label="Email"
          style={{backgroundColor: 'white', marginBottom: 20}}
          value={email}
          onChangeText={text => setEmail(text)}
        />
        <TextInput
          label="Username"
          style={{backgroundColor: 'white', marginBottom: 20}}
          value={username}
          onChangeText={text => setUsername(text)}
        />
        <TextInput
          label="Report Name"
          style={{backgroundColor: 'white', marginBottom: 20}}
          value={reportName}
          onChangeText={text => setReportName(text)}
        />
        <TextInput
          label="Report Descriptions"
          style={{backgroundColor: 'white', marginBottom: 20}}
          value={descriptions}
          onChangeText={text => setDescriptions(text)}
        />
        {username.length &&
        username.indexOf(' ') &&
        descriptions.length &&
        descriptions.indexOf(' ') &&
        reportName.length &&
        reportName.indexOf(' ') &&
        email.length &&
        email.indexOf(' ') ? (
          <Button
            style={{borderRadius: 5, padding: 5, marginBottom: 20}}
            mode="elevated"
            onPress={() => setTost(true)}>
            <Text variant="bodyLarge">Submit</Text>
          </Button>
        ) : null}
      </ScrollView>
    </View>
  );
};
