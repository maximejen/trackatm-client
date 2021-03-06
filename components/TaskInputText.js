import React from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    TextInput
} from 'react-native';
import { material } from 'react-native-typography'
import {Tooltip, Icon} from 'react-native-elements'

export default class TaskInputText extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: this.props.checked,
            edit: false,
            text: ""
        }
    }

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

    textChanged(text) {
        this.setState({text: text});
        this.props.handleText(this.props.id, text)
    }
    renderTextEdit() {
        if (this.state.edit) {
            return (
                <View
                    style={{paddingLeft: "3%"}}
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
        return (
            <View
                style={{paddingLeft: '3%',
                    paddingRight: '3%',
                    flex: 1,
                    paddingBottom: "7%"
                }}
            >
                <View
                    style={{
                        borderStyle: "solid",
                        borderWidth: 1,
                        borderRadius: 15,
                        borderColor: "#d6d6d6",
                    }}
                >

                    <View
                        style={{backgroundColor: '#f5f5f5',
                            paddingLeft: '5%',
                            height: 45,
                            flex: 1,
                            borderRadius: 15,
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexDirection: "row",
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
                        <TouchableOpacity style={{paddingRight: "4%"}}
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
