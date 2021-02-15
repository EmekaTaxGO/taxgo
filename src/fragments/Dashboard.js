import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LineChart, BarChart, StackedBarChart } from 'react-native-chart-kit';
import CardView from 'react-native-cardview';
class DashBoard extends Component {


    componentDidMount() {
        this.configHeader();
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
            backgroundColor: "#e26a00",
            backgroundGradientFrom: "#002fff",
            backgroundGradientTo: "#006cff",
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
                borderRadius: 16
            },
            propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#002fff"
            }
        }
    }
    getBarData = () => {
        return {
            labels: ["January", "February", "March", "April", "May", "June"],
            datasets: [
                {
                    data: [20, 45, 28, 80, 99, 43]
                }
            ]
        };
    }
    getStackedBarData = () => {
        return {
            labels: ["Test1", "Test2"],
            legend: ["L1", "L2", "L3"],
            data: [
                [60, 60, 60],
                [30, 30, 60]
            ],
            barColors: ["#dfe4ea", "#ced6e0", "#a4b0be"]
        };
    }
    render() {
        const barData = this.getBarData();
        const stackedBarData = this.getStackedBarData();
        const chartConfig = this.getChartConfig();

        const chartWidth = Dimensions.get('screen').width * 0.92;

        return <View style={{ flexDirection: 'column', alignItems: 'center' }}>
            <LineChart
                data={{
                    labels: ["January", "February", "March", "April", "May", "June"],
                    datasets: [
                        {
                            data: [
                                Math.random() * 100,
                                Math.random() * 100,
                                Math.random() * 100,
                                Math.random() * 100,
                                Math.random() * 100,
                                Math.random() * 100
                            ]
                        }
                    ]
                }}
                width={chartWidth} // from react-native
                height={220}
                yAxisLabel="$"
                yAxisSuffix="k"
                yAxisInterval={1} // optional, defaults to 1
                chartConfig={chartConfig}
                bezier
                style={{
                    borderRadius: 12,
                    marginTop: 18
                }}
            />

            <BarChart
                data={barData}
                width={chartWidth}
                height={220}
                yAxisLabel="$"
                chartConfig={chartConfig}
                verticalLabelRotation={0}
                style={{
                    borderRadius: 12,
                    marginTop: 18
                }}
            />


            {/* <CardView
                cardElevation={4}
                cornerRadius={6}
                style={styles.card}>
                <StackedBarChart
                    style={styles.barGraph}
                    data={stackedBarData}
                    width={Dimensions.get('screen').width}
                    height={220}
                    chartConfig={chartConfig}
                    verticalLabelRotation={0}

                />
            </CardView> */}
        </View>
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
    }
})
export default DashBoard; 