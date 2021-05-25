import React, { Component } from 'react';
import { FlatList, Image, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import CardView from 'react-native-cardview';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AppText from '../AppText'
import { colorPrimary } from '../../theme/Color';
import AppButton from '../AppButton';
class CustomizeTab extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pages: this.createInvoicePages(),
            selected: props.profile.defaultinvoice
        }
    }

    componentDidMount() {

    }

    createInvoicePages = () => {
        return [
            {
                id: '1',
                url: 'https://taxgo.s3-eu-west-1.amazonaws.com/taxgo/InvoiceDesign/Invoicev1.png'
            },
            {
                id: '2',
                url: 'https://taxgo.s3-eu-west-1.amazonaws.com/taxgo/InvoiceDesign/Invoicev2.png'
            },
            {
                id: '3',
                url: 'https://taxgo.s3-eu-west-1.amazonaws.com/taxgo/InvoiceDesign/Invoicev3.png'
            }
        ];
    }

    renderInvoice = ({ item, index }) => {

        const selected = item.id === this.state.selected;
        const radioIcon = selected ? 'radio-button-checked' : 'radio-button-off';
        const radioColor = selected ? colorPrimary : 'black';
        return (
            <View style={{ flexDirection: 'column' }}>
                <AppText style={styles.title}>Invoice {index + 1}</AppText>
                <CardView
                    cardElevation={4}
                    cornerRadius={6}
                    style={[styles.card]}>
                    <Image
                        style={styles.image}
                        placeholder='person'
                        source={{ uri: item.url }}
                    />
                </CardView>
                <TouchableOpacity style={{
                    padding: 4,
                    alignSelf: 'center',
                    marginTop: 12
                }}
                    onPress={() => this.setState({ selected: item.id })}>

                    <Icon name={radioIcon} size={30} color={radioColor} />
                </TouchableOpacity>
            </View>
        )
    }
    updateInvoice = () => {
        const newProfile = {
            ...this.props.profile,
            defaultinvoice: this.state.selected
        };
        const { onSubmit } = this.props;
        onSubmit(newProfile);
    }
    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <FlatList
                    style={{ flex: 1 }}
                    data={this.state.pages}
                    keyExtractor={(item) => item.id}
                    renderItem={this.renderInvoice}
                />
                <AppButton
                    onPress={this.updateInvoice}
                    containerStyle={styles.btnStyle}
                    title='Update' />
            </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
    card: {
        marginHorizontal: 20,
        backgroundColor: 'white',
        marginTop: 12,
        aspectRatio: 2 / 3
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 6
    },
    title: {
        textAlign: 'center',
        marginTop: 30,
        fontSize: 20
    },
    btnStyle: {
        marginHorizontal: 16,
        marginTop: 30
    }
})
export default CustomizeTab;