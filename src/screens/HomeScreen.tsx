import { StyleSheet, Image, Alert, Text, Pressable, Animated } from 'react-native'
import React, { useCallback, useEffect, useRef } from 'react'
import Wrapper from '../components/Wrapper'
import { deviceHeight, deviceWidth } from '../constants/scaling'
import Logo from "../assets/images/logo.png"
import { navigate } from '../helpers/navigationUtils'
import GradientButton from '../components/GradientButton'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentPosition } from '../store/reducers/gameSelectors'
import { useIsFocused } from '@react-navigation/native'
import { playSound } from '../helpers/soundUtils'
import SoundPlayer from 'react-native-sound-player'
import { resetGame } from '../store/reducers/gameSlice'
import LottieView from 'lottie-react-native'
import witch from "../assets/animation/witch.json"

const HomeScreen: React.FC = () => {
     const dispatch = useDispatch()
     const currentPosition = useSelector(selectCurrentPosition)
     const isFocused = useIsFocused()
     const witchAnim = useRef(new Animated.Value(-deviceWidth)).current;
     const scaleXAnim = useRef(new Animated.Value(-1)).current;

     useEffect(() => {
          if (isFocused) {
               playSound('home')
          }
     }, [isFocused])

     const renderButton = useCallback((title: string, onPress: any) =>
          <GradientButton title={title} onPress={onPress} />, [])

     const startGame = async (isNew = false) => {
          SoundPlayer.stop()
          if (isNew) {
               dispatch(resetGame())
          }
          navigate('ludoboardScreen')
          playSound('game_start')
     }

     const handleNewGame = useCallback(() => startGame(true), [])
     const handleResumeGame = useCallback(() => startGame(), [])

     // Animation Logic
     const loopAnimation = useCallback(() => {
          return Animated.loop(
               Animated.sequence([
                    Animated.parallel([
                         Animated.timing(witchAnim, {
                              toValue: deviceWidth * 0.02,
                              duration: 2000,
                              useNativeDriver: true,
                         }),
                         Animated.timing(scaleXAnim, {
                              toValue: -1,
                              duration: 2000,
                              useNativeDriver: true,
                         }),
                    ]),
                    Animated.delay(3000),
                    Animated.parallel([
                         Animated.timing(witchAnim, {
                              toValue: deviceWidth * 2,
                              duration: 8000,
                              useNativeDriver: true,
                         }),
                         Animated.timing(scaleXAnim, {
                              toValue: -1,
                              duration: 0,
                              useNativeDriver: true,
                         }),
                    ]),
                    Animated.parallel([
                         Animated.timing(witchAnim, {
                              toValue: -deviceWidth * 0.05,
                              duration: 3000,
                              useNativeDriver: true,
                         }),
                         Animated.timing(scaleXAnim, {
                              toValue: 1,
                              duration: 0,
                              useNativeDriver: true,
                         }),
                    ]),
                    Animated.delay(3000),
                    Animated.parallel([
                         Animated.timing(witchAnim, {
                              toValue: -deviceWidth * 2,
                              duration: 8000,
                              useNativeDriver: true,
                         }),
                         Animated.timing(scaleXAnim, {
                              toValue: 1,
                              duration: 0,
                              useNativeDriver: true,
                         }),
                    ]),
               ])
          );
     }, [witchAnim, scaleXAnim]);

     // Start and Cleanup Animation
     useEffect(() => {
          const animation = loopAnimation();
          animation.start();

          return () => {
               animation.stop(); // Properly stop the animation on component unmount
          };
     }, [loopAnimation]);


     return (
          <Wrapper style={{ justifyContent: 'flex-start' }}>
               <Animated.View style={styles.imgContainer}>
                    <Image source={Logo} style={styles.img} />
               </Animated.View>

               {currentPosition.length !== 0 && renderButton("RESUME", handleResumeGame)}
               {renderButton("NEW GAME", handleNewGame)}
               {renderButton("VS CPU", () => Alert.alert("Coming Soon! Click new game"))}
               {renderButton("2 vs 2", () => Alert.alert("Coming Soon! Click new game"))}

               <Animated.View
                    style={[
                         styles.witchContainer,
                         {
                              transform: [{ translateX: witchAnim }, { scaleX: scaleXAnim }]
                         }
                    ]}
               >
                    <Pressable
                         onPress={() => {
                              const random = Math.floor(Math.random() * 3 + 1)
                              playSound(`girl${random}`)
                         }}
                    >
                         <LottieView
                              hardwareAccelerationAndroid
                              source={witch}
                              autoPlay
                              speed={1}
                              style={styles.witch}
                         />
                    </Pressable>
               </Animated.View>

               <Text style={styles.artist}>Made by - Suresh Pal</Text>
          </Wrapper>
     )
}

export default HomeScreen

const styles = StyleSheet.create({
     imgContainer: {
          width: deviceWidth * 0.6,
          height: deviceHeight * 0.2,
          justifyContent: 'center',
          alignItems: 'center',
          marginVertical: 50,
          alignSelf: 'center'
     },
     img: {
          width: "100%",
          height: '100%',
          resizeMode: 'contain',
     },
     artist: {
          position: 'absolute',
          bottom: 60,
          color: 'white',
          fontWeight: 800,
          opacity: 0.5,
     },
     witchContainer: {
          position: "absolute",
          top: "60%",
          left: "24%"
     },
     witch: {
          height: 250,
          width: 250,
          transform: [{ rotate: '25deg' }]
     }
})
