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
import { createStackNavigator } from '@react-navigation/stack';
import Hello from './src/screens/Hello';

const App = () => {

  const Stack = createStackNavigator();

  return <NavigationContainer>
    <Stack.Navigator initialRouteName='Hello'>
      <Stack.Screen name='Hello' component={Hello} />
    </Stack.Navigator>
  </NavigationContainer>
}

export default App;