import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import React from 'react';
import {FlatList, Image, View} from 'react-native';
import {Appbar, Button, Text} from 'react-native-paper';

const quizData = [
  {
    id: 1,
    question: 'Which board game uses pieces like the king, queen, and pawns?',
    options: ['Chess', 'Checkers', 'Backgammon', 'Scrabble'],
    answer: 'Chess',
  },
  {
    id: 2,
    question: "In Monopoly, what do players collect when they pass 'Go'?",
    options: ['$100', '$200', '$300', '$400'],
    answer: '$200',
  },
  {
    id: 3,
    question:
      'What is the name of the game where you try to guess the word from drawn pictures?',
    options: ['Charades', 'Pictionary', 'Scattergories', 'Taboo'],
    answer: 'Pictionary',
  },
  {
    id: 4,
    question: 'In Risk, the objective is to conquer what?',
    options: ['Countries', 'Cities', 'Continents', 'Planets'],
    answer: 'Continents',
  },
  {
    id: 5,
    question:
      'Which board game is played on a hexagonal board with resources like wood and brick?',
    options: ['Settlers of Catan', 'Carcassonne', 'Ticket to Ride', 'Pandemic'],
    answer: 'Settlers of Catan',
  },
];

export const Questions = () => {
  const focused = useIsFocused();
  const navigation = useNavigation();
  const [point, setPoint] = React.useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [selectedOption, setSelectedOption] = React.useState(null);

  const getPoint = async () => {
    const value = await AsyncStorage.getItem('point');
    if (value !== null) {
      setPoint(Number(value));
    }
  };

  const savePoints = async (newPoints: any) => {
    setPoint(newPoints);
    await AsyncStorage.setItem('point', newPoints.toString());
  };

  React.useEffect(() => {
    getPoint();
  }, [focused]);

  const handleAnswer = (selectedOption: any) => {
    setSelectedOption(selectedOption);
    const currentQuestion = quizData[currentQuestionIndex];
    if (selectedOption === currentQuestion.answer) {
      setScore(score + 1);
    }

    setTimeout(() => {
      const nextIndex = currentQuestionIndex + 1;
      if (nextIndex < quizData.length) {
        setCurrentQuestionIndex(nextIndex);
        setSelectedOption(null);
      } else {
        const totalPoints = point + score + 1;
        savePoints(totalPoints);
        navigation.goBack();
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
      }
    }, 1000);
  };

  const currentQuestion = quizData[currentQuestionIndex];

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
        style={{color: 'white', textAlign: 'center', marginVertical: 20}}>
        Quez
      </Text>
      <Text
        style={{
          paddingHorizontal: 20,
          color: 'white',
          fontSize: 18,
          fontWeight: 'bold',
          marginBottom: 20,
        }}>
        {currentQuestion.question}
      </Text>
      <FlatList
        style={{marginHorizontal: 20}}
        data={currentQuestion.options}
        keyExtractor={item => item}
        renderItem={({item}) => (
          <Button
            style={{
              borderRadius: 5,
              padding: 5,
              marginTop: 20,
              backgroundColor:
                selectedOption === item
                  ? item === currentQuestion.answer
                    ? 'green'
                    : 'red'
                  : 'gold',
            }}
            mode="elevated"
            disabled={selectedOption !== null}
            onPress={() => handleAnswer(item)}>
            <Text style={{color: 'black'}}>{item}</Text>
          </Button>
        )}
      />
    </View>
  );
};
