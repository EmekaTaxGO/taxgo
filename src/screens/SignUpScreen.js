import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    KeyboardAvoidingView,
    SafeAreaView,
    Picker,
    TouchableOpacity,
    Linking,
    Image
} from 'react-native';
import { colorPrimary, colorAccent } from '../theme/Color';
import OnScreenSpinner from '../components/OnScreenSpinner';
import FullScreenError from '../components/FullScreenError';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ProgressDialog from '../components/ProgressDialog';


import * as authActions from '../redux/actions/authActions';
import { focusField, getFieldValue } from '../helpers/TextFieldHelpers';
import { RaisedTextButton } from 'react-native-material-buttons';
import FBLoginButton from '../components/FBLoginButton';
import { TERMS_AND_CONDITION_URL, PRIVACY_POLICY_URL } from '../constants/appConstant';
import ImagePicker from 'react-native-image-picker';
import AntIcon from 'react-native-vector-icons/AntDesign';
import { call } from 'react-native-reanimated';
import { DEFAULT_PICKER_OPTIONS, validateFirstName, FIRST_NAME_ERROR_MESSAGE, validateLastName, LAST_NAME_ERROR_MESSAGE, validateEmail, EMAIL_ERROR_MESSAGE, validateBusinessName, BUSINESS_NAME_ERROR_MESSAGE, validateMobile, MOBILE_ERROR_MESSAGE, validatePass, PASSWORD_ERROR_MESSAGE } from '../helpers/Utils';
import { log } from '../components/Logger';
import { OutlinedTextField } from 'react-native-material-textfield';

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
            businessType: ['Limited Company', 'Partnership', 'Trader']
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

    renderBusinessCategory = () => {
        const { businesses } = this.props.auth;
        const selectedCategory = businesses[this.state.categoryIndex].btitle;
        return <View style={{ flexDirection: 'column', marginTop: 12 }}>
            <Text>Business Category</Text>
            <View style={{ borderWidth: 1, borderRadius: 12, borderColor: 'lightgray', marginTop: 6 }}>
                <Picker
                    selectedValue={selectedCategory}
                    mode='dropdown'
                    onValueChange={(itemValue, itemIndex) => this.setState({ categoryIndex: itemIndex })}>

                    {businesses.map((value, index) => <Picker.Item
                        label={value.btitle} value={value.btitle} key={`${index}`} />)}
                </Picker>
            </View>
        </View>
    }

    countryPickerLabel = value => {
        return value.country_code ? `${value.currency} (${value.country_code})`
            : value.currency;
    }
    renderCountry = () => {
        const { countries } = this.props.auth;
        const selectedCountry = countries[this.state.countryIndex].currency;
        return <View style={{ flexDirection: 'column', marginTop: 12 }}>
            <Text>Currency</Text>
            <View style={{ borderWidth: 1, borderRadius: 12, borderColor: 'lightgray', marginTop: 6 }}>
                <Picker
                    selectedValue={selectedCountry}
                    mode='dropdown'
                    onValueChange={(itemValue, itemIndex) => this.setState({ countryIndex: itemIndex })}>

                    {countries.map((value, index) => <Picker.Item
                        label={this.countryPickerLabel(value)} value={value.currency} key={`${value.id}`} />)}
                </Picker>
            </View>

        </View>
    }
    renderBusinessType = () => {
        const selectedBType = this.state.businessType[this.state.businessTypeIndex];
        return <View style={{ flexDirection: 'column', marginTop: 12 }}>
            <Text>Business Type</Text>
            <View style={{ borderWidth: 1, borderRadius: 12, borderColor: 'lightgray', marginTop: 6 }}>
                <Picker
                    selectedValue={selectedBType}
                    mode='dropdown'
                    onValueChange={(itemValue, itemIndex) => this.setState({ businessTypeIndex: itemIndex })}>

                    {this.state.businessType.map((value, index) => <Picker.Item
                        label={value} value={value} key={value} />)}
                </Picker>
            </View>

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
        const { businesses, countries } = this.props.auth;
        const country = countries[this.state.countryIndex];
        const business = businesses[this.state.categoryIndex];
        const body = {
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
        log('Sign Up Body: ', body);
        const { authActions } = this.props;
        authActions.signUp(this.props, body);
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
            <KeyboardAvoidingView style={{ flex: 1 }}>
                <ScrollView style={{ paddingHorizontal: 16, flex: 1 }}>
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
                    <OutlinedTextField
                        label='First Name'
                        keyboardType='default'
                        returnKeyType='next'
                        lineWidth={1}
                        title='*required'
                        ref={this.firstNameRef}
                        error={this.state.firstNameError}
                        onChange={event => this.resetAllError()}
                        onSubmitEditing={() => focusField(this.lastNameRef)} />
                    <OutlinedTextField
                        label='Last Name'
                        keyboardType='default'
                        returnKeyType='next'
                        lineWidth={1}
                        title='*required'
                        ref={this.lastNameRef}
                        error={this.state.lastNameError}
                        onChange={event => this.resetAllError()}
                        onSubmitEditing={() => focusField(this.emailRef)} />
                    <OutlinedTextField
                        label='Email'
                        keyboardType='email-address'
                        returnKeyType='next'
                        lineWidth={1}
                        title='*required'
                        ref={this.emailRef}
                        error={this.state.emailError}
                        onChange={event => this.resetAllError()}
                        onSubmitEditing={() => focusField(this.passwordRef)} />
                    <OutlinedTextField
                        label='Password'
                        keyboardType='default'
                        returnKeyType='next'
                        lineWidth={1}
                        secureTextEntry={true}
                        title='*required'
                        ref={this.passwordRef}
                        error={this.state.passwordError}
                        onChange={event => this.resetAllError()}
                        onSubmitEditing={() => focusField(this.businessNameRef)} />
                    <OutlinedTextField
                        label='Business Name'
                        keyboardType='name-phone-pad'
                        returnKeyType='done'
                        lineWidth={1}
                        secureTextEntry={true}
                        title='*required'
                        error={this.state.businessNameError}
                        onChange={event => this.resetAllError()}
                        ref={this.businessNameRef}
                    />
                    {this.renderBusinessCategory()}
                    {this.renderCountry()}
                    {this.renderBusinessType()}
                    <OutlinedTextField
                        label='Phone'
                        keyboardType='number-pad'
                        returnKeyType='done'
                        lineWidth={1}
                        error={this.state.phoneError}
                        ref={this.phoneNumberRef}
                        onChange={event => this.resetAllError()}
                    />
                    <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', marginTop: 12 }}>
                        <Text style={{ fontSize: 10 }}>By Signing up you are agreeing with Tax Go</Text>
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
                                color: 'red',
                                fontSize: 11,
                                alignSelf: 'center'
                            }}>Resolve All Error First!</Text> : null}
                    <RaisedTextButton
                        title='Sign Up'
                        color={colorAccent}
                        titleColor='white'
                        style={styles.materialBtn}
                        onPress={this.validateAndSignUp} />
                    <View style={{ flexDirection: 'row', marginVertical: 18, alignItems: 'center' }}>
                        <View style={{ backgroundColor: 'rgba(0,0,0,0.1)', flex: 0.5, height: 1 }} />
                        <Text style={{ paddingHorizontal: 24, fontSize: 16 }}>OR</Text>
                        <View style={{ backgroundColor: 'rgba(0,0,0,0.1)', flex: 0.5, height: 1 }} />
                    </View>
                    <FBLoginButton
                        onSuccess={accessToken => { }}
                        onError={() => { }} />
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
                    <ProgressDialog visible={auth.loading} />
                </ScrollView>
            </KeyboardAvoidingView>

        </SafeAreaView>
    }
}
const styles = StyleSheet.create({
    materialBtn: {
        padding: 26,
        marginTop: 15,
        fontSize: 50
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