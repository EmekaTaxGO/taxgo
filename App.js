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
import AddJournalScreen from './src/screens/AddJournalScreen';
import AddLedgerScreen from './src/screens/AddLedgerScreen';
import SelectLedgerScreen from './src/screens/SelectLedgerScreen';
import JournalLedgersScreen from './src/screens/JournalLedgersScreen';
import SplashScreen from './src/screens/SplashScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import WebViewScreen from './src/screens/WebViewScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import UpdateUserScreen from './src/screens/UpdateUserScreen';
import AddInvoice from './src/screens/AddInvoiceScreen';
import AddInvoiceScreen from './src/screens/AddInvoiceScreen';

const App = () => {

  const Stack = createStackNavigator();

  LogBox.ignoreAllLogs();

  return <NavigationContainer>
    <Stack.Navigator
      initialRouteName='SplashScreen'
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
      <Stack.Screen name='AddJournalScreen' component={AddJournalScreen} options={{ title: 'Add Journal' }} />
      <Stack.Screen name='AddLedgerScreen' component={AddLedgerScreen} options={{ title: 'Add Ledger' }} />
      <Stack.Screen name='SelectLedgerScreen' component={SelectLedgerScreen} options={{ title: 'Select Ledger' }} />
      <Stack.Screen name='JournalLedgersScreen' component={JournalLedgersScreen} options={{ title: 'Journal Ledgers' }} />
      <Stack.Screen name='SplashScreen' component={SplashScreen} options={{ title: 'TaxGo', headerShown: false }} />
      <Stack.Screen name='SignUpScreen' component={SignUpScreen} options={{ title: 'SignUp' }} />
      <Stack.Screen name='WebViewScreen' component={WebViewScreen} options={{ title: 'WebView' }} />
      <Stack.Screen name='ForgotPasswordScreen' component={ForgotPasswordScreen} options={{ title: 'Forgot Password' }} />
      <Stack.Screen name='UpdateUserScreen' component={UpdateUserScreen} options={{ title: 'Add User' }} />
      <Stack.Screen name='AddInvoiceScreen' component={AddInvoiceScreen} options={{ title: 'Add Invoice' }} />

    </Stack.Navigator>
  </NavigationContainer>
}

export default App;