import { StyleSheet, View } from 'react-native'
import React, { memo } from 'react'
import { colors } from '../constants/colors';
import Plot from './Plot';
import { useDispatch, useSelector } from 'react-redux';
import { playerType } from '../store/reducers/initialState';
import { unfreezeDice, updatePlayerPileValue } from '../store/reducers/gameSlice';
import { startingPoints } from '../helpers/getPlots';

type Props = {
     color: string;
     player: number;
     data: playerType[]
}

const HomeArea: React.FC<Props> = ({ color, player, data }) => {
     const dispatch = useDispatch()
     const handlePress = async (value: playerType) => {
          let playerNo = value?.id[0]
          switch (playerNo) {
               case 'R':
                    playerNo = 'player1';
                    break;
               case 'G':
                    playerNo = 'player2';
                    break;
               case 'Y':
                    playerNo = 'player3';
                    break;
               case 'B':
                    playerNo = 'player4';
                    break;
          }

          const match = playerNo.match(/\d+/); // Extract the number from the text like 'player1' => 1
          if (match) {
               dispatch(updatePlayerPileValue({
                    playerNo: playerNo as "player1" | "player2" | "player3" | "player4",
                    id: value.id,
                    pos: startingPoints[parseInt(match[0]) - 1],
                    travelCount: 1,
               }));
          } else {
               // handle the case where no match is found
               console.error('No match found for playerNo:', playerNo);
          }

          dispatch(unfreezeDice())
     }
     return (
          <View style={[styles.container, { backgroundColor: color }]}>
               <View style={styles.childFrame}>
                    <View style={styles.flexRow}>
                         <Plot
                              pieceNo={0}
                              player={player}
                              color={color}
                              onPress={handlePress}
                              data={data}
                         />
                         <Plot
                              pieceNo={1}
                              player={player}
                              color={color}
                              onPress={handlePress}
                              data={data}
                         />
                    </View>
                    <View style={[styles.flexRow, { marginTop: 15 }]}>
                         <Plot
                              pieceNo={2}
                              player={player}
                              color={color}
                              onPress={handlePress}
                              data={data}
                         />
                         <Plot
                              pieceNo={3}
                              player={player}
                              color={color}
                              onPress={handlePress}
                              data={data}
                         />
                    </View>
               </View>
          </View>
     )
}

export default memo(HomeArea)

const styles = StyleSheet.create({
     container: {
          borderWidth: 0.4,
          justifyContent: "center",
          alignItems: "center",
          width: "40%",
          height: "100%"
     },
     childFrame: {
          backgroundColor: "white",
          width: "70%",
          height: "70%",
          borderColor: colors.borderColor,
          padding: 15,
          borderWidth: 0.4,
     },
     flexRow: {
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          width: "100%",
          height: "40%"
     }
})