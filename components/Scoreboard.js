import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { Text, Button, DataTable } from 'react-native-paper'
import styles from '../style/style'
import Header from './Header';
import Footer from './Footer';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MAX_NBR_OF_SCOREBOARD_ROWS, SCOREBOARD_KEY } from "../constants/Game";
import { horizontalScale, moderateScale } from "../constants/Metrics";

export default function Scoreboard({navigation}) {

  const [scores, setScores] = useState([]);

  useEffect(() =>{
    const unsubscribe = navigation.addListener('focus', () => {
        getScore()
    })
    return unsubscribe
}, [navigation])

  const getScore = async () => {
    try {
      const jsonObj = await AsyncStorage.getItem(SCOREBOARD_KEY);
      const scores = jsonObj ? JSON.parse(jsonObj) : [];
      setScores(scores);
    } catch (error) {
      console.error("Error while fetching scoreboard data:", error);
    }
  };

const clearScoreboard = async() => {
  try {
    await AsyncStorage.removeItem(SCOREBOARD_KEY);
    setScores([]);
  } catch (error) {
    console.error("Clear while clearing scoreboard data:", error);
  }
};

scores.sort((a,b) => b.points - a.points)

  return (
    <View style={styles.container}>
      <Header/>
      <View  style={styles.container}>
      <Text style={styles.gameinfo}>SCOREBOARD</Text>
      {scores.length === 0 ? (
          <Text style={styles.header}>Scoreboard is empty</Text>
        ) : (
          <View>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>
                  <Text>Rank</Text>
                </DataTable.Title>
                <DataTable.Title>
                  <Text>Player</Text>
                </DataTable.Title>
                <DataTable.Title>
                  <Text>Date</Text>
                </DataTable.Title>
                <DataTable.Title>
                  <Text>Time</Text>
                </DataTable.Title>
                <DataTable.Title style={{ justifyContent: "center" }}>
                  <Text>Points</Text>
                </DataTable.Title>
              </DataTable.Header>
            </DataTable>
            <View>
              {scores.map(
                (player, rank) =>
                  rank < MAX_NBR_OF_SCOREBOARD_ROWS && (
                    <DataTable.Row
                      key={player.key}
                    >
                      <DataTable.Cell>
                        <Text>{rank + 1}.</Text>
                      </DataTable.Cell>
                      <DataTable.Cell>
                        <Text>{player.name}</Text>
                      </DataTable.Cell>
                      <DataTable.Cell>
                        <Text>{player.date}</Text>
                      </DataTable.Cell>
                      <DataTable.Cell>
                        <Text>{player.time}</Text>
                      </DataTable.Cell>
                      <DataTable.Cell
                        style={{
                          justifyContent: "center",
                        }}
                      >
                        <Text>
                          {player.points}
                        </Text>
                      </DataTable.Cell>
                    </DataTable.Row>
                  )
              )}
            </View>
          </View>
        )}
      </View>
      <View>
        {scores.length > 0 && (
          <View>
            <Button
              style={styles.button}
              textColor='white'
              mode="contained"
              onPress={() => clearScoreboard()}
            >
              CLEAR SCOREBOARD
            </Button>
          </View>
        )}           
            </View>
        <Footer/>
    </View>
  )
}