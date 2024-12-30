import { StyleSheet, Image, ActivityIndicator } from 'react-native'
import React, { useEffect } from 'react'
import Wrapper from '../components/Wrapper'
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming } from 'react-native-reanimated'
import { deviceHeight, deviceWidth } from '../constants/scaling'
import Logo from "../assets/images/logo.png"
import { prepareNavigation, resetAndNavigate } from '../helpers/navigationUtils'

const SplashScreen: React.FC = () => {
     const scale = useSharedValue(1)

     useEffect(() => {
          // Start the navigation preparation
          prepareNavigation()

          // Navigate to the HomeScreen after 1.5 seconds
          const timeout = setTimeout(() => {
               resetAndNavigate('homeScreen')
          }, 1500)

          return () => clearTimeout(timeout)
     }, [])

     useEffect(() => {
          // Breathing animation: scale up and down continuously
          scale.value = withRepeat(
               withSequence(
                    withTiming(1.1, { duration: 2000 }),
                    withTiming(1, { duration: 2000 })
               ),
               -1, // Infinite loop
               true // Reverse animation direction
          )
     }, [])

     // Create animated style for scaling the logo
     const animatedStyle = useAnimatedStyle(() => ({
          transform: [{ scale: scale.value }]
     }))

     return (
          <Wrapper>
               <Animated.View style={[styles.imgContainer, animatedStyle]}>
                    <Image source={Logo} style={styles.img} />
               </Animated.View>
               <ActivityIndicator size={'small'} color={"white"} />
          </Wrapper>
     )
}

export default SplashScreen

const styles = StyleSheet.create({
     imgContainer: {
          width: deviceWidth * 0.7,
          height: deviceHeight * 0.6,
          justifyContent: 'center',
          alignItems: 'center',
     },
     img: {
          width: "100%",
          height: '100%',
          resizeMode: 'contain',
     },
})
