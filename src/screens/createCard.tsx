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

import uuid from 'react-native-uuid';

import {
  Appbar,
  Avatar,
  Button,
  List,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';
import {list} from './home';

export const CreateCard = () => {
  const [gameName, setGameName] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [popularity, setPopularity] = React.useState('');

  const focused = useIsFocused();
  const navigation = useNavigation<any>();
  const [point, setPoint] = React.useState(0);

  const getPoint = async () => {
    const value = await AsyncStorage.getItem('point');
    if (value !== null) {
      setPoint(Number(value));
    }
  };

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

  const submit = async () => {
    try {
      const storedList = await AsyncStorage.getItem('gameList');
      const parsedList = storedList ? JSON.parse(storedList) : [];

      setGameName('');
      setCategory('');
      setDescription('');
      setPopularity('');
      setImageSource(null);
      const newList = [
        ...(parsedList.length ? parsedList : list),
        {
          id: uuid.v4(),
          gameName: gameName,
          category: category,
          description: description,
          popularity: popularity,
          playerComment: '',
          coordinates: {
            latitude: 48.8588443,
            longitude: 2.2943506,
          },
          imageCommentURL: '',
          imageURL: imageSource.uri,
        },
      ];
      await AsyncStorage.setItem('gameList', JSON.stringify(newList));
      setTost(true);

      navigation.goBack();
    } catch (error) {
      console.error('Error updating the list:', error);
    }
  };

  React.useEffect(() => {
    getPoint();
  }, [focused]);

  const [tost, setTost] = React.useState(false);

  React.useEffect(() => {
    if (tost) {
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
            Successfully add card
          </Text>
        </View>
      )}
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
        style={{color: 'white', textAlign: 'center', marginVertical: 10}}>
        Create Card
      </Text>
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
      <ScrollView style={{marginHorizontal: 20}}>
        <TextInput
          label="Game Name"
          style={{backgroundColor: 'white', marginBottom: 20}}
          value={gameName}
          onChangeText={text => setGameName(text)}
        />
        <TextInput
          label="Category"
          style={{backgroundColor: 'white', marginBottom: 20}}
          value={category}
          onChangeText={text => setCategory(text)}
        />
        <TextInput
          label="Description"
          style={{backgroundColor: 'white', marginBottom: 20}}
          value={description}
          onChangeText={text => setDescription(text)}
        />
        <TextInput
          label="Popularity"
          style={{backgroundColor: 'white', marginBottom: 20}}
          value={popularity}
          onChangeText={text => setPopularity(text)}
        />
      </ScrollView>

      {gameName.length &&
      gameName.indexOf(' ') &&
      description.length &&
      description.indexOf(' ') &&
      popularity.length &&
      popularity.indexOf(' ') &&
      category.length &&
      category.indexOf(' ') &&
      imageSource ? (
        <Button
          style={{borderRadius: 5, padding: 5, marginBottom: 20}}
          mode="elevated"
          onPress={submit}>
          <Text variant="bodyLarge">Submit</Text>
        </Button>
      ) : null}
    </View>
  );
};
