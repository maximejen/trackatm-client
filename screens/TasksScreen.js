import React from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    FlatList
} from 'react-native';
import { Camera, Permissions } from 'expo';
import { CheckBox } from 'react-native-elements'

import TaskInputText from '../components/TaskInputText'
import TaskInputPicture from '../components/TaskInputPicture'
import {withNavigation} from "react-navigation";

class TasksScreen extends React.Component {
    static navigationOptions = {
        title: 'Tasks',
    };
    async componentDidMount() {
    }

    constructor(props) {
        super(props);
        this.handleChecked = this.handleChecked.bind(this);
        this.handleText = this.handleText.bind(this);
        this.state = ({job: this.props.navigation.state.params.job,
            data: [
                    {id: 0,type: 'Text', key:'Good condition', checked: false, text: ""},
        {id: 1, type: 'Text', key:'Enough money But i dont care', checked: true, text: ""},
        {id: 2,type: 'Picture', key:'Image of atm before check', checked: false, text: ""}
    ]
        });
    }

    handleText(id, text){
        var data = this.state.data;
        data[id].text = text;
        this.setState({
            data: data
        });
    }

    handleChecked(id) {
        var data = this.state.data;
        data[id].checked = !data[id].checked
        this.setState({
            data: data
        });
    }

    renderText(item) {

        return (<TaskInputText
            title={item.key}
            checked={item.checked}
            id={item.id}
            item={item}
            handleChecked = {this.handleChecked}
            handleText = {this.handleText}
            iconRight
            onPress={() => item.checked = !item.checked}
        />)
    }

    renderPicture(item) {
        return (
            <View>
                <TaskInputPicture
                    title={item.key}
                    checked={item.checked}
                    id={item.id}
                    item={item}
                    handleChecked = {this.handleChecked}
                    handleText = {this.handleText}
                    iconRight
                    onPress={() => item.checked = !item.checked}
                />
            </View>
        )
    }


    renderItems = ({ item }) =>
    {
        if (item.type === 'Text')
            return this.renderText(item);
        else return this.renderPicture(item)
    };


    render () {
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.data}
                    renderItem={this.renderItems}
                />
            </View>
        )
    }
}

export default withNavigation(TasksScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 22
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
})