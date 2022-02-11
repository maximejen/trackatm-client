import React from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {Camera} from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ScreenOrientation from 'expo-screen-orientation'
import {Icon} from "react-native-elements";
import DropdownAlert from 'react-native-dropdownalert';
import {withNavigation} from "react-navigation";


class TaskCamera extends React.Component {
  static navigationOptions = {
    header: null
  };
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    flashOn: false,
    cameraReady: false
  };

  constructor(props) {
    super(props);
    ScreenOrientation.lockAsync(ScreenOrientation.Orientation.PORTRAIT_UP).then(() => {});
  }

  async componentDidMount() {
    const {granted} = await Camera.requestCameraPermissionsAsync();
    this.setState({hasCameraPermission: granted});
  }

  async snapPhoto() {
    if (this.camera && this.state.cameraReady) {
      const options = {
        quality: 0, base64: true, fixOrientation: true,
        exif: true
      };
      await this.camera.takePictureAsync(options).then(async photo => {
        const manipResult = await ImageManipulator.manipulateAsync(
          photo.localUri || photo.uri,
          [{resize: {width: 300}}],
          {compress: 0.9}
        );
        this.props.navigation.state.params.setPicture(manipResult);
      });
    }
  }

  async handleFlash() {
    this.setState({
      flashOn: !this.state.flashOn
    })
  }

  render() {
    const {hasCameraPermission} = this.state;
    if (hasCameraPermission === null) {
      return <View/>;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{flex: 1}}>
          <Camera
            style={{flex: 1}}
            ref={ref => {
              this.camera = ref;
            }}
            type={this.state.type}
            flashMode={this.state.flashOn ? Camera.Constants.FlashMode.torch : Camera.Constants.FlashMode.off}
            onCameraReady={() => {
              this.setState({
                cameraReady: true
              });
            }}
          >
            <DropdownAlert ref={ref => this.dropdown = ref}/>
            <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                flexDirection: 'row',
              }}>

              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'flex-end',
                  paddingBottom: "7%"
                }}
              >
                <TouchableOpacity
                  style={{
                    width: "33%"
                  }}
                  onPress={() => this.props.navigation.goBack()}
                >
                  <Icon
                    style={{justifyContent: "flex-start"}}
                    name='close'
                    color="#ffffff"
                    size={40}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    width: "33%"
                  }}
                  onPress={this.snapPhoto.bind(this)}>
                  <Icon
                    name='adjust'
                    color="#ffffff"
                    size={60}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    width: "33%"
                  }}
                  onPress={this.handleFlash.bind(this)}>
                  <Icon
                    style={{justifyContent: "flex-end"}}
                    name={this.state.flashOn ? 'flash-on' : 'flash-off'}
                    color="#ffffff"
                    size={40}
                  />
                </TouchableOpacity>

              </View>

            </View>
            <TouchableOpacity style={{}} onPress={this.snapPhoto.bind(this)}>

            </TouchableOpacity>
          </Camera>

        </View>
      )
    }
  }
}

export default withNavigation(TaskCamera);