import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { TextField, OutlinedTextField } from 'react-native-material-textfield';
import AppTextField from '../components/AppTextField';
import { colorAccent } from '../theme/Color';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AppButton from '../components/AppButton';
const { View, Text, StyleSheet, Image } = require("react-native")

const LoginScreen = (props) => {

    useEffect(() => {
        console.log('Props', JSON.stringify(props));
    }, [])


    const onSubmit = () => {
        let { current: field } = fieldRef;

        console.log(field.value());
    };

    const onForgotPass = () => {
        console.log('Pass forgot')
    }

    const fieldRef = React.createRef();

    return <View style={styles.container}>
        <Image source={{ uri: 'https://taxgoglobal.com/images/logo-hd-main.webp' }}
            style={styles.logo} />
        <AppTextField
            label='Email'
            keyboardType='email-address' />

        <AppTextField
            label='Password'
            secureTextEntry={true} />

        <TouchableOpacity
            style={{ paddingVertical: 6 }}
            onPress={onForgotPass}>
            <Text style={styles.forgotPass}>Forgot password?</Text>
        </TouchableOpacity>

        <AppButton />


    </View>
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