import React from "react";

import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import AuthLoadingScreen from "./screens/AuthLoadingScreen";
import JobInformationsScreen from "./screens/JobInformations";
import TasksScreen from "./screens/TasksScreen";
import TaskCamera from "./screens/TaskCamera";

const MainNavigator = createStackNavigator(
  {
    AuthLoadingScreen: { screen: AuthLoadingScreen },
    Login: { screen: LoginScreen },
    JobInformation: { screen: JobInformationsScreen },
    Tasks: { screen: TasksScreen },
    TaskCamera: {
      screen: TaskCamera,
      navigationOptions: {
        headerShown: false,
      },
    },
    Home: { screen: HomeScreen },
  },
  {
    initialRouteName: "AuthLoadingScreen",
    defaultNavigationOptions: {
      gesturesEnabled: false,
    },
  }
);

MainNavigator.navigationOptions = {
  // Hide the header from AppNavigator stack
  headerShown: false,
};

const App = createAppContainer(MainNavigator);
export default App;
