import { FlatList, Pressable, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import Snackbar from 'react-native-snackbar';
import Icons from './components/Icons';

export default function App() {
  const [isCross, setIsCross] = useState<boolean>(false);
  const [gameWinner, setGameWinner] = useState<string>('');
  const [gameState, setGameState] = useState(new Array(9).fill('empty', 0, 9))

  const reloadGame = () => {
    setGameState(new Array(9).fill('empty', 0, 9))
    setIsCross(false)
    setGameWinner('')
  }

  const checkIsWinner = () => {
    const winConditions = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (const condition of winConditions) {
      const [a, b, c] = condition;
      if (
        gameState[a] !== 'empty' &&
        gameState[a] === gameState[b] &&
        gameState[a] === gameState[c]
      ) {
        setGameWinner(`${gameState[a]} won the game! 🥳`);
        return;
      }
    }

    if (!gameState.includes('empty', 0)) {
      setGameWinner('Draw game... ⌛️');
    }
  };

  const onChangeItem = (itemNumber: number) => {
    if (gameWinner) {
      return Snackbar.show({
        text: gameWinner,
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: '#000000',
        textColor: '#FFFFFF',
        // action: {
        //   onPress: reloadGame,
        //   text: 'Reload',
        // },
      })
    }
    if (gameState[itemNumber] === 'empty') {
      gameState[itemNumber] = isCross ? 'cross' : 'circle'
      setIsCross(!isCross)
    } else {
      Snackbar.show({
        text: 'This item is already taken',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: '#000000',
        textColor: '#FFFFFF',
        // action: {
        //   onPress: reloadGame,
        //   text: 'Reload',
        // },
      })
    }
    checkIsWinner()
  }

  return (
    <SafeAreaView>
      <StatusBar />
      {
        gameWinner ? (
          <View style={[styles.playerInfo, styles.winnerInfo]}>
            <Text style={styles.winnerTxt}>{gameWinner}</Text>
          </View>
        ) : (
          <View style={[styles.playerInfo,
          isCross ? styles.playerX : styles.playerO]}
          >
            <Text style={styles.gameTurnTxt}>Player {isCross ? 'X' : 'O'} 's Turn</Text>
          </View>
        )
      }
      {/* Game Grid using FlatList */}
      <FlatList
        numColumns={3}
        data={gameState}
        style={styles.grid}
        renderItem={({ item, index }) => (
          <Pressable style={styles.card} key={index} onPress={() => onChangeItem(index)}>
            <Icons name={item} />
          </Pressable>
        )}
      />

      {/* game action */}
      <Pressable style={styles.gameBtn} onPress={reloadGame}>
          <Text style={styles.gameBtnText}>{
            gameWinner ? 'Start new Game' : 'reload the game'
          }</Text>
      </Pressable>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  playerInfo: {
    height: 56,

    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

    borderRadius: 4,
    paddingVertical: 8,
    marginVertical: 12,
    marginHorizontal: 14,

    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowColor: '#333',
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  gameTurnTxt: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  playerX: {
    backgroundColor: '#38CC77',
  },
  playerO: {
    backgroundColor: '#F7CD2E',
  },
  grid: {
    margin: 12,
  },
  card: {
    height: 100,
    width: '33.33%',

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 1,
    borderColor: '#333',
  },
  winnerInfo: {
    borderRadius: 8,
    backgroundColor: '#38CC77',

    shadowOpacity: 0.1,
  },
  winnerTxt: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  gameBtn: {
    alignItems: 'center',

    padding: 10,
    borderRadius: 8,
    marginHorizontal: 36,
    backgroundColor: '#8D3DAF',
  },
  gameBtnText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '500',
  },
});