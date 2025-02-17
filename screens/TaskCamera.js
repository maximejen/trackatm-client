import React from "react";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Dimensions, TouchableOpacity, View, Text } from "react-native";
import DropdownAlert, { DropdownAlertType } from "react-native-dropdownalert";
import { Icon } from "react-native-elements";
import * as ScreenOrientation from "expo-screen-orientation";
import { OrientationLock } from "expo-screen-orientation/src/ScreenOrientation.types";
import { useNavigation } from "@react-navigation/native";
import { useAlertContext } from "../components/AlertContext";
import { manipulateAsync, useImageManipulator } from "expo-image-manipulator";

const TaskCamera = ({ route, ...props }) => {
  const navigation = useNavigation();

  const { setPicture } = route.params;

  const [hasCameraPermission, setHasCameraPermission] = React.useState(null);
  const [flashOn, setFlashOn] = React.useState(false);
  const [cameraReady, setCameraReady] = React.useState(false);

  const cameraRef = React.useRef(null);

  React.useEffect(() => {
    ScreenOrientation.lockAsync(OrientationLock.PORTRAIT_UP)
      .then(() => {
        console.log("successfully locked to PORTRAIT_UP");
      })
      .catch((err) => {
        console.warn(err.message);
      });
  }, []);

  const [permission, requestPermission] = useCameraPermissions();

  React.useEffect(() => {
    if (permission) {
      if (permission.status !== "granted" && permission.canAskAgain === true) {
        requestPermission().then((permission) => {
          console.log(permission);
          setHasCameraPermission(permission.status);
        });
      }
      setHasCameraPermission(permission.status);
    }
  }, [permission]);

  const { alert } = useAlertContext();

  React.useEffect(() => {});

  const snapPhoto = () => {
    if (cameraRef.current) {
      const options = {
        quality: 0,
        base64: true,
        fixOrientation: true,
        skipProcessing: true,
        exif: true,
      };
      cameraRef.current
        .takePictureAsync(options)
        .then((photo) => {
          const process = [{ resize: { width: 300 } }];
          if (photo.width > photo.height) process.unshift({ rotate: 90 });
          const uri = photo.localUri || photo.uri;
          manipulateAsync(uri, process, { compress: 0.9 }).then(
            (manipResult) => {
              setPicture(manipResult);
            },
          );
        })
        .catch((err) => {
          console.log(err);
          alert({
            type: DropdownAlertType.Error,
            title: "Error",
            message: "Error taking the picture",
          }).then((data) => {
            console.log(data);
          });
        });
    }
  };

  if (hasCameraPermission !== "granted")
    return (
      <Text>You need to provide access to the camera to take picture.</Text>
    );
  else
    return (
      <View style={{ flex: 1 }}>
        <CameraView
          mode={"picture"}
          facing={"back"}
          style={{ flex: 1 }}
          ref={cameraRef}
          flashOn={flashOn}
          enableTorch={flashOn}
          onCameraReady={() => {
            setCameraReady(true);
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "transparent",
              flexDirection: "row",
            }}
          >
            <View
              style={{
                position: "absolute",
                bottom: "5%",
                flex: 1,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
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
                  if (cameraReady) snapPhoto();
                }}
              >
                <Icon name="adjust" color="#ffffff" size={75} />
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  width: Dimensions.get("window").width * 0.33,
                }}
                activeOpacity={0.9}
                onPress={() => {
                  if (cameraReady) setFlashOn(!flashOn);
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
};

export default TaskCamera;
