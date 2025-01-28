import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import React from 'react';
import {
  Dimensions,
  ScrollView,
  View,
  Image,
  Animated,
  PanResponder,
  Share,
  Alert,
} from 'react-native';
import {
  Appbar,
  Avatar,
  Button,
  Text,
  TextInput,
  Icon,
  Chip,
  ProgressBar,
} from 'react-native-paper';
import MapView, {Marker, Circle} from 'react-native-maps';
import {
  launchImageLibrary,
  ImageLibraryOptions,
} from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import uuid from 'react-native-uuid';
import {list} from './home';

export const Info = () => {
  const focused = useIsFocused();
  const route = useRoute<any>();
  const navigation = useNavigation();
  const [text, setText] = React.useState('');
  const [imageSource, setImageSource] = React.useState<any>(null);
  const [points, setPoints] = React.useState(0);
  const [listGames, setListGames] = React.useState<any>(list);
  const [comments, setComments] = React.useState<any>([]);
  const [loading, setLoading] = React.useState(false);
  const [visitCount, setVisitCount] = React.useState(0);
  const [userRating, setUserRating] = React.useState(0);
  const [showAchievement, setShowAchievement] = React.useState(false);

  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(0)).current;

  // Interactive game stats
  const [gameStats, setGameStats] = React.useState({
    visits: 0,
    totalTime: 0,
    achievements: [],
    lastVisit: null,
  });

  // Gesture handler for interactive map
  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        // Add interactive map features
        if (Math.abs(gestureState.dx) > 100) {
          // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
      },
    }),
  ).current;

  const getListGames = async () => {
    const storedList = await AsyncStorage.getItem('gameList');
    const parsedList = storedList ? JSON.parse(storedList) : [];
    if (parsedList.length) {
      setListGames(parsedList);
    }
    setComments((prev: any) => [
      ...prev,
      {
        id: uuid.v4(),
        imageUrl: '',
        userName: 'Andrey',
        avatar:
          'https://img.freepik.com/free-psd/3d-render-avatar-character_23-2150611765.jpg',
        commentDescriptions: 'sdsdfsdfds',
      },
    ]);
  };

  React.useEffect(() => {
    getListGames();
  }, [focused]);

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `Check out ${
          listGames[route.params?.id]?.gameName
        } - An amazing gaming spot!`,
        title: listGames[route.params?.id]?.gameName,
      });
      if (result.action === Share.sharedAction) {
        await onGetPoints(3, 'Sharing is caring!');
      }
    } catch (error) {
      Alert.alert('Error sharing');
    }
  };

  const onGetPoints = async (amount: number, achievement: string) => {
    setLoading(true);
    try {
      const newPoints = points + amount;
      await AsyncStorage.setItem('points', JSON.stringify(newPoints));
      setPoints(newPoints);

      // Show achievement animation
      setShowAchievement(true);
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => setShowAchievement(false));

      // Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      const newVisitCount = visitCount + 1;
      setVisitCount(newVisitCount);

      if (newVisitCount === 5) {
        await onGetPoints(10, 'Regular Visitor Badge!');
      }
    } catch (error) {
      Alert.alert('Error updating points');
    } finally {
      setLoading(false);
    }
  };

  const rateGame = async (rating: number) => {
    setUserRating(rating);
    if (rating >= 4) {
      await onGetPoints(2, 'Thanks for rating!');
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: '#121212'}}>
      {/* Achievement Animation */}
      <Animated.View
        style={{
          position: 'absolute',
          top: '10%',
          alignSelf: 'center',
          zIndex: 100,
          opacity: fadeAnim,
          transform: [{translateY}],
          backgroundColor: 'gold',
          padding: 20,
          borderRadius: 10,
        }}>
        <Text style={{color: '#000', fontWeight: 'bold'}}>
          🎉 Achievement Unlocked!
        </Text>
      </Animated.View>

      <Appbar.Header style={{backgroundColor: '#1E1E1E'}}>
        <Appbar.BackAction color="white" onPress={() => navigation.goBack()} />
        <Appbar.Content
          color="white"
          title={listGames[route.params?.id]?.gameName}
        />
        <Button
          mode="contained"
          style={{backgroundColor: 'gold'}}
          onPress={handleShare}>
          Share
        </Button>
      </Appbar.Header>

      <ScrollView>
        <Image
          width={Dimensions.get('window').width}
          height={300}
          source={{uri: listGames[route.params?.id]?.imageURL}}
        />

        {/* Game Stats */}
        <View style={{padding: 20}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Chip icon="eye">{visitCount} visits</Chip>
            <Chip icon="star" selected={userRating > 0}>
              {userRating}/5
            </Chip>
            <Chip icon="trophy" selected={points > 0}>
              {points} points
            </Chip>
          </View>

          {/* Rating System */}
          <View style={{marginVertical: 20}}>
            <Text style={{color: 'white', marginBottom: 10}}>
              Rate this location:
            </Text>
            <View style={{flexDirection: 'row'}}>
              {[1, 2, 3, 4, 5].map(star => (
                <Icon
                  key={star}
                  source={star <= userRating ? 'star' : 'star-outline'}
                  size={30}
                  color={star <= userRating ? 'gold' : 'white'}
                />
              ))}
            </View>
          </View>

          {/* Interactive Map */}
          <View {...panResponder.panHandlers}>
            <MapView
              style={{height: 300, borderRadius: 15}}
              initialRegion={{
                latitude: listGames[route.params?.id]?.coordinates.latitude,
                longitude: listGames[route.params?.id]?.coordinates.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}>
              <Marker coordinate={listGames[route.params?.id]?.coordinates} />
              <Circle
                center={listGames[route.params?.id]?.coordinates}
                radius={1000}
                fillColor="rgba(255, 215, 0, 0.2)"
                strokeColor="rgba(255, 215, 0, 0.5)"
              />
            </MapView>
          </View>

          {/* Comments Section with Enhanced UI */}
          <View style={{marginTop: 20}}>
            <Text style={{color: 'gold', fontSize: 20, marginBottom: 15}}>
              Community Feedback
            </Text>
            {comments.map((comment: any) => (
              <View
                key={comment.id}
                style={{
                  backgroundColor: '#1E1E1E',
                  padding: 15,
                  borderRadius: 10,
                  marginBottom: 15,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 10,
                  }}>
                  <Avatar.Image size={40} source={{uri: comment.avatar}} />
                  <View style={{marginLeft: 10}}>
                    <Text style={{color: 'white'}}>{comment.userName}</Text>
                    <Text style={{color: 'gray'}}>
                      {new Date(comment.timestamp).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
                {comment.imageUrl && (
                  <Image
                    source={{uri: comment.imageUrl}}
                    style={{
                      width: '100%',
                      height: 200,
                      borderRadius: 10,
                      marginBottom: 10,
                    }}
                  />
                )}
                <Text style={{color: 'white'}}>
                  {comment.commentDescriptions}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
