import React from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    TextInput,
    Image,
    ScrollView,
    ImageBackground,
    FlatList, StyleSheet
} from 'react-native';
import { material } from 'react-native-typography'
import {Tooltip, Icon} from 'react-native-elements'
import ImageView from 'react-native-image-view';
import TaskCamera from "../screens/TaskCamera";
import {withNavigation} from "react-navigation";

class TaskInputPicture extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: this.props.checked,
            edit: false,
            text: "",
            viewer: false,
            cameraEnable: false,
            imageId: 0,
            images: [
            ]
        }
    }

    SetPicture = (data) => {
        this.pictureChanged(data);
        let picture = {
            source: {
                uri: data.uri,
            },
            title: 'Paris',
            width: 806,
            height: 720,
        };
        let images = this.state.images;
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

    pictureChanged(data) {
        this.props.handlePicture(this.props.id, data)
    }

    ChangeParentState() {
        this.setState({checked: !this.state.checked});
        this.props.handleChecked(this.props.id)
    }

    toogleViewer(index){
        console.log("true");
        this.setState({viewer: true, imageId: index})
    }

    deleteImage(idx) {
        let array = [...this.state.images]; // make a separate copy of the array
        array.splice(idx, 1);
        this.setState({images: array});
        this.props.handleDeletePicture(this.props.id, idx);
    }

    renderImage(item, index)
    {
        return (
            <View style={{position: 'static'}}>
                <TouchableOpacity style={{paddingRight: 10}}
                                  onPress={() => this.toogleViewer(index)}
                >
                    <ImageBackground source={{uri: item.source.uri}}
                                     style={{
                                         width: 100, height: 95, borderRadius: 4}}

                    >
                        <TouchableOpacity
                            onPress={() => this.deleteImage(index)}
                            style={{
                                position: 'absolute',
                                bottom:0
                            }}
                        >
                            <Icon
                                name="clear"
                                size={30}
                                color='#ff0000'
                            />
                        </TouchableOpacity>

                    </ImageBackground>
                </TouchableOpacity>
            </View>
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

    textChanged(text) {
        this.setState({text: text});
        this.props.handleText(this.props.id, text)
    }

    renderTextEdit() {
        if (this.state.edit) {
            return (
                <View
                    style={{paddingLeft: "3%", backgroundColor: "#f3f3f3", borderBottomLeftRadius: "15%"}}
                >
                    <TextInput
                        style={{height: 40}}
                        placeholder="Type here to write information!"
                        onChangeText={(text) => this.textChanged(text)}
                        value={this.state.text}
                    />
                </View>
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
                        borderRadius: "15%",
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
                            borderTopLeftRadius: "15%",
                            borderTopRightRadius: "15%",
                        }}
                    >


                        <TouchableOpacity
                            style={{paddingRight: "2%"}}
                            onPress={() => this.setState({edit: !this.state.edit})}
                        >
                            <Icon
                                name='edit'
                                type="feather"
                            />
                        </TouchableOpacity>
                        <Tooltip popover={<Text>{this.props.comment}</Text>}>
                            <Text style={material.subheading}>{this.props.title}</Text>
                        </Tooltip>
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
                        <TouchableOpacity style={{paddingRight: "4%"}}
                                          onPress={() => this.ChangeParentState()}

                        >
                            {this.renderChecked()}
                        </TouchableOpacity>
                    </View>
                    {this.renderTextEdit()}

                    {this.renderImageFlatList()}

                </View>
            </View>
        );
    }
}

export default withNavigation(TaskInputPicture);
