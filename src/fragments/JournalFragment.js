import React, { useLayoutEffect, Component } from 'react';
import { View, TouchableOpacity, StyleSheet, Platform, ActionSheetIOS, FlatList, Text, Image, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SearchView from '../components/SearchView';

import * as journalActions from '../redux/actions/journalActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import OnScreenSpinner from '../components/OnScreenSpinner';
import FullScreenError from '../components/FullScreenError';
import EmptyView from '../components/EmptyView';
import { isEmpty } from '../helpers/Utils';
import ContactAvatarItem from '../components/ContactAvatarItem';
import { rColor } from '../theme/Color';

class JournalFragment extends Component {

    constructor(props) {
        super(props);
        this.state = {
            query: ''
        }
    }

    onMenuPress = () => {
        this.props.navigation.openDrawer();
    }

    onAddClick = () => {
        this.props.navigation.push('AddJournalScreen');
    }

    componentDidMount() {
        this.props.navigation.setOptions({
            headerLeft: () => {
                return <TouchableOpacity onPress={this.onMenuPress} style={styles.menu}>
                    <Icon name='menu' size={30} color='white' />
                </TouchableOpacity>
            },
            headerRight: () => {
                return <TouchableOpacity onPress={this.onAddClick} style={styles.rightBtn}>
                    <Icon name='add' size={30} color='white' />
                </TouchableOpacity>
            }
        })

        this.fetchMyJournal();
    }

    listItem = ({ item, index }) => {
        const color = rColor[2 % rColor.length];
        return (
            <ContactAvatarItem
                color={color}
                text='J'
                title={item.description}
                subtitle={item.total}
                description={item.date}
            />
        )
    }

    fetchMyJournal = () => {
        const { journalActions } = this.props;
        journalActions.getMyJournals();
    }

    listData = () => {
        if (isEmpty(this.state.query)) {
            return this.props.journal.myJournalList;
        } else {
            return this.filteredJournals();
        }
    }
    filteredJournals = () => {
        let filteredJournals = [];
        filteredJournals = this.props.journal.myJournalList.filter(value => {
            return value.description.toLowerCase().indexOf(this.state.query.toLowerCase()) > -1
        });
        return filteredJournals;
    }

    render() {
        const { journal } = this.props;
        if (journal.fetchingMyJournal) {
            return <OnScreenSpinner />
        }
        if (journal.fetchMyJournalError) {
            return <FullScreenError tryAgainClick={this.fetchMyJournal} />
        }
        if (journal.myJournalList.length === 0) {
            return <EmptyView message='No Journal Available.'
                iconName='description' />
        }
        return <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <SearchView
                value={this.state.query}
                onChangeQuery={q => this.setState({ query: q })}
                onCrossPress={() => { this.setState({ query: '' }) }}
                placeholder='Search Journals' />

            <FlatList
                data={this.listData()}
                renderItem={this.listItem}
                keyExtractor={(item, index) => `${index}`}
            />
        </SafeAreaView >
    }

}
const styles = StyleSheet.create({
    menu: {
        paddingLeft: 12
    },
    rightBtn: {
        paddingRight: 12
    },
    textStyle: {
        fontSize: 16,
        color: 'gray',
        paddingRight: 12
    }
});
export default connect(
    state => ({
        journal: state.journal
    }),
    dispatch => ({
        journalActions: bindActionCreators(journalActions, dispatch)
    })
)(JournalFragment);