import { StyleSheet, View } from 'react-native'
import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux';
import { playSound } from '../helpers/soundUtils';
import { announceWinner, resetGame } from '../store/reducers/gameSlice';
import { goBack } from '../helpers/navigationUtils';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';
import GradientButton from './GradientButton';

type Props = {
     visiable: boolean;
     onPressHide: () => void
}

const MenuModal: React.FC<Props> = ({visiable, onPressHide}) => {
     const dispatch = useDispatch()

     const handleNewGame = useCallback(() =>{
          dispatch(resetGame())
          playSound('game_start')
          dispatch(announceWinner(null))
          onPressHide()
     },[dispatch, onPressHide])

     const handleHome = useCallback(() => {
          goBack()
     },[])

     return (
          <Modal
          style={styles.bottomModalView}
          isVisible={visiable}
          backdropColor='black'
          backdropOpacity={0.8}
          onBackdropPress={onPressHide}
          animationIn={'zoomIn'}
          animationOut={'zoomOut'}
          onBackButtonPress={onPressHide}
          >
               <View style={styles.modalContainer}>
                    <LinearGradient
                    colors={['#0f0c29', '#302b63', '#24243e']}
                    style={styles.gradientContainer}
                    >
                         <View style = {styles.subView}>
                              <GradientButton title='RESUME' onPress={onPressHide}/>
                              <GradientButton title='NEW GAME' onPress={handleNewGame}/>
                              <GradientButton title='HOME' onPress={handleHome}/>
                         </View>
                    </LinearGradient>
               </View>
          </Modal>
     )
}

export default MenuModal

const styles = StyleSheet.create({
     bottomModalView:{
          justifyContent:'center',
          width:'95%',
          alignSelf:'center'
     },
     modalContainer:{
          width:'100%',
          justifyContent:'center',
          alignItems:'center'
     },
     gradientContainer:{
          borderRadius:20,
          overflow:'hidden',
          padding:20,
          paddingVertical:40,
          width:'96%',
          borderWidth:2,
          borderColor:"gold",
          justifyContent:'center',
          alignItems:'center'
     },
     subView:{
          width:'100%',
          justifyContent:'center',
          alignItems:'center',
          alignSelf:'center'
     },
})