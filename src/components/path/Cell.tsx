import { StyleSheet, View } from 'react-native'
import React, { memo, useCallback, useMemo } from 'react'
import { ArrowRightIcon, StarIcon } from "react-native-heroicons/outline"
import { RFValue } from "react-native-responsive-fontsize"
import { arrowSpots, safeSpots, starSpots } from '../../helpers/getPlots';
import { colors } from '../../constants/colors';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentPosition } from '../../store/reducers/gameSelectors';
import { handleForwardThunk } from '../../store/reducers/gameAction';
import { Dispatch } from '@reduxjs/toolkit';
import Pile from '../Pile';

type Props = {
     id: number;
     color: string;
}

const Cell: React.FC<Props> = ({ id, color }) => {
     const dispatch: Dispatch = useDispatch();
     const plottedPiles = useSelector(selectCurrentPosition) // available piles in cell

     const isSafeSpots = useMemo(() => safeSpots.includes(id), [id])
     const isStarSpots = useMemo(() => starSpots.includes(id), [id])
     const isArrowSpots = useMemo(() => arrowSpots.includes(id), [id])

     const pileAtPosition = useMemo(() =>
          plottedPiles.filter(item => item.pos === id),
     [plottedPiles, id])

     const handlePress = useCallback((playerNo: number, pileId: string) => {
          //forward and merge token
          dispatch(handleForwardThunk(playerNo, pileId, id) as any);
     }, [dispatch, id])

     return (
          <View style={[
               styles.container,
               {
                    backgroundColor: isSafeSpots ? color : "white"
               }
          ]}>
               {isStarSpots && <StarIcon size={20} color={"gray"} />}
               {isArrowSpots &&
                    <ArrowRightIcon
                         size={RFValue(12)}
                         style={{
                              transform: [
                                   {
                                        rotate:
                                             id === 38
                                                  ? "180deg"
                                                  : id === 25
                                                       ? "90deg"
                                                       : id === 51
                                                            ? "-90deg"
                                                            : "0deg"
                                   }
                              ]
                         }}
                    />}
               {pileAtPosition.map((pile, i) => {
                    const playerNo =
                         pile.id[0] === 'R' ? 1
                              : pile.id[0] === 'G' ? 2
                                   : pile.id[0] === 'Y' ? 3
                                        : 4
                    const playerColor =
                         playerNo === 1 ? colors.red
                              : playerNo === 2 ? colors.green
                                   : playerNo === 3 ? colors.yellow
                                        : colors.blue

                    return (
                         <View
                              key={pile.id}
                              style={[
                                   styles.pieceContainer,
                                   {
                                        transform: [{
                                             scale: pileAtPosition.length === 1 ? 1 : 0.7
                                        }, {
                                             translateX: pileAtPosition.length === 1 ? 0 : i % 2 === 0 ? -6 : 6
                                        },
                                        {
                                             translateY: pileAtPosition.length === 1 ? 0 : i < 2 ? -6 : 6
                                        }]
                                   }
                              ]}
                         >
                              {/* show the piles in the cell */}
                              <Pile
                                   cell={true}
                                   player={playerNo}
                                   onPress={()=>handlePress(playerNo, pile.id)}
                                   pileId={pile.id}
                                   color={playerColor}
                              />
                         </View>
                    )
               })}
          </View>
     )
}

export default memo(Cell)

const styles = StyleSheet.create({
     container: {
          width: "100%",
          height: "100%",
          borderWidth: 0.4,
          borderColor: colors.borderColor,
          justifyContent: "center",
          alignItems: "center"
     },
     pieceContainer: {
          position: "absolute",
          top: 0,
          bottom: 0,
          zIndex: 99,
     }
})