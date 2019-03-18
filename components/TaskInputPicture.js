import React from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    TextInput,
    Image,
    ScrollView,
    FlatList, StyleSheet
} from 'react-native';
import { material } from 'react-native-typography'
import {Button, CheckBox, Icon} from 'react-native-elements'
import ImageView from 'react-native-image-view';
import TaskCamera from "../screens/TaskCamera";
import {withNavigation} from "react-navigation";

class TaskInputPicture extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: this.props.checked,
            edit: true,
            viewer: false,
            cameraEnable: false,
            imageId: 0,
            images: [
            ]
        }
    }

    SetPicture = (data) => {

        var picture = {
            source: {
                uri: data.uri,
            },
            title: 'Paris',
            width: 806,
            height: 720,
        };
        var images = this.state.images;
        images.push(picture);
        this.setState({images: images});
        console.log("Saving picture");
    };

    renderChecked() {
        if (this.state.checked) {
            return (<Icon
                name='check-square'
                type="feather"
            />)
        } else {
            return (
                <Icon
                    name='square'
                    type="feather"
                />
            )
        }
    }

    ChangeParentState() {
        this.setState({checked: !this.state.checked});
        this.props.handleChecked(this.props.id)
    }

    toogleViewer(index){
        console.log("true");
        this.setState({viewer: true, imageId: index})
    }

    renderImage(item, index)
    {
        return (
            <TouchableOpacity style={{paddingRight: 10}}
                              onPress={() => this.toogleViewer(index)}
            >
                <Image source={{uri: item.source.uri}}
                       style={{width: 100, height: 95, borderRadius: 4}} />
            </TouchableOpacity>
        )
    }

    renderImageFlatList() {
        if (this.state.images.length > 0) {
            return (
                <FlatList
                    style={{
                        height: 140,
                        paddingTop: 20
                    }}
                    horizontal={true}
                    keyExtractor={(item, index) => index.toString()}
                    data={this.state.images}
                    renderItem={({item, index}) => this.renderImage(item, index)}
                />
            )
        } else {
            const {navigate} = this.props.navigation;
            return (
                <TouchableOpacity
                    onPress={() => navigate("TaskCamera", {
                        setPicture: this.SetPicture
                    })}
                >
                    <Icon
                        name="camera"
                        type="feather"
                        size={70}
                    />
                </TouchableOpacity>
            )
        }

    }


    render() {
        const {navigate} = this.props.navigation;

        return (
            <View
                style={{paddingLeft: '3%',
                    paddingRight: '3%',
                    flex: 1,
                    paddingBottom: "7%"
                }}
            >
                <ImageView
                    images={this.state.images}
                    imageIndex={this.state.imageId}
                    isVisible={this.state.viewer}
                    onClose={() => this.setState({viewer: false})}
                />
                <View
                    style={{
                        borderStyle: "solid",
                        borderWidth: "1px",
                        borderRadius: "3px",
                        borderColor: "#d6d6d6",
                    }}
                >

                    <View
                        style={{backgroundColor: '#f5f5f5',
                            paddingLeft: '5%',
                            height: 45,
                            flex: 1,
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexDirection: "row",
                        }}
                    >
                        <TouchableOpacity
                            style={{paddingRight: "2%"}}
                            onPress={() => navigate("TaskCamera", {
                                setPicture: this.SetPicture
                            })}
                        >
                            <Icon
                                name='camera'
                                type="feather"
                            />
                        </TouchableOpacity>
                        <Text style={material.subheading}>{this.props.title}</Text>
                        <TouchableOpacity style={{paddingRight: "4%"}}
                                          onPress={() => this.ChangeParentState()}

                        >
                            {this.renderChecked()}
                        </TouchableOpacity>
                    </View>
                    {this.renderImageFlatList()}

                </View>
            </View>
        );
    }
}

export default withNavigation(TaskInputPicture);
