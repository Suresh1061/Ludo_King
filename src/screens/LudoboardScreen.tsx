import { Animated, Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Wrapper from '../components/Wrapper'
import menu from "../assets/images/menu.png"
import { deviceHeight, deviceWidth } from '../constants/scaling'
import Dice from '../components/Dice'
import { colors } from '../constants/colors'
import HomeArea from '../components/HomeArea'
import VerticalPath from '../components/path/VerticalPath'
import { plot1Data, plot2Data, plot3Data, plot4Data } from '../helpers/getPlots'
import HorizontalPath from '../components/path/HorizontalPath'
import FourTriangles from '../components/FourTriangles'
import { useSelector } from 'react-redux'
import { useIsFocused } from "@react-navigation/native"
import {
     selectIsDiceTouch,
     selectPlayer1,
     selectPlayer2,
     selectPlayer3,
     selectPlayer4,
     selectWinner
} from '../store/reducers/gameSelectors'
import startGame from "../assets/images/start.png"
import MenuModal from '../components/MenuModal'
import { playSound } from '../helpers/soundUtils'
import WinModal from '../components/WinModal'

const LudoboardScreen: React.FC = () => {
     const playerRed = useSelector(selectPlayer1);
     const playerGreen = useSelector(selectPlayer2)
     const playerYellow = useSelector(selectPlayer3)
     const playerBlue = useSelector(selectPlayer4)
     const isDiceTouch = useSelector(selectIsDiceTouch)
     const winner = useSelector(selectWinner)

     const isFocused = useIsFocused()

     const [showStartImage, setShowStartImage] = useState(false)
     const [menuVisible, setMenuVisible] = useState(false)
     const opacity = useRef(new Animated.Value(1)).current

     useEffect(() => {
          if (isFocused) {
               setShowStartImage(true)
               const blinkAnimation = Animated.loop(Animated.sequence([
                    Animated.timing(opacity, {
                         toValue: 0,
                         duration: 500,
                         useNativeDriver: true
                    }),
                    Animated.timing(opacity, {
                         toValue: 1,
                         duration: 500,
                         useNativeDriver: true
                    })
               ]))

               blinkAnimation.start()

               const timeout = setTimeout(() => {
                    blinkAnimation.stop()
                    setShowStartImage(false)
               }, 2500);

               return () => {
                    blinkAnimation.stop()
                    clearTimeout(timeout)
               }
          }
     }, [isFocused])

     const handleMenuVisiable = useCallback(() => {
          playSound('ui')
          setMenuVisible(true)
     }, [])

     return (
          <Wrapper>
               <TouchableOpacity onPress={handleMenuVisiable} style={{ position: "absolute", top: 60, left: 20 }}>
                    <Image source={menu} style={{ width: 30, height: 30 }} />
               </TouchableOpacity>

               <View style={styles.container}>
                    <View style={styles.flexRow} pointerEvents={isDiceTouch ? "none" : "auto"}>
                         <Dice color={colors.green} player={2} data={playerGreen} />
                         <Dice color={colors.yellow} player={3} data={playerYellow} rotate />
                    </View>
                    <View style={styles.ludoboard}>
                         <View style={styles.plotContainer}>
                              <HomeArea color={colors.green} player={2} data={playerGreen} />
                              <VerticalPath cells={plot2Data} color={colors.yellow} />
                              <HomeArea color={colors.yellow} player={3} data={playerYellow} />
                         </View>
                         <View style={styles.pathContainer}>
                              <HorizontalPath cells={plot1Data} color={colors.green} />
                              <FourTriangles
                                   player1={playerRed}
                                   player2={playerGreen}
                                   player3={playerYellow}
                                   player4={playerBlue}
                              />
                              <HorizontalPath cells={plot3Data} color={colors.blue} />
                         </View>
                         <View style={styles.plotContainer}>
                              <HomeArea color={colors.red} player={1} data={playerRed} />
                              <VerticalPath cells={plot4Data} color={colors.red} />
                              <HomeArea color={colors.blue} player={4} data={playerBlue} />
                         </View>
                    </View>
                    <View style={styles.flexRow} pointerEvents={isDiceTouch ? "none" : "auto"}>
                         <Dice color={colors.red} player={1} data={playerRed} />
                         <Dice color={colors.blue} player={4} data={playerBlue} rotate />
                    </View>
               </View>

               {showStartImage &&
                    <Animated.Image
                         source={startGame}
                         style={{
                              width: deviceWidth * 0.5,
                              height: deviceHeight * 0.2,
                              position: "absolute",
                              opacity
                         }}
                    />}

               {menuVisible && <MenuModal onPressHide={() => setMenuVisible(false)} visiable={menuVisible} />}

               {winner !== null && <WinModal winner={winner} />}
          </Wrapper>
     )
}

export default LudoboardScreen

const styles = StyleSheet.create({
     container: {
          width: deviceWidth,
          height: deviceHeight * 0.5,
          justifyContent: "center",
          alignItems: "center",
     },
     flexRow: {
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          paddingHorizontal: 30,
     },
     ludoboard: {
          width: "100%",
          height: "100%",
          alignSelf: "center",
          padding: 10,
     },
     plotContainer: {
          width: "100%",
          height: "40%",
          // justifyContent:"center",
          flexDirection: "row",
          backgroundColor: "#ccc"
     },
     pathContainer: {
          width: "100%",
          height: "20%",
          justifyContent: "space-between",
          flexDirection: "row",
          backgroundColor: "#1e5162"
     }
})