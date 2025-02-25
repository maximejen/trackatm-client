import React from "react";

import { createStaticNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import AuthLoadingScreen from "./screens/AuthLoadingScreen";
import JobInformationsScreen from "./screens/JobInformations";
import TasksScreen from "./screens/TasksScreen";
import TaskCamera from "./screens/TaskCamera";
import AlertContextProvider from "./components/AlertContext";

// const MainNavigator = createStackNavigator(
//   {
//     AuthLoadingScreen: { screen: DummyScreen },
//     // Login: { screen: LoginScreen },
//     // JobInformation: { screen: JobInformationsScreen },
//     // Tasks: { screen: TasksScreen },
//     // TaskCamera: {
//     //   screen: TaskCamera,
//     //   navigationOptions: {
//     //     headerShown: false,
//     //   },
//     // },
//     // Home: { screen: HomeScreen },
//   },
//   {
//     initialRouteName: "AuthLoadingScreen",
//     defaultNavigationOptions: {
//       gesturesEnabled: false,
//     },
//   }
// );

// MainNavigator.navigationOptions = {
//   // Hide the header from AppNavigator stack
//   headerShown: false,
// };

const RootStack = createNativeStackNavigator({
  initialRouteName: "AuthLoadingScreen",
  screenOptions: {
    gesturesEnabled: false,
    headerShown: false,
  },
  screens: {
    Home: { screen: HomeScreen },
    Login: { screen: LoginScreen },
    AuthLoadingScreen: { screen: AuthLoadingScreen },
    JobInformation: { screen: JobInformationsScreen },
    Tasks: { screen: TasksScreen },
    TaskCamera: {
      screen: TaskCamera,
      navigationOptions: {
        headerShown: false,
      },
    },
  },
});

const Navigation = createStaticNavigation(RootStack);

const AlertContext = React.createContext(null);

const App = () => {

  return (
    <>
      <AlertContextProvider>
        <Navigation screenOptions={{ headerShown: false }} />
      </AlertContextProvider>
    </>
  );
};
export default App;

