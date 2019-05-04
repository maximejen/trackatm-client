import React from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text
} from 'react-native';
import { Camera, Permissions, ImageManipulator, ScreenOrientation } from 'expo';
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
        takenPicture: false,
    };
    async componentDidMount() {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasCameraPermission: status === 'granted' });
    }

    constructor(props) {
        super(props);
        Expo.ScreenOrientation.allowAsync(Expo.ScreenOrientation.Orientation.PORTRAIT);

    }

    async snapPhoto() {
        this.setState({
            takenPicture: true
        });
        if (this.camera) {
            const options = { quality: 0, base64: true, fixOrientation: true,
                exif: true};
            await this.camera.takePictureAsync(options).then(async photo => {
                const manipResult = await ImageManipulator.manipulateAsync(
                    photo.localUri || photo.uri,
                    [{resize: {width: 1024}}],
                    {compress: 0.7}
                );
                this.props.navigation.state.params.setPicture(manipResult);
                this.setState({
                    takenPicture: false
                });
            });
        }
    }

    render () {
        const { hasCameraPermission } = this.state;
        if (hasCameraPermission === null) {
            return <View />;
        } else if (hasCameraPermission === false) {
            return <Text>No access to camera</Text>;
        } else {
            return (
                <View style={{ flex: 1 }}>
                    <Camera style={{ flex: 1 }} ref={ref => { this.camera = ref; }} type={this.state.type}>
                        <DropdownAlert ref={ref => this.dropdown = ref} />
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
                                    justifyContent: 'flex-start',
                                    alignItems:'flex-end',
                                    paddingBottom: "7%"
                                }}
                            >
                                <TouchableOpacity
                                    disable={this.state.takenPicture}
                                style={{
                                    flexGrow: 0.45
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
                                    disable={this.state.takenPicture}
                                    onPress={this.snapPhoto.bind(this)}>
                                    <Icon
                                        name='adjust'
                                        color="#ffffff"
                                        size={60}
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
