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
import ViewProductInfoScreen from './src/screens/ViewProductInfoScreen';
import SelectSupplierScreen from './src/screens/SelectSupplierScreen';
import ScanBarcodeScreen from './src/screens/ScanBarcodeScreen';
import PurchaseLedgerScreen from './src/screens/PurchaseLedgerScreen';
import SaleLedgerScreen from './src/screens/SaleLedgerScreen';
import MyLedgerScreen from './src/screens/MyLedgerScreen';
import BankAccountScreen from './src/screens/BankAccountScreen';
import SelectCustomerScreen from './src/screens/SelectCustomerScreen';
import SelectProductScreen from './src/screens/SelectProductScreen';
import SelectBankScreen from './src/screens/SelectBankScreen';
import BankDetailScreen from './src/screens/BankDetailScreen';
import CustomerReceiptScreen from './src/screens/CustomerReceiptScreen';
import SupplierPaymentScreen from './src/screens/SupplierPaymentScreen';
import BankTransferScreen from './src/screens/BankTransferScreen';
import OtherReceiptScreen from './src/screens/OtherReceiptScreen';
import SupplierRefundScreen from './src/screens/SupplierRefundScreen';
import OtherPaymentScreen from './src/screens/OtherPaymentScreen';
import CustomerRefundScreen from './src/screens/CustomerRefundScreen';
import AddMerchantScreen from './src/screens/AddMerchantScreen';
import TaxReturnListScreen from './src/screens/TaxReturnListScreen';
import TaxViewScreen from './src/screens/TaxViewScreen';
import ViewTaxReportScreen from './src/screens/ViewTaxReportScreen';
import AgeDebtorScreen from './src/screens/AgeDebtorScreen';
import DebtorBreakdownScreen from './src/screens/DebtorBreakdownScreen';
import AgeCreditorScreen from './src/screens/AgeCreditorScreen';
import CreditorBreakdownScreen from './src/screens/CreditorBreakdownScreen';
import BalanceSheetScreen from './src/screens/BalanceSheetScreen';
import TrialBalanceScreen from './src/screens/TrialBalanceScreen';

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
      <Stack.Screen name='ViewProductInfoScreen' component={ViewProductInfoScreen} options={{ title: 'Product Info' }} />
      <Stack.Screen name='SelectSupplierScreen' component={SelectSupplierScreen} options={{ title: 'Select Supplier' }} />
      <Stack.Screen name='SelectCustomerScreen' component={SelectCustomerScreen} options={{ title: 'Select Customer' }} />
      <Stack.Screen name='ScanBarcodeScreen' component={ScanBarcodeScreen} options={{ title: 'Scan QR' }} />
      <Stack.Screen name='PurchaseLedgerScreen' component={PurchaseLedgerScreen} options={{ title: 'Purchase Ledger' }} />
      <Stack.Screen name='SaleLedgerScreen' component={SaleLedgerScreen} options={{ title: 'Sale Ledger' }} />
      <Stack.Screen name='MyLedgerScreen' component={MyLedgerScreen} options={{ title: 'My Ledger' }} />
      <Stack.Screen name='BankAccountScreen' component={BankAccountScreen} options={{ title: 'Bank Account' }} />
      <Stack.Screen name='SelectProductScreen' component={SelectProductScreen} options={{ title: 'Select Product' }} />
      <Stack.Screen name='SelectBankScreen' component={SelectBankScreen} options={{ title: 'Select Bank' }} />
      <Stack.Screen name='BankDetailScreen' component={BankDetailScreen} options={{ title: 'Bank Detail' }} />
      <Stack.Screen name='CustomerReceiptScreen' component={CustomerReceiptScreen} options={{ title: 'Customer Receipt' }} />
      <Stack.Screen name='SupplierPaymentScreen' component={SupplierPaymentScreen} options={{ title: 'Supplier Payment' }} />
      <Stack.Screen name='BankTransferScreen' component={BankTransferScreen} options={{ title: 'Bank Transfer' }} />
      <Stack.Screen name='OtherReceiptScreen' component={OtherReceiptScreen} options={{ title: 'Other Receipt' }} />
      <Stack.Screen name='SupplierRefundScreen' component={SupplierRefundScreen} options={{ title: 'Supplier Refund' }} />
      <Stack.Screen name='OtherPaymentScreen' component={OtherPaymentScreen} options={{ title: 'Other Payment' }} />
      <Stack.Screen name='CustomerRefundScreen' component={CustomerRefundScreen} options={{ title: 'Customer Refund' }} />
      <Stack.Screen name='AddMerchantScreen' component={AddMerchantScreen} options={{ title: 'Add Merchant Account' }} />
      <Stack.Screen name='TaxReturnListScreen' component={TaxReturnListScreen} options={{ title: 'Tax Return List' }} />
      <Stack.Screen name='TaxViewScreen' component={TaxViewScreen} options={{ title: 'Tax View' }} />
      <Stack.Screen name='ViewTaxReportScreen' component={ViewTaxReportScreen} options={{ title: 'Tax Report' }} />
      <Stack.Screen name='AgeDebtorScreen' component={AgeDebtorScreen} options={{ title: 'Aged Debtors Report' }} />
      <Stack.Screen name='DebtorBreakdownScreen' component={DebtorBreakdownScreen} options={{ title: 'Aged Debtors Breakdown' }} />
      <Stack.Screen name='AgeCreditorScreen' component={AgeCreditorScreen} options={{ title: 'Aged Creditors Report' }} />
      <Stack.Screen name='CreditorBreakdownScreen' component={CreditorBreakdownScreen} options={{ title: 'Aged Creditors Breakdown' }} />
      <Stack.Screen name='BalanceSheetScreen' component={BalanceSheetScreen} options={{ title: 'Balance Sheet' }} />
      <Stack.Screen name='TrialBalanceScreen' component={TrialBalanceScreen} options={{ title: 'Trial Balance Report' }} />
    </Stack.Navigator>
  </NavigationContainer>
}

export default App;