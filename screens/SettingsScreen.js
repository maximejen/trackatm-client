import React from 'react';
import { ExpoConfigView } from '@expo/samples';
import {Platform} from "react-native";

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'app.json',
    headerStyle: {
      marginTop: Platform.OS !== "android" ? 20 : 0
    },
  };

  render() {
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
    return <ExpoConfigView />;
  }
}
