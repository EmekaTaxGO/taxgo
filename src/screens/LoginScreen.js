import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TextField, OutlinedTextField } from 'react-native-material-textfield';
import { colorAccent } from '../theme/Color';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import AppButton from '../components/AppButton';
import { RaisedTextButton } from 'react-native-material-buttons';
import { LoginButton, AccessToken } from 'react-native-fbsdk';
import { log, showToast } from '../components/Logger';
import FBLoginButton from '../components/FBLoginButton';
const { View, Text, StyleSheet, Image } = require("react-native")

class LoginScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            emailError: undefined,
            passError: undefined
        }
    }

    emailRef = React.createRef();
    passRef = React.createRef();

    onForgetPassClick = () => {
        console.log('OnForget password click!');
    }

    onLoginClick = () => {
        const { text } = this.emailRef.current.state;
        console.log('Email Ref', text);
    }

    renderCreateAccountRow = () => {
        return <View style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <Text style={{ fontSize: 14 }}>Don't have an account</Text>
            <TouchableOpacity style={{ padding: 12 }}>
                <Text style={{
                    fontSize: 14,
                    color: colorAccent,
                    textDecorationLine: 'underline'
                }}>Register</Text>
            </TouchableOpacity>
        </View>
    }
    renderLoginForm = () => {
        return <View>
            <TextField
                label='Email'
                keyboardType='email-address'
                returnKeyType='next'
                error={this.state.emailError}
                ref={this.emailRef}
                lineWidth={1}
                onSubmitEditing={() => { this.passRef.current.focus() }} />
            <TextField
                label='Password'
                secureTextEntry={true}
                error={this.state.passError}
                lineWidth={1}
                ref={this.passRef} />

            <TouchableOpacity
                style={{ paddingVertical: 6, alignItems: 'flex-end' }}
                onPress={this.onForgetPassClick}>
                <Text style={styles.forgotPass}>Forgot password?</Text>
            </TouchableOpacity>

            <AppButton onPress={this.onLoginClick}
                title='Login' />
        </View>
    }

    getFBAccessToken = () => {
        AccessToken.getCurrentAccessToken()
            .then(data => {
                log('FB Access Token', data.accessToken.toString());
            })
    }

    render() {
        return <ScrollView style={{ flex: 1 }}>
            <View style={styles.container}>
                <Image source={{ uri: 'https://taxgoglobal.com/images/logo-hd-main.webp' }}
                    style={styles.logo} />
                {this.renderLoginForm()}
                {this.renderCreateAccountRow()}

                <View style={{
                    flex: 1, flexDirection: 'row',
                    alignItems: 'center', marginTop: 12
                }}>
                    <View style={{ backgroundColor: 'rgba(0,0,0,0.1)', flex: 0.5, height: 1 }} />
                    <Text style={{ paddingHorizontal: 24, fontSize: 16 }}>OR</Text>
                    <View style={{ backgroundColor: 'rgba(0,0,0,0.1)', flex: 0.5, height: 1 }} />
                </View>
                <View style={{ flex: 1, justifyContent: 'center', marginTop: 20 }}>

                    <FBLoginButton
                        onSuccess={accessToken => { }}
                        onError={() => { }} />

                </View>
            </View>

        </ScrollView>
    }
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'stretch',
        paddingHorizontal: 12
    },
    textField: {
        marginTop: 10
    },
    logo: {
        width: '80%',
        height: 150,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginTop: 12
    },
    forgotPass: {
        color: colorAccent
    },
    fbBtn: {
        // width: '100%'
    }
});
export default connect(
    state => ({
        auth: state.auth
    })
)(LoginScreen);