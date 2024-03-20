import React from 'react';
import { useEffect, useState } from 'react';
import { Text, View, Pressable } from 'react-native';
import { Button } from 'react-native-paper'
import Header from './Header';
import Footer from './Footer';
import {
  NBR_OF_DICES,
  NBR_OF_THROWS,
  MAX_SPOT,
  BONUS_POINTS_LIMIT,
  BONUS_POINTS,
  SCOREBOARD_KEY
} from '../constants/Game';
import { Container, Row, Col } from 'react-native-flex-grid';
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import styles from '../style/style';

let board = [];


export default function Gameboard({ navigation, route }) {

  const [playerName, setPlayerName] = useState('');
  const [nbrOfThrowsLeft, setNbrOfThrowsLeft] = useState(NBR_OF_THROWS);
  const [status, setStatus] = useState('Throw dices');
  const [bonusPointStatus, setBonusPointStatus] = useState(`Only ${BONUS_POINTS_LIMIT} points left for bonus`)
  const [gameEndStatus, setGameEndStatus] = useState(false);
  const [gameStartStatus, setGameStartStatus] = useState(false)
  //Are dices selected or not?
  const [selectedDices, setSelectedDices] = useState(new Array(NBR_OF_DICES).fill(false));
  //Dice spots (1, 2, 3, 4, 5, 6) for each dice
  const [diceSpots, setDiceSpots] = useState(new Array(NBR_OF_DICES).fill(0));
  //Are dice points selected or not?
  const [selectedDicePoints, setSelectedDicePoints] = useState(new Array(MAX_SPOT).fill(false));
  const [dicePointsTotal, setDicePointsTotal] = useState(new Array(MAX_SPOT).fill(0));
  const [totalPoints, setTotalPoints] = useState(0);
  // For Scoreboard
  const [scores, setScores] = useState([])

  // One way to handel with useEffects

  //This one is for passing the player name to the screen
  useEffect(() => {
    if (playerName === '' && route.params?.player) {
      setPlayerName(route.params.player)
    }
  }, []);

  //This useEffect is for reading scoreboard from the AsyncStorage when user if navigating back to screen

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getScore()
    })
    return unsubscribe;
  }, [navigation])

  useEffect(() => {
    setNbrOfThrowsLeft(NBR_OF_THROWS)
    selectedDices.fill(false)
    setStatus('Throw dices.')
    let countingTotalPoints = dicePointsTotal.reduce((sum, point) => sum + point, 0)
    let pointsToGetBonus = BONUS_POINTS_LIMIT - countingTotalPoints
    if (pointsToGetBonus > 0) {
      setTotalPoints(countingTotalPoints)
      setBonusPointStatus(`You are ${pointsToGetBonus} points away from bonus`);
    }
    else {
      const newTotalPoints = countingTotalPoints + BONUS_POINTS;
      setTotalPoints(newTotalPoints)
      setBonusPointStatus(`Congrats! Bonus points (50) added`);
    }
    const allPointsSelected = selectedDicePoints.every((pointSelected) => pointSelected);
    if (allPointsSelected) {
      setGameEndStatus(true)
    }
  }, [selectedDicePoints])

  useEffect(() => {
    if (gameEndStatus) {
      savePlayerPoints()
      setStatus("GAME OVER. All points selected.")
    }
  }, [gameEndStatus])



  const dicesRow = [];
  for (let dice = 0; dice < NBR_OF_DICES; dice++) {
    dicesRow.push(
      <Col key={"dice" + dice}>
        <Pressable
          key={"dice" + dice}
          onPress={() => selectDice(dice)}
        >
          <MaterialCommunityIcons
            name={board[dice]}
            key={"dice" + dice}
            size={50}
            color={getDiceColor(dice)}
          >
          </MaterialCommunityIcons>
        </Pressable>
      </Col>
    );
  }

  //Call the function for calculating points inside Text-component for replacing the 0
  //{getSpotTotal(spot)} after the text key ... spot
  const pointsRow = [];
  for (let spot = 0; spot < MAX_SPOT; spot++) {
    pointsRow.push(
      <Col key={"pointsRow" + spot}>
        <Text key={"pointsRow" + spot}>{getSpotTotal(spot)}

        </Text>
      </Col>
    );
  }

  const pointsToSelectRow = [];
  for (let diceButton = 0; diceButton < MAX_SPOT; diceButton++) {
    pointsToSelectRow.push(
      <Col key={"buttonsRow" + diceButton}>
        <Pressable
          key={"buttonsRow" + diceButton}
          onPress={() => selectDicePoints(diceButton)}
        >
          <MaterialCommunityIcons
            name={"numeric-" + (diceButton + 1) + "-circle"}
            key={"buttonRow" + diceButton}
            size={35}
            color={getDicePointsColor(diceButton)}
          >

          </MaterialCommunityIcons>
        </Pressable>
      </Col>
    )
  }

  // Scoreboard pts
  const savePlayerPoints = async () => {

    let time = new Date()
    let date = `${time.getDate()}.${time.getMonth() + 1}.${time.getFullYear()}`;
    let currentTime = `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`

    const newKey = scores.length + 1
    const playerPoints = {
      key: newKey,
      name: playerName,
      date: date,
      time: currentTime,
      points: totalPoints
    }
    try {
      const newScore = [...scores, playerPoints]
      const jsonObj = JSON.stringify(newScore)
      await AsyncStorage.setItem(SCOREBOARD_KEY, jsonObj)
    } catch (error) {
      console.log('save error: ' + error);
    }
  }

  const getScore = async () => {

    try {
      const jsonObj = await AsyncStorage.getItem(SCOREBOARD_KEY)
      if (jsonObj !== null) {
        let tmpScores = JSON.parse(jsonObj)
        setScores(tmpScores)
      }
    } catch (error) {
      console.log('Read error: ' + error);
    }
  }

  function getDiceColor(i) {
    return selectedDices[i] ? "maroon" : "chocolate";
  }

  function getDicePointsColor(i) {
    return (selectedDicePoints[i] && !gameEndStatus)
      ? "maroon" : "chocolate";
  }

  function selectDice(i) {
    if (nbrOfThrowsLeft < NBR_OF_THROWS && !gameEndStatus) {
      let dices = [...selectedDices];
      dices[i] = selectedDices[i] ? false : true;
      setSelectedDices(dices);
    }
    else {
      setStatus("You have to throw dices first");
    }
  }

  const throwDices = () => {
    setGameStartStatus(true)
    if (nbrOfThrowsLeft === 0 && !gameEndStatus) {
      setStatus('Select your points before next throw');
      return 1;
    }
    else if (nbrOfThrowsLeft === 0 && gameEndStatus) {
      setGameEndStatus(false);
      diceSpots.fill(0);
      dicePointsTotal.fill(0);
    }
    let spots = [...diceSpots];

    for (let i = 0; i < NBR_OF_DICES; i++) {
      if (!selectedDices[i]) {
        let randomNumber = Math.floor(Math.random() * 6 + 1);
        board[i] = 'dice-' + randomNumber;
        spots[i] = randomNumber;
      }
    }
    setNbrOfThrowsLeft(nbrOfThrowsLeft - 1);
    setDiceSpots(spots);
    setStatus('Select and throw dices again.')
  }

  function getSpotTotal(i) {
    return dicePointsTotal[i];
  }

  const selectDicePoints = (i) => {
    if (nbrOfThrowsLeft === 0) {
      let selectedPoints = [...selectedDicePoints]
      let points = [...dicePointsTotal]

      if (!selectedPoints[i]) {
        selectedPoints[i] = true
        let nbrOfDices = diceSpots.reduce((total, x) => (x === (i + 1) ? total + 1 : total), 0)
        points[i] = nbrOfDices * (i + 1)
      } else {
        setStatus('You already selected points for ' + (i + 1))
        return points[i]
      }

      setDicePointsTotal(points)
      setSelectedDicePoints(selectedPoints)
      return points[i]
    }
    else {
      setStatus('Throw ' + NBR_OF_THROWS + ' times before setting points')
    }
  }

  const restartGame = () => {
    setGameStartStatus(false)
    setGameEndStatus(false)
    setStatus('Throw dices.')
    diceSpots.fill(0)
    dicePointsTotal.fill(0)
    setTotalPoints(0)
    selectedDices.fill(0)
    selectedDicePoints.fill(0)
    countingTotalPoints = 0
    pointsToGetBonus = 0
    setBonusPointStatus(`You are ${BONUS_POINTS_LIMIT} points away from bonus`)
  }

  return (
    <>
      <Header />
      <View style={styles.container}>
        {!gameStartStatus ?
          <>
            <Text style={styles.title}>Start your game! </Text>
            <MaterialCommunityIcons name="dice-multiple"
              size={80}
              color={'#F0681A'}
            />
          </>
          :
          <Container fluid>
            <Row>{dicesRow}</Row>
          </Container>}
        <Text style={styles.gameinfo}>Throws left: {nbrOfThrowsLeft}</Text>
        <Text style={styles.gameinfo}>{status}</Text>
        <View>
          <Text style={styles.gameinfo}>TOTAL:  {totalPoints}.</Text>
          <Text style={styles.gameinfo}>{bonusPointStatus}</Text>
        </View>
        <Container fluid>
          <Row>{pointsRow}</Row>
        </Container>
        <Container fluid>
          <Row>{pointsToSelectRow}</Row>
        </Container>
        <Button
          onPress={() => throwDices()} style={styles.button} textColor='white'>
          THROW DICES
        </Button>
        <Text style={styles.gameinfo}>Player: {playerName}</Text>
        {gameEndStatus &&
          <Button
            style={styles.button}
            textColor='white'
            mode="elevated"
            onPress={() => restartGame()}>
            START AGAIN
          </Button>
        }
      </View>
      <Footer />
    </>
  )
}