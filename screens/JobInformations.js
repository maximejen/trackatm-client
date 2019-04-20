import React from 'react';
import {
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View,
    Linking
} from 'react-native';
import {MapView, Location, Permissions} from 'expo';
import {Button} from 'react-native-elements';

export default class JobInformations extends React.Component {
    static navigationOptions = {
        title: '',
    };

    constructor(props) {
        super(props);
        console.log(this.props.navigation.state.params.job);
        this.state = ({
            job: this.props.navigation.state.params.job,
        });
        this.updateTitle(this.state.job.place.name);
        this._getLocationAsync(this.state.job.place.geoCoords);
    }

    _getLocationAsync = async (coords) => {
        let {status} = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            this.setState({
                errorMessage: 'Permission to access location was denied',
            });
        }
        let locationDetail = await Location.reverseGeocodeAsync({
            latitude: coords.lat,
            longitude: coords.lon
        });
        console.log(locationDetail);
        this.setState({
            location: locationDetail[0]
        });
    };


    updateTitle(title) {
        this.props.navigation.setParams({
            JobInformation: {
                title: title
            }
        });
        JobInformations.navigationOptions.title = title
    }


    _handleOpenWithLinking = () => {
        if (Platform.OS === 'ios') {
            Linking.openURL('maps://?q=' + this.state.job.lat + ',' + this.state.job.long);
        } else {
            Linking.openURL('geo:' + +this.state.job.lat + ',' + this.state.job.long);
        }
    };

    renderButtonTasks() {
        //TODO remettre le if
        const {navigate} = this.props.navigation;
        //if (!this.state.job.done) {
            return (
                <View style={styles.buttonOpenMap}>
                    <Button
                        title="Complete tasks"
                        type="solid"
                        onPress={() => navigate('Tasks', {tasks: this.state.job.template.tasks, job: this.state.job})}
                    /></View>
            )
        //}
    }

    renderAddress() {
        if (this.state.location) {
            return (
                <View>
                    <Text style={styles.textTitle}>location address</Text>
                    <Text style={styles.textData}>{this.state.location.street},{this.state.location.city}, {this.state.location.postalCode}</Text>
                </View>
            )
        }
        else return (
            <View>
                <Text style={styles.textTitle}>location address</Text>
            </View>
        )

    }

    renderBorderLine() {
        return (
            <View style={{margin: '3%'}}>
                <View
                    style={{
                        borderBottomColor: '#4158d6',
                        borderBottomWidth: 1,
                    }}
                />
            </View>
        )
    }

    render() {
        return (
            <ScrollView style={{flex: 1}}>
                <MapView style={styles.map}
                         initialRegion={{
                             latitude: this.state.job.place.geoCoords.lat,
                             longitude: this.state.job.place.geoCoords.lon,
                             latitudeDelta: 0.005,
                             longitudeDelta: 0.005,
                         }}
                >
                    <MapView.Marker
                        coordinate={{
                            latitude: this.state.job.place.geoCoords.lat,
                            longitude: this.state.job.place.geoCoords.lon
                        }}
                        title={this.state.job.bank_name}
                        description={this.state.job.atm_name}
                    />
                </MapView>
                <View style={{flex: 1, position: 'relative'}}>
                    <View style={styles.buttonOpenMap}>
                        <Button
                            title="Open with maps"
                            type="solid"
                            onPress={this._handleOpenWithLinking}
                        />
                    </View>
                    <View>
                        {this.renderAddress()}
                        {this.renderBorderLine()}
                        <Text style={styles.textTitle}>Customer</Text>
                        <Text style={styles.textData}>{this.state.job.place.customer.name}</Text>
                        {this.renderBorderLine()}
                        {this.renderButtonTasks()}
                    </View>
                </View>
            </ScrollView>
        )
    }
}

var styles = StyleSheet.create({

    textTitle: {
        fontSize: 16,
        color: '#ada8a3',
        paddingTop: '2%',
        paddingLeft: '3%',
        paddingRight: '3%'
    },
    textData: {
        fontSize: 16,
        paddingLeft: '3%',
        paddingRight: '3%'
    },
    textAddress: {
        width: '100%',
        height: '40%',
        paddingLeft: '2%',
    },
    buttonOpenMap: {
        paddingTop: '2%',
        marginLeft: '3%',
        marginRight: '3%'
    },
    container: {
        flex: 1,
    },
    map: {
        alignItems: 'center',
        overflow: 'hidden',
        alignSelf: 'center',
        borderRadius: 8,
        shadowOpacity: 0.4,
        elevation: 1.5,
        marginTop: 5,
        marginBottom: 5,
        shadowRadius: 1,
        shadowOffset: {height: 2, width: 0},
        height: '95%',
        width: '95%',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    }
});