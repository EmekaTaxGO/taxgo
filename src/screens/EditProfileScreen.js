import React, { useEffect, Component } from 'react';
import { View, StyleSheet, Text, AppState, KeyboardAvoidingView, Image, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import ImageView from '../components/ImageView';
import AppButton from '../components/AppButton';
import { RaisedButton, RaisedTextButton } from 'react-native-material-buttons';
import { colorAccent } from '../theme/Color';
import { connect } from 'react-redux';
import * as profileActions from '../redux/actions/profileActions';
import { bindActionCreators } from 'redux';
import { setFieldValue, getFieldValue } from '../helpers/TextFieldHelpers'
import OnScreenSpinner from '../components/OnScreenSpinner';
import FullScreenError from '../components/FullScreenError';
import ProgressDialog from '../components/ProgressDialog';
import { isInteger, isEmpty } from '../helpers/Utils';
import { API_ERROR_MESSAGE } from '../constants/appConstant';
import AppTextField from '../components/AppTextField';
import { Picker } from '@react-native-community/picker';
import AppPicker from '../components/AppPicker';
import Store from '../redux/Store';

class EditProfileScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            businessTypeIndex: 0,
            businessType: ['Select Business Type',
                'Limited Company',
                'Partnership',
                'Trader'],
            categoryIndex: 0,
            countryIndex: 0
        }
    }

    firstNameRef = React.createRef();
    lastNameRef = React.createRef();
    emailRef = React.createRef();
    businessNameRef = React.createRef();
    phoneRef = React.createRef();
    businessTypeRef = React.createRef();
    regNumRef = React.createRef();

    shouldComponentUpdate(newProps, newState) {
        const { profile: newProfile } = newProps;
        const { profile: oldProfile } = this.props;
        return newProfile.fetchingPreEditProfile !== oldProfile.fetchingPreEditProfile
            || newProfile.editProfileProgress !== oldProfile.editProfileProgress
            //State Change
            || newState.businessTypeIndex !== this.state.businessTypeIndex
            || newState.categoryIndex !== this.state.categoryIndex
            || newState.countryIndex !== this.state.countryIndex;
    }
    componentDidUpdate(oldProps, oldState) {
        const { profile: newProfile } = this.props;
        const { profile: oldProfile } = oldProps;
        if (!newProfile.fetchingPreEditProfile && oldProfile.fetchingPreEditProfile
            && newProfile.fetchPreEditProfileError === undefined) {
            this.setFieldData(newProfile.profile);
        }
    }

    UNSAFE_componentWillUpdate(newProps, newState) {
        const { profile: newProfile } = newProps;
        const { profile: oldProfile } = this.props;
        if (!newProfile.fetchingPreEditProfile && oldProfile.fetchingPreEditProfile
            && newProfile.fetchPreEditProfileError === undefined) {

            let categoryIndex = 0;
            let countryIndex = 0;
            let businessTypeIndex = 0;

            //Business category Pre-fill
            if (isInteger(newProfile.profile.bcategory)) {
                for (let i = 0; i < newProfile.businesses.length; i++) {
                    const value = newProfile.businesses[i];
                    if (newProfile.profile.bcategory === `${value.id}`) {
                        categoryIndex = i;
                        break;
                    }
                }
            }
            //Currency category
            if (isInteger(newProfile.profile.country)) {
                for (let i = 0; i < newProfile.countries.length; i++) {
                    const value = newProfile.countries[i];
                    if (newProfile.profile.country === `${value.id}`) {
                        countryIndex = i;
                        break;
                    }
                }
            }
            //Business Type
            if (!isEmpty(newProfile.profile.btype)) {
                for (let i = 0; i < this.state.businessType.length; i++) {
                    const value = this.state.businessType[i];
                    if (newProfile.profile.btype === value) {
                        businessTypeIndex = i;
                        break;
                    }
                }
            }

            this.setState({
                categoryIndex: categoryIndex,
                countryIndex: countryIndex,
                businessTypeIndex: businessTypeIndex
            });
        }
    }
    componentDidMount() {
        this.prefetchForEditProfile();
    }

    prefetchForEditProfile = () => {
        const { profileActions } = this.props;
        profileActions.prefetchForEditProfile();
    }

    setFieldData = (profile) => {
        setFieldValue(this.firstNameRef, profile.firstname);
        setFieldValue(this.lastNameRef, profile.lastname);
        setFieldValue(this.emailRef, profile.email);
        setFieldValue(this.businessNameRef, profile.bname);
        setFieldValue(this.phoneRef, profile.phonenumber);
        setFieldValue(this.regNumRef, profile.registerno);
    }

    renderBusinessCategory = () => {

        const { businesses } = this.props.profile;
        const selectedCategory = businesses[this.state.categoryIndex].btitle;
        return <View style={{ flexDirection: 'column', marginTop: 12 }}>
            <Text style={{ fontSize: 15 }}>Business Category</Text>
            <AppPicker
                selectedValue={selectedCategory}
                mode='dropdown'
                onValueChange={(itemValue, itemIndex) => this.setState({ categoryIndex: itemIndex })}>

                {businesses.map((value, index) => <Picker.Item
                    label={value.btitle} value={value.btitle} key={`${index}`} />)}
            </AppPicker>
        </View>
    }
    countryPickerLabel = value => {
        return value.country_code ? `${value.currency} (${value.country_code})`
            : value.currency;
    }

    renderCountry = () => {
        const { countries } = this.props.profile;
        const selectedCountry = countries[this.state.countryIndex].currency;
        return <View style={{ flexDirection: 'column', marginTop: 12 }}>
            <Text style={{ fontSize: 15 }}>Currency</Text>
            <AppPicker
                selectedValue={selectedCountry}
                mode='dropdown'
                onValueChange={(itemValue, itemIndex) => this.setState({ countryIndex: itemIndex })}>

                {countries.map((value, index) => <Picker.Item
                    label={this.countryPickerLabel(value)} value={value.currency} key={`${value.id}`} />)}
            </AppPicker>

        </View>
    }

    renderBusinessType = () => {
        const selectedBType = this.state.businessType[this.state.businessTypeIndex];
        return <View style={{ flexDirection: 'column', marginTop: 20 }}>
            <Text style={{ fontSize: 15 }}>Business Type</Text>
            <AppPicker
                selectedValue={selectedBType}
                mode='dropdown'
                onValueChange={(itemValue, itemIndex) => this.setState({ businessTypeIndex: itemIndex })}>

                {this.state.businessType.map((value, index) => <Picker.Item
                    label={value} value={value} key={value} />)}
            </AppPicker>
        </View>
    }

    onUpdatePress = () => {
        const { profileActions } = this.props;
        const { profile } = this.props;
        const { businessTypeIndex, businessType } = this.state;
        const { authData } = Store.getState().auth;
        const body = {
            ...this.props.profile.profile,
            userid: authData.id,
            firstname: getFieldValue(this.firstNameRef),
            lastname: getFieldValue(this.lastNameRef),
            email: getFieldValue(this.emailRef),
            bname: getFieldValue(this.businessNameRef),
            phonenumber: getFieldValue(this.phoneRef),
            bcategory: `${profile.businesses[this.state.categoryIndex].id}`,
            country: `${profile.countries[this.state.countryIndex].id}`,
            btype: businessTypeIndex === 0 ? '' : businessType[businessTypeIndex],
            registerno: getFieldValue(this.regNumRef)
        };
        profileActions.updateProfile(body, this.onErrorEditProfile,
            this.onSuccessEditProfile);
    }

    onErrorEditProfile = () => {
        Alert.alert('Alert', API_ERROR_MESSAGE);
    }

    onSuccessEditProfile = (data) => {
        Alert.alert('Alert', data.message, [
            {
                style: 'default',
                text: 'OK',
                onPress: () => { this.props.navigation.goBack() }
            }
        ], { cancelable: false });
    }

    render() {
        const { profile } = this.props;
        if (profile.fetchingPreEditProfile) {
            return <OnScreenSpinner />
        }
        if (profile.fetchPreEditProfileError) {
            return <FullScreenError tryAgainClick={this.prefetchForEditProfile} />
        }
        return <KeyboardAvoidingView
            style={{
                flex: 1,
                flexDirection: 'column'
            }}>
            <ScrollView style={{ paddingHorizontal: 20 }}>
                <Image
                    style={{
                        width: 100,
                        height: 100,
                        borderRadius: 50,
                        borderWidth: 2,
                        borderColor: 'lightgray',
                        margin: 20,
                        alignSelf: 'center'
                    }}
                    source={require('../assets/product.png')}
                />
                <AppTextField
                    containerStyle={styles.textFieldContainerStyle}
                    label='First Name'
                    keyboardType='name-phone-pad'
                    returnKeyType='next'
                    // error={this.state.emailError}
                    fieldRef={this.firstNameRef}
                    lineWidth={1}
                    onSubmitEditing={() => { this.lastNameRef.current.focus() }} />
                <AppTextField
                    containerStyle={styles.textFieldContainerStyle}
                    label='Last Name'
                    keyboardType='name-phone-pad'
                    returnKeyType='next'
                    // error={this.state.emailError}
                    fieldRef={this.lastNameRef}
                    lineWidth={1}
                    style={{ marginTop: 100 }}
                    onSubmitEditing={() => { this.emailRef.current.focus() }} />
                <AppTextField
                    containerStyle={styles.textFieldContainerStyle}
                    label='Email'
                    keyboardType='email-address'
                    returnKeyType='next'
                    // error={this.state.emailError}
                    fieldRef={this.emailRef}
                    lineWidth={1}
                    onSubmitEditing={() => { this.businessNameRef.current.focus() }} />
                <AppTextField
                    containerStyle={styles.textFieldContainerStyle}
                    label='Business Name'
                    keyboardType='name-phone-pad'
                    returnKeyType='next'
                    // error={this.state.emailError}
                    fieldRef={this.businessNameRef}
                    lineWidth={1}
                    onSubmitEditing={() => { this.phoneRef.current.focus() }} />
                <AppTextField
                    containerStyle={styles.textFieldContainerStyle}
                    label='Phone Number'
                    keyboardType='phone-pad'
                    returnKeyType='next'
                    // error={this.state.emailError}
                    fieldRef={this.phoneRef}
                    lineWidth={1}
                    onSubmitEditing={() => { this.businessTypeRef.current.focus() }} />
                {this.renderBusinessCategory()}
                {this.renderCountry()}
                {this.renderBusinessType()}
                <AppTextField
                    containerStyle={styles.textFieldContainerStyle}
                    label='Registration Number'
                    keyboardType='numbers-and-punctuation'
                    returnKeyType='next'
                    // error={this.state.emailError}
                    fieldRef={this.regNumRef}
                    lineWidth={1}
                    onSubmitEditing={() => { this.countryRef.current.focus() }} />
                <AppButton
                    title='Update'
                    onPress={this.onUpdatePress}
                />
            </ScrollView>
            <ProgressDialog visible={profile.editProfileProgress} />
        </KeyboardAvoidingView >
    }
}
const styles = StyleSheet.create({
    updateBtn: {
        padding: 26,
        marginVertical: 20
    },
    textFieldContainerStyle: {
        marginTop: 20
    }
});
export default connect(
    state => ({
        profile: state.profile
    }),
    dispatch => ({
        profileActions: bindActionCreators(profileActions, dispatch)
    })
)(EditProfileScreen);