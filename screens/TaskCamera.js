import React from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text
} from 'react-native';
import { Camera, Permissions } from 'expo';
import {Icon} from "react-native-elements";
import DropdownAlert from 'react-native-dropdownalert';


export default class TaskCamera extends React.Component {
    static navigationOptions = {
        title: 'Tasks',
    };
    state = {
        hasCameraPermission: null,
        type: Camera.Constants.Type.back,
    };
    async componentDidMount() {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasCameraPermission: status === 'granted' });
    }

    constructor(props) {
        super(props);
    }

    async snapPhoto() {
        console.log('Button Pressed');
        if (this.camera) {
            console.log('Taking photo');
            const options = { quality: 1, base64: true, fixOrientation: true,
                exif: true};
            await this.camera.takePictureAsync(options).then(photo => {
                photo.exif.Orientation = 1;
                this.dropdown.alertWithType('success', 'Picture has been saved', "");
                //console.log(photo);
                this.props.navigation.state.params.setPicture(photo);
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
                            <TouchableOpacity
                                style={{
                                    flex: 1,
                                    alignSelf: 'flex-end',
                                    alignItems: 'center',
                                    paddingBottom: "10%"
                                }}
                                onPress={this.snapPhoto.bind(this)}>
                                <Icon
                                    name='adjust'
                                    color="#ffffff"
                                    size={60}
                                />

                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={{}} onPress={this.snapPhoto.bind(this)}>

                        </TouchableOpacity>
                    </Camera>

                </View>
            )
        }
    }
}
