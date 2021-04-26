import React, { Component } from 'react';
import { appFont, appFontBold } from '../../helpers/ViewHelper';
import { tabBackgroundColor, tabColor, tabSelectedColor } from '../../theme/Color';
class BottomTabLayout extends Component {


    render() {
        const { tab } = this.props;
        return (
            <tab.Navigator
                lazy={true}
                tabBarOptions={{
                    showLabel: true,
                    activeTintColor: tabSelectedColor,
                    inactiveTintColor: tabColor,
                    labelStyle: {
                        fontSize: 17,
                        fontFamily: appFont
                    },
                    labelPosition: 'below-icon',
                    style: { backgroundColor: tabBackgroundColor, paddingVertical: 6 }
                }}
                {...this.props} />
        )
    }
}
export default BottomTabLayout;