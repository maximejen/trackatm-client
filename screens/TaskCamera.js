import React from 'react';
import {View, TouchableOpacity, Text, Dimensions} from 'react-native';
import {Camera} from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ScreenOrientation from 'expo-screen-orientation'
import {Icon} from "react-native-elements";
import DropdownAlert from 'react-native-dropdownalert';
import {withNavigation} from "react-navigation";
import {OrientationLock} from "expo-screen-orientation/src/ScreenOrientation.types";


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
    ScreenOrientation.lockAsync(OrientationLock.PORTRAIT_UP).then(() => {
    });

    this.snapPhoto = this.snapPhoto.bind(this);
  }

  async componentDidMount() {
    const {granted} = await Camera.requestCameraPermissionsAsync();
    this.setState({hasCameraPermission: granted});
  }

  async snapPhoto() {
    if (this.camera) {
      ScreenOrientation.lockAsync(OrientationLock.PORTRAIT_UP).then(async () => {
        const options = {
          quality: 0,
          base64: true,
          fixOrientation: true,
          skipProcessing: true,
          exif: true
        };
        this.camera.takePictureAsync(options)
          .then(async photo => {
            let manipResult = await ImageManipulator.manipulateAsync(
              photo.localUri || photo.uri,
              [{resize: {width: 300}}],
              {compress: 0.9}
            );
            // Check the picture is in landscape and rotate it back to portrait if needed.
            if (manipResult.width > manipResult.height) {
              manipResult = await ImageManipulator.manipulate(
                manipResult.uri,
                [{rotate: -90}, {resize: {width: 300}}],
                {}
              );
            }
            this.props.navigation.state.params.setPicture(manipResult);
          })
          .catch(err => {
            this.dropdown.alertWithType('error', 'Error taking the picture', err);
          });
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
            ratio={"4:3"}
            type={this.state.type}
            flashMode={this.state.flashOn ? Camera.Constants.FlashMode.torch : Camera.Constants.FlashMode.off}
            onCameraReady={() => {
              console.log("Camera READY")
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
                    width: Dimensions.get("window").width * 0.33
                  }}
                  onPress={() => this.props.navigation.goBack()}
                  activeOpacity={0.9}
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
                    width: Dimensions.get("window").width * 0.33
                  }}
                  activeOpacity={0.9}
                  onPress={() => {
                    console.log("snapPhoto !");
                    this.snapPhoto();
                  }}
                >
                  <Icon
                    name='adjust'
                    color="#ffffff"
                    size={60}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    width: Dimensions.get("window").width * 0.33
                  }}
                  activeOpacity={0.9}
                  onPress={this.handleFlash.bind(this)}
                >
                  <Icon
                    style={{justifyContent: "flex-end"}}
                    name={this.state.flashOn ? 'flash-on' : 'flash-off'}
                    color="#ffffff"
                    size={40}
                  />
                </TouchableOpacity>

              </View>

            </View>
          </Camera>

        </View>
      )
    }
  }
}

export default withNavigation(TaskCamera);