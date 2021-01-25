import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { colorPrimary, colorAccent } from '../theme/Color';
import AppLogo from '../components/AppLogo';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


import * as authActions from '../redux/actions/authActions';

class SplashScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {
        const { authActions } = this.props;
        authActions.fetchAuthdata();

        setTimeout(() => {
            const { authData } = this.props.auth;
            this.props.navigation.replace(authData !== null ? 'OtherReceiptScreen' : 'LoginScreen');
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
export default connect(
    state => ({
        auth: state.auth
    }),
    dispatch => ({
        authActions: bindActionCreators(authActions, dispatch)
    })
)(SplashScreen);