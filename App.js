/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, HeaderTitle } from '@react-navigation/stack';
import LoginScreen from './src/screens/LoginScreen';
import { colorPrimary, colorWhite } from './src/theme/Color';
import HomeScreen from './src/screens/HomeScreen';

const App = () => {

  const Stack = createStackNavigator();

  return <NavigationContainer>
    <Stack.Navigator
      initialRouteName='HomeScreen'
      screenOptions={{
        headerStyle: { backgroundColor: colorPrimary },
        headerTintColor: colorWhite,
        headerTitleStyle: { fontWeight: '400' }
      }}>

      <Stack.Screen name='LoginScreen' component={LoginScreen} options={{ title: 'Login' }} />
      <Stack.Screen name='HomeScreen' component={HomeScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  </NavigationContainer>
}

export default App;