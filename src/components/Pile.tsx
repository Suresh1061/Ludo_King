import { Animated, Easing, Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react'
import { getPilesIconImage } from '../helpers/getImages';
import { Svg, Circle } from "react-native-svg"
import { useSelector } from 'react-redux';
import { selectCellPile, selectDiceNo, selectHomePile } from '../store/reducers/gameSelectors';
import { initialStateType } from '../store/reducers/initialState';

type Props = {
     color: string;
     player?: number;
     cell?: boolean;
     pileId?: string;
     onPress?: any;
}

const Pile: React.FC<Props> = ({ color, player, cell, onPress, pileId }) => {
     const rotation = useRef(new Animated.Value(0)).current;

     const pileImg = getPilesIconImage.getImage(color);

     const currentPlayerHomePileSelection = useSelector(selectHomePile);
     const currentPlayerCellPileSelection = useSelector(selectCellPile);
     const diceNo = useSelector(selectDiceNo);
     const playerPiles = useSelector((state: { game: initialStateType }) => {
          const currentPlayerKey = `player${player}` as keyof Pick<
               initialStateType,
               "player1" | "player2" | "player3" | "player4"
          >;
          return state.game[currentPlayerKey];
     });

     const isHomePileEnable = useMemo(() => player === currentPlayerHomePileSelection, [player, currentPlayerHomePileSelection]);
     const isCellPileEnable = useMemo(() => player === currentPlayerCellPileSelection, [player, currentPlayerCellPileSelection]);

     const isForwardable = useCallback(() => {
          const pile = playerPiles.find(p => p.id === pileId);
          return pile && pile.travelCount + diceNo <= 57;
     }, [playerPiles, pileId, diceNo]);

     useEffect(() => {
          const startRotation = () => {
               rotation.setValue(0);
               Animated.timing(rotation, {
                    toValue: 1,
                    duration: 1500,
                    easing: Easing.linear,
                    useNativeDriver: true,
               }).start(() => startRotation());
          };

          startRotation();
          return () => rotation.stopAnimation();
     }, [cell]);

     const rotateInterpolate = useMemo(
          () =>
               rotation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "360deg"],
               }),
          [rotation]
     );

     return (
          <TouchableOpacity
               style={styles.continer}
               activeOpacity={0.5}
               disabled={!(cell ? isCellPileEnable && isForwardable() : isHomePileEnable)}
               onPress={onPress}
          >
               <View style={styles.hollowCircle}>
                    {(cell ? isCellPileEnable && isForwardable() : isHomePileEnable) &&
                         <View style={styles.dashedCilcleContainer}>
                              <Animated.View
                                   style={[
                                        styles.dashedCilcle,
                                        { transform: [{ rotate: rotateInterpolate }] },
                                   ]}
                              >
                                   <Svg height="18" width="18">
                                        <Circle
                                             cx="9"
                                             cy="9"
                                             r="8"
                                             stroke="white"
                                             strokeWidth="2"
                                             strokeDasharray="4 4"
                                             strokeDashoffset="0"
                                             fill="transparent"
                                        />
                                   </Svg>
                              </Animated.View>
                         </View>
                    }
               </View>
               <Image source={pileImg} style={styles.img} />
          </TouchableOpacity>
     );
};


export default memo(Pile)

const styles = StyleSheet.create({
     continer: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center"
     },
     img: {
          height: 32,
          width: 32,
          position: "absolute",
          top: -16
     },
     hollowCircle: {
          width: 15,
          height: 15,
          position: "absolute",
          borderRadius: 25,
          borderWidth: 2,
          borderColor: "black",
          justifyContent: "center",
          alignItems: "center"
     },
     dashedCilcleContainer: {},
     dashedCilcle: {

     }
})