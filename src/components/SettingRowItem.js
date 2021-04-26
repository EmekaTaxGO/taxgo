import { get, isEmpty } from 'lodash';
import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { appFontBold } from '../helpers/ViewHelper';
import AppText from './AppText';
import Divider from './Divider';
class SettingRowItem extends Component {


    render() {
        const {
            bgColor,
            iconColor,
            iconName,
            label,
            text,
            hasUnread,
            onPress,
            hideDivider
        } = this.props;
        const labelColor = get(this.props, 'labelColor', 'black');
        return (
            <TouchableOpacity style={{ flexDirection: 'column' }} onPress={onPress}>

                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: 'white',
                    paddingVertical: 12
                }}>
                    <View style={{
                        backgroundColor: bgColor,
                        borderRadius: 12,
                        padding: 5,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginStart: 16
                    }}>
                        <Icon name={iconName} size={30} color={iconColor} />
                    </View>
                    <AppText style={[styles.label, { color: labelColor }]}>{label}</AppText>
                    {!isEmpty(text) ? <AppText style={styles.text}>{text}</AppText> : null}
                    <Icon name='keyboard-arrow-right'
                        size={30}
                        color='gray'
                        style={{ marginEnd: 16 }} />
                </View>
                {!hideDivider ? <Divider style={{ marginHorizontal: 16 }} /> : null}
            </TouchableOpacity>
        )
    }
}
const styles = StyleSheet.create({
    label: {
        color: 'black',
        fontFamily: appFontBold,
        fontSize: 16,
        flex: 1,
        paddingStart: 14,
        textTransform: 'capitalize'
    },
    text: {
        fontSize: 15,
        color: 'gray'
    }
});
export default SettingRowItem;