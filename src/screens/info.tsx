import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import React from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ImageSourcePropType,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import uuid from 'react-native-uuid';

import {
  Appbar,
  Avatar,
  Button,
  Icon,
  List,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';
import {list} from './home';
import MapView, {Marker} from 'react-native-maps';
import {
  Asset,
  ImageLibraryOptions,
  ImagePickerResponse,
  launchImageLibrary,
} from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const Info = () => {
  const focused = useIsFocused();
  const route = useRoute<any>();
  const navigation = useNavigation();
  const [text, setText] = React.useState('');
  const [imageSource, setImageSource] = React.useState<
    ImageSourcePropType | null | any
  >(null);
  const [point, setPoint] = React.useState(0);
  const [listGames, setListGames] = React.useState<any>(list);

  const [comment, setComment] = React.useState<any>([
    {
      id: 1,
      imageUrl: listGames[route.params?.id]?.imageCommentURL,
      userName: 'Andrey',
      avatar:
        'https://img.freepik.com/free-psd/3d-render-avatar-character_23-2150611765.jpg',
      commentDescriptions: listGames[route.params?.id]?.playerComment,
    },
  ]);

  const getListGames = async () => {
    const storedList = await AsyncStorage.getItem('gameList');
    const parsedList = storedList ? JSON.parse(storedList) : [];
    if (parsedList.length) {
      setListGames(parsedList);
    }
  };

  const onGetPoint = async () => {
    setPoint(prev => prev + 5);
    setTost(true);
    await AsyncStorage.setItem('point', JSON.stringify(point + 5));
  };

  const getPoint = async () => {
    const value = await AsyncStorage.getItem('point');
    if (value !== null) {
      setPoint(Number(value));
    }
  };

  React.useEffect(() => {
    getPoint();
    getListGames();
  }, [focused]);

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

  const [tost, setTost] = React.useState(false);

  React.useEffect(() => {
    if (tost) {
      setComment((prev: any) => [
        ...prev,
        {
          id: uuid.v4(),
          imageUrl: imageSource.uri,
          userName: 'Andrey',
          avatar:
            'https://img.freepik.com/free-psd/3d-render-avatar-character_23-2150611765.jpg',
          commentDescriptions: text,
        },
      ]);
      setText('');
      setImageSource('');
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
            {!text && !imageSource
              ? 'Successfully add point'
              : 'Sent for processing'}
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
      <Image
        width={Dimensions.get('window').width}
        height={300}
        source={{uri: listGames[route.params?.id]?.imageURL}}
      />
      <ScrollView
        style={{backgroundColor: '#121212', marginTop: -40, borderRadius: 30}}>
        <Text
          variant="displaySmall"
          style={{
            color: 'white',
            textAlign: 'center',
            marginVertical: 10,
            marginBottom: 20,
          }}>
          {listGames[route.params?.id]?.gameName}
        </Text>
        <Text
          variant="bodyLarge"
          style={{
            color: 'gold',
            marginHorizontal: 20,
            fontWeight: '500',
          }}>
          Description
        </Text>
        <Text
          variant="bodyMedium"
          style={{
            color: 'white',
            marginVertical: 10,
            marginHorizontal: 20,
            marginBottom: 20,
          }}>
          {listGames[route.params?.id]?.description}
        </Text>
        <Text
          variant="bodyLarge"
          style={{
            color: 'gold',
            marginHorizontal: 20,
            fontWeight: '500',
          }}>
          Category
        </Text>
        <Text
          variant="bodyMedium"
          style={{
            color: 'white',
            marginVertical: 10,
            marginHorizontal: 20,
            marginBottom: 20,
          }}>
          {listGames[route.params?.id]?.category}
        </Text>
        <Text
          variant="bodyLarge"
          style={{
            color: 'gold',
            marginHorizontal: 20,
            fontWeight: '500',
          }}>
          Popularity
        </Text>
        <Text
          variant="bodyMedium"
          style={{
            color: 'white',
            marginVertical: 10,
            marginHorizontal: 20,
            marginBottom: 20,
          }}>
          {listGames[route.params?.id]?.popularity}
        </Text>
        <MapView
          initialRegion={{
            latitude: listGames[route.params?.id]?.coordinates.latitude,
            longitude: listGames[route.params?.id]?.coordinates.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          style={{width: '100%', height: 300}}>
          <Marker coordinate={listGames[route.params?.id]?.coordinates} />
        </MapView>
        <Button
          style={{
            borderRadius: 5,
            padding: 5,
            marginTop: 20,
            backgroundColor: 'gold',
          }}
          mode="elevated"
          onPress={onGetPoint}>
          <Text variant="bodyLarge">Get points +5</Text>
        </Button>
        <View
          style={{borderWidth: 1, borderTopColor: 'gold', marginVertical: 10}}>
          <Text
            variant="bodyLarge"
            style={{
              color: 'gold',
              marginTop: 20,
              paddingHorizontal: 20,
              fontWeight: '500',
            }}>
            Comment
          </Text>
          {listGames[route.params?.id]?.playerComment?.length
            ? comment.map((item: any) => (
                <View
                  key={item.id}
                  style={{
                    marginBottom: 20,
                    marginHorizontal: 20,
                    marginVertical: 20,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      columnGap: 20,
                      marginBottom: 10,
                    }}>
                    <Avatar.Image
                      size={40}
                      source={{
                        uri: item.avatar,
                      }}
                      style={{
                        backgroundColor: 'white',
                        alignSelf: 'center',
                      }}
                    />
                    <Text
                      variant="bodyLarge"
                      style={{
                        fontWeight: '500',
                        color: 'white',
                      }}>
                      {item.userName}
                    </Text>
                  </View>
                  <Image
                    style={{width: '100%', height: 200, marginBottom: 20}}
                    source={{uri: item.imageUrl}}
                  />
                  <Text
                    variant="bodyMedium"
                    style={{
                      color: 'white',
                      marginBottom: 20,
                    }}>
                    {item.commentDescriptions}
                  </Text>
                </View>
              ))
            : null}
          <View style={{marginHorizontal: 20}}>
            <View style={{alignItems: 'center', marginBottom: 10}}>
              {!imageSource ? (
                <Pressable onPress={pickImage}>
                  <Icon size={50} color="white" source={'camera'} />
                </Pressable>
              ) : (
                <Image style={{width: 50, height: 50}} source={imageSource} />
              )}
            </View>
            <TextInput
              label="Comment"
              style={{backgroundColor: 'white', marginBottom: 20}}
              value={text}
              onChangeText={text => setText(text)}
            />
            {imageSource && text.length && text.indexOf(' ') ? (
              <Button
                style={{borderRadius: 5, padding: 5}}
                mode="elevated"
                onPress={() => setTost(true)}>
                <Text variant="bodyLarge">Send</Text>
              </Button>
            ) : null}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
