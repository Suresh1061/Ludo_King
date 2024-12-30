import { StyleSheet, View } from 'react-native'
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { colors } from '../constants/colors'
import LottieView from 'lottie-react-native'
import FireWorks from "../assets/animation/firework.json"
import Svg, { Polygon } from 'react-native-svg'
import { playerType } from '../store/reducers/initialState'
import { useDispatch, useSelector } from 'react-redux'
import { selectIsFireworks } from '../store/reducers/gameSelectors'
import { updateFireworks } from '../store/reducers/gameSlice'
import Pile from './Pile'
import { deviceHeight, deviceWidth } from '../constants/scaling'

type Props = {
     player1: playerType[];
     player2: playerType[];
     player3: playerType[];
     player4: playerType[];
}

const FourTriangles: React.FC<Props> = ({ player1, player2, player3, player4 }) => {
     const size = 300
     const [blast, setBlast] = useState(false)
     const dispatch = useDispatch()
     const isFirework = useSelector(selectIsFireworks)

     useEffect(() => {
          if (isFirework) {
               setBlast(true)
               const timer = setTimeout(() => {
                    setBlast(false)
                    dispatch(updateFireworks({ value: false }))
               }, 5000);

               return () => clearTimeout(timer)
          }
     }, [isFirework, dispatch])

     const playerData = useMemo(() => [
          {
               player: player1,
               top: 55,
               left: 15,
               pileColor: colors.red,
               translate: 'translateX'
          },
          {
               player: player3,
               top: 52,
               left: 15,
               pileColor: colors.yellow,
               translate: 'translateX'
          },
          {
               player: player2,
               top: 20,
               left: -2,
               pileColor: colors.green,
               translate: 'translateY'
          },
          {
               player: player4,
               top: 20,
               right: -2,
               pileColor: colors.blue,
               translate: 'translateY'
          },
     ], [player1, player2, player3, player4])

     const renderPlayerPiles = useCallback(
          (data: any, index: number) => (
               <PlayerPile
                    key={index}
                    player={data?.player.filter((item: playerType) => item.travelCount === 57)}
                    style={{
                         top: data?.top,
                         bottom: data?.bottom,
                         left: data?.left,
                         right: data?.right
                    }}
                    pileColor={data.pileColor}
                    translate={data.translate}
               />
          ), [])

     return (
          <View style={styles.mainContainer}>
               {blast &&
                    <LottieView
                         source={FireWorks}
                         autoPlay
                         loop
                         hardwareAccelerationAndroid
                         speed={1}
                         style={styles.lottieView}
                    />
               }

               <Svg height={size} width={size}>
                    {/* Top Triangle (Yellow) */}
                    <Polygon
                         points={`0,0 ${size / 2}, ${size / 2} ${size},0`}
                         fill={colors.yellow}
                    />
                    {/* Right Triangle (Blue) */}
                    <Polygon
                         points={`${size},0 ${size},${size} ${size / 2} ,${size / 2}`}
                         fill={colors.blue}
                    />
                    {/* Bottom Triangle (Red) */}
                    <Polygon
                         points={`0,${size} ${size / 2}, ${size / 2} ${size},${size}`}
                         fill={colors.red}
                    />
                    {/* Left Triangle (Green) */}
                    <Polygon
                         points={`0,0 ${size / 2}, ${size / 2} 0,${size}`}
                         fill={colors.green}
                    />
               </Svg>

               {playerData.map(renderPlayerPiles)}
          </View>
     )
}

export default FourTriangles


type PlayerPileProps = {
     player: playerType[];
     style: any;
     pileColor: string;
     translate: string;
}

const PlayerPile: React.FC<PlayerPileProps> = memo(({ player, style, pileColor, translate }) => {
     return (
          <View style={[styles.container, style]}>
               {player.map((pile, i) => (
                    <View
                         pointerEvents='none'
                         key={pile.id}
                         style={{
                              top: 0,
                              zIndex: 99,
                              position: 'absolute',
                              bottom: 0,
                              transform: [
                                   { scale: 0.5 },
                                   translate === 'translateX' ? { translateX: 14 * i } : { translateY: 14 * i },
                              ],
                         }}
                    >
                         <Pile
                              pileId={pile.id}
                              cell={true}
                              color={pileColor}
                         />
                    </View>
               ))}

          </View>
     )
})

const styles = StyleSheet.create({
     mainContainer: {
          backgroundColor: 'white',
          borderWidth: 0.8,
          width: "20%",
          height: "100%",
          overflow: "hidden",
          borderColor: colors.borderColor,
          alignItems: "center",
          justifyContent: "center"
     },
     lottieView: {
          height: "100%",
          width: "100%",
          position: "absolute",
          zIndex: 1
     },
     container: {
          width: deviceWidth * 0.063,
          height: deviceHeight * 0.032,
          justifyContent: "center",
          alignItems: 'center',
          position: 'absolute'
     }
})