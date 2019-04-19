import React from 'react';
import {
    ActivityIndicator,
    AsyncStorage, ImageBackground,
    StatusBar,
    StyleSheet,
    View,
} from 'react-native';
import config from "../constants/Config";

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
        let url = config.server_addr + '/api/token?token=' + userToken;
        console.log("url : " + url);
        fetch(url)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
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