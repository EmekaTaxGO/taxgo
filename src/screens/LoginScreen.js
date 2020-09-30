import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TextField, OutlinedTextField } from 'react-native-material-textfield';
import { colorAccent } from '../theme/Color';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AppButton from '../components/AppButton';
const { View, Text, StyleSheet, Image } = require("react-native")

class LoginScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
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

    render() {
        return <View style={styles.container}>
            <Image source={{ uri: 'https://taxgoglobal.com/images/logo-hd-main.webp' }}
                style={styles.logo} />
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
                title='Login'
                textAllCaps={true} />


        </View>
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    }
});
export default connect(
    state => ({
        auth: state.auth
    })
)(LoginScreen);