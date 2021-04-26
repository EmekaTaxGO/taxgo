import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import CardView from 'react-native-cardview';
import AntIcon from 'react-native-vector-icons/AntDesign';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';

const SearchView = ({
    value,
    onChangeQuery,
    onCrossPress,
    placeholder }) => {


    const renderCross = () => {
        return (value && value.length > 0)
            ? <TouchableOpacity
                onPress={onCrossPress}>
                < AntIcon name='close' size={24} color='black' />
            </TouchableOpacity>
            : null

    }
    return <CardView
        cardElevation={4}
        cornerRadius={6}
        style={styles.card}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <AntIcon name='search1' size={24} />
            <TextInput
                value={value}
                autoCorrect={false}
                keyboardType='default'
                placeholder={placeholder}
                onChangeText={text => onChangeQuery(text)}
                style={{
                    flex: 1,
                    fontSize: 16,
                    marginStart: 12,
                }}
            />
            {renderCross()}
        </View>
    </CardView>
}
const styles = StyleSheet.create({
    card: {
        marginHorizontal: 8,
        marginVertical: 12,
        paddingHorizontal: 12,
        backgroundColor: 'white',
        paddingVertical: Platform.select({ ios: 12, android: 0 })
    }
});
export default SearchView;