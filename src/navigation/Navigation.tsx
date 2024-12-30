import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import LudoboardScreen from '../screens/LudoboardScreen'
import HomeScreen from '../screens/HomeScreen'
import SplashScreen from '../screens/SplashScreen'
import { navigationRef } from '../helpers/navigationUtils'

const Stack = createNativeStackNavigator()

const Navigation: React.FC = () => {
     return (
          <NavigationContainer ref={navigationRef}>
               <Stack.Navigator initialRouteName='splashScreen' screenOptions={{ headerShown: false }}>
                    <Stack.Screen
                         name='ludoboardScreen'
                         options={{ animation: "fade" }}
                         component={LudoboardScreen}
                    />
                    <Stack.Screen
                         name='homeScreen'
                         options={{ animation: "fade" }}
                         component={HomeScreen}
                    />
                    <Stack.Screen
                         name='splashScreen'
                         options={{ animation: "fade" }}
                         component={SplashScreen}
                    />
               </Stack.Navigator>
          </NavigationContainer>
     )
}

export default Navigation