#1 Remove MaterialTextField userNative Driver warning
Go to /Users/Karan/Projects/taxgo-mobile/node_modules/react-native-material-textfield/src/components/field/index.js & in function startFocusAnimation in options object add 
"useNativeDriver: false"

#2 Image Upload View
<ImagePickerView
    url={profile.localUri}
    onChange={this.onChangeProfile}
                />