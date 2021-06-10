import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BarChart } from 'react-native-chart-kit';
import Api from '../services/api';
import Store from '../redux/Store';
import { getSavedData, GRAPH_DATA, saveToLocal } from '../services/UserStorage';
import OnScreenSpinner from '../components/OnScreenSpinner';
import FullScreenError from '../components/FullScreenError';
import { colorPrimary } from '../theme/Color';
import AppText from '../components/AppText';
import { get, isEmpty } from 'lodash';
class DashBoard extends Component {

    constructor(props) {
        super(props);

        const symbol = get(Store.getState().auth, 'profile.countryInfo.symbol', '')
        this.state = {
            fetching: true,
            error: undefined,
            salesDataSet: undefined,
            purchaseDataSet: undefined,
            symbol
        }
    }

    componentDidMount() {
        this.configHeader();
        this.fetchGraphData()
    }

    sanetizeMonth = data => {
        if (isEmpty(data.labels)) {
            return data;
        }
        data.labels = data.labels.map(value => {
            if (value.length > 2) {
                return value.substring(0, 3)
            }
            return value
        })
        return data
    }

    fetchGraphData = async () => {
        this.setState({ fetching: true })
        const cachedGraph = await getSavedData(GRAPH_DATA)
        if (cachedGraph !== null) {
            this.setState({
                fetching: false,
                ...cachedGraph
            })
        }
        const id = Store.getState().auth.authData.id
        const requests = [
            Api.get(`/dashboard/salesGraph/${id}`),
            Api.get(`/dashboard/purchaseGraph/${id}`)
        ]
        Promise.all(requests)
            .then(async (result) => {
                const graphData = {
                    salesDataSet: this.sanetizeMonth(result[0].data.data),
                    purchaseDataSet: this.sanetizeMonth(result[1].data.data)
                }
                await saveToLocal(GRAPH_DATA, graphData)
                this.setState({
                    fetching: false,
                    ...graphData
                })
            })
            .catch(err => {
                console.log('Error fetching graph Data: ', err.message);
                if (cachedGraph === null) {
                    this.setState({
                        fetching: false,
                        error: 'Unable to fetch Graph: '
                    })
                }
            })
    }
    onMenuPress = () => {
        this.props.navigation.openDrawer();
    }

    configHeader = () => {
        this.props.navigation.setOptions({
            headerLeft: () => {
                return <TouchableOpacity onPress={this.onMenuPress} style={styles.menu}>
                    <Icon name='menu' size={30} color='white' />
                </TouchableOpacity>
            }
        })
    }

    getChartConfig = () => {
        return {
            backgroundColor: colorPrimary,
            backgroundGradientFrom: colorPrimary,
            backgroundGradientTo: colorPrimary + '9f',
            decimalPlaces: 0, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
                borderRadius: 16
            },
            propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#002fff"
            },
            barPercentage: 0.8
        }
    }

    renderBarChart = (label, dataSet) => {

        const chartConfig = this.getChartConfig();
        const chartWidth = Dimensions.get('screen').width * 0.92;
        return (
            <View style={{ flexDirection: 'column' }}>
                <AppText style={styles.chartLabel}>{label}</AppText>
                <BarChart
                    data={dataSet}
                    width={chartWidth}
                    height={220}
                    yAxisLabel={this.state.symbol}
                    chartConfig={chartConfig}
                    verticalLabelRotation={0}
                    style={{
                        borderRadius: 12
                    }}
                />
            </View>
        )
    }

    render() {
        const { fetching, error } = this.state
        if (fetching) {
            return <OnScreenSpinner />
        }
        if (error) {
            return <FullScreenError tryAgainClick={() => this.fetchGraphData()} />
        }

        return <ScrollView style={{ flex: 1 }}>
            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                {this.renderBarChart('Sales Graph', this.state.salesDataSet)}
                {this.renderBarChart('Purchase Graph', this.state.purchaseDataSet)}
            </View>
        </ScrollView>
    }
}
const styles = StyleSheet.create({
    menu: {
        paddingLeft: 12
    },
    card: {
        marginHorizontal: 16,
        marginVertical: 14
    },
    chart: {
        borderRadius: 12
    },
    chartLabel: {
        color: 'black',
        fontSize: 18,
        textAlign: 'center',
        paddingVertical: 12
    }
})
export default DashBoard;