import { ImageBackground, SafeAreaView, StyleSheet} from 'react-native'
import React from 'react'
import BG from "../assets/images/bg.jpg"
import { deviceHeight, deviceWidth } from '../constants/scaling';

type Props = {
     children: React.ReactNode;
     style?: any;
}

const Wrapper:React.FC<Props> = ({children, style}) => {
     return (
          <ImageBackground source={BG} resizeMode='cover' style={styles.container}>
               <SafeAreaView style={[styles.safeView, {...style}]}>
                    {children}
               </SafeAreaView>
          </ImageBackground>
     )
}

export default Wrapper

const styles = StyleSheet.create({
     container:{
          flex:1,
          justifyContent:"center",
          alignItems:"center"
     },
     safeView:{
          height:deviceHeight,
          width:deviceWidth,
          justifyContent:"center",
          alignItems:"center"
     }
})