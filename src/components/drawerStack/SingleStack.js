import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { colorPrimary, colorWhite } from '../../theme/Color';
import { appFontBold } from '../../helpers/ViewHelper';

const SingleStack = ({ name, component, title }) => {

    const Stack = createStackNavigator();

    return <Stack.Navigator
        initialRouteName={name}
        screenOptions={{
            headerStyle: { backgroundColor: colorPrimary },
            headerTintColor: colorWhite,
            headerTitleStyle: { fontWeight: '400', fontFamily: appFontBold }
        }}>
        <Stack.Screen name={name} component={component}
            options={{ title: title }} />
    </Stack.Navigator>
}
export default SingleStack;