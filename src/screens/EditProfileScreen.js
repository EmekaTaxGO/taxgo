import React, { useEffect, Component } from 'react';
import { View, StyleSheet, Text, AppState, KeyboardAvoidingView, Image, Picker } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import ImageView from '../components/ImageView';
import { TextField } from 'react-native-material-textfield';
import AppButton from '../components/AppButton';
import { RaisedButton, RaisedTextButton } from 'react-native-material-buttons';
import { colorAccent } from '../theme/Color';
import { connect } from 'react-redux';
import * as profileActions from '../redux/actions/profileActions';
import { bindActionCreators } from 'redux';
import { setFieldValue } from '../helpers/TextFieldHelpers'
import OnScreenSpinner from '../components/OnScreenSpinner';
import FullScreenError from '../components/FullScreenError';

class EditProfileScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            businessTypeIndex: 0,
            businessType: ['Select Business Type',
                'Limited Company',
                'Partnership',
                'Trader',
                'Health Care'],
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
            || newState.businessTypeIndex !== this.state.businessTypeIndex;
    }
    componentDidUpdate(oldProps, oldState) {
        const { profile: newProfile } = this.props;
        const { profile: oldProfile } = oldProps;
        if (!newProfile.fetchingPreEditProfile && oldProfile.fetchingPreEditProfile
            && newProfile.fetchPreEditProfileError === undefined) {
            this.setFieldData(newProfile.profile);
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
        console.log('Profile: ', profile);
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
        const { countries } = this.props.profile;
        const selectedCountry = countries[this.state.countryIndex].currency;
        return <View style={{ flexDirection: 'column', marginTop: 12 }}>
            <Text style={{ fontSize: 15 }}>Currency</Text>
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
        return <View style={{ flexDirection: 'column', marginTop: 20 }}>
            <Text style={{ fontSize: 15 }}>Business Type</Text>
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
            }
            }>
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
                <TextField
                    label='First Name'
                    keyboardType='name-phone-pad'
                    returnKeyType='next'
                    // error={this.state.emailError}
                    ref={this.firstNameRef}
                    lineWidth={1}
                    onSubmitEditing={() => { this.lastNameRef.current.focus() }} />
                <TextField
                    label='Last Name'
                    keyboardType='name-phone-pad'
                    returnKeyType='next'
                    // error={this.state.emailError}
                    ref={this.lastNameRef}
                    lineWidth={1}
                    onSubmitEditing={() => { this.emailRef.current.focus() }} />
                <TextField
                    label='Email'
                    keyboardType='email-address'
                    returnKeyType='next'
                    // error={this.state.emailError}
                    ref={this.emailRef}
                    lineWidth={1}
                    onSubmitEditing={() => { this.businessNameRef.current.focus() }} />
                <TextField
                    label='Business Name'
                    keyboardType='name-phone-pad'
                    returnKeyType='next'
                    // error={this.state.emailError}
                    ref={this.businessNameRef}
                    lineWidth={1}
                    onSubmitEditing={() => { this.phoneRef.current.focus() }} />
                <TextField
                    label='Phone Number'
                    keyboardType='phone-pad'
                    returnKeyType='next'
                    // error={this.state.emailError}
                    ref={this.phoneRef}
                    lineWidth={1}
                    onSubmitEditing={() => { this.businessTypeRef.current.focus() }} />
                {this.renderBusinessCategory()}
                {this.renderCountry()}
                {this.renderBusinessType()}
                <TextField
                    label='Registration Number'
                    keyboardType='numbers-and-punctuation'
                    returnKeyType='next'
                    // error={this.state.emailError}
                    ref={this.regNumRef}
                    lineWidth={1}
                    onSubmitEditing={() => { this.countryRef.current.focus() }} />
                <RaisedTextButton
                    title='Update'
                    color={colorAccent}
                    titleColor='white'
                    style={styles.updateBtn}
                    onPress={() => { console.log('Raised btn clicked!') }}
                />
            </ScrollView>
        </KeyboardAvoidingView >
    }
}
const styles = StyleSheet.create({
    updateBtn: {
        padding: 26,
        marginVertical: 20
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