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
import EditProfileScreen from './src/screens/EditProfileScreen';
import ChangePasswordScreen from './src/screens/ChangePasswordScreen';
import MerchantAccountScreen from './src/screens/MerchantAccountScreen';
import UpgradePlanScreen from './src/screens/UpgradePlanScreen';
import AddCustomerScreen from './src/screens/AddCustomerScreen';
import AddProductScreen from './src/screens/AddProductScreen';
import { LogBox } from 'react-native';

const App = () => {

  const Stack = createStackNavigator();

  LogBox.ignoreAllLogs();

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
      <Stack.Screen name='EditProfileScreen' component={EditProfileScreen} options={{ title: 'Edit Profile' }} />
      <Stack.Screen name='ChangePasswordScreen' component={ChangePasswordScreen} options={{ title: 'Change Password' }} />
      <Stack.Screen name='MerchantAccountScreen' component={MerchantAccountScreen} options={{ title: 'Merchant Account' }} />
      <Stack.Screen name='UpgradePlanScreen' component={UpgradePlanScreen} options={{ title: 'Upgrade Plan' }} />
      <Stack.Screen name='AddCustomerScreen' component={AddCustomerScreen} options={{ title: 'Add Customer' }} />
      <Stack.Screen name='AddProductScreen' component={AddProductScreen} options={{ title: 'Add Product' }} />
    </Stack.Navigator>
  </NavigationContainer>
}

export default App;