import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Alert,
  Text,
  Platform,
} from "react-native";
import { Button, Icon } from "react-native-elements";
import TaskInputText from "../components/TaskInputText";
import TaskInputPicture from "../components/TaskInputPicture";
import { withNavigation } from "react-navigation";
import { requestOperationDone } from "../utils/TasksRequests";
import LottieView from "lottie-react-native";

class TasksScreen extends React.Component {
  state = {
    data: null,
    beginningDate: Date.now(),
    job: this.props.navigation.state.params.job,
    sending: false,
  };

  constructor(props) {
    super(props);
    this.handleChecked = this.handleChecked.bind(this);
    this.handleText = this.handleText.bind(this);
    this.handlePicture = this.handlePicture.bind(this);
    this.handleDeletePicture = this.handleDeletePicture.bind(this);
    this.createTasks(this.props.navigation.state.params.tasks);
  }

  static navigationOptions = ({ navigation }) => {
    const { state } = navigation;
    return {
      title: "Tasks",
      headerStyle: {
        marginTop: Platform.OS !== "android" ? 20 : undefined,
      },
      headerLeft: (
        <TouchableOpacity
          onPress={() => this.goBack(navigation)}
          style={{
            height: 45,
            width: 45,
            alignItems: "center",
            justifyContent: "center",
            margin: 10,
          }}
        >
          <Icon name="arrow-left" type="feather" />
        </TouchableOpacity>
      ),
    };
  };

  static goBack(navigation) {
    const { navigate } = navigation;

    Alert.alert(
      "Leaving",
      "You are going to leave, tasks will not be saved",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Leave", onPress: () => navigate("Home") },
      ],
      { cancelable: false }
    );
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
        text: "",
      };
      newTask.push(item);
    }
    this.state = {
      data: newTask,
      beginningDate: Date.now(),
      job: this.props.navigation.state.params.job,
      sending: false,
    };
  }

  async sendTasksToServer() {
    const { navigate } = this.props.navigation;
    this.setState({
      sending: true,
    });
    this.animation.play();

    await requestOperationDone(
      this.state.beginningDate,
      this.state.data,
      this.state.job,
      navigate
    ).done(() => {});
  }

  handleText(id, text) {
    let data = this.state.data;
    data[id].text = text;
    this.setState({
      data: data,
    });
  }

  handlePicture(id, picture) {
    let data = this.state.data;
    if (!data[id].content) data[id].content = [];
    if (!data[id].date) data[id].date = [];
    data[id].content.push(picture);
    data[id].date.push(Date.now());
    this.setState({
      data: data,
    });
  }

  handleDeletePicture(id, idx) {
    let data = this.state.data;
    data[id].content.splice(idx, 1);
    this.setState({
      data: data,
    });
  }

  handleChecked(id) {
    let data = this.state.data;
    data[id].checked = !data[id].checked;
    this.setState({
      data: data,
    });
  }

  renderText(item, index) {
    return (
      <TaskInputText
        title={item.key}
        checked={item.checked}
        comment={item.comment}
        id={index}
        item={item}
        handleChecked={this.handleChecked}
        handleText={this.handleText}
        iconRight
        onPress={() => (item.checked = !item.checked)}
      />
    );
  }

  renderPicture(item, index) {
    try {
      return (
        <View>
          <TaskInputPicture
            title={item.key}
            checked={item.checked}
            comment={item.comment}
            id={index}
            item={item}
            handleChecked={this.handleChecked}
            handlePicture={this.handlePicture}
            handleText={this.handleText}
            handleDeletePicture={this.handleDeletePicture}
            iconRight
            onPress={() => (item.checked = !item.checked)}
          />
        </View>
      );
    } catch {
      return <View></View>;
    }
  }

  renderItems(item, index) {
    if (!item.imageForced) return this.renderText(item, index);
    else return this.renderPicture(item, index);
  }

  taskValidation() {
    Alert.alert(
      "Task validation",
      "Do you want to validate these tasks ? You can't change tasks after validation",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: () => this.sendTasksToServer() },
      ],
      { cancelable: false }
    );
  }

  render() {
    if (!this.state.data) {
      return <View />;
    } else if (this.state.sending) {
      return (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={styles.textData}>Sending task, please wait</Text>
          <View style={styles.imageWrapper}>
            <LottieView
              ref={(animation) => {
                this.animation = animation;
              }}
              style={styles.animationWrapper}
              source={require("../assets/5340-line-loader")}
              loop
            />
          </View>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <FlatList
          style={{ flex: 1 }}
          data={this.state.data}
          renderItem={({ item, index }) => this.renderItems(item, index)}
        />
        <View style={styles.buttonOpenMap}>
          <Button
            title="Validate tasks"
            type="solid"
            onPress={() => this.taskValidation()}
          />
        </View>
      </View>
    );
  }
}

export default withNavigation(TasksScreen);

const styles = StyleSheet.create({
  buttonOpenMap: {
    marginLeft: "3%",
    marginRight: "3%",
    flex: 0.1,
  },
  container: {
    flex: 1,
    paddingTop: "5%",
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  textTitle: {
    fontSize: 16,
    color: "#ada8a3",
    paddingTop: "2%",
    paddingLeft: "3%",
    paddingRight: "3%",
  },
  textData: {
    paddingBottom: 15,
    fontSize: 20,
    paddingLeft: "3%",
    paddingRight: "3%",
    textAlign: "center",
    color: "#65625f",
  },
  imageWrapper: {
    width: 170,
    height: 170,
    opacity: 0.85,
    justifyContent: "center",
  },
  loadingText: {
    width: "100%",
    textAlign: "center",
  },
  logoImage: {
    alignItems: "center",
  },
  animationWrapper: {
    width: "100%",
    height: "100%",
  },
});
