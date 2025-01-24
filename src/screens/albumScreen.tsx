import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import React from 'react';
import {
  Image,
  Pressable,
  View,
  Alert,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {
  Appbar,
  Button,
  Dialog,
  Portal,
  List,
  Text,
  TextInput,
  Icon,
} from 'react-native-paper';
import {
  launchImageLibrary,
  Asset,
  ImageLibraryOptions,
  ImagePickerResponse,
} from 'react-native-image-picker';

export const AlbumScreen = () => {
  const focused = useIsFocused();
  const [point, setPoint] = React.useState(0);
  const [albums, setAlbums] = React.useState<{[key: string]: string[]}>({});
  const [newAlbumName, setNewAlbumName] = React.useState<string>('');
  const [dialogVisible, setDialogVisible] = React.useState(false);

  const getPoint = async () => {
    const value = await AsyncStorage.getItem('point');
    if (value !== null) {
      setPoint(Number(value));
    }
  };

  const getAlbums = async () => {
    const storedAlbums = await AsyncStorage.getItem('albums');
    if (storedAlbums) {
      setAlbums(JSON.parse(storedAlbums));
    }
  };

  React.useEffect(() => {
    getPoint();
    getAlbums();
  }, [focused]);

  const saveAlbums = async (newAlbums: {[key: string]: string[]}) => {
    setAlbums(newAlbums);
    await AsyncStorage.setItem('albums', JSON.stringify(newAlbums));
  };

  const createAlbum = () => {
    if (newAlbumName.trim() === '') {
      Alert.alert('Error', 'Album name cannot be empty.');
      return;
    }
    if (albums[newAlbumName]) {
      Alert.alert('Error', 'Album already exists.');
      return;
    }
    const updatedAlbums = {...albums, [newAlbumName]: []};
    saveAlbums(updatedAlbums);
    setNewAlbumName('');
    setDialogVisible(false);
  };

  const pickImage = (albumName: string) => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
    };
    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (!response.didCancel && !response.errorCode) {
        if (response.assets && response.assets.length > 0) {
          const selectedAsset: Asset = response.assets[0];
          if (selectedAsset.uri) {
            const updatedAlbums = {
              ...albums,
              [albumName]: [...albums[albumName], selectedAsset.uri],
            };
            saveAlbums(updatedAlbums);
          }
        }
      }
    });
  };

  const removeImage = (albumName: string, uri: string) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this image?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedAlbums = {
              ...albums,
              [albumName]: albums[albumName].filter(image => image !== uri),
            };
            saveAlbums(updatedAlbums);
          },
        },
      ],
    );
  };

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
        style={{color: 'gold', textAlign: 'center', marginVertical: 10}}>
        Album
      </Text>
      <View style={{padding: 20}}>
        <Button
          mode="contained"
          icon={() => {
            return <Icon size={30} source={'plus'} />;
          }}
          onPress={() => setDialogVisible(true)}
          style={styles.createButton}>
          <Text
            variant="bodyMedium"
            style={{color: 'black', textAlign: 'center', marginVertical: 10}}>
            Create Album
          </Text>
        </Button>
      </View>
      <ScrollView>
        {Object.keys(albums).length === 0 ? (
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Text variant="titleLarge" style={{color: 'white'}}>
              None Album
            </Text>
          </View>
        ) : (
          <List.Section>
            {Object.keys(albums).map(albumName => (
              <List.Accordion
                key={albumName}
                title={albumName}
                titleStyle={styles.accordionTitle}
                style={styles.accordion}
                left={props => <List.Icon {...props} icon="folder" />}>
                <View style={styles.imageContainer}>
                  {albums[albumName].map((uri, index) => (
                    <Pressable
                      key={index}
                      style={styles.imageWrapper}
                      onPress={() => removeImage(albumName, uri)}>
                      <Image source={{uri: uri}} style={styles.image} />
                    </Pressable>
                  ))}
                  <Button
                    mode="outlined"
                    onPress={() => pickImage(albumName)}
                    style={styles.addImageButton}>
                    Add Photo
                  </Button>
                </View>
              </List.Accordion>
            ))}
          </List.Section>
        )}
      </ScrollView>

      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>Create Album</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Album Name"
              value={newAlbumName}
              onChangeText={setNewAlbumName}
              mode="outlined"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
            <Button onPress={createAlbum}>Create</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  pointContainer: {
    backgroundColor: 'gold',
    padding: 10,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointText: {
    color: '#1E1E1E',
    fontWeight: 'bold',
    fontSize: 16,
  },
  createButton: {
    backgroundColor: '#FFD700',
    marginBottom: 10,
    borderRadius: 8,
  },
  accordion: {
    backgroundColor: '#1E1E1E',
    // marginVertical: 5,
    // borderRadius: 8,
  },
  accordionTitle: {
    color: 'white',
    fontWeight: 'bold',
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  imageWrapper: {
    width: '40%',
    height: 150,
    margin: 10,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
    backgroundColor: '#1E1E1E',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  addImageButton: {
    width: '40%',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    borderColor: '#FFD700',
    borderWidth: 1,
    borderRadius: 8,
  },
});
