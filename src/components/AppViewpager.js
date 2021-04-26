import React, { useState } from 'react';
import { View, ScrollView, Text } from 'react-native';
import ViewPager from '@react-native-community/viewpager';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { errorColor } from '../theme/Color';
const AppViewPager = ({
    defaultTab = 0,
    pageCount,
    renderTab,
    renderPage,
    onTabSelected
}) => {

    const indexes = [];
    for (let index = 0; index < pageCount; index++) {
        indexes.push(index);
    }

    console.log('Indexes: ', indexes);
    const viewPager = React.createRef();
    return <View style={{ flexDirection: 'column', flex: 1 }}>
        <View style={{ height: 40, backgroundColor: errorColor }}>
            <ScrollView
                horizontal={true}>
                {indexes.map((value, index) => renderTab(index, selectedTab))}
            </ScrollView>
        </View>

        <ViewPager
            style={{ flex: 1 }}
            initialPage={selectedTab}
            fieldRef={viewPager}>
            {indexes.map((value, index) => renderPage(index, selectedTab))}
        </ViewPager>
    </View>
}
export default AppViewPager;