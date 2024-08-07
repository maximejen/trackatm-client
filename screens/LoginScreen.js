import React from "react";

import {
  StyleSheet,
  View,
  ImageBackground,
  Keyboard,
  Platform,
} from "react-native";
import { Button, Input } from "react-native-elements";
import config from "../constants/environment";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null,
    headerStyle: {
      marginTop: Platform.OS !== "android" ? 20 : undefined,
    },
  };

  constructor(props) {
    super(props);
    this.state = { loading: false, error: "" };
  }

  login() {
    const { navigate } = this.props.navigation;
    Keyboard.dismiss();
    this.setState({ loading: true });
    fetch(config().apiUrl + "/api/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.success && responseJson.cleanerid >= 0) {
          this.storeItem(
            responseJson.token,
            JSON.stringify(responseJson.cleanerid)
          )
            .then((value) => {
              this.setState({ loading: false });
              navigate("Home");
            })
            .catch((error) => {
              console.log("Promise is rejected with error: " + error);
            });
        } else {
          if (responseJson.cleanerid === -1)
            this.setState({ loading: false, error: "You are not a cleaner" });
          else this.setState({ loading: false, error: "Bad credentials" });
        }
      })
      .catch((error) => {
        console.error(error);
        this.setState({ loading: false, error: "An error occurred" });
      });
  }

  async storeItem(token, cleanerId) {
    try {
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("cleanerid", cleanerId);
    } catch (error) {
      console.log(error.message);
    }
  }

  render() {
    return (
      <ImageBackground
        source={require("../assets/images/login-background.jpg")}
        style={{
          flex: 1,
        }}
      >
        <View style={styles.content}>
          <View style={styles.messageBox}>
            <View>
              <Input
                placeholder=" Username"
                shake={true}
                errorStyle={{ color: "red" }}
                onChangeText={(text) => this.setState({ username: text })}
              />
              <Input
                secureTextEntry={true}
                placeholder=" Password"
                shake={true}
                onChangeText={(text) => this.setState({ password: text })}
                errorStyle={{ color: "red" }}
                errorMessage={this.state.error}
              />
              <Button
                loading={this.state.loading}
                disabled={this.state.loading}
                buttonStyle={{
                  backgroundColor: "#00d1b2",
                  borderRadius: 10,
                  marginTop: "3%",
                }}
                textStyle={{ textAlign: "center" }}
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

    backgroundColor: "transparent",
    justifyContent: "center",
  },
  content: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  messageBox: {
    backgroundColor: "white",
    width: 300,
    paddingTop: 10,
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 10,
  },
});
