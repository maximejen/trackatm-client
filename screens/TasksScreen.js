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

export default class TasksScreen extends React.Component {
    static navigationOptions = {
        title: 'Tasks',
    };
    async componentDidMount() {
    }

    constructor(props) {
        super(props);
        this.state = ({job: this.props.navigation.state.params.job});
    }

    renderText(item) {
        return (<CheckBox
            title={item.key}
            checked={item.checked}
            iconRight
            onPress={() => item.checked = !item.checked}
        />)
    }

    renderPicture(item) {
        return (
            <View>
                <CheckBox
                    title={item.key}
                    checked={item.checked}
                    iconRight
                    onPress={() => item.checked = !item.checked}
                />
                <Text>Hello</Text>
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
                    data={[
                        {type: 'Text', key:'Good condition', checked: false},
                        {type: 'Text', key:'Enough money', checked: false},
                        {type: 'Picture', key:'Image of atm before check', checked: false}
                    ]}
                    renderItem={this.renderItems}
                />
            </View>
        )
    }
}

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