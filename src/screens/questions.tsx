import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import React from 'react';
import {FlatList, Image, View, TouchableOpacity,ImageBackground} from 'react-native';
import {Appbar, Button, Text, Card} from 'react-native-paper';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  answer: string;
}

interface QuizCategory {
  name: string;
  questions: QuizQuestion[];
}

interface QuizCategories {
  [key: string]: QuizCategory;
}

const quizCategories: QuizCategories = {
  boardGames: {
    name: 'Board Games',
    questions: [
      {
        id: 1,
        question:
          'Which board game uses pieces like the king, queen, and pawns?',
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
        options: [
          'Settlers of Catan',
          'Carcassonne',
          'Ticket to Ride',
          'Pandemic',
        ],
        answer: 'Settlers of Catan',
      },
      {
        id: 6,
        question:
          'In Clue (Cluedo), which room is NOT featured on the game board?',
        options: ['Kitchen', 'Bedroom', 'Conservatory', 'Ballroom'],
        answer: 'Bedroom',
      },
      {
        id: 7,
        question:
          'What is the maximum number of houses you can build on a single property in Monopoly?',
        options: ['3', '4', '5', '6'],
        answer: '4',
      },
      {
        id: 8,
        question: 'Which of these is NOT a piece in traditional Scrabble?',
        options: [
          'Double Word Score',
          'Triple Letter Score',
          'Quadruple Word Score',
          'Center Star',
        ],
        answer: 'Quadruple Word Score',
      },
      {
        id: 9,
        question:
          'In Jenga, what shape are the blocks arranged in at the start?',
        options: ['Square Tower', 'Rectangle Tower', 'Pyramid', 'Circle'],
        answer: 'Rectangle Tower',
      },
      {
        id: 10,
        question: 'Which color typically moves first in Chess?',
        options: ['Black', 'White', 'Random', 'Players Choice'],
        answer: 'White',
      },
    ],
  },
  modernBoardGames: {
    name: 'Modern Board Games',
    questions: [
      {
        id: 1,
        question:
          'Which game requires players to cooperatively save the world from disease outbreaks?',
        options: ['Pandemic', 'Risk', 'Catan', 'Ticket to Ride'],
        answer: 'Pandemic',
      },
      {
        id: 2,
        question:
          'In "7 Wonders", players develop which type of ancient civilization?',
        options: [
          'Medieval Cities',
          'Ancient Wonders',
          'Roman Empire',
          'Greek Cities',
        ],
        answer: 'Ancient Wonders',
      },
      {
        id: 3,
        question: 'What resource is NOT found in the base game of Catan?',
        options: ['Wood', 'Brick', 'Gold', 'Wheat'],
        answer: 'Gold',
      },
      {
        id: 4,
        question: 'Which game involves building train routes between cities?',
        options: ['Carcassonne', 'Ticket to Ride', 'Pandemic', 'Azul'],
        answer: 'Ticket to Ride',
      },
      {
        id: 5,
        question: 'In "Splendor", what are players collecting?',
        options: ['Gems', 'Coins', 'Cards', 'Territories'],
        answer: 'Gems',
      },
    ],
  },
};

export const Questions = () => {
  const focused = useIsFocused();
  const navigation = useNavigation();
  const [point, setPoint] = React.useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [selectedOption, setSelectedOption] = React.useState<string | null>(
    null,
  );
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(
    null,
  );
  const [quizStarted, setQuizStarted] = React.useState(false);

  const getPoint = async () => {
    const value = await AsyncStorage.getItem('point');
    if (value !== null) {
      setPoint(Number(value));
    }
  };

  const savePoints = async (newPoints: number) => {
    setPoint(newPoints);
    await AsyncStorage.setItem('point', newPoints.toString());
  };

  React.useEffect(() => {
    getPoint();
  }, [focused]);

  const handleAnswer = (selectedOption: string) => {
    if (!selectedCategory) return;

    setSelectedOption(selectedOption);
    const currentQuestion =
      quizCategories[selectedCategory].questions[currentQuestionIndex];
    if (selectedOption === currentQuestion.answer) {
      setScore(score + 1);
    }

    setTimeout(() => {
      const nextIndex = currentQuestionIndex + 1;
      if (nextIndex < quizCategories[selectedCategory].questions.length) {
        setCurrentQuestionIndex(nextIndex);
        setSelectedOption(null);
      } else {
        const totalPoints = point + score + 1;
        savePoints(totalPoints);
        navigation.goBack();
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setQuizStarted(false);
      }
    }, 1000);
  };

  const startQuiz = (category: string) => {
    setSelectedCategory(category);
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOption(null);
  };

  const renderCategorySelection = () => (
    <View style={{padding: 20}}>
      <Text
        style={{
          color: 'white',
          fontSize: 24,
          textAlign: 'center',
          marginBottom: 20,
        }}>
        Select Quiz Category
      </Text>
      {Object.entries(quizCategories).map(([key, category]) => (
        <Card
          key={key}
          style={{marginBottom: 15, backgroundColor: 'gold'}}
          onPress={() => startQuiz(key)}>
          <Card.Content>
            <Text style={{color: 'black', fontSize: 18, textAlign: 'center'}}>
              {category.name}
            </Text>
          </Card.Content>
        </Card>
      ))}
    </View>
  );

  const renderQuiz = () => {
    if (!selectedCategory) return null;

    const currentQuestion =
      quizCategories[selectedCategory].questions[currentQuestionIndex];

    return (
      <>
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
      </>
    );
  };

  return (
    <View style={{ backgroundColor: '#121212', flex: 1 }}>
      <ImageBackground style={{flex:1}} source={require('../assets/Background.png')}>
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
        Quiz
      </Text>
      {!quizStarted ? renderCategorySelection() : renderQuiz()}</ImageBackground>
    </View>
  );
};
