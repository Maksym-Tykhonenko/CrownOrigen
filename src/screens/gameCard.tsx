import React, {useState} from 'react';
import {
  View,
  Animated,
  PanResponder,
  Pressable,
  Image,
  Linking,
} from 'react-native';
import {Text, IconButton} from 'react-native-paper';

interface GameCardProps {
  game: {
    id: number;
    gameName: string;
    category: string;
    description: string;
    popularity: number;
    playerComment: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    imageCommentURL: string;
    imageURL: string;
  };
  onPress: () => void;
}

export const GameCard: React.FC<GameCardProps> = ({game, onPress}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const translateY = new Animated.Value(0);
  const scale = new Animated.Value(1);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      translateY.setValue(gesture.dy);
      const scaleValue = Math.max(1 - Math.abs(gesture.dy) / 500, 0.95);
      scale.setValue(scaleValue);
    },
    onPanResponderRelease: (_, gesture) => {
      if (Math.abs(gesture.dy) > 50) {
        setIsExpanded(!isExpanded);
      }
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
        }),
      ]).start();
    },
  });

  const openLocation = () => {
    const {latitude, longitude} = game.coordinates;
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  const renderStars = (rating: number) => {
    if (!rating || typeof rating !== 'number') {
      console.warn('Invalid rating:', rating);
      return null;
    }
  };

  if (!game) {
    console.error('Game object is undefined');
    return null;
  }

  if (!game.popularity || typeof game.popularity !== 'number') {
    console.error('Invalid or missing popularity field:', game.popularity);
    return null;
  }

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={{
        transform: [{translateY}, {scale}],
        margin: 16,
        borderRadius: 20,
        backgroundColor: '#1E1E1E',
        elevation: 5,
        overflow: 'hidden',
      }}>
      <Pressable onPress={onPress}>
        <Image
          source={{uri: game.imageURL}}
          style={{
            width: '100%',
            height: 200,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        />
        <View style={{padding: 16}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 8,
            }}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: 'gold',
              }}>
              {game.gameName}
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {game.popularity ? renderStars(game.popularity) : null}
            </View>
          </View>

          <View
            style={{
              backgroundColor: 'rgba(255,215,0,0.2)',
              paddingHorizontal: 12,
              paddingVertical: 4,
              borderRadius: 12,
              alignSelf: 'flex-start',
              marginBottom: 12,
            }}>
            <Text style={{color: 'gold'}}>{game.category}</Text>
          </View>

          <Text style={{color: 'white', marginBottom: 12}}>
            {game.description}
          </Text>

          {isExpanded && (
            <View style={{marginTop: 8}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  padding: 12,
                  borderRadius: 12,
                  marginBottom: 12,
                }}>
                <Text style={{color: 'white', flex: 1}}>
                  {game.playerComment}
                </Text>
              </View>

              <Pressable
                onPress={openLocation}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: 'gold',
                  padding: 12,
                  borderRadius: 12,
                }}>
                <Text style={{color: 'black', fontWeight: '500'}}>
                  Показати на карті
                </Text>
              </Pressable>
            </View>
          )}

          <Text
            style={{
              color: 'gold',
              textAlign: 'center',
              marginTop: 8,
              opacity: 0.7,
            }}>
            {isExpanded ? 'Згорнути ↑' : 'Розгорнути ↓'}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
};
