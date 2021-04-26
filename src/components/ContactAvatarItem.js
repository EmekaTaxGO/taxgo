import { get } from 'lodash';
import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { appFontBold } from '../helpers/ViewHelper';
import AppText from './AppText';
import ContactAvatar from './ContactAvatar';
import Title from '../components/item/Title';
import SubTitle from '../components/item/SubTitle';
class ContactAvatarItem extends Component {

    shouldComponentUpdate(newProps, nextState) {
        return newProps.title !== this.props.title
            || newProps.subtitle !== this.props.subtitle
            || newProps.description !== this.props.description;
    }

    render() {
        const color = get(this.props, 'color', '#000000');
        const text = get(this.props, 'text', '');
        const clickable = get(this.props, 'clickable', false);
        const { title, subtitle, description, onPress } = this.props;
        return (
            <TouchableOpacity
                style={styles.container}
                onPress={onPress}
                disabled={!clickable}
            >
                <ContactAvatar
                    color={color}
                    text={text}
                />
                <View style={styles.content}>
                    {title ? <Title>{title}</Title> : null}
                    {subtitle ? <SubTitle style={styles.subtitle}>{subtitle}</SubTitle> : null}
                    {description ? <AppText style={styles.description}>{description}</AppText> : null}
                </View>
            </TouchableOpacity>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: 'white',
        paddingHorizontal: 16,
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomColor: 'lightgray',
        borderBottomWidth: 1
    },
    content: {
        flexDirection: 'column',
        paddingStart: 16,
        flex: 1
    },
    subtitle: {
        marginTop: 2
    },
    description: {
        fontSize: 14,
        color: 'gray',
        marginTop: 2
    }
})
export default ContactAvatarItem;