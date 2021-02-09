import React, { Component } from 'react';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import EntypoIcon from 'react-native-vector-icons/Entypo';
class InAppIcon extends Component {

    getIcon = (icon, iconType, color, size) => {
        switch (iconType) {
            case 'FontAwesome5':
                return <FontAwesome5Icon name={icon} color={color} size={size} />;
            case 'Entypo':
                return <EntypoIcon name={icon} color={color} size={size} />;
            case 'FontAwesome':
                return <FontAwesomeIcon name={icon} color={color} size={size} />;
            default:
                return <MaterialIcons name={icon} color={color} size={size} />;
        }
    }
    render() {
        const { icon, iconType, color, size } = this.props;
        return this.getIcon(icon, iconType, color, size);
    }
}
export default InAppIcon;