import { Picker } from '@react-native-community/picker';
import React, { Component } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AppButton from '../AppButton';
import AppPicker from '../AppPicker';
import AppText from '../AppText';
import AppTextField from '../AppTextField';
import businessHelper from '../../helpers/BusinessHelper';
import { showError, validateEmail } from '../../helpers/Utils';
import { isEmpty } from 'lodash';
import { getFieldValue } from '../../helpers/TextFieldHelpers';
import MultiLineTextField from '../MultiLineTextField';

class BusinessTab extends Component {

    constructor(props) {
        super(props);
        this.state = {
            profile: props.profile,
            categoryIdx: this.getCatIndex(),
            bTypeIdx: this.getBTypeIndex(props.profile.btype)
        }
    }
    bNameRef = React.createRef();
    regNumRef = React.createRef();
    websiteRef = React.createRef();
    bEmailRef = React.createRef();
    bPhoneRef = React.createRef();
    contactRef = React.createRef();
    taxNumRef = React.createRef();
    bAddressRef = React.createRef();
    scrollView = React.createRef();
    businessAddress = React.createRef();

    getBTypeIndex = (bType) => {
        const bTypes = businessHelper.getBusinessTypes();
        for (let i = 0; i < bTypes.length; i++) {
            const element = bTypes[i];
            if (element.value === bType) {
                return i;
            }
        }
        return 0;
    }

    getCatIndex = () => {
        const { businesses, profile } = this.props;

        for (let i = 0; i < businesses.length; i++) {
            const element = businesses[i];
            if (`${element.id}` === profile.bcategory) {
                return i;
            }
        }
        return 0;
    }

    componentDidMount() {

    }

    onChangeText = (key, value) => {
        const { profile } = this.props;
        const newProfile = {
            ...profile,
            [key]: value
        };
        this.setState({ profile: newProfile });
    }




    validateForm = () => {
        const { profile, categoryIdx, bTypeIdx } = this.state;
        const { onSubmit, businesses } = this.props;
        const bTypes = businessHelper.getBusinessTypes();

        const newProfile = {
            ...profile,
            bname: getFieldValue(this.bNameRef),
            registerno: getFieldValue(this.regNumRef),
            website: getFieldValue(this.websiteRef),
            cemail: getFieldValue(this.bEmailRef),
            cphoneno: getFieldValue(this.bPhoneRef),
            cperson: getFieldValue(this.contactRef),
            taxno: getFieldValue(this.taxNumRef),
            // fullAddress: getFieldValue(this.bAddressRef),
            bcategory: `${businesses[categoryIdx].id}`,
            btype: bTypes[bTypeIdx].value
        }
        if (isEmpty(newProfile.bname)) {
            showError('Enter business name.');
        }
        else if (isEmpty(newProfile.cemail)) {
            showError('Enter business email.');
        }
        else if (!validateEmail(newProfile.cemail)) {
            showError('Enter valid business email.');
        }
        else {
            onSubmit(newProfile);
        }
    }

    onChangeAddress = text => {
        this.setState({
            profile: {
                ...this.state.profile,
                fullAddress: text
            }
        });
    }

    scrollTo = ref => {
        setTimeout(() => {
            ref.current.measure((fx, fy, width, height, px, py) => {
                this.scrollView.scrollTo({ y: fy - 20, animated: true });
            })
        }, 300);
    }

    render() {
        const { businesses } = this.props;
        const { categoryIdx, bTypeIdx, profile } = this.state;
        const businessTypes = businessHelper.getBusinessTypes();
        return <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
            <KeyboardAwareScrollView
                style={{ flex: 1 }}
                innerRef={ref => {
                    this.scrollView = ref;
                }}
            >
                <AppTextField
                    label='Business Name'
                    fieldRef={this.bNameRef}
                    containerStyle={styles.textField}
                    value={profile.bname}
                />
                <AppTextField
                    label='Registration Number'
                    fieldRef={this.regNumRef}
                    containerStyle={styles.textField}
                    value={profile.registerno}
                />
                <AppText style={styles.pickerLabel}>Business Category</AppText>
                <AppPicker
                    style={styles.picker}
                    selectedValue={businesses[categoryIdx].btitle}
                    mode='dropdown'
                    onValueChange={(itemValue, itemIndex) => this.setState({ categoryIdx: itemIndex })}>
                    {businesses.map((value, index) => <Picker.Item
                        label={value.btitle} value={value.btitle} key={`${index}`} />)}
                </AppPicker>
                <AppText style={styles.pickerLabel}>Business Type</AppText>
                <AppPicker
                    style={styles.picker}
                    selectedValue={businessTypes[bTypeIdx].value}
                    mode='dropdown'
                    onValueChange={(itemValue, itemIndex) => this.setState({ bTypeIdx: itemIndex })}>
                    {businessTypes.map((value, index) => <Picker.Item
                        label={value.label} value={value.value} key={`${index}`} />)}
                </AppPicker>

                <AppTextField
                    label='Website'
                    fieldRef={this.websiteRef}
                    containerStyle={styles.textField}
                    value={profile.website}
                    keyboardType='url'
                />
                <AppTextField
                    label='Business Email'
                    fieldRef={this.bEmailRef}
                    containerStyle={styles.textField}
                    value={profile.cemail}
                    keyboardType='email-address'
                />
                <AppTextField
                    label='Business Phone'
                    fieldRef={this.bPhoneRef}
                    containerStyle={styles.textField}
                    value={profile.cphoneno}
                    keyboardType='phone-pad'
                />

                <AppTextField
                    fieldRef={this.contactRef}
                    label='Contact Person'
                    containerStyle={styles.textField}
                    value={profile.cperson}
                />
                <AppTextField
                    fieldRef={this.taxNumRef}
                    label='TAX/VAT Number'
                    containerStyle={styles.textField}
                    value={profile.taxno}
                    keyboardType='numeric'
                />
                {/* <AppTextField
                    fieldRef={this.bAddressRef}
                    label='Business Address'
                    containerStyle={styles.textField}
                    inputContainerStyle={styles.addressField2}
                    titleTextStyle={{ backgroundColor: 'black' }}
                    value={profile.fullAddress}
                    multiline={true}
                /> */}

                <MultiLineTextField
                    fieldRef={this.businessAddress}
                    label='Business Address'
                    containerStyle={styles.addressField}
                    value={profile.fullAddress}
                    onChangeText={this.onChangeAddress}
                    onFocus={event => this.scrollTo(this.businessAddress)} />

                <AppButton
                    onPress={this.validateForm}
                    containerStyle={styles.btnStyle}
                    title='Update' />

            </KeyboardAwareScrollView>
        </SafeAreaView>
    }
}
const styles = StyleSheet.create({
    textField: {
        marginHorizontal: 16,
        marginTop: 20
    },
    addressField: {
        marginHorizontal: 16,
        marginTop: 20
    },
    btnStyle: {
        marginHorizontal: 16,
        marginTop: 30
    },
    picker: {
        marginHorizontal: 16
    },
    pickerLabel: {
        paddingHorizontal: 16,
        fontSize: 16,
        color: 'gray',
        paddingVertical: 4,
        marginTop: 12
    }
})
export default BusinessTab;