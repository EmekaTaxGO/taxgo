import React, { Component } from 'react';
import { View } from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';

class ScanBarcodeScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    onReadQRCode = ({ data, type }) => {
        this.props.route.params.onBarCodeScanned(data);
        this.props.navigation.goBack();
    }

    render() {
        return <View style={{
            flex: 1,
            backgroundColor: 'black',
            flexDirection: 'column'
        }}>
            <QRCodeScanner
                onRead={this.onReadQRCode}
                showMarker={true}
                cameraProps={{ autoFocus: true }} />
        </View>
    }
};
export default ScanBarcodeScreen;