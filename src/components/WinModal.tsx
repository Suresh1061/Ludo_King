import { StyleSheet, Text, View } from 'react-native'
import Modal from "react-native-modal"
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { announceWinner, resetGame } from '../store/reducers/gameSlice';
import { playSound } from '../helpers/soundUtils';
import { resetAndNavigate } from '../helpers/navigationUtils';
import LinearGradient from 'react-native-linear-gradient';
import Pile from './Pile';
import { colorPlayer } from '../helpers/getPlots';
import LottieView from 'lottie-react-native';
import GradientButton from './GradientButton';
import Trophy from "../assets/animation/trophy.json"
import Firework from "../assets/animation/firework.json"
import HeartGirl from "../assets/animation/girl.json"

type Props = {
     winner: number;
}

const WinModal: React.FC<Props> = ({ winner }) => {
     const dispatch = useDispatch()
     const [visible, setVisible] = useState<boolean>(!!winner)

     useEffect(() => {
          setVisible(!!winner)
     }, [winner])

     const handleNewGame = () => {
          dispatch(resetGame())
          dispatch(announceWinner(null))
          playSound('game_start')
     }

     const handleHome = () => {
          dispatch(resetGame())
          dispatch(announceWinner(null))
          resetAndNavigate("HomeScreen")
     }
     return (
          <Modal
               style={styles.Modal}
               isVisible={visible}
               backdropColor='black'
               backdropOpacity={0.8}
               onBackdropPress={() => { }}
               animationIn={'zoomIn'}
               animationOut={'zoomOut'}
               onBackButtonPress={() => { }}
          >
               <LinearGradient
                    colors={['#0f0c29', '#302b63', '#24243e']}
                    style={styles.gradientContainer}
               >
                    <View style={styles.content}>
                         <View style={styles.pileContainer}>
                              <Pile player={1} color={colorPlayer[winner - 1]} />
                         </View>
                         <Text style={styles.congratsText}>
                              Congratulations! Player {winner} Wins
                         </Text>
                         <LottieView
                              autoPlay
                              hardwareAccelerationAndroid
                              loop={false}
                              source={Trophy}
                              style={styles.trophyAnimation}
                         />
                         <LottieView
                              autoPlay
                              hardwareAccelerationAndroid
                              loop={true}
                              source={Firework}
                              style={styles.fireworkAnimation}
                         />
                         <GradientButton title="NEW GAME" onPress={handleNewGame} />
                         <GradientButton title="Home" onPress={handleHome} />
                    </View>
               </LinearGradient>
               <LottieView
                    autoPlay
                    hardwareAccelerationAndroid
                    loop={true}
                    source={HeartGirl}
                    style={styles.girlAnimation}
               />
          </Modal>
     )
}

export default WinModal

const styles = StyleSheet.create({
     Modal: {
          justifyContent: 'center',
          alignItems: 'center'
     },
     gradientContainer: {
          borderRadius: 20,
          padding: 20,
          width: '96%',
          borderWidth: 2,
          borderColor: "gold",
          justifyContent: 'center',
          alignItems: 'center'
     },
     content: {
          width: '100%',
          alignItems: 'center',
     },
     pileContainer: {
          width: 90,
          height: 40
     },
     congratsText: {
          fontSize: 18,
          color: 'white',
          fontFamily: 'Philosopher-bold',
          marginTop: 10,
     },
     trophyAnimation: {
          height: 200,
          width: 200,
          marginTop: 20,
     },
     fireworkAnimation: {
          height: 200,
          width: 500,
          position: 'absolute',
          zIndex: -1,
          marginTop: 20
     },
     girlAnimation: {
          height: 500,
          width: 380,
          position: 'absolute',
          bottom: -200,
          right: -120,
          zIndex: 99
     }
})