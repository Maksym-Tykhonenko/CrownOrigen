import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import React from 'react';
import {FlatList, Image, Pressable, View} from 'react-native';

import {Appbar, Icon, List, Text, useTheme} from 'react-native-paper';
import {GameCard} from './gameCard';

export const list = [
  {
    id: 1,
    gameName: 'Chess',
    category: 'Strategy',
    description:
      "A classic strategy game where players aim to checkmate the opponent's king.",
    popularity: 4.9,
    playerComment: 'Timeless and deeply strategic. Perfect for thinkers.',
    coordinates: {
      latitude: 40.712776,
      longitude: -74.005974,
    },
    imageCommentURL: 'https://m.media-amazon.com/images/I/71UBr0lwOvL.jpg',
    imageURL:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Chess_pieces_close_up.jpg/800px-Chess_pieces_close_up.jpg',
  },
  {
    id: 3,
    gameName: 'Settlers of Catan',
    category: 'Strategy',
    description:
      'A game of trading and resource management to build settlements and earn points.',
    popularity: 4.8,
    playerComment: 'The trading mechanics make this game truly unique!',
    coordinates: {
      latitude: 48.856613,
      longitude: 2.352222,
    },
    imageCommentURL:
      'https://geekach.com.ua/content/images/44/500x375l99nn0/the-settlers-of-catan-5-6-player-kolonizatory.-rozshyrennia-dlia-5-6-hravtsiv-59196316908571.jpg',
    imageURL:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOJBAXKW9Md5cPLS5nuMnVIcNyEieqfFmF7w&s',
  },
  {
    id: 4,
    gameName: 'Risk',
    category: 'Strategy',
    description:
      'A game of global domination where players aim to conquer territories.',
    popularity: 4.6,
    playerComment: "It's all about strategy and alliances—fantastic fun!",
    coordinates: {
      latitude: 51.507351,
      longitude: -0.127758,
    },
    imageCommentURL:
      'https://content1.rozetka.com.ua/goods/images/big/420836616.jpg',
    imageURL:
      'https://imageio.forbes.com/specials-images/imageserve/5eee230831cecb00065c882d/0x0.jpg?format=jpg&height=900&width=1600&fit=bounds',
  },
  {
    id: 5,
    gameName: 'Scrabble',
    category: 'Word',
    description:
      'A word game where players use letter tiles to create words on a game board.',
    popularity: 4.5,
    playerComment: 'Great for word lovers and competitive minds!',
    coordinates: {
      latitude: 37.774929,
      longitude: -122.419418,
    },
    imageCommentURL: 'https://m.media-amazon.com/images/I/71nLrAXVDzL.jpg',
    imageURL:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3vlCV8p4vPRgfnEMF0oTEhv-6HRux1jAUnQ&s',
  },
  {
    id: 6,
    gameName: 'Clue',
    category: 'Mystery',
    description:
      'A murder mystery game where players deduce the culprit, weapon, and location.',
    popularity: 4.4,
    playerComment: "Perfect for mystery enthusiasts—it's so engaging!",
    coordinates: {
      latitude: 41.878113,
      longitude: -87.629799,
    },
    imageCommentURL:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRkOyMhlEZS6j2H6XgLqTWaFzkV1XVswJQsg&s',
    imageURL:
      'https://cf.geekdo-images.com/wNcbhLJGGjakYjjm1gV_kQ__opengraph/img/22FcQ8Hj6fdfVywtkFIvqi6hVpM=/0x0:1188x624/fit-in/1200x630/filters:strip_icc()/pic7563466.png',
  },
  {
    id: 2,
    gameName: 'Monopoly',
    category: 'Economic',
    description:
      'A game of buying, trading, and developing properties to bankrupt opponents.',
    popularity: 4.7,
    playerComment: 'Great for family nights, but it can get competitive!',
    coordinates: {
      latitude: 34.052235,
      longitude: -118.243683,
    },
    imageCommentURL:
      'https://i5.walmartimages.com/asr/5f111379-f266-49c8-aaa7-114aabfab302.d4e25014549fb7dc694e77c833ba4f22.jpeg',
    imageURL:
      'https://upload.wikimedia.org/wikipedia/commons/7/78/Monopoly_board_on_white_bg.jpg',
  },
];

export const Home = () => {
  const focused = useIsFocused();
  const navigation = useNavigation<any>();
  const [point, setPoint] = React.useState(0);
  const [listGames, setListGames] = React.useState(list);

  const getPoint = async () => {
    const value = await AsyncStorage.getItem('point');
    if (value !== null) {
      setPoint(Number(value));
    }
  };

  const getListGames = async () => {
    const storedList = await AsyncStorage.getItem('gameList');
    const parsedList = storedList ? JSON.parse(storedList) : [];
    if (parsedList.length) {
      setListGames(parsedList);
    }
  };

  React.useEffect(() => {
    getPoint();
    getListGames();
  }, [focused]);

  return (
    <View style={{backgroundColor: '#121212', flex: 1}}>
      <Pressable
        onPress={() => navigation.navigate('CreateCard')}
        style={{
          position: 'absolute',
          bottom: '2%',
          right: 20,
          width: 60,
          borderRadius: 50,
          height: 60,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'gold',
          zIndex: 1,
        }}>
        <Icon size={30} source={'plus'} />
      </Pressable>
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
      <Pressable
        onPress={() => navigation.navigate('Statistics')}
        style={{
          position: 'relative',
          marginHorizontal: 20,
          borderRadius: 40,
          borderWidth: 1,
          borderColor: 'gold',
          marginVertical: 20,
        }}>
        <Image
          height={100}
          style={{borderRadius: 40}}
          source={{
            uri: 'https://studway.com.ua/wp-content/uploads/2024/06/67.jpeg',
          }}
        />
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            alignItems: 'center',
            borderRadius: 40,
            justifyContent: 'center',
          }}>
          <Text
            variant="titleLarge"
            style={{color: 'white', marginVertical: 10}}>
            Statistics
          </Text>
        </View>
      </Pressable>
      <Text
        variant="displaySmall"
        style={{color: 'gold', textAlign: 'center', marginVertical: 10}}>
        Table Games
      </Text>
      {listGames && (
        <FlatList
          data={listGames}
          showsVerticalScrollIndicator={false}
          style={{marginHorizontal: 20}}
          renderItem={({item, index}) => (
            <GameCard
              game={item}
              onPress={() => navigation.navigate('Info', {id: index})}
            />
          )}
        />
      )}
    </View>
  );
};
