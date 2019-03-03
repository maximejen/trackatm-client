import React from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text
} from 'react-native';
import { Camera, Permissions } from 'expo';


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
        this.state = ({job: this.props.navigation.state.params.job});
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
                    <Camera style={{ flex: 1 }} type={this.state.type}>
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: 'transparent',
                                flexDirection: 'row',
                            }}>
                        </View>
                    </Camera>
                </View>
            )
        }
    }
}
