import React, { Component } from 'react';
import { tabBackgroundColor, tabSelectedColor } from '../../theme/Color';
import { appFontBold } from '../../helpers/ViewHelper';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

class TabLayout extends Component {

    Tab = createMaterialTopTabNavigator();
    render() {
        const { tab } = this.props;
        return (
            <tab.Navigator
                tabBarOptions={{
                    scrollEnabled: true,
                    activeTintColor: tabSelectedColor,
                    labelStyle: {
                        fontFamily: appFontBold,
                        fontSize: 16,
                        textTransform: 'capitalize'
                    },
                    style: { backgroundColor: tabBackgroundColor },
                    showLabel: true,
                    showIcon: true,
                    indicatorStyle: { backgroundColor: tabSelectedColor }
                }}
                lazy={true}
                {...this.props} />
        )
    }
}
export default TabLayout;