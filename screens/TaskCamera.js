import React from "react";
import { CameraView, useCameraPermissions} from "expo-camera";
import { Dimensions, TouchableOpacity, View, Text } from "react-native";
import DropdownAlert, { DropdownAlertType} from "react-native-dropdownalert";
import { Icon } from "react-native-elements";
import { withNavigation } from "react-navigation";
import * as ScreenOrientation from "expo-screen-orientation";
import { OrientationLock } from "expo-screen-orientation/src/ScreenOrientation.types";
import * as ImageManipulator from "expo-image-manipulator";

const TaskCamera = ({ navigation, ...props }) => {

  const [hasCameraPermission, setHasCameraPermission] = React.useState(null);
  const [flashOn, setFlashOn] = React.useState(false);
  const [cameraReady, setCameraReady] = React.useState(false);

  const cameraRef = React.useRef(null);

  React.useEffect(() => {
    ScreenOrientation.lockAsync(2);
  }, []);

  const [status, requestPermission] = useCameraPermissions();

  React.useEffect(() => {
    if (status) {
      if (status.status !== "granted" && status.canAskAgain === true) {
        requestPermission().then((status) => {
          setHasCameraPermission(status.status);
        });
      }
      setHasCameraPermission(status.status);
    }
  }, [status]);

  let alert = (_data) => new Promise(res => res);


  const snapPhoto = () => {
    if (cameraRef.current) {
      ScreenOrientation.lockAsync(OrientationLock.PORTRAIT_UP).then(
        async () => {
          const options = {
            quality: 0,
            base64: true,
            fixOrientation: true,
            skipProcessing: true,
            exif: true,
          };
          cameraRef.current
            .takePictureAsync(options)
            .then(async (photo) => {
              let manipResult = await ImageManipulator.manipulateAsync(
                photo.localUri || photo.uri,
                [{ resize: { width: 300 } }],
                { compress: 0.9 }
              );
              // Check the picture is in landscape and rotate it back to portrait if needed.
              if (manipResult.width > manipResult.height) {
                manipResult = await ImageManipulator.manipulateAsync(
                  manipResult.uri,
                  [{ rotate: -90 }, { resize: { width: 300 } }],
                  {}
                );
              }
              navigation.state.params.setPicture(manipResult);
            })
            .catch((err) => {
              console.log(err);
              alert({
                type: DropdownAlertType.Error,
                title: 'Error',
                message: 'Error taking the picture',
              }).then(data => {
                console.log(data);
              });
            });
        }
      );
    }
  };

  if (hasCameraPermission === null) {
    return <View />;
  } else if (hasCameraPermission !== "granted") {
    return <Text>No access to camera</Text>;
  } else {
    return (
      <View style={{ flex: 1 }}>
        <CameraView
          // facing={"back"}
          // flash={flashOn ? "on" : "off"}
          mode={"picture"}
          style={{ flex: 1 }}
          ref={(ref) => {
            if (ref) cameraRef.current = ref;
          }}
          // pictureSize={"4:3"}
          enableTorch={flashOn}
          onCameraReady={() => {
            console.log("Camera READY");
            setCameraReady(true);
          }}
        >
          <DropdownAlert alert={func => (alert = func)} />
          <View
            style={{
              flex: 1,
              backgroundColor: "transparent",
              flexDirection: "row",
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "flex-end",
                paddingBottom: "7%",
              }}
            >
              <TouchableOpacity
                style={{
                  width: Dimensions.get("window").width * 0.33,
                }}
                onPress={() => navigation.goBack()}
                activeOpacity={0.9}
              >
                <Icon
                  style={{ justifyContent: "flex-start" }}
                  name="close"
                  color="#ffffff"
                  size={40}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  width: Dimensions.get("window").width * 0.33,
                }}
                activeOpacity={0.9}
                onPress={() => {
                  if (cameraReady)
                    snapPhoto();
                }}
              >
                <Icon name="adjust" color="#ffffff" size={60} />
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  width: Dimensions.get("window").width * 0.33,
                }}
                activeOpacity={0.9}
                onPress={() => {
                  setFlashOn(!flashOn);
                }}
              >
                <Icon
                  style={{ justifyContent: "flex-end" }}
                  name={flashOn ? "flash-on" : "flash-off"}
                  color="#ffffff"
                  size={40}
                />
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      </View>
    );
  }
};

export default withNavigation(TaskCamera);
