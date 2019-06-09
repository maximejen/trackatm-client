import React from 'react';
import {
    ActivityIndicator,
    AsyncStorage, ImageBackground,
    StatusBar,
    StyleSheet,
    View,
} from 'react-native';
import config from "../constants/environment";

class AuthLoadingScreen extends React.Component {
    static navigationOptions = {
        header: null
    };
    constructor(props) {
        super(props);
        this._bootstrapAsync();
    }

    _bootstrapAsync = async () => {
        const userToken = await AsyncStorage.getItem('token');
        const cleanerId = await AsyncStorage.getItem('cleanerid');
        const {navigate} = this.props.navigation;

        if (!userToken || !cleanerId) {
            this.props.navigation.navigate('Login');
            return
        }
        let url = config().apiUrl + '/api/upload-app-version?version=' + config().version;
        fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
                'token': userToken
            }});
        url = config().apiUrl + '/api/token?token=' + userToken;
        fetch(url)
            .then((response) => response.json())
            .then((responseJson) => {
                navigate(responseJson.success ? 'Home' : 'Login');
            })
            .catch((error) => {
                console.error(error);
            });

    };

    render() {
        return (
            <ImageBackground
                source={require('../assets/images/login-background.jpg')}
                style={{
                    flex: 1,
                }}
            >
                <View style={styles.content}>
                    <ActivityIndicator size="large"
                                       color="white"
                    />
                    <StatusBar barStyle="default" />
                </View>
            </ImageBackground>
        );
    }
}

export default AuthLoadingScreen
const styles = StyleSheet.create({
    content: {
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
});