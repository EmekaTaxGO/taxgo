import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    SafeAreaView,
    TouchableOpacity,
    Linking,
    Alert,
} from 'react-native';
import { colorAccent, errorColor } from '../theme/Color';
import OnScreenSpinner from '../components/OnScreenSpinner';
import FullScreenError from '../components/FullScreenError';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ProgressDialog from '../components/ProgressDialog';


import * as authActions from '../redux/actions/authActions';
import { focusField, getFieldValue } from '../helpers/TextFieldHelpers';
import FBLoginButton from '../components/FBLoginButton';
import { TERMS_AND_CONDITION_URL, PRIVACY_POLICY_URL } from '../constants/appConstant';
import ImagePicker from 'react-native-image-picker';
import {
    DEFAULT_PICKER_OPTIONS,
    validateFirstName,
    FIRST_NAME_ERROR_MESSAGE,
    validateLastName,
    LAST_NAME_ERROR_MESSAGE,
    validateEmail,
    EMAIL_ERROR_MESSAGE,
    validateBusinessName,
    BUSINESS_NAME_ERROR_MESSAGE,
    validateMobile,
    MOBILE_ERROR_MESSAGE,
    validatePass,
    PASSWORD_ERROR_MESSAGE,
    getApiErrorMsg
} from '../helpers/Utils';
import AppTextField from '../components/AppTextField';
import AppButton from '../components/AppButton';
import Api from '../services/api';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AppPicker2 from '../components/AppPicker2';
import { showSingleSelectAlert } from '../components/SingleSelectAlert';
import { appFont } from '../helpers/ViewHelper';

class SignUpScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            categoryIndex: 0,
            countryIndex: 0,
            businessTypeIndex: 0,
            imageUri: undefined,
            firstNameError: undefined,
            lastNameError: undefined,
            emailError: undefined,
            passwordError: undefined,
            businessNameError: undefined,
            phoneError: undefined,
            businessType: ['Limited Company', 'Partnership', 'Trader'],
            creating: false
        }
    }

    firstNameRef = React.createRef();
    lastNameRef = React.createRef();
    emailRef = React.createRef();
    passwordRef = React.createRef();
    businessNameRef = React.createRef();
    countryCodeRef = React.createRef();
    phoneNumberRef = React.createRef();

    componentDidMount() {
        this.fetchRenderInfo();
    }

    fetchRenderInfo = () => {
        const { authActions, auth } = this.props;
        if (auth.countries.length === 0) {
            //Only load if countries are not available
            authActions.fetchSignupDetails();
        }

    }

    onPressBusinessCategory = () => {
        const { businesses } = this.props.auth
        const items = businesses.map(element => element.btitle)
        showSingleSelectAlert('Business Category', items, categoryIndex => {
            this.setState({ categoryIndex })
        })
    }

    onItemChange = (key, index) => {
        this.setState({ [key]: index })
    }

    renderBusinessCategory = () => {
        const { businesses } = this.props.auth;
        const selectedCategory = businesses[this.state.categoryIndex].btitle;
        return <View style={{ flexDirection: 'column', marginTop: 18 }}>
            <Text style={styles.dropDownLabel}>Business Category</Text>
            <AppPicker2
                title={selectedCategory}
                text='Business Category'
                items={businesses.map(element => element.btitle)}
                containerStyle={styles.dropDown}
                onChange={idx => this.onItemChange('categoryIndex', idx)}
            />
        </View>
    }

    countryPickerLabel = value => {
        return value.country_code ? `${value.currency} (${value.country_code})`
            : value.currency;
    }
    renderCountry = () => {
        const { countries } = this.props.auth;
        const selectedCountry = countries[this.state.countryIndex];
        return <View style={{ flexDirection: 'column', marginTop: 18 }}>
            <Text style={styles.dropDownLabel}>Currency</Text>

            <AppPicker2
                title={this.countryPickerLabel(selectedCountry)}
                text='Select Currency'
                items={countries.map(item => this.countryPickerLabel(item))}
                containerStyle={styles.dropDown}
                onChange={idx => this.onItemChange('countryIndex', idx)}
            />

        </View>
    }
    renderBusinessType = () => {
        const selectedBType = this.state.businessType[this.state.businessTypeIndex];
        return <View style={{ flexDirection: 'column', marginTop: 12 }}>
            <Text style={styles.dropDownLabel}>Business Type</Text>

            <AppPicker2
                title={selectedBType}
                text='Select Business Type'
                items={this.state.businessType}
                containerStyle={styles.dropDown}
                onChange={idx => this.onItemChange('businessTypeIndex', idx)}
            />

        </View>
    }

    loginClick = () => {
        this.props.navigation.navigate('LoginScreen');
    }

    onTermsConditionClick = () => {
        Linking.openURL(TERMS_AND_CONDITION_URL);
    }
    onPrivacyPolicyClick = () => {
        Linking.openURL(PRIVACY_POLICY_URL);
    }

    onImageClick = () => {
        ImagePicker.showImagePicker(DEFAULT_PICKER_OPTIONS, callback => {
            if (callback.uri) {
                this.setState({ imageUri: callback.uri });
            }
        })
    }

    hasAnyError = () => {
        return this.state.firstNameError !== undefined
            || this.state.lastNameError !== undefined
            || this.state.emailError !== undefined
            || this.state.passwordError !== undefined
            || this.state.businessNameError !== undefined
            || this.state.phoneError !== undefined;
    }

    resetAllError = () => {
        if (this.hasAnyError()) {
            this.setState({
                firstNameError: undefined,
                lastNameError: undefined,
                emailError: undefined,
                passwordError: undefined,
                businessNameError: undefined,
                phoneError: undefined
            });
        }
    }

    validateAndSignUp = () => {
        if (!validateFirstName(getFieldValue(this.firstNameRef))) {
            this.setState({ firstNameError: FIRST_NAME_ERROR_MESSAGE });

        } else if (!validateLastName(getFieldValue(this.lastNameRef))) {
            this.setState({ lastNameError: LAST_NAME_ERROR_MESSAGE });

        } else if (!validateEmail(getFieldValue(this.emailRef))) {
            this.setState({ emailError: EMAIL_ERROR_MESSAGE });

        } else if (!validatePass(getFieldValue(this.passwordRef))) {
            this.setState({ passwordError: PASSWORD_ERROR_MESSAGE });

        }
        else if (!validateBusinessName(getFieldValue(this.businessNameRef))) {
            this.setState({ businessNameError: BUSINESS_NAME_ERROR_MESSAGE });

        } else if (!validateMobile(getFieldValue(this.phoneNumberRef))) {
            this.setState({ phoneError: MOBILE_ERROR_MESSAGE });

        } else {
            this.signUpUser();
        }
    }

    signUpUser = () => {
        this.setState({ creating: true });
        const body = this.getRequestBody();
        return Api.post('/user/register', body)
            .then(response => {
                this.setState({ creating: false });
                setTimeout(() => this.showSignUpSuccessDialog(), 300);
            })
            .catch(err => {
                console.log('Error: ', err.response.data);
                this.setState({ creating: false });
                const message = getApiErrorMsg(err);
                setTimeout(() => {
                    Alert.alert('Alert', message);
                }, 300);

            })
    }

    showSignUpSuccessDialog = () => {
        Alert.alert('Alert', 'Registration is successful, Please Login to use Taxgo Services.', [{
            onPress: () => {
                this.props.navigation.navigate('LoginScreen');
            },
            style: 'default',
            text: 'OK'
        }], { cancelable: false })
    }

    getRequestBody = () => {
        const { businesses, countries } = this.props.auth;
        const country = countries[this.state.countryIndex];
        const business = businesses[this.state.categoryIndex];
        return {
            firstname: getFieldValue(this.firstNameRef),
            lastname: getFieldValue(this.lastNameRef),
            email: getFieldValue(this.emailRef),
            password: getFieldValue(this.passwordRef),
            phone: getFieldValue(this.phoneNumberRef),
            bcategory: business.id,
            country: country.id,
            currency: country.currency,
            btype: this.state.businessType[this.state.businessTypeIndex],
            bname: getFieldValue(this.businessNameRef),
            rtype: business.btitle,
            tax: country.taxtype
        };
    }

    render() {
        const { auth } = this.props;

        if (auth.fetchingSignupDetails) {
            return <OnScreenSpinner />
        }
        if (auth.fetchSignupDetailsError) {
            return <FullScreenError tryAgainClick={this.fetchRenderInfo} />
        }
        return <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <KeyboardAwareScrollView style={{
                paddingHorizontal: 16,
                flex: 1
            }}>
                {/* <TouchableOpacity onPress={this.onImageClick}>
                        <Image style={{
                            borderColor: 'gray',
                            borderWidth: 1,
                            width: 80,
                            height: 80,
                            borderRadius: 40,
                            marginTop: 14,
                            alignSelf: 'center',
                            backgroundColor: 'lightgray',

                        }}
                            source={{ uri: this.state.imageUri }} />
                        {this.state.imageUri === undefined ? <AntIcon
                            style={{
                                position: 'absolute',
                                alignSelf: 'center',
                                marginTop: 34,
                            }}
                            name='camera'
                            color='gray'
                            size={40} /> : null}
                    </TouchableOpacity> */}
                <AppTextField
                    containerStyle={styles.textField}
                    label='First Name'
                    keyboardType='default'
                    returnKeyType='next'
                    lineWidth={1}
                    title='*required'
                    fieldRef={this.firstNameRef}
                    error={this.state.firstNameError}
                    onChange={event => this.resetAllError()}
                    onSubmitEditing={() => focusField(this.lastNameRef)} />
                <AppTextField
                    containerStyle={styles.textField}
                    label='Last Name'
                    keyboardType='default'
                    returnKeyType='next'
                    lineWidth={1}
                    title='*required'
                    fieldRef={this.lastNameRef}
                    error={this.state.lastNameError}
                    onChange={event => this.resetAllError()}
                    onSubmitEditing={() => focusField(this.emailRef)} />
                <AppTextField
                    containerStyle={styles.textField}
                    label='Email'
                    keyboardType='email-address'
                    returnKeyType='next'
                    lineWidth={1}
                    title='*required'
                    fieldRef={this.emailRef}
                    error={this.state.emailError}
                    onChange={event => this.resetAllError()}
                    onSubmitEditing={() => focusField(this.passwordRef)} />
                <AppTextField
                    containerStyle={styles.textField}
                    label='Password'
                    keyboardType='default'
                    returnKeyType='next'
                    lineWidth={1}
                    secureTextEntry={true}
                    title='*required'
                    fieldRef={this.passwordRef}
                    error={this.state.passwordError}
                    onChange={event => this.resetAllError()}
                    onSubmitEditing={() => focusField(this.businessNameRef)} />
                <AppTextField
                    containerStyle={styles.textField}
                    label='Business Name'
                    keyboardType='name-phone-pad'
                    returnKeyType='done'
                    lineWidth={1}
                    title='*required'
                    error={this.state.businessNameError}
                    onChange={event => this.resetAllError()}
                    fieldRef={this.businessNameRef}
                />
                {this.renderBusinessCategory()}
                {this.renderCountry()}
                {this.renderBusinessType()}
                <AppTextField
                    containerStyle={[styles.textField, { marginTop: 30 }]}
                    label='Phone'
                    keyboardType='number-pad'
                    returnKeyType='done'
                    lineWidth={1}
                    error={this.state.phoneError}
                    fieldRef={this.phoneNumberRef}
                    onChange={event => this.resetAllError()}
                />
                <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', marginTop: 12 }}>
                    <Text style={{ fontSize: 10 }}>By Signing up you are agreeing with Tax GO</Text>
                    <TouchableOpacity onPress={this.onTermsConditionClick}
                        style={{
                            marginLeft: 4,
                            paddingVertical: 8, paddingHorizontal: 4
                        }}>
                        <Text style={{ color: colorAccent, fontSize: 10 }}>Terms {`&`} Conditions.</Text>
                    </TouchableOpacity>
                </View>
                {this.hasAnyError()
                    ? <Text
                        style={{
                            color: errorColor,
                            fontSize: 11,
                            alignSelf: 'center'
                        }}>Resolve All Error First!</Text> : null}
                <AppButton
                    title='Sign Up'
                    onPress={this.validateAndSignUp} />
                {/* <View style={{ flexDirection: 'row', marginVertical: 18, alignItems: 'center' }}>
                    <View style={{ backgroundColor: 'rgba(0,0,0,0.1)', flex: 0.5, height: 1 }} />
                    <Text style={{ paddingHorizontal: 24, fontSize: 16 }}>OR</Text>
                    <View style={{ backgroundColor: 'rgba(0,0,0,0.1)', flex: 0.5, height: 1 }} />
                </View> */}
                {/* <FBLoginButton
                    onSuccess={accessToken => { }}
                    onError={() => { }} /> */}
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 12
                }}>
                    <Text style={{ fontWeight: 'bold' }}>Already have an Account?</Text>
                    <TouchableOpacity onPress={this.loginClick} style={{ padding: 12 }}>
                        <Text style={{
                            textDecorationLine: 'underline',
                            color: colorAccent,
                            fontWeight: 'bold'
                        }}>
                            LOGIN
                            </Text>
                    </TouchableOpacity>

                </View>
                <View style={{
                    flexDirection: 'row',
                    flex: 1,
                    alignItems: 'center',
                    marginBottom: 12
                }}>
                    <Text style={{
                        fontSize: 10,
                        textTransform: 'capitalize'
                    }}>**Read our privacy policy</Text>
                    <TouchableOpacity onPress={this.onPrivacyPolicyClick}
                        style={{
                            marginLeft: 4,
                            paddingVertical: 8, paddingHorizontal: 4
                        }}>
                        <Text style={{
                            color: colorAccent,
                            fontSize: 10,
                            textTransform: 'capitalize',
                            textDecorationLine: 'underline'
                        }}>here.</Text>
                    </TouchableOpacity>
                </View>
                <ProgressDialog visible={this.state.creating} />
            </KeyboardAwareScrollView>
        </SafeAreaView>
    }
}
const styles = StyleSheet.create({

    textField: {
        marginTop: 16
    },
    dropDown: {
        marginTop: 8
    },
    dropDownLabel: {
        marginTop: 4,
        fontFamily: appFont,
        fontSize: 17,
        color: 'gray'
    }
});
export default connect(
    state => ({
        auth: state.auth
    }),
    dispatch => ({
        authActions: bindActionCreators(authActions, dispatch)
    })
)(SignUpScreen);