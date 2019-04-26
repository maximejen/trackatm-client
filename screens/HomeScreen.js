import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    RefreshControl, AsyncStorage, ScrollView
} from 'react-native';
import { withNavigation } from "react-navigation"
import {Camera, Location, Permissions, ScreenOrientation} from 'expo';
import LottieView from 'lottie-react-native';

import { Icon } from 'react-native-elements'
import { SuperGridSectionList } from 'react-native-super-grid';
import geolib from 'geolib'
import config from "../constants/environment";
import DropdownAlert from "react-native-dropdownalert";

const DaysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
];

class HomeScreen extends React.Component {
    static navigationOptions = ({ navigation  }) => {

        const {state} = navigation;
        return {
            title: 'List of jobs',
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
        sections: null
    };

    constructor(props) {
        super(props);
        this.navigate  = props.navigation;
        this.updateTitle("3 tasks remaining");
        this.updateOperations();
    }
    componentDidMount() {
        this.animation.play();
        this.focusListener = this.props.navigation.addListener("didFocus", () => {
            if (this.props.navigation.state.params.done) {
                this.dropdown.alertWithType('success', 'Operation has been saved', "");
                this.updateOperations();
                this.props.navigation.state.params.done = false;
            }
        });
    }
    updateOperations = async () =>{
        const userToken = await AsyncStorage.getItem('token');
        console.log("url: " + config().apiUrl);
        fetch(config().apiUrl + '/api/cleaner/operations/', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'token': userToken
            },
        }).then((response) => response.json())
            .then((responseJson) => {
                this.setColor([...responseJson]);
            })
            .catch((err) => {
                console.log(err)
            })
    };

    componentWillMount() {
        const {setParams} = this.props.navigation;
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
        this.updateOperations().then(this.setState({refreshing: false}));

    };

    getDistance(coords) {
        if (!this.state.location || !coords)
            return;
        return geolib.convertUnit('km', geolib.getDistance(
            {latitude: coords.lat, longitude: coords.lon},
            {latitude: this.state.location.coords.latitude, longitude: this.state.location.coords.longitude}
        ));
    }

    setColor(array) {
        let color = [
            "#2089dc",
            "#2089dc"
        ];

        let newData = [];
        for (let i = 0; i < array.length; i++) {
            if (array[i].done)
                Object.assign(array[i], {color: "#1dd131"});
            else
                Object.assign(array[i], {color: color[Math.floor(Math.random()*color.length)]})
            newData.push(array[i]);
        }
        this.setState({sections: newData});
    }

    renderList() {
        let sortedArray = [];
        for (let i = 0; i < DaysOfWeek.length; i++) {
            let toShow = this.state.sections.filter((item) => {
                if (item.day === DaysOfWeek[i])
                    return item;
            });
            if (toShow.length > 0) {
                let item = {
                    title: DaysOfWeek[i],
                    data: toShow
                };
                sortedArray.push(item);
            }
        }
        const {navigate} = this.props.navigation;
        Expo.ScreenOrientation.allowAsync(Expo.ScreenOrientation.Orientation.PORTRAIT);
        return (
            <ScrollView>
                <SuperGridSectionList
                    itemDimension={120}
                    //staticDimension={500}
                    // fixed
                    // spacing={20}
                    sections={sortedArray}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh}
                        />}
                    style={styles.gridView}
                    renderItem={({ item, section, index }) => (
                        <TouchableOpacity

                            onPress={() => navigate('JobInformation', {job: item, name: 'dams'})}
                            style={[styles.itemContainer, { backgroundColor: item.color}]}>
                            <Text style={styles.itemName}>{item.place.name}</Text>
                            <Text style={styles.itemCode}>{item.place.description}</Text>
                            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                                <Text style={styles.itemCode}>{this.getDistance(item.place.geoCoords)} km</Text>
                                {item.done ?
                                    <Icon
                                        name='check'
                                        type='feather'/>
                                    : null}
                            </View>
                        </TouchableOpacity>
                    )}
                    renderSectionHeader={({ section }) => (
                        <Text style={styles.sectionHeader}>{section.title}</Text>
                    )}
                />
                <DropdownAlert style={{zIndex: 20}} ref={ref => this.dropdown = ref} />
            </ScrollView>
        )
    }

    render () {
        if (this.state.sections) {
            if (this.state.sections.length > 0) {
                return (
                    <View style={styles.container}>
                        {this.renderList()}
                    </View>
                )
            }
            else {
                return (
                        <View style={styles.textContainer}>
                            <Text style={{fontSize: 30}}>
                                You have no job
                            </Text>
                        </View>
                )
            }

        }
        else {
            return (
                <View style={{
                }}>
                    <LottieView
                        ref={animation => {
                            this.animation = animation;
                        }}
                        source={require('../assets/5340-line-loader')}
                        style={{
                            height: '50%',
                            width: '50%',
                            marginTop: '30%',
                            marginLeft: '12%'
                        }}
                    />
                </View>
            )
        }

    }
}

export default withNavigation(HomeScreen);

const styles = StyleSheet.create({
    gridView: {
        flex: 1,
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemContainer: {
        justifyContent: 'flex-end',
        borderRadius: 20,
        padding: 10,
        height: 110,
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
        textAlign: 'center',
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