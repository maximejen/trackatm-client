import React from 'react';

import {
  createStackNavigator,
  createAppContainer
} from 'react-navigation';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen'
import AuthLoadingScreen from './screens/AuthLoadingScreen'
import JobInformationsScreen from "./screens/JobInformations";
import TasksScreen from "./screens/TasksScreen";
import TaskCamera from "./screens/TaskCamera";

const MainNavigator = createStackNavigator({
    AuthLoadingScreen: {screen: AuthLoadingScreen},
    Login: {screen: LoginScreen},
    JobInformation: {screen: JobInformationsScreen},
    Tasks: {screen: TasksScreen},
    TaskCamera: {screen: TaskCamera},
    Home: {screen: HomeScreen}},{
      initialRouteName: "AuthLoadingScreen",
      defaultNavigationOptions: {
        gesturesEnabled: false
      }
});

const App = createAppContainer(MainNavigator);
export default App;
