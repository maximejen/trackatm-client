import React from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    FlatList,
    Alert
} from 'react-native';
import { Camera, Permissions } from 'expo';
import {Button, CheckBox, Icon} from 'react-native-elements'

import TaskInputText from '../components/TaskInputText'
import TaskInputPicture from '../components/TaskInputPicture'
import {withNavigation} from "react-navigation";

class TasksScreen extends React.Component {
    static navigationOptions = ({ navigation  }) => {
        const {state} = navigation;
        return {
            title: 'Home',
            headerLeft: (
                <TouchableOpacity
                    onPress={() => this.goBack(navigation)}
                    style={{
                        height: 45,
                        width: 45,
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: 10,

                    }}
                >
                    <Icon
                        name='x'
                        type='feather'
                    />
                </TouchableOpacity>
            )
        }

    };
    static goBack(navigation) {
        const {navigate} = navigation;

        Alert.alert(
            'Task validation',
            'Do you want to validate these data ? You can\'t change data after validation',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {text: 'Leave', onPress: () => navigate('Home')},
            ],
            {cancelable: false},
        );
    }

    constructor(props) {
        super(props);
        this.handleChecked = this.handleChecked.bind(this);
        this.handleText = this.handleText.bind(this);
        this.handlePicture = this.handlePicture.bind(this);
        this.handleDeletePicture = this.handleDeletePicture.bind(this);
        this.state = ({
            data: [
                {type: 'Text', key:'Good condition', checked: false, content: null, text: ""},
                {type: 'Text', key:'Enough money But i dont care', checked: true, content: null, text: ""},
                {type: 'Picture', key:'Image of atm before check', checked: false, content: null, text: ""},
                {type: 'Picture', key:'Image of atm after check', checked: false, content: null, text: ""},
                {type: 'Picture', key:'Image of atm after checks', checked: false, content: null, text: ""},
                {type: 'Picture', key:'Image of atm after checkss', checked: false, content: null, text: ""},
                {type: 'Picture', key:'Image of atm after checksss', checked: false, content: null, text: ""}
            ]
        });
    }

    createFormData = (photo, body) => {
        const data = new FormData();

        data.append("photo", {
            name: photo.fileName,
            type: photo.type,
            uri:
                Platform.OS === "android" ? photo.uri : photo.uri.replace("file://", "")
        });

        Object.keys(body).forEach(key => {
            data.append(key, body[key]);
        });

        return data;
    };

    sendTasksToServer() {
        const {navigate} = this.props.navigation;
        navigate("Home")
    }

    handleText(id, text){
        let data = this.state.data;
        data[id].text = text;
        this.setState({
            data: data
        });
    }

    handlePicture(id, picture){
        let data = this.state.data;
        if (!data[id].content)
            data[id].content = [];
        data[id].content.push(picture);
        this.setState({
            data: data
        });
    }

    handleDeletePicture(id, idx){
        let data = this.state.data;
        data[id].content.splice(idx, 1);
        this.setState({
            data: data
        });
    }

    handleChecked(id) {
        let data = this.state.data;
        data[id].checked = !data[id].checked;
        this.setState({
            data: data
        });
    }

    renderText(item, index) {

        return (<TaskInputText
            title={item.key}
            checked={item.checked}
            id={index}
            item={item}
            handleChecked = {this.handleChecked}
            handleText = {this.handleText}
            iconRight
            onPress={() => item.checked = !item.checked}
        />)
    }

    renderPicture(item, index) {
        return (
            <View>
                <TaskInputPicture
                    title={item.key}
                    checked={item.checked}
                    id={index}
                    item={item}
                    handleChecked = {this.handleChecked}
                    handlePicture = {this.handlePicture}
                    handleText = {this.handleText}
                    handleDeletePicture = {this.handleDeletePicture}
                    iconRight
                    onPress={() => item.checked = !item.checked}
                />
            </View>
        )
    }


    renderItems( item, index)
    {
        if (item.type === 'Text')
            return this.renderText(item, index);
        else return this.renderPicture(item, index)
    };



    taskValiddation() {
        Alert.alert(
            'Task validation',
            'Do you want to validate these data ? You can\'t change data after validation',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {text: 'OK', onPress: () => this.sendTasksToServer()},
            ],
            {cancelable: false},
        );
    }


    render () {
        return (
            <View style={styles.container}>
                <FlatList
                    style={{flex: 1}}
                    data={this.state.data}
                    renderItem={({item, index}) => this.renderItems(item, index)}
                />
                <View style={styles.buttonOpenMap}>
                    <Button
                        title="Validate tasks"
                        type="solid"
                        onPress={() => this.taskValiddation()}
                    /></View>
            </View>
        )
    }
}

export default withNavigation(TasksScreen);

const styles = StyleSheet.create({
    buttonOpenMap: {
        marginLeft: '3%',
        marginRight: '3%',
        flex: 0.1
    },
    container: {
        flex: 1,
        paddingTop: "5%"
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
})