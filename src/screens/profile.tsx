import React, {useState, useEffect} from 'react';
import {View, ScrollView, Pressable, ImageSourcePropType} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {Asset, launchImageLibrary} from 'react-native-image-picker';
import {
  Appbar,
  Avatar,
  Button,
  Text,
  TextInput,
  IconButton,
} from 'react-native-paper';

export const Profile = () => {
  const navigation = useNavigation<any>();
  const focused = useIsFocused();
  const [username, setUsername] = useState('');
  const [point, setPoint] = useState(0);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [level, setLevel] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [imageSource, setImageSource] = useState<ImageSourcePropType | null>(
    null,
  );
  const [bio, setBio] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    getStoredData();
    getPoint();
  }, [focused]);

  const getPoint = async () => {
    const value = await AsyncStorage.getItem('point');
    if (value !== null) {
      setPoint(Number(value));
      // Calculate level based on points
      setLevel(Math.floor(Number(value) / 100) + 1);
    }
  };

  const getStoredData = async () => {
    const value = await AsyncStorage.getItem('user');
    if (value !== null) {
      const parseValue = JSON.parse(value);
      setUsername(parseValue.username);
      setImageSource(parseValue.image);
      setBio(parseValue.bio || '');
      setAchievements(parseValue.achievements || []);
    }
  };

  const handleSave = async () => {
    const user = {
      username,
      image: imageSource,
      bio,
      achievements,
    };
    await AsyncStorage.setItem('user', JSON.stringify(user));
    showToastMessage('Profile updated successfully');
    setIsEditMode(false);
  };

  const handleReset = async () => {
    await AsyncStorage.setItem('user', '');
    setUsername('');
    setImageSource(null);
    setBio('');
    setAchievements([]);
    showToastMessage('Profile reset successfully');
  };

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const pickImage = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (!response.didCancel && !response.errorCode && response.assets?.[0]) {
        setImageSource({uri: response.assets[0].uri});
      }
    });
  };

  const renderProgressBar = () => {
    const progress = (point % 100) / 100;
    return (
      <View style={{marginVertical: 10}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 5,
          }}>
          <Text style={{color: 'white'}}>Level {level}</Text>
          <Text style={{color: 'white'}}>{point} points</Text>
        </View>
        <View style={{height: 8, backgroundColor: '#333', borderRadius: 4}}>
          <View
            style={{
              height: '100%',
              width: `${progress * 100}%`,
              backgroundColor: 'gold',
              borderRadius: 4,
            }}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={{backgroundColor: '#121212', flex: 1}}>
      {showToast && (
        <View
          style={{
            backgroundColor: 'gold',
            position: 'absolute',
            top: '10%',
            padding: 10,
            borderRadius: 8,
            zIndex: 1,
            alignSelf: 'center',
          }}>
          <Text style={{color: 'black', fontWeight: '600'}}>
            {toastMessage}
          </Text>
        </View>
      )}

      <Appbar.Header style={{backgroundColor: '#1E1E1E'}}>
        <Appbar.Content color="white" title="Profile" />
        <IconButton
          icon={isEditMode ? 'check' : 'pencil'}
          iconColor="gold"
          onPress={() => (isEditMode ? handleSave() : setIsEditMode(true))}
        />
      </Appbar.Header>

      <ScrollView style={{padding: 20}}>
        <View style={{alignItems: 'center', marginBottom: 20}}>
          <Pressable onPress={isEditMode ? pickImage : undefined}>
            {!imageSource ? (
              <Avatar.Icon
                size={120}
                icon="account"
                color="black"
                style={{backgroundColor: 'gold'}}
              />
            ) : (
              <Avatar.Image
                size={120}
                source={imageSource}
                style={{backgroundColor: 'white'}}
              />
            )}
          </Pressable>

          {renderProgressBar()}

          <View
            style={{
              backgroundColor: '#1E1E1E',
              padding: 15,
              borderRadius: 12,
              width: '100%',
              marginTop: 20,
            }}>
            <TextInput
              label="Username"
              value={username}
              disabled={!isEditMode}
              style={{
                backgroundColor: '#2A2A2A',
                marginBottom: 10,
                color: 'white',
              }}
              textColor="white"
              onChangeText={isEditMode ? setUsername : undefined}
            />

            <TextInput
              label="Bio"
              value={bio}
              disabled={!isEditMode}
              multiline
              numberOfLines={3}
              style={{
                backgroundColor: '#2A2A2A',
                marginBottom: 10,
                color: 'white',
              }}
              textColor="white"
              onChangeText={isEditMode ? setBio : undefined}
            />
          </View>

          <View
            style={{
              backgroundColor: '#1E1E1E',
              padding: 15,
              borderRadius: 12,
              width: '100%',
              marginTop: 20,
            }}>
            <Text style={{color: 'gold', fontSize: 18, marginBottom: 10}}>
              Achievements
            </Text>
            {achievements.length > 0 ? (
              achievements.map((achievement, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#2A2A2A',
                    padding: 10,
                    borderRadius: 8,
                    marginBottom: 8,
                  }}>
                  <Avatar.Icon
                    size={40}
                    icon="trophy"
                    style={{backgroundColor: 'gold'}}
                  />
                  <Text style={{color: 'white', marginLeft: 10}}>
                    {achievement}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={{color: '#666', textAlign: 'center'}}>
                No achievements yet
              </Text>
            )}
          </View>
        </View>

        {isEditMode && (
          <Button
            mode="contained"
            style={{
              backgroundColor: 'red',
              marginTop: 20,
              marginBottom: 40,
            }}
            onPress={handleReset}>
            Reset Profile
          </Button>
        )}
      </ScrollView>

      <Button
        style={{
          position: 'absolute',
          right: 20,
          bottom: 20,
          backgroundColor: 'gold',
          borderRadius: 30,
        }}
        mode="contained"
        onPress={() => navigation.navigate('Support')}>
        Support
      </Button>
    </View>
  );
};
