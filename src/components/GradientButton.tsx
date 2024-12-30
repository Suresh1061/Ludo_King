import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { playSound } from '../helpers/soundUtils';
import LinearGradient from 'react-native-linear-gradient';
import {
     ComputerDesktopIcon,
     HomeIcon,
     PlayCircleIcon,
     PlayPauseIcon,
     UserIcon
} from 'react-native-heroicons/solid';
import { RFValue } from 'react-native-responsive-fontsize';

type Props = {
     title: string;
     iconColor?: string;
     onPress: any;
}

const iconSize = RFValue(20)

const GradientButton: React.FC<Props> = ({ title, iconColor = '#d5be3e', onPress }) => {
     return (
          <View style={styles.container}>
               <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                         playSound('ui')
                         onPress()
                    }}
                    style={styles.btnContainer}
               >
                    <LinearGradient
                         colors={['#4c6697', '#3b5998', '#192f6a']}
                         style={styles.button}
                         start={{ x: 0, y: 0 }}
                         end={{ x: 0, y: 1 }}
                    >
                         {title === 'RESUME' ? (
                              <PlayPauseIcon size={iconSize} color={iconColor} />
                         ) : title === 'NEW GAME' ? (
                              <PlayCircleIcon size={iconSize} color={iconColor} />
                         ) : title === 'VS CPU' ? (
                              <ComputerDesktopIcon size={iconSize} color={iconColor} />
                         ) : title === 'Home' ? (
                              <HomeIcon size={iconSize} color={iconColor} />
                         ) : (
                              <UserIcon size={iconSize} color={iconColor} />
                         )}
                         <Text style={styles.buttonText}>{title}</Text>
                    </LinearGradient>

               </TouchableOpacity>
          </View>
     )
}

export default GradientButton

const styles = StyleSheet.create({
     container: {
          borderRadius: 10,
          borderWidth: 2,
          borderColor: "#000",
          marginVertical: 10
     },
     btnContainer: {
          borderWidth: 2,
          borderRadius: 8,
          elevation: 5,
          shadowColor: '#d5be3e',
          shadowOpacity: 0.5,
          shadowOffset: { width: 1, height: 1 },
          shadowRadius: 10,
          borderColor: '#d5be3e',
          width: 220,
     },
     button: {
          paddingHorizontal: 20,
          paddingVertical: 10,
          borderRadius: 6,
          borderWidth: 1,
          borderColor: "#000",
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 20
     },
     buttonText: {
          color: 'white',
          fontSize: RFValue(16),
          width: '70%',
          textAlign: 'left',
          fontFamily: 'Philosopher-bold'
     }
})