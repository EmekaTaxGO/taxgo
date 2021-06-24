import React from 'react';
import { FlatList, View } from 'react-native';
import FormProgress from './FormProgress';
const TaxForm = props => {

    const renderItem = ({ item, index }) => {
        

    }
    return (
        <View style={{ flexDirection: 'column' }}>
            <FormProgress
                data={props.tabs}
                currPosition={props.currentTab}
            />
            <FlatList
                data={props.tabs[props.currentTab]}
                keyExtractor={(item, index) => item.label}
                renderItem={renderItem}
            />
        </View>
    )
}
export default TaxForm