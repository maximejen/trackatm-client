import React from 'react';
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    FlatList,
    SectionList,
    Linking
} from 'react-native';
import { MapView } from 'expo';
import { Button } from 'react-native-elements';

export default class JobInformations extends React.Component {
    static navigationOptions = {
        title: '',
    };

    constructor(props) {
        super(props);
        this.state = ({job: this.props.navigation.state.params.job});
        this.updateTitle(this.state.job.atm_name + ' - ' + this.state.job.bank_name);
        console.log(this.state.job)
    }

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
            Linking.openURL('comgooglemaps://?q='+ this.state.job.lat + ',' + this.state.job.long);
        } else {
            Linking.openURL('geo:' + + this.state.job.lat + ',' + this.state.job.long);
        }
        //Linking.openURL('https://maps.google.com/?q=' + this.state.job.lat + ',' + this.state.job.long);
        //Linking.openURL('comgooglemaps://?q='+ this.state.job.lat + ',' + this.state.job.long);
    };

    renderButtonTasks() {
        const {navigate} = this.props.navigation;
        if (this.state.job.type !== 'done') {
            return (  <Button
                title="Complete tasks"
                type="outline"
                onPress={() => navigate('Tasks', {job: this.state.job})}
            />)
        }
    }

    render () {
        return (
            <View style={{ flex: 1, position: 'relative'  }}>
                <View style={{ width: '100%', height: '30%', position: 'relative'  }}>
                    <MapView style={styles.map}
                             initialRegion={{
                                 latitude: this.state.job.lat,
                                 longitude: this.state.job.long,
                                 latitudeDelta: 0.05,
                                 longitudeDelta: 0.05   ,
                             }}
                    >
                        <MapView.Marker
                            coordinate={{latitude: this.state.job.lat,
                                longitude: this.state.job.long}}
                            title={this.state.job.bank_name}
                            description={this.state.job.atm_name}
                        />
                    </MapView>
                </View>
                <View style={{ flex: 1, position: 'relative'  }}>
                    <Button
                        title="open with google maps"
                        type="outline"
                        onPress={this._handleOpenWithLinking}
                    />
                   {this.renderButtonTasks()}
                </View>
            </View>
        )
    }
}

var styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    map: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    }
});