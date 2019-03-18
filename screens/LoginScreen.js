import React from 'react';

import { StyleSheet, View , ImageBackground, AsyncStorage, Keyboard} from 'react-native';
import { Button, Input } from 'react-native-elements';
import config from '../constants/Config'



export default class LoginScreen extends React.Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {loading: false, error: ""}

    }

    login() {
        const {navigate} = this.props.navigation;
        Keyboard.dismiss();
        this.setState({loading: true});
        fetch(config.server_addr + '/api/login', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password,
            }),
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                if (responseJson.success) {
                    this.storeItem(responseJson.token).then((value) => {
                        console.log("Token save: " + value);
                        this.setState({loading: false});
                        navigate('Home');
                    }).catch((error) => {
                        console.log('Promise is rejected with error: ' + error);
                    });
                } else {
                    this.setState({loading: false, error: "Bad credentials"})
                }
            })
            .catch((error) => {
                console.error(error);
                this.setState({loading: false, error: "An error occurred"})
            });
    }

    async storeItem(item) {
        try {
            var jsonOfItem = await AsyncStorage.setItem("token", item);
            return jsonOfItem;
        } catch (error) {
            console.log(error.message);
        }
    }


    render() {
        return (
            <ImageBackground
                source={require('../assets/images/login-background.jpg')}
                style={{
                    flex: 1,
                }}
            >
                <View style={styles.content}>

                    <View style={styles.messageBox}>
                        <View >
                            <Input
                                placeholder=' Username'
                                shake={true}
                                errorStyle={{ color: 'red' }}
                                onChangeText={(text) => this.setState({username: text})}
                            />
                            <Input
                                secureTextEntry={true}
                                placeholder=' Password'
                                shake={true}
                                onChangeText={(text) => this.setState({password: text})}
                                errorStyle={{ color: 'red' }}
                                errorMessage={this.state.error}
                            />
                            <Button
                                loading={this.state.loading}
                                disabled={this.state.loading}
                                buttonStyle={{backgroundColor: '#00d1b2', borderRadius: 10, marginTop: "3%"}}
                                textStyle={{textAlign: 'center'}}
                                title={`Login`}
                                onPress={() => this.login()}
                            />
                        </View>
                    </View>
                </View>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

        backgroundColor: 'transparent',
        justifyContent: 'center'
    },
    content:{
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        flex:1,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center'
    },
    messageBox:{
        backgroundColor:'white',
        width:300,
        paddingTop:10,
        paddingBottom:20,
        paddingLeft:20,
        paddingRight:20,
        borderRadius:10
    },
});
