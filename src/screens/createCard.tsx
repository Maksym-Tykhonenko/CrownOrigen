import React, {useState, useEffect, memo} from 'react';
import {View, ScrollView, Pressable, ImageSourcePropType} from 'react-native';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Asset, launchImageLibrary} from 'react-native-image-picker';
import uuid from 'react-native-uuid';
import {
  Appbar,
  Avatar,
  Button,
  Text,
  TextInput,
  Card,
  IconButton,
  ProgressBar,
} from 'react-native-paper';
import {list} from './home';

type FormData = {
  gameName: string;
  category: string;
  description: string;
};

const InputField = memo(
  ({
    label,
    value,
    onChangeText,
    icon,
    multiline = false,
  }: {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    icon?: React.ReactNode;
    multiline?: boolean;
  }) => (
    <View style={{marginBottom: 16}}>
      <View
        style={{flexDirection: 'row', alignItems: 'center', marginBottom: 8}}>
        {icon}
        <Text style={{color: 'white', marginLeft: 8}}>{label}</Text>
      </View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={{
          backgroundColor: '#2A2A2A',
          marginBottom: 4,
          borderRadius: 8,
        }}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
        mode="flat"
        textColor="white"
      />
    </View>
  ),
);

export const CreateCard = () => {
  const navigation = useNavigation<any>();
  const focused = useIsFocused();
  const [point, setPoint] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [imageSource, setImageSource] = useState<any | null>(null);
  const [formData, setFormData] = useState<FormData>({
    gameName: '',
    category: '',
    description: '',
  });
  const [formProgress, setFormProgress] = useState(0);

  useEffect(() => {
    getPoint();
  }, [focused]);

  useEffect(() => {
    calculateProgress();
  }, [formData, imageSource]);

  const getPoint = async () => {
    const value = await AsyncStorage.getItem('point');
    if (value !== null) {
      setPoint(Number(value));
    }
  };

  const calculateProgress = () => {
    const fields = [
      formData.gameName,
      formData.category,
      formData.description,
      imageSource,
    ];
    const filledFields = fields.filter(field => field).length;
    setFormProgress(filledFields / fields.length);
  };

  const pickImage = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (!response.didCancel && !response.errorCode && response.assets?.[0]) {
        setImageSource({uri: response.assets[0].uri});
      }
    });
  };

  const handleInputChange = (field: keyof FormData) => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value.trim(),
    }));
  };

  const isFormValid = () => {
    return (
      Object.values(formData).every(value => value.trim().length > 0) &&
      imageSource !== null
    );
  };

  const submit = async () => {
    try {
      const storedList = await AsyncStorage.getItem('gameList');
      const parsedList = storedList ? JSON.parse(storedList) : [];

      setImageSource(null);
      const newList = [
        ...(parsedList.length ? parsedList : list),
        {
          id: uuid.v4(),
          gameName: formData.gameName,
          category: formData.category,
          description: formData.description,
          popularity: 4.9,
          playerComment: '',
          coordinates: {
            latitude: 48.8588443,
            longitude: 2.2943506,
          },
          imageCommentURL: '',
          imageURL: imageSource?.uri,
        },
      ];
      await AsyncStorage.setItem('gameList', JSON.stringify(newList));
      setShowToast(true);

      navigation.goBack();
    } catch (error) {
      console.error('Error updating the list:', error);
    }
  };

  return (
    <View style={{backgroundColor: '#121212', flex: 1}}>
      {showToast && (
        <View
          style={{
            backgroundColor: 'gold',
            position: 'absolute',
            top: '10%',
            left: '50%',
            transform: [{translateX: -75}],
            padding: 16,
            borderRadius: 8,
            zIndex: 1,
            width: 150,
            alignItems: 'center',
          }}>
          <Text style={{color: 'black', fontWeight: '600'}}>Card Created!</Text>
        </View>
      )}

      <Appbar.Header style={{backgroundColor: '#1E1E1E'}}>
        <Appbar.BackAction color="white" onPress={() => navigation.goBack()} />
        <Appbar.Content color="white" title="Create New Card" />
        <View
          style={{
            backgroundColor: 'gold',
            padding: 10,
            borderRadius: 20,
            minWidth: 40,
            alignItems: 'center',
          }}>
          <Text style={{color: 'black', fontWeight: '600'}}>{point}</Text>
        </View>
      </Appbar.Header>

      <ScrollView style={{padding: 16}}>
        <Card
          style={{
            backgroundColor: '#1E1E1E',
            padding: 16,
            marginBottom: 16,
            borderRadius: 12,
          }}>
          <Text
            style={{
              color: 'white',
              fontSize: 18,
              fontWeight: 'bold',
              marginBottom: 16,
              textAlign: 'center',
            }}>
            Game Information
          </Text>

          <View style={{alignItems: 'center', marginBottom: 24}}>
            <Pressable onPress={pickImage}>
              {!imageSource ? (
                <Avatar.Icon
                  size={120}
                  icon={'camera'}
                  style={{
                    backgroundColor: '#333',
                  }}
                />
              ) : (
                <Avatar.Image
                  size={120}
                  source={imageSource}
                  style={{
                    backgroundColor: '#333',
                  }}
                />
              )}
            </Pressable>
            <Text style={{color: '#666', marginTop: 8}}>
              Tap to {imageSource ? 'change' : 'add'} image
            </Text>
          </View>

          <InputField
            label="Game Name"
            value={formData.gameName}
            onChangeText={handleInputChange('gameName')}
          />

          <InputField
            label="Category"
            value={formData.category}
            onChangeText={handleInputChange('category')}
          />

          <InputField
            label="Description"
            value={formData.description}
            onChangeText={handleInputChange('description')}
            multiline
          />

          <View style={{marginTop: 16}}>
            <Text style={{color: '#666', marginBottom: 8}}>Form Progress</Text>
            <ProgressBar
              progress={formProgress}
              color="gold"
              style={{height: 8, borderRadius: 4}}
            />
          </View>
        </Card>

        <Button
          mode="contained"
          onPress={submit}
          disabled={!isFormValid()}
          style={{
            marginBottom: 24,
            backgroundColor: isFormValid() ? 'gold' : '#333',
            borderRadius: 8,
            padding: 8,
          }}>
          Create Card
        </Button>
      </ScrollView>
    </View>
  );
};
