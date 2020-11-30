import React from 'react';
import { StyleSheet, View, TouchableHighlight, Text } from 'react-native';
import { tabBackgroundColor, tabIndicatorColor, tabSelectedColor } from '../theme/Color';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const AppTab = ({
    label,
    icon = null,
    iconType = null,
    onSelected,
    isSelected = false
}) => {

    const getIcon = () => {
        if (icon === null) {
            return null;
        } else if (iconType === null) {
            return <FeatherIcon name={icon} size={30} color={isSelected ? tabSelectedColor : 'white'} />
        }
        switch (iconType) {
            case 'material':
                return <MaterialIcon name={icon} size={30} color={isSelected ? tabSelectedColor : 'white'} />;
            default:
                return <FeatherIcon name={icon} size={30} color={isSelected ? tabSelectedColor : 'white'} />;
        }
    }
    return <TouchableHighlight
        style={{
            flex: 1,
            backgroundColor: tabBackgroundColor,
            paddingVertical: 8,
            paddingHorizontal: 4,
            borderBottomColor: tabIndicatorColor,
            borderBottomWidth: isSelected ? 4 : 0,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        }}
        onPress={onSelected}
        underlayColor={tabBackgroundColor}
    >
        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
            {getIcon()}
            {(label !== undefined && label.length > 0)
                ? <Text style={{
                    fontWeight: isSelected ? 'bold' : 'normal',
                    fontSize: 18,
                    marginTop: 4,
                    color: isSelected ? tabSelectedColor : 'white'
                }}>
                    {label}</Text> : null}
        </View>
    </TouchableHighlight>
}
const styles = StyleSheet.create({
    tabText: {
        fontSize: 14,

    }
});
export default AppTab;