import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RaisedTextButton } from 'react-native-material-buttons';
import { colorAccent } from '../theme/Color';
import AppLogo from '../components/AppLogo';
import { validateEmail, EMAIL_ERROR_MESSAGE } from '../helpers/Utils';
import { getFieldValue, focusField } from '../helpers/TextFieldHelpers';
import AppTextField from '../components/AppTextField';
import AppButton from '../components/AppButton';
class ForgotPasswordScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            emailError: undefined
        }
    }

    emailRef = React.createRef();

    componentDidMount() {

        setTimeout(() => {
            focusField(this.emailRef);
        }, 200);

    }

    resetState = () => {
        if (this.state.emailError !== undefined) {
            this.setState({ emailError: undefined });
        }
    }

    validateAndResetPass = () => {
        if (!validateEmail(getFieldValue(this.emailRef))) {
            this.setState({ emailError: EMAIL_ERROR_MESSAGE });
        } else {
            this.resetPass();
        }
    }

    resetPass = () => {
        console.log('Reset Pass!');
    }
    render() {
        return <View style={{
            flex: 1,
            paddingHorizontal: 16
        }}>
            <AppLogo />
            <AppTextField
                label='Email'
                keyboardType='email-address'
                returnKeyType='done'
                error={this.state.emailError}
                fieldRef={this.emailRef}
                lineWidth={1}
                onChange={event => this.resetState()}
                onSubmitEditing={() => { }} />
            <AppButton
                title='Submit'
                onPress={this.validateAndResetPass} />
        </View>
    }
};
const styles = StyleSheet.create({
    materialBtn: {
        padding: 26,
        marginTop: 15,
        fontSize: 50
    }
});
export default ForgotPasswordScreen;