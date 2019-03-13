import React from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    TextInput,
    Image,
    ScrollView,
    FlatList
} from 'react-native';
import { material } from 'react-native-typography'
import {CheckBox, Icon} from 'react-native-elements'
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
                {
                    source: {
                        uri: 'https://cdn.pixabay.com/photo/2017/08/17/10/47/paris-2650808_960_720.jpg',
                    },
                    title: 'Paris',
                    width: 806,
                    height: 720,
                },
                {
                    source: {
                        uri: 'https://cdn.pixabay.com/photo/2017/08/17/10/47/paris-2650808_960_720.jpg',
                    },
                    title: 'Paris',
                    width: 806,
                    height: 720,
                },
                {
                    source: {
                        uri: 'https://cdn.pixabay.com/photo/2017/08/17/10/47/paris-2650808_960_720.jpg',
                    },
                    title: 'Paris',
                    width: 806,
                    height: 720,
                },
                {
                    source: {
                        uri: 'https://cdn.pixabay.com/photo/2017/08/17/10/47/paris-2650808_960_720.jpg',
                    },
                    title: 'Paris',
                    width: 806,
                    height: 720,
                },
            ]
        }
    }

    SetPicture = (data) => {
        console.log(data)
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

    toogleViewer(){
        console.log("true");
        this.setState({viewer: true})
    }

    renderImage = ({item}) =>
    {
        return (
            <TouchableOpacity style={{paddingRight: 10}}
                              onPress={() => this.toogleViewer()}
            >
                <Image source={{uri: item.source.uri}}
                       style={{width: 100, height: 95, borderRadius: 4}} />
            </TouchableOpacity>
        )
    }

    renderTextEdit() {
            return (
                <FlatList
                    style={{
                        height: 140,
                        paddingTop: 20
                    }}
                    horizontal={true}
                    keyExtractor={(item, index) => index.toString()}
                    data={this.state.images}
                    renderItem={this.renderImage}
                />
            )

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
                    imageIndex={0}
                    isVisible={this.state.viewer}
                    renderFooter={(currentImage) => (<View><Text>My footer</Text></View>)}
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
                            height: 35,
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
                        <TouchableOpacity style={{paddingLeft: "4%"}}
                                          onPress={() => this.ChangeParentState()}

                        >
                            {this.renderChecked()}
                        </TouchableOpacity>
                    </View>
                    {this.renderTextEdit()}
                </View>
            </View>
        );
    }
}

export default withNavigation(TaskInputPicture);
