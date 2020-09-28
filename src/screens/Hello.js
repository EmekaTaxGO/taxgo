import React, { useEffect } from 'react';
import { connect } from 'react-redux';
const { View, Text } = require("react-native")

const Hello = (props) => {


    useEffect(() => {
        console.log('Props', JSON.stringify(props));
    }, [])

    return <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center',alignItems:'center' }}>
        <Text>Hello IsReact Native!</Text>
    </View>
}
export default connect(
    state => ({
        auth: state.auth
    })
)(Hello);