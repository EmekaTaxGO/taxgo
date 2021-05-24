import React, { Component } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CardView from 'react-native-cardview';
import AppTextField from '../AppTextField';
import AppButton from '../AppButton';
import AppText from '../AppText';
import ProgressDialog from '../ProgressDialog';
import { appFontBold } from '../../helpers/ViewHelper';
import { isEmpty } from 'lodash';
import Api from '../../services/api';
import { getApiErrorMsg, showError, showSuccess } from '../../helpers/Utils';
import Store from '../../redux/Store';
import { getFieldValue } from '../../helpers/TextFieldHelpers';
class SecurityTab extends Component {

    constructor(props) {
        super(props);
        this.state = {
            points: this.getAllPoints(),
            updating: false
        }
    }

    getAllPoints = () => {
        return [
            'Minimum 8 character',
            'At least one special character . * @ ! # % & ( ) ^ ~',
            'Can’t be the same as a previous password'
        ];
    }
    componentDidMount() {


    }

    oldPassRef = React.createRef();
    newPassRef = React.createRef();
    confirmNewPassRef = React.createRef();


    renderPassRequirement = () => {
        return (
            <View style={{
                flexDirection: 'column',
                backgroundColor: '#fbfbfb',
                padding: 16,
                marginHorizontal: 16,
                marginTop: 12,
                borderRadius: 4
            }}>
                <AppText style={styles.reqTitle}>Passwork Requirements</AppText>
                <AppText style={styles.reqDesc}>to create a new password, you have to meet all of the following requirements.</AppText>
                {this.state.points.map(value => <AppText style={styles.point} key={value}>{value}</AppText>)}

            </View>
        )
    }

    validatePass = () => {
        const body = {
            userid: Store.getState().auth.authData.id,
            password_old: getFieldValue(this.oldPassRef),
            password_new: getFieldValue(this.newPassRef),
            conf_pass: getFieldValue(this.confirmNewPassRef)
        };
        if (isEmpty(body.password_old)) {
            showError('Enter old password.');
        }
        else if (isEmpty(body.password_new)) {
            showError('Enter new password.');
        }
        else if (body.password_new !== body.conf_pass) {
            showError('New password & confirm password should be same.')
        }
        else {
            const samePass = body.password_old === body.password_new;
            const validLength = body.password_new.length >= 8;
            const hasNumber = /\d/.test(body.password_new);
            const hasSymbol = /[.*@!#%&()^~]/.test(body.password_new);
            if (!samePass && validLength && hasNumber && hasSymbol) {
                delete body.conf_pass;
                this.props.onPassChange(body);
            } else {
                showError('Invalid password entered.');
            }
        }
    }

    changePassword = body => {
        this.setState({ updating: true });
        Api.post('/user/changePassword', body)
            .then(response => {
                this.setState({ updating: false }, () => {

                    setTimeout(() => {
                        this.props.navigation.goBack();
                        showSuccess(response.data.message);
                    }, 300);
                    
                });

            })
            .catch(err => {
                console.log('Error updating Password', err);
                this.setState({ updating: false }, () => {
                    setTimeout(() => {
                        showError(getApiErrorMsg(err));
                    }, 300);
                });
            })
    }
    render() {
        return <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <KeyboardAwareScrollView style={{ flex: 1 }}>
                <CardView
                    cardElevation={4}
                    cornerRadius={6}
                    style={styles.card}>
                    <AppTextField
                        containerStyle={styles.textField}
                        label='Old Password'
                        returnKeyType='next'
                        fieldRef={this.oldPassRef}
                        lineWidth={1}
                        secureTextEntry={true}
                    />
                    <AppTextField
                        containerStyle={styles.textField}
                        label='New Password'
                        returnKeyType='next'
                        fieldRef={this.newPassRef}
                        lineWidth={1}
                        secureTextEntry={true}
                    />
                    <AppTextField
                        containerStyle={styles.textField}
                        label='Confirm New Password'
                        returnKeyType='next'
                        fieldRef={this.confirmNewPassRef}
                        lineWidth={1}
                        secureTextEntry={true}
                    />
                </CardView>
                {this.renderPassRequirement()}
                <AppButton
                    containerStyle={styles.appBtn}
                    title='Update'
                    onPress={this.validatePass} />
            </KeyboardAwareScrollView>
            <ProgressDialog visible={this.state.updating} />
        </SafeAreaView>
    }
}
const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        marginHorizontal: 16,
        marginTop: 12,
        paddingTop: 12,
        paddingBottom: 20
    },
    textField: {
        marginHorizontal: 16,
        marginTop: 18
    },
    appBtn: {
        marginTop: 18,
        marginHorizontal: 16
    },
    point: {
        color: 'black',
        fontSize: 15,
        marginTop: 6
    },
    reqDesc: {
        marginTop: 6,
        color: '#202020',
        fontFamily: appFontBold,
        fontSize: 14,
        textTransform: 'uppercase',
        paddingBottom: 12
    },
    reqTitle: {
        color: '#737373',
        fontSize: 20,
        textTransform: 'uppercase'
    }
})
export default SecurityTab;