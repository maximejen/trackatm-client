import React from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Linking
} from 'react-native';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import {Button} from 'react-native-elements';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default class JobInformations extends React.Component {
  static navigationOptions = {
    title: '',
    headerStyle: {
      marginTop: Platform.OS !== "android" ? 20 : 0
    },
  };

  constructor(props) {
    super(props);
    this.state = ({
      job: {...this.props.navigation.state.params.job, initialDate: this.props.navigation.state.params.initialDate}
    });
    this.updateTitle(this.state.job.place.name);
  }

  componentDidMount() {
    if (Platform.OS === "ios")
      this._getLocationAsync(this.state.job.place.geoCoords);
  }

  _getLocationAsync = async (coords) => {
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
      Linking.openURL(`maps:0,0?q=${this.state.job.place.customer.name} - ${this.state.job.place.name}@${this.state.job.place.geoCoords.lat},${this.state.job.place.geoCoords.lon}`);
    } else {
      Linking.openURL('geo:' + +this.state.job.geoCoords.lat + ',' + this.state.job.geoCoords.lon);
    }
  };

  renderButtonTasks() {
    const {navigate} = this.props.navigation;
    if (!this.state.job.done) {
      return (
        <View style={styles.buttonOpenMap}>
          <Button
            title="Complete tasks"
            type="solid"
            onPress={() => navigate('Tasks', {tasks: this.state.job.template.tasks, job: this.state.job})}
          /></View>
      )
    }
  }

  renderAddress() {
    if (this.state.location) {
      return (
        <View>
          <Text style={styles.textTitle}>location address</Text>
          <Text
            style={styles.textData}>{this.state.location.street},{this.state.location.city}, {this.state.location.postalCode}</Text>
        </View>
      )
    } else return (
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
      <View style={{flex: 1}}>
        <ScrollView>
          {Platform.OS === "ios" && (
            <MapView
              style={styles.map}
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
          )}
          <View style={{flex: 1, position: 'relative', height: hp('70%')}}>
            <View style={styles.buttonOpenMap}>
              <Button
                title="Open with maps"
                type="solid"
                onPress={this._handleOpenWithLinking}
              />
            </View>
            <View>
              {Platform.OS === "ios" && this.renderAddress()}
              {this.renderBorderLine()}
              <Text style={styles.textTitle}>Customer</Text>
              <Text style={styles.textData}>{this.state.job.place.customer.name}</Text>
              {this.renderBorderLine()}
              <Text style={styles.textTitle}>Location name</Text>
              <Text style={styles.textData}>{this.state.job.place.name}</Text>
              {this.renderBorderLine()}
              {this.renderButtonTasks()}
            </View>
          </View>
        </ScrollView>
      </View>
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
    height: hp('3%'),
    paddingLeft: '2%',
  },
  buttonOpenMap: {
    paddingTop: hp('1%'),
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
    height: hp('35%'),
    width: '95%',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  }
});