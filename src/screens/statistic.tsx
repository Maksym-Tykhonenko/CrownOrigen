import React, {useState, useEffect} from 'react';
import {View, Dimensions, ScrollView} from 'react-native';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Appbar, Text, Card, Button} from 'react-native-paper';

const {width, height} = Dimensions.get('window');

type PeriodType = 'week' | 'month' | 'year';

type LabelsType = {
  week: string[];
  month: number[];
  year: string[];
};

type DataPoint = {
  name: string | number;
  points: number;
  avg: number;
};

export const Statistics = () => {
  const navigation = useNavigation();
  const focused = useIsFocused();
  const [point, setPoint] = useState(0);
  const [historicalData, setHistoricalData] = useState<DataPoint[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('week');

  useEffect(() => {
    getPoint();
    generateHistoricalData();
  }, [focused, selectedPeriod]);

  const getPoint = async () => {
    const value = await AsyncStorage.getItem('point');
    if (value !== null) {
      setPoint(Number(value));
    }
  };

  const generateHistoricalData = () => {
    const periods: Record<PeriodType, number> = {
      week: 7,
      month: 30,
      year: 12,
    };

    const labels: LabelsType = {
      week: [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d.toLocaleDateString('en-US', {weekday: 'short'});
      }),
      month: [...Array(30)].map((_, i) => i + 1),
      year: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
    };

    const data: DataPoint[] = labels[selectedPeriod].map(label => ({
      name: label,
      points: Math.floor(Math.random() * (point * 1.5)),
      avg: point,
    }));

    setHistoricalData(data);
  };

  interface StatCardProps {
    title: string;
    value: string | number;
    icon?: React.ReactNode;
    color: string;
  }

  const StatCard: React.FC<StatCardProps> = ({title, value, icon, color}) => (
    <Card
      style={{
        backgroundColor: '#1E1E1E',
        padding: 16,
        margin: 8,
        flex: 1,
        borderRadius: 12,
      }}>
      <View
        style={{flexDirection: 'row', alignItems: 'center', marginBottom: 8}}>
        {icon}
        <Text style={{color: 'white', marginLeft: 8, fontSize: 14}}>
          {title}
        </Text>
      </View>
      <Text style={{color: color, fontSize: 24, fontWeight: 'bold'}}>
        {value}
      </Text>
    </Card>
  );

  return (
    <View style={{backgroundColor: '#121212', flex: 1}}>
      <Appbar.Header style={{backgroundColor: '#1E1E1E'}}>
        <Appbar.BackAction color="white" onPress={() => navigation.goBack()} />
        <Appbar.Content color="white" title="Statistics" />
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
        <View
          style={{flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16}}>
          <StatCard
            title="Total Points"
            value={point}
            // icon={(<Trophy size={20} color="gold" />)}
            color="gold"
          />
          <StatCard
            title="Daily Average"
            value={Math.floor(point / 7)}
            // icon={<TrendingUp size={20} color="#4CAF50" />}
            color="#4CAF50"
          />
        </View>

        <Card
          style={{
            backgroundColor: '#1E1E1E',
            padding: 16,
            marginBottom: 16,
            borderRadius: 12,
          }}>
          <View
            style={{
              justifyContent: 'space-between',
              marginBottom: 16,
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: 18,
                fontWeight: 'bold',
                marginBottom: 10,
              }}>
              Points History
            </Text>
            <View style={{flexDirection: 'row'}}>
              {(['week', 'month', 'year'] as PeriodType[]).map(period => (
                <Button
                  key={period}
                  mode={selectedPeriod === period ? 'contained' : 'text'}
                  onPress={() => setSelectedPeriod(period)}
                  style={{
                    marginLeft: 8,
                    backgroundColor:
                      selectedPeriod === period ? 'gold' : 'transparent',
                  }}
                  labelStyle={{
                    color: selectedPeriod === period ? 'black' : 'white',
                    textTransform: 'capitalize',
                  }}>
                  {period}
                </Button>
              ))}
            </View>
          </View>
        </Card>

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
            }}>
            Achievements
          </Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <StatCard
              title="Weekly Goal"
              value="85%"
              // icon={<Target size={20} color="#2196F3" />}
              color="#2196F3"
            />
            <StatCard
              title="Streak"
              value="7 days"
              // icon={<Calendar size={20} color="#9C27B0" />}
              color="#9C27B0"
            />
          </View>
        </Card>
      </ScrollView>
    </View>
  );
};
