import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    RefreshControl, AsyncStorage,
} from 'react-native';
import { withNavigation } from "react-navigation"
import TouchableScale from 'react-native-touchable-scale'; // https://github.com/kohver/react-native-touchable-scale
import { Location, Permissions } from 'expo';

import { Icon } from 'react-native-elements'
import { FlatGrid } from 'react-native-super-grid';
import {getDistance} from "react-native-image-view/src/utils";
import geolib from 'geolib'

class HomeScreen extends React.Component {
    static navigationOptions = ({ navigation  }) => {

        const {state} = navigation;
        return {
            title: 'List of ATM',
            headerLeft: null,
            headerRight: (
                <TouchableOpacity
                    onPress={() => this.logout(navigation)}
                    style={{
                        height: 45,
                        width: 45,
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: 10,

                    }}
                >
                    <Icon
                        name='log-out'
                        type='feather'
                    />
                </TouchableOpacity>
            )
        }

    };

    state = {
        refreshing: false,
        location: null,
        sections: [
            {
                atm_name: 'ATM #9',
                bank_name: 'BC',
                lat: 48.576678,
                long: 7.749236,
                avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
                type: "today",
                lastClean: "02-03-2018",
                nextClean: "05-03-2018"

            },
            {
                atm_name: 'ATM #10',
                bank_name: 'ABC',
                lat: 48.613675,
                long: 7.752227,
                avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
                type: "today",
                lastClean: "03-03-2018",
                nextClean: "10-03-2018"

            },
            {
                atm_name: 'ATM #10',
                bank_name: 'ABC',
                lat: 48.576678,
                long: 7.749236,
                avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
                type: "important",
                lastClean: "03-03-2018",
                nextClean: "07-03-2018"

            },
        ]
    };

    constructor(props) {
        super(props);
        this.navigate  = props.navigation;
        this.updateTitle("3 tasks remaining");
    }


    componentWillMount() {
        const {setParams} = this.props.navigation;
        setParams({demotxt: "looool"});
        this.setColor()
        if (Platform.OS === 'android' && !Constants.isDevice) {
            this.setState({
                errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
            });
        } else {
            this._getLocationAsync();
        }
    }

    _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            this.setState({
                errorMessage: 'Permission to access location was denied',
            });
        }

        let location = await Location.getCurrentPositionAsync({});
        this.setState({ location });
    };


    static logout(navigation) {
        this.removeToken().then((value) => {
            navigation.navigate("Login")
        })
    }

    static async removeToken() {
        try {
            await AsyncStorage.removeItem("token");
            return true
        } catch (error) {
            console.log(error.message);
        }
    }

    updateTitle(title) {
        this.props.navigation.setParams({
            HomeScreen: {
                title: title
            }
        });
        HomeScreen.navigationOptions.title = title
    }

    _onRefresh = () => {
        this.setState({refreshing: true});
        this.setState({refreshing: false});
    };

    getDistance(lat1, lon1) {
        if (!this.state.location)
            return;
        return geolib.convertUnit('km', geolib.getDistance(
            {latitude: lat1, longitude: lon1},
            {latitude: this.state.location.coords.latitude, longitude: this.state.location.coords.longitude}
        ));
    }

    setColor() {
        let color = [
            "#00d1b2",
            "#2089dc"
        ];

        let array = [...this.state.sections];
        let newData = [];
        for (let i = 0; i < array.length; i++) {
            Object.assign(array[i], {color: color[Math.floor(Math.random()*color.length)]})
            newData.push(array[i]);
        }
        this.setState({sections: newData});
    }

    render () {
        const {navigate} = this.props.navigation;

        return (
            <View style={styles.container}>
                <FlatGrid
                    itemDimension={130}
                    items={this.state.sections}
                    style={styles.gridView}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh}
                        />}
                    // staticDimension={300}
                    // fixed
                     spacing={30}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            onPress={() => navigate('JobInformation', {job: item, name: 'dams'})}
                            style={[styles.itemContainer, { backgroundColor: item.color}]}>
                            <Text style={styles.itemName}>{item.atm_name}</Text>
                            <Text style={styles.itemCode}>{item.bank_name}</Text>
                            <Text style={styles.itemCode}>{this.getDistance(item.lat, item.long)} km</Text>
                        </TouchableOpacity>
                    )}
                />
            </View>
        )
    }
}

export default withNavigation(HomeScreen);

const styles = StyleSheet.create({
    gridView: {
        flex: 1,
    },
    itemContainer: {
        justifyContent: 'flex-end',
        borderRadius: 20,
        padding: 10,
        height: 100,
    },
    itemName: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
    },
    itemCode: {
        fontWeight: '600',
        fontSize: 12,
        color: '#fff',
    },
    container: {
        flex: 1,
    },
    sectionHeaderImportant: {
        paddingTop: 2,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 2,
        fontSize: 14,
        fontWeight: 'bold',
        backgroundColor: '#ff220f',
    },
    sectionHeader: {
        paddingTop: 2,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 2,
        fontSize: 14,
        fontWeight: 'bold',
        backgroundColor: 'rgba(247,247,247,1.0)',
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
});