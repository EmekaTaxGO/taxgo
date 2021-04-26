import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { appFontBold } from '../helpers/ViewHelper';
import AppImage from './AppImage';
import AppText from './AppText';
import ImagePicker from 'react-native-image-picker';
import { DEFAULT_PICKER_OPTIONS } from '../helpers/Utils';

class ImagePickerView extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    sheetRef = React.createRef();

    // pickFromCamera = async () => {
    //     const hasPermission = await permissionHelper.hasCameraAccess();
    //     if (hasPermission) {

    //     }
    // }
    // pickFromGallery = () => {

    // }
    // handlePick = index => {
    //     if (index === 0) {
    //         this.pickFromCamera();
    //     } else if (index === 1) {
    //         this.pickFromGallery();
    //     }
    // }
    onPressUpload = () => {
        ImagePicker.showImagePicker(DEFAULT_PICKER_OPTIONS, callback => {
            if (callback.uri) {
                const { onChange } = this.props;
                onChange(callback.uri);
            }
        })
    }
    render() {
        const { url } = this.props;
        return (
            <View style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 12
            }}>
                <AppImage
                    style={styles.image}
                    url={url}
                    placeholderColor='white'
                />
                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 4,
                        backgroundColor: '#e0e0e0',
                        marginTop: 12,
                        paddingHorizontal: 12,
                        paddingVertical: 6
                    }}
                    onPress={this.onPressUpload}>
                    <Icon size={30} color='black' name='camera-alt' />
                    <AppText style={styles.upload}>Upload</AppText>
                </TouchableOpacity>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#bdbdbd',
        borderWidth: 1,
        borderColor: 'lightgray'
    },
    upload: {
        fontFamily: appFontBold,
        fontSize: 20,
        marginLeft: 12
    }
})
export default ImagePickerView;