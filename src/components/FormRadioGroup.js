import React from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from './AppText';
import RadioGroup from 'react-native-radio-buttons-group';

const FormRadioGroup = props => {

    const newContainerStyle = {
        ...styles.containerStyle,
        ...props.containerStyle
    }

    return (
        <View style={newContainerStyle}>
            <AppText style={styles.title}>{props.title}</AppText>
            <View style={{ flexDirection: 'row', paddingHorizontal: 6, marginTop: 6 }}>
                <RadioGroup
                    radioButtons={props.options}
                    onPress={props.onPress}
                    layout='row' />
                <View style={{ flex: 1 }} />
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    containerStyle: {
        flexDirection: 'column',
        marginTop: 12
    },
    title: {
        fontSize: 18,
        paddingHorizontal: 16
    }
})
export default FormRadioGroup