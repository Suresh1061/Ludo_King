import { StyleSheet, View } from 'react-native'
import React, { useMemo } from 'react'
import Cell from './Cell';

type Props = {
     cells: number[];
     color: string;
}

const VerticalPath: React.FC<Props> = ({ cells, color }) => {
     const groupedCells = useMemo(() => {
          const groups = []
          for (let i = 0; i < cells.length; i += 3) {
               groups.push(cells.slice(i, i + 3))
          }
          return groups;
     }, [cells])

     return (
          <View style={styles.container}>
               <View style={styles.subConatiner}>
                    {groupedCells.map((group, i) => (
                         <View
                              key={`group-${i}`}
                              style={{ flexDirection: "row", width: "33.3%", height: "16.7%" }}
                         >
                              {group.map((cell, i) => (
                                   <Cell key={`cell-${i}`} color={color} id={cell} />
                              ))}
                         </View>
                    ))}
               </View>
          </View>
     )
}

export default VerticalPath

const styles = StyleSheet.create({
     container: {
          flexDirection: "row",
          alignItems: "center",
          width: "20%",
          height: "100%"
     },
     subConatiner: {
          flexDirection: "column",
          width: "100%",
          height: "100%"
     }
})