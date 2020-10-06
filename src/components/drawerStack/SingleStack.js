import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { colorPrimary, colorWhite } from '../../theme/Color';

const SingleStack = ({ name, component }) => {

    const Stack = createStackNavigator();
    return <Stack.Navigator
        initialRouteName={name}
        screenOptions={{
            headerStyle: { backgroundColor: colorPrimary },
            headerTintColor: colorWhite,
            headerTitleStyle: { fontWeight: '400' }
        }}>
        <Stack.Screen name={name} component={component} />
    </Stack.Navigator>
}
export default SingleStack;