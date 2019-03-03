import React from 'react';
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    FlatList,
    SectionList,
    RefreshControl
} from 'react-native';
import { withNavigation } from "react-navigation"
import TouchableScale from 'react-native-touchable-scale'; // https://github.com/kohver/react-native-touchable-scale
import { LinearGradient } from 'expo';
import { ListItem } from 'react-native-elements'

class HomeScreen extends React.Component {
    static navigationOptions = {
        title: 'Home',
        headerLeft: null
    };

    constructor(props) {
        super(props);
        this.navigate  = props.navigation;
        this.updateTitle("3 tasks remaining");
        this.state = {
            refreshing: false,
        };
    }

    updateTitle(title) {
        this.props.navigation.setParams({
            HomeScreen: {
                title: title
            }
        });
        HomeScreen.navigationOptions.title = title
    }

    renderItem(item, colors) {
        const {navigate} = this.props.navigation;
        return (
            <ListItem style={{borderRadius: '10px'}}
                      onPress={() => navigate('JobInformation', {job: item, name: 'dams'})}
                      Component={TouchableScale}
                      friction={90} //
                      tension={100} // These props are passed to the parent component (here TouchableScale)
                      activeScale={0.95} //
                      linearGradientProps={{
                          //colors: ['#186bf2', '#5f96ef'],
                          colors: colors,
                          start: [1, 0],
                          end: [0.2, 0],
                      }}
                      ViewComponent={LinearGradient} // Only if no expo
                      titleStyle={{ color: 'white', fontWeight: 'bold' }}
                      subtitleStyle={{ color: 'white' }}
                      chevronColor="white"
                      chevron

                      title={item.atm_name + " - " + item.bank_name}
                      subtitle={item.lat + ", " + item.long}
                      leftAvatar={{
                          rounded: true,
                          source: item.avatar_url && { uri: item.avatar_url },
                          title: item.name
                      }}
            />
        )
    }

    _onRefresh = () => {
        this.setState({refreshing: true});
        this.setState({refreshing: false});
    };

    renderItems = ({ item }) =>
    {
        if (!item.atm_name) {
            return this.renderTitle(item.type, ["white"])
        }

        if (item.type === "important") {
            return this.renderItem(item, ["#ff7373", "#ff7373"])
        } else if (item.type === "today") {
            return this.renderItem(item, ["#29ddd7", "#29ddd7"])
        } else if (item.type === "done") {
            return this.renderItem(item, ["#d1d951", "#d1d951"])
        }
    };

    render () {
        return (
            <View style={styles.container}>

                <SectionList

                    sections={[
                        {title: 'Important', data:
                                [
                                    {
                                        atm_name: 'ATM #10',
                                        bank_name: 'ABC',
                                        lat: 48.576678,
                                        long: 7.749236,
                                        avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
                                        type: "important"

                                    },
                                ]},
                        {title: 'Today', data: [
                                {
                                    atm_name: 'ATM #9',
                                    bank_name: 'BC',
                                    lat: 48.576678,
                                    long: 7.749236,
                                    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
                                    type: "today"

                                },
                                {
                                    atm_name: 'ATM #10',
                                    bank_name: 'ABC',
                                    lat: 48.613675,
                                    long: 7.752227,
                                    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
                                    type: "today"

                                },
                            ]},
                        {title: 'Done', data: [
                                {
                                    atm_name: 'ATM #10',
                                    bank_name: 'ABC',
                                    lat: 48.576678,
                                    long: 7.749236,
                                    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
                                    type: "done"

                                },
                                {
                                    atm_name: 'ATM #10',
                                    bank_name: 'ABC',
                                    lat: 48.576678,
                                    long: 7.749236,
                                    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
                                    type: "done"

                                },
                            ]},
                    ]}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh}
                        />}
                    renderItem={this.renderItems}
                    renderSectionHeader={({section: {title}}) => (
                        <Text style={{fontWeight: 'bold'}}>{title}</Text>)}
                    keyExtractor={(item, index) => index}

                />
            </View>
        )
    }
}

export default withNavigation(HomeScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 22
    },
    sectionHeaderImportant: {
        paddingTop: 2,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 2,
        fontSize: 14,
        fontWeight: 'bold',
        backgroundColor: '#ff220f',
    },
    sectionHeader: {
        paddingTop: 2,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 2,
        fontSize: 14,
        fontWeight: 'bold',
        backgroundColor: 'rgba(247,247,247,1.0)',
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
});