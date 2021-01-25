import React, { Component } from 'react';
import { StyleSheet, TouchableHighlight, View, Text } from 'react-native';
import { colorPrimary, tabSelectedColor } from '../theme/Color';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import EntypoIcon from 'react-native-vector-icons/Entypo';

class AppTab extends Component {

    getIcon = (icon, iconType, color) => {
        if (icon === undefined) {
            return null
        }
        if (iconType === undefined) {
            return <MaterialIcon name={icon} size={24} color={color} />
        }
        switch (iconType) {
            case 'FontAwesome5Icon':
                return <FontAwesome5Icon name={icon} size={24} color={color} />;
            case 'MaterialCommunityIcons':
                return <MaterialCommunityIcons name={icon} size={24} color={color} />;
            case 'EntypoIcon':
                return <EntypoIcon name={icon} size={24} color={color} />;
            default:
                return <MaterialIcon name={icon} size={24} color={color} />;
        }

    }

    render() {
        const { title, onTabPress, icon, iconType, selected } = this.props;
        return <TouchableHighlight style={{
            flex: 1,
            backgroundColor: colorPrimary,
            paddingVertical: icon ? 6 : 13,
            borderBottomWidth: selected ? 2 : 0,
            borderBottomColor: tabSelectedColor,
        }}
            onPress={onTabPress}
            underlayColor={colorPrimary}>
            <View style={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {this.getIcon(icon, iconType, selected ? tabSelectedColor : 'white')}
                <Text style={{
                    color: selected ? tabSelectedColor : 'white',
                    fontSize: 14
                }}>{title}</Text>
            </View>
        </TouchableHighlight>
    }
}
const styles = StyleSheet.create({

});
export default AppTab;