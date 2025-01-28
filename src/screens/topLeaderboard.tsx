import React, {useState, useEffect} from 'react';
import {View, Animated, ScrollView, Pressable} from 'react-native';
import {Appbar, Avatar, Text, Card} from 'react-native-paper';

interface UserStats {
  gamesPlayed: number;
  winRate: number;
  lastActive: string;
  favoriteGame: string;
}

interface LeaderboardUser {
  id: string;
  name: string;
  points: number;
  avatar: string;
  stats: UserStats;
}

export const TopLeaderboard = () => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const scaleAnim = new Animated.Value(1);

  // Моделюємо дані користувачів
  const users: LeaderboardUser[] = [
    {
      id: '1',
      name: 'Player 1',
      points: 300,
      avatar:
        'https://img.freepik.com/free-psd/3d-illustration-person-with-punk-hair-jacket_23-2149436198.jpg',
      stats: {
        gamesPlayed: 45,
        winRate: 75,
        lastActive: '2 години тому',
        favoriteGame: 'Chess',
      },
    },
    {
      id: '2',
      name: 'Player 2',
      points: 200,
      avatar:
        'https://img.freepik.com/psd-gratis/render-3d-personaje-avatar_23-2150611707.jpg',
      stats: {
        gamesPlayed: 38,
        winRate: 68,
        lastActive: '5 годин тому',
        favoriteGame: 'Monopoly',
      },
    },
    {
      id: '3',
      name: 'Player 3',
      points: 150,
      avatar:
        'https://img.freepik.com/free-psd/3d-render-avatar-character_23-2150611765.jpg',
      stats: {
        gamesPlayed: 32,
        winRate: 60,
        lastActive: '1 день тому',
        favoriteGame: 'Scrabble',
      },
    },
  ];

  const regularUsers: LeaderboardUser[] = [
    {
      id: '4',
      name: 'Anna',
      points: 100,
      avatar:
        'https://img.freepik.com/psd-premium/illustration-3d-personne-veste-cuir_23-2149436206.jpg?w=360',
      stats: {
        gamesPlayed: 25,
        winRate: 55,
        lastActive: '3 дні тому',
        favoriteGame: 'Risk',
      },
    },
    {
      id: '5',
      name: 'Artem',
      points: 80,
      avatar:
        'https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg',
      stats: {
        gamesPlayed: 20,
        winRate: 50,
        lastActive: '1 тиждень тому',
        favoriteGame: 'Catan',
      },
    },
    {
      id: '6',
      name: 'Andrey',
      points: 70,
      avatar:
        'https://img.freepik.com/free-psd/3d-illustration-person-with-glasses_23-2149436189.jpg',
      stats: {
        gamesPlayed: 18,
        winRate: 45,
        lastActive: '2 тижні тому',
        favoriteGame: 'Clue',
      },
    },
  ];

  const TopUserCard = ({
    user,
    position,
  }: {
    user: LeaderboardUser;
    position: number;
  }) => {
    const isSelected = selectedUser === user.id;
    const iconSize = position === 1 ? 110 : 90;

    return (
      <Pressable
        onPress={() => setSelectedUser(isSelected ? null : user.id)}
        style={{
          alignItems: 'center',
          marginHorizontal: 10,
        }}>
        <View style={{position: 'relative'}}>
          <Avatar.Image
            size={iconSize}
            source={{uri: user.avatar}}
            style={{
              backgroundColor: 'white',
              marginBottom: 10,
              borderWidth: 3,
              borderColor:
                position === 1 ? 'gold' : position === 2 ? 'silver' : '#CD7F32',
            }}
          />
        </View>

        <View
          style={{
            backgroundColor:
              position === 1 ? 'gold' : position === 2 ? 'silver' : '#CD7F32',
            padding: 10,
            borderRadius: 20,
            minWidth: 80,
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: position === 1 ? 'black' : 'white',
              fontWeight: 'bold',
            }}>
            {user.points}
          </Text>
        </View>

        {isSelected && (
          <Card
            style={{
              marginTop: 10,
              backgroundColor: '#2A2A2A',
              width: 200,
            }}>
            <Card.Content>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 8,
                }}>
                <Text style={{color: 'white'}}>
                  Ігор: {user.stats.gamesPlayed}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 8,
                }}>
                <Text style={{color: 'white'}}>
                  Перемог: {user.stats.winRate}%
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 8,
                }}>
                <Text style={{color: 'white'}}>{user.stats.lastActive}</Text>
              </View>
              <Text style={{color: 'gold', marginTop: 4}}>
                Улюблена гра: {user.stats.favoriteGame}
              </Text>
            </Card.Content>
          </Card>
        )}
      </Pressable>
    );
  };

  const RegularUserCard = ({
    user,
    position,
  }: {
    user: LeaderboardUser;
    position: number;
  }) => {
    const isSelected = selectedUser === user.id;

    return (
      <Pressable
        onPress={() => setSelectedUser(isSelected ? null : user.id)}
        style={{
          marginBottom: 20,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: isSelected ? '#2A2A2A' : 'transparent',
            padding: 10,
            borderRadius: 20,
          }}>
          <Text
            style={{
              color: 'gold',
              width: 30,
              textAlign: 'center',
              fontWeight: 'bold',
            }}>
            #{position}
          </Text>
          <Avatar.Image
            size={50}
            source={{uri: user.avatar}}
            style={{
              backgroundColor: 'white',
              marginRight: 20,
            }}
          />
          <View style={{flex: 1}}>
            <Text
              variant="titleLarge"
              style={{color: 'white', fontWeight: '500'}}>
              {user.name}
            </Text>
            {isSelected && (
              <View style={{marginTop: 8}}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 4,
                  }}>
                  <Text style={{color: 'white'}}>
                    Ігор: {user.stats.gamesPlayed}
                  </Text>
                </View>
                <Text style={{color: 'gold'}}>
                  Улюблена гра: {user.stats.favoriteGame}
                </Text>
              </View>
            )}
          </View>
          <View
            style={{
              backgroundColor: 'gold',
              padding: 10,
              borderRadius: 20,
              minWidth: 60,
              alignItems: 'center',
            }}>
            <Text style={{color: 'black', fontWeight: '500'}}>
              {user.points}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <ScrollView style={{paddingHorizontal: 20}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: 40,
          marginTop: 20,
        }}>
        <TopUserCard user={users[2]} position={3} />
        <TopUserCard user={users[0]} position={1} />
        <TopUserCard user={users[1]} position={2} />
      </View>

      <View style={{marginTop: 20}}>
        {regularUsers.map((user, index) => (
          <RegularUserCard key={user.id} user={user} position={index + 4} />
        ))}
      </View>
    </ScrollView>
  );
};
