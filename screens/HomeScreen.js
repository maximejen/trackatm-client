import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    RefreshControl, AsyncStorage, ScrollView, SafeAreaView
} from 'react-native';
import {withNavigation} from "react-navigation"
import * as Updates from "expo-updates";
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import * as ScreenOrientation from 'expo-screen-orientation'
import LottieView from 'lottie-react-native';
import {Constants} from "expo-constants"
import {Icon} from 'react-native-elements'
import {SuperGridSectionList} from 'react-native-super-grid';
import geolib from 'geolib'
import config from "../constants/environment";
import DropdownAlert from "react-native-dropdownalert";

const DaysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];

class HomeScreen extends React.Component {

    state = {
        refreshing: false,
        location: null,
        planning: null
    };

    constructor(props) {
        super(props);
        this.navigate = props.navigation;
        this.updateTitle("3 tasks remaining");
        this.updateOperations();
    }

    static navigationOptions = ({navigation}) => {

        const {state} = navigation;
        return {
            title: 'List of jobs',
            headerStyle: {
                marginTop: Platform.OS !== "android" ? 20 : 0
            },
            headerLeft: <TouchableOpacity
                onPress={async () => await Updates.reloadAsync()}
                style={{
                    height: 45,
                    width: 45,
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: 10,

                }}
            >
                <Icon
                    name='refresh-ccw'
                    type='feather'
                />
            </TouchableOpacity>,
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

    componentDidMount() {
        this.animation.play();
        this.focusListener = this.props.navigation.addListener("didFocus", () => {
            if (this.props.navigation.state.params.done) {
                this.dropdown.alertWithType('success', 'Operation has been saved', "");
                this.updateOperations();
                this.props.navigation.state.params.done = false;
            }
        });

        const {setParams} = this.props.navigation;
        if (Platform.OS === 'ios')
            this._getLocationAsync();
        // if (Platform.OS === 'android' && !Constants.isDevice) {
        //     this.setState({
        //         errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
        //     });
        // } else {
        //
        // }
    }

    fromFlatToTree(operations) {
        let tree = {Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: []};
        operations.map((operation) => {
            tree[operation.day].push(operation);
        });
        return tree;
    }

    fromTreeToFlat(tree) {
        let flat = [];
        Object.Keys(tree).map((day) => {
            tree[day].map((operation) => {
                flat.push(operation);
            });
        });
        return flat;
    }

    async updateOperations() {
        const userToken = await AsyncStorage.getItem('token');
        fetch(config().apiUrl + '/api/cleaner/operations/?flat=false', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'token': userToken
            },
        }).then((response) => response.json())
            .then((responseJson) => {
                // const planning = this.fromFlatToTree(responseJson);
                // this.setState({planning});
                this.setState({planning: responseJson});
                // this.setColor([...responseJson]);
            })
            .catch((err) => {
                console.log(err)
            })
    };

    _getLocationAsync = async () => {
        let {status} = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            this.setState({
                errorMessage: 'Permission to access location was denied',
            });
        }

        let location = await Location.getCurrentPositionAsync({});
        this.setState({location});
    };

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
                Object.assign(array[i], {color: color[Math.floor(Math.random() * color.length)]});
            newData.push(array[i]);
        }
        this.setState({planning: newData});
    }

    renderList() {
        let sortedArray = [];

        const {planning} = this.state;
        Object.keys(planning).map((date) => {
            const dayOperations = planning[date];
            const actualDay = new Date(date);
            const filteredOperations = dayOperations.filter((operation) => !operation.done);
            if (filteredOperations.length > 0) {
                let operations = filteredOperations.map((operation) => {
                    const color = operation.template.color;
                    Object.assign(operation, {color: color ? color : "#2089dc"});
                    return operation;
                });
                let item = {
                    title: DaysOfWeek[actualDay.getDay()] + " - " + date,
                    data: operations
                };
                sortedArray.push(item);
            }
        });

        // while (iDate.getDate() !== end.getDate()) {
        //     console.log(`${iDate.getFullYear()}-${("0" + (iDate.getMonth() + 1)).slice(-2)}-${("0" + iDate.getDate()).slice(-2)}`);
        //
        //
        //     const day = DaysOfWeek[iDate.getDay()];
        //     planning[day].map((operation) => {
        //         Object.assign(operation, {color: "#2089dc"});
        //         let item = {
        //             title: day + `${iDate.getFullYear()}-${("0" + (iDate.getMonth() + 1)).slice(-2)}-${("0" + iDate.getDate()).slice(-2)}`,
        //             data: {...operation, color: "#2089dc"}
        //         };
        //         // console.log(item);
        //         sortedArray.push(item);
        //     });
        //
        //     iDate.setDate(iDate.getDate() + 1);
        // }

        // document.write('<br>5 days ago was: ' + d.toLocaleString());
        // for (let i = 0; i < DaysOfWeek.length; i++) {
        //     let d = new Date();
        //     d.setDate(d.getDate());
        //     let toShow = this.state.planning.filter((item) => {
        //         if (item.day === DaysOfWeek[i] && !item.done)
        //             return item;
        //     });
        //     if (toShow.length > 0) {
        //         const todayDayNumber = d.getDay();
        //         const differenceToNewDay = todayDayNumber - i;
        //         d.setDate(d.getDate() - differenceToNewDay);
        //         const startTitle = differenceToNewDay === 0 ? "Today - " : "";
        //         let item = {
        //             title: startTitle + DaysOfWeek[i] + ` - ${d.getFullYear()}-${("0" + (d.getMonth() + 1)).slice(-2)}-${("0" + d.getDate()).slice(-2)}`,
        //             data: toShow
        //         };
        //         sortedArray.push(item);
        //     }
        // }
        //
        // console.log(sortedArray);

        // for (let i = 0; i < DaysOfWeek.length; i++) {
        //     let d = new Date();
        //     let secondWeekElement = this.state.sections.filter((item) => {
        //         if (item.day === DaysOfWeek[i])
        //             return item;
        //         if (item.done) {
        //             item.color = "#2089dc";
        //             item.done = false;
        //         }
        //     });
        //     if (secondWeekElement.length > 0) {
        //         const todayDayNumber = d.getDay();
        //         const differenceToNewDay = todayDayNumber - i;
        //         d.setDate(d.getDate() - differenceToNewDay);
        //         let item = {
        //             title: DaysOfWeek[i] + ` - ${d.getFullYear()}-${("0" + (d.getMonth() + 1)).slice(-2)}-${("0" + d.getDate()).slice(-2)}`,
        //             data: secondWeekElement
        //         };
        //         sortedArray.push(item);
        //     }
        // }

        // const {planning} = this.state;
        //
        // Object.keys(planning).map((day) => {
        //     let d = new Date();
        //     const todayDayNumber = d.getDay();
        //     const differenceToNewDay = todayDayNumber - DaysOfWeek.findIndex((index) => index === day);
        //     d.setDate(d.getDate() - differenceToNewDay);
        //     d.setDate(d.getDate() + 7);
        //     planning[day].map((operation) => {
        //         let item = {
        //             title: day + ` - ${d.getFullYear()}-${("0" + (d.getMonth() + 1)).slice(-2)}-${("0" + d.getDate()).slice(-2)}`,
        //             data: {...operation, color: "#2089dc"}
        //         };
        //         sortedArray.push(item);
        //     })
        // });

        const {navigate} = this.props.navigation;
        ScreenOrientation.lockAsync(ScreenOrientation.Orientation.PORTRAIT_UP);
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
                    renderItem={({item, section, index}) => (
                        <TouchableOpacity
                            onPress={() => navigate('JobInformation', {
                                job: item,
                                name: 'dams',
                                initialDate: section.title.substr(-10, 10)
                            })}
                            style={[styles.itemContainer, {backgroundColor: item.color}]}>
                            <Text style={styles.itemName}>{item.place.name}</Text>
                            <Text style={styles.itemCode}>{item.template.name}</Text>
                            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                                {Platform.OS === 'ios' ? <Text style={styles.itemCode}>{this.getDistance(item.place.geoCoords)} km</Text> : null}
                                {item.done ?
                                    <Icon
                                        name='check'
                                        type='feather'/>
                                    : null}
                            </View>
                        </TouchableOpacity>
                    )}
                    renderSectionHeader={({section}) => (
                        <Text style={styles.sectionHeader}>{section.title}</Text>
                    )}
                />
                <DropdownAlert style={{zIndex: 20}} ref={ref => this.dropdown = ref}/>
            </ScrollView>
        )
    }

    render() {
        const version = <Text style={{marginLeft: "auto", marginRight: "auto", fontSize: 12}}>{config().version}</Text>;
        const {planning} = this.state;
        if (planning) {
            const condition = Object.keys(planning).every((day) => planning[day].length === 0);
            if (!condition) {
                return (
                    <>
                        <View style={styles.container}>
                            {this.renderList()}
                        </View>
                        {version}
                    </>
                )
            } else {
                return (
                    <View style={styles.textContainer}>
                        <Text style={{fontSize: 30}}>
                            You have no job
                        </Text>
                        {version}
                    </View>
                )
            }

        } else {
            return (
                <SafeAreaView style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>

                    <View style={styles.imageWrapper}>
                        <LottieView
                            ref={animation => {
                                this.animation = animation;
                            }}
                            style={styles.animationWrapper}
                            source={require('../assets/5340-line-loader')}
                            loop
                        />
                    </View>
                    {version}

                </SafeAreaView>
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
    imageWrapper: {
        width: 170,
        height: 170,
        opacity: 0.85,
        justifyContent: 'center'
    },
    loadingText: {
        width: '100%',
        textAlign: 'center',
    },
    logoImage: {
        width: '100%',
        alignItems: 'center',
    },
    animationWrapper: {
        width: '100%',
        height: '100%',
    },
});