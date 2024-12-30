import { StyleSheet, View } from 'react-native'
import React, { memo } from 'react'
import Pile from './Pile';
import { playerType } from '../store/reducers/initialState';

type Props = {
     pieceNo: number;
     player: number;
     color: string;
     data: playerType[];
     onPress: any
}

const Plot: React.FC<Props> = ({ pieceNo, player, color, data, onPress }) => {
     return (
          <View style={[styles.plot, { backgroundColor: color }]}>
               {/* if player piles posistion is 0 then only show this piles com */}
               {data && data[pieceNo]?.pos === 0 &&
                    <Pile
                    color={color}
                    player={player}
                    onPress={()=>onPress(data[pieceNo])}
                    />
               }
          </View>
     )
}

export default memo(Plot)

const styles = StyleSheet.create({
     plot: {
          width: "36%",
          height: "80%",
          borderRadius: 120
     }
})