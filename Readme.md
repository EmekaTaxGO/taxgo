#1 Remove MaterialTextField userNative Driver warning
Go to /Users/Karan/Projects/taxgo-mobile/node_modules/react-native-material-textfield/src/components/field/index.js & in function startFocusAnimation in options object add 
"useNativeDriver: false"

#2 Image Upload View
<ImagePickerView
    url={profile.localUri}
    onChange={this.onChangeProfile}
    />

#3 AppDatePicker
<AppDatePicker
    showDialog={this.state.showDobDialog}
    date={this.state.dob}
    containerStyle={styles.textField}
    textFieldProps={{
        label: `Title`,
        fieldRef: this.dobRef
    }}
    readFormat='DD/MM/YYYY'
    displayFormat='DD MMM, YYYY HH:MM A'
    pickerProps={{
        mode: `datetime`,
        display: `default`
    }}
    onChange={this.onChangeDob}
    />