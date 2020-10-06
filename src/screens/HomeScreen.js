import React from 'react';
import { View, Button, StyleSheet, useWindowDimensions } from 'react-native';
import { createDrawerNavigator, DrawerItemList } from '@react-navigation/drawer';
import DrawerContent from '../components/DrawerContent';
import ProductStack from '../components/drawerStack/ProductStack';
import InvoiceStack from '../components/drawerStack/InvoiceStack';
import HomeStack from '../components/drawerStack/HomeStack';

const HomeScreen = ({ navigation }) => {


    // useLayoutEffect(() => {
    //     navigation.setOptions({
    //         headerLeft: () => {
    //             return <TouchableOpacity onPress={onMenuPress} style={styles.menu}>
    //                 <Icon name='menu' size={30} color='white' />
    //             </TouchableOpacity>
    //         }
    //     })
    // }, [navigation])

    const dimension = useWindowDimensions();

    const Drawer = createDrawerNavigator();

    return <Drawer.Navigator
        initialRouteName='HomeFragment'
        drawerType={dimension.width >= 768 ? 'permanent' : 'front'}
        overlayColor='transparent'
        drawerPosition='left'
        drawerStyle={{ backgroundColor: 'white' }}
        drawerContent={DrawerContent}
        screenOptions={{
            // headerStyle: { backgroundColor: colorPrimary },
            // headerTintColor: colorWhite,
            // headerTitleStyle: { fontWeight: '400' }
        }}>

        <Drawer.Screen name='HomeFragment' component={HomeStack} options={{ title: 'Home' }} />
        <Drawer.Screen name='ProductFragment' component={ProductStack} options={{ title: 'Product & Services' }} />
        <Drawer.Screen name='InvoiceFragment' component={InvoiceStack} options={{ title: 'Invoice' }} />
    </Drawer.Navigator>
}
const styles = StyleSheet.create({

})
export default HomeScreen;