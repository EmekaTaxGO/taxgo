import React, { useEffect, Component } from 'react';
import { StyleSheet, View, LogBox, Alert } from 'react-native';
import CardView from 'react-native-cardview';
import { RaisedTextButton } from 'react-native-material-buttons';
import { colorAccent } from '../theme/Color';
import { connect } from 'react-redux';

import * as authActions from '../redux/actions/authActions';
import { bindActionCreators } from 'redux';
import { validatePass, PASSWORD_ERROR_MESSAGE, isEmpty, showError, getApiErrorMsg } from '../helpers/Utils';
import { getFieldValue } from '../helpers/TextFieldHelpers';
import Store from '../redux/Store';
import ProgressDialog from '../components/ProgressDialog';
import AppLogo from '../components/AppLogo';
import AppTextField from '../components/AppTextField';
import AppButton from '../components/AppButton';

class ChangePasswordScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            oldPassError: undefined,
            newPasswordError: undefined,
            confirmPassErr: undefined
        }
    }

    oldPassRef = React.createRef();
    newPassRef = React.createRef();
    confirmPassRef = React.createRef();

    componentDidMount() {
        LogBox.ignoreAllLogs(true);
        setTimeout(() => {
            this.oldPassRef.current.focus();
        }, 200);
    }

    hasAnyError = () => {
        return this.state.oldPassError !== undefined
            || this.state.newPasswordError !== undefined
            || this.state.confirmPassErr !== undefined;
    }

    onUpdatePassPress = () => {
        if (isEmpty(getFieldValue(this.oldPassRef))) {
            this.setState({ oldPassError: 'Please enter old password' });

        } else if (!validatePass(getFieldValue(this.newPassRef))) {
            this.setState({ newPasswordError: PASSWORD_ERROR_MESSAGE });

        } else if (getFieldValue(this.newPassRef) !== getFieldValue(this.confirmPassRef)) {
            this.setState({ confirmPassErr: 'Password not matched' });

        } else {
            this.updatePassword();
        }
    }

    updatePassword = () => {
        const { authActions } = this.props;
        const body = {
            userid: Store.getState().auth.authData.id,
            password_old: getFieldValue(this.oldPassRef),
            password_new: getFieldValue(this.newPassRef)
        };

        authActions.changePassword(body, this.passUpdatedAlert, this.updatePassError)
    }

    passUpdatedAlert = data => {
        Alert.alert('Alert', data.message, [
            {
                style: 'default',
                text: 'OK',
                onPress: () => this.props.navigation.goBack()
            }
        ], { cancelable: false });
    }

    updatePassError = err => {
        setTimeout(() => {
            showError(getApiErrorMsg(err));
        }, 200);
    }

    resetError = () => {
        if (this.hasAnyError()) {
            this.setState({
                oldPassError: undefined,
                newPasswordError: undefined,
                confirmPassErr: undefined
            });
        }
    }

    render() {
        const { updatingPassword } = this.props.auth;

        return <View style={{ flex: 1 }}>
            <CardView
                cardElevation={4}
                cornerRadius={6}
                style={styles.card}>
                <View style={{ flexDirection: 'column', paddingTop: 12 }}>
                    <AppLogo />
                    <AppTextField
                        containerStyle={styles.textField}
                        label='Old Password'
                        returnKeyType='next'
                        fieldRef={this.oldPassRef}
                        lineWidth={1}
                        secureTextEntry={true}
                        onChange={event => this.resetError()}
                        error={this.state.oldPassError}
                        onSubmitEditing={() => { this.newPassRef.current.focus() }}
                    />
                    <AppTextField
                        containerStyle={styles.textField}
                        label='New Password'
                        returnKeyType='next'
                        fieldRef={this.newPassRef}
                        lineWidth={1}
                        secureTextEntry={true}
                        error={this.state.newPasswordError}
                        onChange={event => this.resetError()}
                        onSubmitEditing={() => { this.confirmPassRef.current.focus() }}
                    />
                    <AppTextField
                        containerStyle={styles.textField}
                        label='Confirm Password'
                        returnKeyType='done'
                        fieldRef={this.confirmPassRef}
                        lineWidth={1}
                        secureTextEntry={true}
                        error={this.state.confirmPassErr}
                        onChange={event => this.resetError()}
                        onSubmitEditing={() => { }}
                    />
                    <AppButton
                        containerStyle={{ marginHorizontal: 16 }}
                        title='Update'
                        onPress={this.onUpdatePassPress} />
                </View>
            </CardView>
            <ProgressDialog visible={updatingPassword} />
        </View >
    }
}
const styles = StyleSheet.create({
    card: {
        margin: 12,
        backgroundColor: 'white'
    },
    updateBtn: {
        padding: 24,
        marginVertical: 26,
        marginHorizontal: 16
    },
    textField: {
        marginHorizontal: 16,
        marginTop: 18
    }
});
export default connect(
    state => ({
        auth: state.auth
    }),
    dispatch => ({
        authActions: bindActionCreators(authActions, dispatch)
    })
)(ChangePasswordScreen);