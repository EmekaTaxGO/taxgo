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
    Linking
} from 'react-native';
import { colorPrimary, colorAccent } from '../theme/Color';
import OnScreenSpinner from '../components/OnScreenSpinner';
import FullScreenError from '../components/FullScreenError';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ProgressDialog from '../components/ProgressDialog';


import * as authActions from '../redux/actions/authActions';
import { TextField } from 'react-native-material-textfield';
import { focusField } from '../helpers/TextFieldHelpers';
import { RaisedTextButton } from 'react-native-material-buttons';
import FBLoginButton from '../components/FBLoginButton';
import { TERMS_AND_CONDITION_URL, PRIVACY_POLICY_URL } from '../constants/appConstant';

class SignUpScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            categoryIndex: 0,
            countryIndex: 0
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

    loginClick = () => {
        this.props.navigation.navigate('LoginScreen');
    }

    onTermsConditionClick = () => {
        Linking.openURL(TERMS_AND_CONDITION_URL);
    }
    onPrivacyPolicyClick = () => {
        Linking.openURL(PRIVACY_POLICY_URL);
    }

    render() {
        const { auth } = this.props;

        if (auth.fetchingSignupDetails) {
            return <OnScreenSpinner />
        }
        if (auth.fetchSignupDetailsError) {
            return <FullScreenError tryAgainClick={this.fetchRenderInfo} />
        }
        return <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView style={{ flex: 1 }}>
                <ScrollView style={{ paddingHorizontal: 16, flex: 1 }}>
                    <TextField
                        label='First Name'
                        keyboardType='default'
                        returnKeyType='next'
                        lineWidth={1}
                        title='*required'
                        ref={this.firstNameRef}
                        onSubmitEditing={() => focusField(this.lastNameRef)} />
                    <TextField
                        label='Last Name'
                        keyboardType='default'
                        returnKeyType='next'
                        lineWidth={1}
                        title='*required'
                        ref={this.lastNameRef}
                        onSubmitEditing={() => focusField(this.emailRef)} />
                    <TextField
                        label='Email'
                        keyboardType='email-address'
                        returnKeyType='next'
                        lineWidth={1}
                        title='*required'
                        ref={this.emailRef}
                        onSubmitEditing={() => focusField(this.passwordRef)} />
                    <TextField
                        label='Password'
                        keyboardType='default'
                        returnKeyType='next'
                        lineWidth={1}
                        secureTextEntry={true}
                        title='*required'
                        ref={this.passwordRef}
                        onSubmitEditing={() => focusField(this.businessNameRef)} />
                    <TextField
                        label='Business Name'
                        keyboardType='name-phone-pad'
                        returnKeyType='done'
                        lineWidth={1}
                        secureTextEntry={true}
                        title='*required'
                        ref={this.businessNameRef}
                    />
                    {this.renderBusinessCategory()}
                    {this.renderCountry()}
                    <TextField
                        label='Phone'
                        keyboardType='phone-pad'
                        returnKeyType='done'
                        lineWidth={1}
                        ref={this.phoneNumberRef}
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
                    <RaisedTextButton
                        title='Sign Up'
                        color={colorAccent}
                        titleColor='white'
                        style={styles.materialBtn}
                        onPress={() => console.log('Pressed!')} />
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