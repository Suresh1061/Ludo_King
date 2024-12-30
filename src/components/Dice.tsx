import { Animated, Easing, Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { memo, useEffect, useRef, useState } from 'react'
import { LinearGradient } from "react-native-linear-gradient"
import { getDiceImage, getPilesIconImage } from '../helpers/getImages'
import LottieWiew from "lottie-react-native"
import diceRollAnimation from "../assets/animation/diceroll.json"
import arrow from "../assets/images/arrow.png"
import { initialStateType, playerType } from '../store/reducers/initialState'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentPlayerChance, selectDiceNo, selectIsDiceRolled } from '../store/reducers/gameSelectors'
import { delay } from '../helpers/delay'
import { enableCellPileSelection, enableHomePileSelection, unfreezeDice, updateDiceNo, updatePlayerChance } from '../store/reducers/gameSlice'
import { playSound } from '../helpers/soundUtils'

type Props = {
     color: string,
     rotate?: boolean,
     player: number,
     data: playerType[]
}

const Dice: React.FC<Props> = ({ color, rotate, player, data }) => {
     const [diceRolling, setDiceRolling] = useState(false);

     const dispatch = useDispatch();
     const currentPlayerChance = useSelector(selectCurrentPlayerChance);
     const isDiceRolled = useSelector(selectIsDiceRolled);
     const diceNo = useSelector(selectDiceNo);

     const playerPieces = useSelector((state: { game: initialStateType }) => {
          const currentPlayerKey = `player${currentPlayerChance}` as keyof Pick<
               initialStateType,
               "player1" | "player2" | "player3" | "player4"
          >;
          return state.game[currentPlayerKey];
     });

     const pileIcon = getPilesIconImage.getImage(color);
     const diceImg = getDiceImage.getImage(diceNo);

     const arrowAnim = useRef(new Animated.Value(0)).current;

     const startArrowAnimation = () => {
          // Reset and start the animation sequence
          arrowAnim.setValue(0);
          Animated.loop(
               Animated.sequence([
                    Animated.timing(arrowAnim, {
                         toValue: 10,
                         duration: 600,
                         easing: Easing.out(Easing.ease),
                         useNativeDriver: true,
                    }),
                    Animated.timing(arrowAnim, {
                         toValue: -10,
                         duration: 600,
                         easing: Easing.out(Easing.ease),
                         useNativeDriver: true,
                    }),
               ])
          ).start();
     };

     useEffect(() => {
          if (currentPlayerChance === player && !isDiceRolled) {
               startArrowAnimation();
          } else {
               arrowAnim.stopAnimation();
          }
     }, [isDiceRolled]);


     const handleDiceRoll = async () => {
          const newDiceNo = Math.floor(Math.random() * 6 + 1)
          playSound('dice_roll');

          setDiceRolling(true);
          await delay(800);

          dispatch(updateDiceNo({ diceNo: newDiceNo }));
          setDiceRolling(false);

          const isAnyPieceAlive = data?.findIndex(i => i.pos !== 0 && i.pos !== 57);
          const isAnyPieceLocked = data?.findIndex(i => i.pos === 0);

          if (isAnyPieceAlive === -1) {
               if (newDiceNo === 6) {
                    dispatch(enableHomePileSelection({ playerNo: player }));
               } else {
                    let chancePlayer = player + 1;
                    if (chancePlayer > 4) {
                         chancePlayer = 1;
                    }
                    await delay(600);
                    dispatch(updatePlayerChance({ playerNo: chancePlayer }));
               }
          } else {
               const canMove = playerPieces.some((pile: playerType) =>
                    pile.travelCount + newDiceNo <= 57 && pile.pos !== 0
               );

               if (
                    (!canMove && newDiceNo === 6 && isAnyPieceLocked === -1) ||
                    (!canMove && newDiceNo !== 6 && isAnyPieceLocked === -1) ||
                    (!canMove && newDiceNo !== 6 && isAnyPieceLocked !== -1)
               ) {
                    let chancePlayer = player + 1;
                    if (chancePlayer > 4) {
                         chancePlayer = 1;
                    }
                    await delay(600);
                    dispatch(updatePlayerChance({ playerNo: chancePlayer }));
                    return;
               }

               if (newDiceNo === 6) {
                    dispatch(enableHomePileSelection({ playerNo: player }))
               }
               dispatch(enableCellPileSelection({ playerNo: player }))
          }
     };

     return (
          <View style={[styles.flexRow, { transform: [{ scaleX: rotate ? -1 : 1 }] }]}>
               <View style={styles.border1}>
                    <LinearGradient
                         style={styles.linearGradient}
                         colors={["#0052be", "#5f9fcb", "#97c6c9"]}
                         start={{ x: 0, y: 0.5 }}
                         end={{ x: 1, y: 0.5 }}
                    >
                         <View style={styles.pileContiner}>
                              <Image
                                   source={pileIcon}
                                   style={styles.pileIcon}
                              />
                         </View>
                    </LinearGradient>
               </View>
               <View style={styles.border2}>
                    <LinearGradient
                         style={styles.diceGradient}
                         colors={["#aac8ab", "#aac8ab", "#aac8ab"]}
                         start={{ x: 0, y: 0.5 }}
                         end={{ x: 1, y: 0.5 }}
                    >
                         <View style={styles.diceContainer}>
                              {currentPlayerChance === player && !diceRolling && (
                                   <TouchableOpacity
                                        disabled={isDiceRolled}
                                        activeOpacity={0.4}
                                        onPress={handleDiceRoll}
                                   >
                                        <Image source={diceImg} style={styles.dice} />
                                   </TouchableOpacity>
                              )}
                         </View>
                    </LinearGradient>
               </View>

               {currentPlayerChance === player && !isDiceRolled && (
                    <Animated.View style={{ transform: [{ translateX: arrowAnim }] }}>
                         <Image source={arrow} style={{ width: 50, height: 30 }} />
                    </Animated.View>
               )}


               {currentPlayerChance === player && diceRolling && (
                    <LottieWiew
                         source={diceRollAnimation}
                         style={styles.rollingDice}
                         loop={false}
                         autoPlay
                         cacheComposition={true}
                         hardwareAccelerationAndroid
                    />
               )}
          </View>
     )
}

export default memo(Dice);

const styles = StyleSheet.create({
     flexRow: {
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row"
     },
     border1: {
          borderWidth: 3,
          borderRightWidth: 0,
          borderColor: "#f0ce2c"
     },
     border2: {
          borderWidth: 3,
          padding: 1,
          backgroundColor: "#aac8ab",
          borderRadius: 10,
          borderLeftWidth: 3,
          borderColor: '#aac8ab'
     },
     linearGradient: {},
     pileContiner: {
          paddingHorizontal: 3,
     },
     pileIcon: {
          width: 35,
          height: 35
     },
     diceGradient: {
          justifyContent: "center",
          alignItems: "center"
     },
     diceContainer: {
          backgroundColor: "#e8c0c1",
          borderWidth: 1,
          borderRadius: 5,
          width: 55,
          height: 55,
          paddingHorizontal: 8,
          padding: 4,
          justifyContent: "center",
          alignItems: "center"
     },
     dice: {
          width: 45,
          height: 45
     },
     rollingDice: {
          position: "absolute",
          top: -25,
          width: 80,
          height: 80,
          zIndex: 99
     }
});
