import React, { useState } from 'react';
import { Keyboard, Text, TextInput, View } from 'react-native';
import { Button } from 'react-native-paper'
import styles from '../style/style';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Header from './Header';
import Footer from './Footer';
import {
    NBR_OF_DICES,
    NBR_OF_THROWS,
    MIN_SPOT,
    MAX_SPOT,
    BONUS_POINTS_LIMIT,
    BONUS_POINTS
} from '../constants/Game';

export default function Home({ navigation }) {

    const [playerName, setPlayerName] = useState('');
    const [hasPlayerName, setHasPlayerName] = useState(false);

    const handlePlayerName = (value) => {
        if (value.trim().length > 0) {
            setHasPlayerName(true);
            Keyboard.dismiss();
        }
    }

    return (
        <>
            <Header />
            <View style={styles.container}>
                {!hasPlayerName ?
                    <>
                        <Text style={styles.gameText}>For scoreboard enter your name..</Text>
                        <TextInput style={styles.playerInput} onChangeText={setPlayerName} autoFocus={true} />
                        <Button onPress={() => handlePlayerName(playerName)} style={styles.button} textColor='white'>
                            OK
                            </Button>
                    </>
                    :
                    <>
                        <Text style={styles.gameinfo}>Rules of the game...</Text>

                        <Text style={styles.gameinfoTitle}>THE GAME:</Text>
                        <Text multiline="true" style={styles.infoText}>
                            Upper section of the classic Yahtzee
                            dice game. You have {NBR_OF_DICES} dices and
                            for the every dice you have {NBR_OF_THROWS} throws. 
                            After each throw you can keep dices in
                            order to get same dice spot counts as many as
                            possible. In the end of the turn you must select
                            your points from {MIN_SPOT} to {MAX_SPOT}.
                            Game ends when all points have been selected.
                            The order for selecting those is free.

                        </Text>

                        <Text style={styles.gameinfoTitle}>GOAL:</Text>
                        <Text multiline="true" style={styles.infoText}>
                            To get points as much as possible. {BONUS_POINTS_LIMIT} points 
                            is the limit of getting bonus which gives 
                            you {BONUS_POINTS} points more.
                        </Text>

                        <Text style={styles.gameinfoTitle}>POINTS:</Text>
                        <Text multiline="true" style={styles.infoText}>
                            After each turn game calculates the sum
                            for the dices you selected. Only the dices having
                            the same spot count are calculated. Inside the
                            game you can not select same points from {MIN_SPOT} to {MAX_SPOT} again.
                        </Text>

                        <Text style={styles.gameinfo}>Good luck, {playerName}</Text>
                        <Button onPress={() => navigation.navigate('Gameboard', { player: playerName })} style={styles.button} textColor='white'>
                            PLAY
                        </Button>
                    </>
                }
            </View>
            <Footer />
        </>
    )
}