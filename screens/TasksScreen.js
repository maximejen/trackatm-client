import React from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    FlatList,
    Alert
} from 'react-native';
import {Button, Icon} from 'react-native-elements'
import TaskInputText from '../components/TaskInputText'
import TaskInputPicture from '../components/TaskInputPicture'
import {withNavigation} from "react-navigation";
import {requestOperationDone} from '../utils/TasksRequests'

class TasksScreen extends React.Component {
    static navigationOptions = ({ navigation  }) => {
        const {state} = navigation;
        return {
            title: 'Tasks',
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
                        name='arrow-left'
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

    state = {
        data: null,
        beginningDate: Date.now(),
        job: this.props.navigation.state.params.job
    };

    constructor(props) {
        super(props);
        this.handleChecked = this.handleChecked.bind(this);
        this.handleText = this.handleText.bind(this);
        this.handlePicture = this.handlePicture.bind(this);
        this.handleDeletePicture = this.handleDeletePicture.bind(this);
        this.createTasks(this.props.navigation.state.params.tasks);
    }

    createTasks(task) {
        let newTask = [];
        for (let i = 0; i < task.length; i++) {
            let item = {
                imageForced: task[i].imagesForced,
                key: task[i].name,
                comment: task[i].comment,
                checked: false,
                content: null,
                text: ""
            };
            newTask.push(item);
        }
        this.state = {
            data: newTask,
            beginningDate: Date.now(),
            job: this.props.navigation.state.params.job
        };
    };

    sendTasksToServer() {
        const {navigate} = this.props.navigation;
        requestOperationDone(this.state.beginningDate, this.state.data, this.state.job).done(() => {
                navigate("Home", {done: true})
        })
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
        if (!data[id].date)
            data[id].date = [];
        data[id].content.push(picture);
        data[id].date.push(Date.now());
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
            comment={item.comment}
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
                    comment={item.comment}
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
        if (!item.imageForced)
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
        if (!this.state.data) {
            return (
                <View/>
            )
        }
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
});