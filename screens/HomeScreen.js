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
  SectionList
} from 'react-native';
import { WebBrowser } from 'expo';


import TouchableScale from 'react-native-touchable-scale'; // https://github.com/kohver/react-native-touchable-scale
import { LinearGradient } from 'expo';

import { ListItem } from 'react-native-elements'


export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Home',
    headerLeft: null
  };

  constructor(props) {
    super(props);
    const {navigate} = this.props.navigation;
    this.updateTitle("3 tasks remaining");
  }

  updateTitle(title) {
    this.props.navigation.setParams({
      HomeScreen: {
        title: title
      }
    });
    HomeScreen.navigationOptions.title = title
  }

  renderTitle(name, colors) {
    return (
        <ListItem

            Component={TouchableScale}
            friction={90} //
            tension={100} // These props are passed to the parent component (here TouchableScale)
            activeScale={0.95} //
            linearGradientProps={{
              colors: colors,
              start: [1, 0],
              end: [0.2, 0],
            }}
            ViewComponent={LinearGradient} // Only if no expo
            //leftAvatar={{ source: { uri: avatar_url } }}
            // title="Chris Jackson"
            titleStyle={{ color: 'black', fontWeight: 'bold', textAlign: 'center'}}
            // subtitle="Vice Chairman"
            title={name}
        />
    )
  }

  renderItem(item, colors) {
    return (
        <ListItem style={{borderRadius: '10px'}}

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
            //leftAvatar={{ source: { uri: avatar_url } }}
            // title="Chris Jackson"
                  titleStyle={{ color: 'white', fontWeight: 'bold' }}
                  subtitleStyle={{ color: 'white' }}
            // subtitle="Vice Chairman"
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



  renderItems = ({ item }) =>
  {
    if (!item.atm_name) {
      return this.renderTitle(item.type, ["white"])
    }

    if (item.type === "important") {
      return this.renderItem(item, ["white", "#F44336"])
    } else if (item.type === "today") {
      return this.renderItem(item, ["white", "grey"])
    } else if (item.type === "done") {
      return this.renderItem(item, ["white", "green"])
    }
  };

  render () {
    var listToday = [
      {
        type: "Important"
      },
      {
        atm_name: 'ATM #10',
        bank_name: 'ABC',
        lat: 48.576678,
        long: 7.749236,
        avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
        type: "important"

      },
      {
        atm_name: 'ATM #10',
        bank_name: 'ABC',
        lat: 34.325632,
        long: 9.746543,
        avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
        type: "important"


      },
      {
        type: "Today"
      },
      {
        atm_name: 'ATM #10',
        bank_name: 'ABC',
        lat: 48.576678,
        long: 7.749236,
        avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
        type: "today"

      },
      {
        type: "Done"
      },
      {
        atm_name: 'ATM #10',
        bank_name: 'ABC',
        lat: 34.325632,
        long: 9.746543,
        avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
        type: "done"

      },
    ];
    return (
        <View style={styles.container}>

          <SectionList
              sections={[
                {title: 'D', data: ['Devin']},
                {title: 'J', data: ['Jackson', 'James', 'Jillian', 'Jimmy', 'Joel', 'John', 'Julie']},
              ]}
              renderItem={({item}) => <Text style={styles.item}>{item}</Text>}
              renderSectionHeader={({section}) => <Text style={styles.sectionHeader}>{section.title}</Text>}
              keyExtractor={(item, index) => index}
          />
        </View>
        /* <FlatList
             keyExtractor={(item, index) => index.toString()}
             data={listToday}
             renderItem={this.renderItems}
         />*/
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22
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