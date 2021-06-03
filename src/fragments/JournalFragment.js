import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, SafeAreaView, TouchableHighlight } from 'react-native';
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
import { editColor, rColor, viewColor } from '../theme/Color';
import timeHelper from '../helpers/TimeHelper';
import { SwipeListView } from 'react-native-swipe-list-view';
import AppText from '../components/AppText';

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
        this.props.navigation.push('AddJournalScreen', {
            onJournalUpdated: () => {
                this.fetchMyJournal()
            }
        });
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

    listItem = (data, rowMap) => {
        const { item, index } = data
        const color = rColor[2 % rColor.length];
        return (
            <ContactAvatarItem
                color={color}
                text='J'
                title={item.description}
                subtitle={item.total}
                description={timeHelper.format(item.date)}
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
    onViewClick = data => {

    }
    onEditClick = data => {
        const { item } = data
        this.props.navigation.push('AddJournalScreen', {
            onJournalUpdated: () => {
                this.fetchMyJournal()
            },
            journalId: item.id
        });
    }
    renderHiddenItem = (data, rowMap) => {
        return <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
                {this.hiddenElement('View', 'visibility', viewColor, () => this.onViewClick(data))}
            </View>
            {this.hiddenElement('Edit', 'edit', editColor, () => this.onEditClick(data))}
        </View>
    }
    hiddenElement = (label, icon, color, onPress) => {
        return <TouchableHighlight onPress={onPress} underlayColor={color}>
            <View style={{
                flexDirection: 'column',
                backgroundColor: color,
                width: 70,
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center'
            }}>

                <Icon name={icon} color='white' size={24} />
                <AppText style={{ color: 'white' }}>{label}</AppText>
            </View>
        </TouchableHighlight>
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
            <SwipeListView
                data={this.listData()}
                renderItem={this.listItem}
                disableRightSwipe={true}
                renderHiddenItem={(data, rowMap) => this.renderHiddenItem(data, rowMap)}
                leftOpenValue={70}
                rightOpenValue={-70}
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