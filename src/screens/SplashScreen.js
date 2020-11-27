import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { colorPrimary, colorAccent } from '../theme/Color';
import AppLogo from '../components/AppLogo';
class SplashScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {
        setTimeout(() => {
            this.props.navigation.replace('LoginScreen');
        }, 500);
    }

    render() {
        return <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            {/* <Text style={{
                color: colorAccent,
                fontSize: 36,
                fontWeight: 'bold',
                textAlign: 'center',
                textTransform: 'capitalize'
            }}>Welcome to TaxGo</Text> */}
            <AppLogo />
        </View>
    }
};
export default SplashScreen;