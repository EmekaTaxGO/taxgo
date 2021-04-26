import React, { Component } from 'react';
import {
    Modal,
    Platform,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback
} from 'react-native';
class BottomSheet extends Component {

    render() {
        const { visible, onPressOutside } = this.props;
        return (
            <Modal
                animationType='slide'
                visible={visible}
                transparent={true}>
                <TouchableOpacity style={styles.modalChild}
                    onPress={onPressOutside}>
                    <TouchableWithoutFeedback>
                        {this.props.children}
                    </TouchableWithoutFeedback>
                </TouchableOpacity>
            </Modal>
        )
    }
}
const styles = StyleSheet.create({
    modalChild: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.3)'
    },
    bottomSheet: {
        backgroundColor: 'white',
        flexDirection: 'column',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        paddingTop: 12,
        paddingBottom: Platform.select({ ios: 40, android: 12 })
    }
})
export default BottomSheet;