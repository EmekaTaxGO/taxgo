import React, { useEffect, Component } from 'react';
import { View, StyleSheet, Text, AppState, KeyboardAvoidingView, Image, Picker } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import ImageView from '../components/ImageView';
import { TextField } from 'react-native-material-textfield';
import AppButton from '../components/AppButton';
import { RaisedButton, RaisedTextButton } from 'react-native-material-buttons';
import { colorAccent } from '../theme/Color';
import { connect } from 'react-redux';
import * as authActions from '../redux/actions/authActions';
import { bindActionCreators } from 'redux';
import { setFieldValue } from '../helpers/TextFieldHelpers'
class EditProfileScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            businessTypeIndex: 0,
            businessType: ['Select Business Type', 'Limited Company', 'Partnership', 'Trader']
        }
    }

    firstNameRef = React.createRef();
    lastNameRef = React.createRef();
    emailRef = React.createRef();
    businessNameRef = React.createRef();
    phoneRef = React.createRef();
    businessTypeRef = React.createRef();
    businessCategoryRef = React.createRef();
    regNumRef = React.createRef();
    countryRef = React.createRef();
    taxRef = React.createRef();

    shouldComponentUpdate(newProps, newState) {
        const { auth: newAuth } = newProps;
        const { auth: oldAuth } = this.props;
        return newAuth.updatingProfile !== oldAuth.updatingProfile
            //State Change
            || newState.businessTypeIndex !== this.state.businessTypeIndex;
    }
    componentDidUpdate(oldProps, oldState) {
        const { auth: newAuth } = this.props;
        const { auth: oldAuth } = oldProps;
        if (!newAuth.updatingProfile && oldAuth.updatingProfile && newAuth.profile !== null) {
            this.setFieldData(newAuth.profile);
        }
    }
    componentDidMount() {
        const { auth } = this.props;
        if (auth.profile !== null) {
            this.setFieldData(auth.profile);
        }
    }

    setFieldData = (profile) => {
        setFieldValue(this.firstNameRef, profile.firstname);
        setFieldValue(this.lastNameRef, profile.lastname);
        setFieldValue(this.emailRef, profile.email);
        setFieldValue(this.businessNameRef, profile.bname);
        setFieldValue(this.phoneRef, profile.phonenumber);

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
                {this.renderBusinessType()}
                <TextField
                    label='Business Category'
                    keyboardType='numbers-and-punctuation'
                    returnKeyType='next'
                    // error={this.state.emailError}
                    ref={this.businessCategoryRef}
                    lineWidth={1}
                    onSubmitEditing={() => { this.regNumRef.current.focus() }} />
                <TextField
                    label='Registration Number'
                    keyboardType='numbers-and-punctuation'
                    returnKeyType='next'
                    // error={this.state.emailError}
                    ref={this.regNumRef}
                    lineWidth={1}
                    onSubmitEditing={() => { this.countryRef.current.focus() }} />
                <TextField
                    label='Country'
                    keyboardType='numbers-and-punctuation'
                    returnKeyType='next'
                    // error={this.state.emailError}
                    ref={this.countryRef}
                    lineWidth={1}
                    onSubmitEditing={() => { this.taxRef.current.focus() }} />
                <TextField
                    label='Tax'
                    keyboardType='numbers-and-punctuation'
                    returnKeyType='done'
                    // error={this.state.emailError}
                    ref={this.businessNameRef}
                    lineWidth={1} x
                    onSubmitEditing={() => { }} />
                {/* <AppButton onPress={() => { }}
                    title='Update'
                    style={styles.updateBtn} /> */}
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
        auth: state.auth
    }),
    dispatch => ({
        authActions: bindActionCreators(authActions, dispatch)
    })
)(EditProfileScreen);