import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Alert,
  Text, Platform,
} from "react-native";
import { Button, Icon } from "react-native-elements";
import { requestOperationDone } from "../utils/TasksRequests";
import LottieView from "lottie-react-native";
import { useNavigation } from "@react-navigation/native";
import Task from "../components/Task";

const TasksScreen = ({ route }) => {
  const navigation = useNavigation();
  const { job, tasks } = route.params;

  const beginningDate = React.useRef(Date.now());
  const [sending, setSending] = React.useState(false);

  const [tasksList, setTasksList] = React.useState(
    tasks.map((task) => {
      return {
        imageForced: task.imagesForced,
        key: task.name,
        comment: task.comment,
        checked: false,
        content: null,
        text: "",
      };
    }),
  );

  React.useEffect(() => {
    navigation.setOptions({
      title: "Tasks",
      headerShown: true,
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              "Leaving",
              "You are going to leave, job will not be saved",
              [
                {
                  text: "Cancel",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel",
                },
                { text: "Leave", onPress: () => navigation.navigate("Home") },
              ],
              { cancelable: true },
            );
          }}
        >
          <View
            style={{
              height: 45,
              width: 45,
              alignItems: "center",
              justifyContent: "center",
              marginRight: Platform.OS === "android" ? 10 : 0,
            }}
          >
            <Icon name="arrow-left" type="feather" />
          </View>
        </TouchableOpacity>
      ),
    });
  }, []);

  const sendTasksToServer = React.useCallback(() => {
    const { navigate } = this.props.navigation;
    setSending(true);

    requestOperationDone(beginningDate.current, tasksList, job, navigate).done(
      () => {},
    );
  }, [tasksList, job, beginningDate]);

  const handleTaskValidation = React.useCallback(() => {
    Alert.alert(
      "Task validation",
      "Do you want to validate these tasks ? You can't change tasks after validation",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: () => sendTasksToServer() },
      ],
      { cancelable: false },
    );
  }, []);

  const handleTaskChecked = React.useCallback(
    (idx) => {
      const newList = [...tasksList];
      const task = newList[idx];
      task.checked = !task.checked;
      setTasksList(newList);
    },
    [tasksList],
  );

  const handleTaskTextChange = React.useCallback(
    (idx, text) => {
      const newList = [...tasksList];
      const task = newList[idx];
      task.text = text;
      setTasksList(newList);
    },
    [tasksList],
  );

  const handleTaskPicture = React.useCallback(
    (idx, picture) => {
      const newList = [...tasksList];
      const task = newList[idx];
      if (!task.content) task.content = [];
      if (!task.date) task.date = [];
      task.content.push(picture);
      task.date.push(Date.now());
      setTasksList(newList);
    },
    [tasksList],
  );

  const handleTaskDeletePicture = React.useCallback(
    (idx, pictureIdx) => {
      const newList = [...tasksList];
      const task = newList[idx];
      task.content.splice(pictureIdx, 1);
      setTasksList(newList);
    },
    [tasksList],
  );

  if (sending) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={styles.textData}>Sending task, please wait</Text>
        <View style={styles.imageWrapper}>
          <LottieView
            ref={(animation) => {
              if (animation) animation.play();
            }}
            style={styles.animationWrapper}
            source={require("../assets/5340-line-loader")}
            loop
          />
        </View>
      </View>
    );
  }

  if (!tasksList) {
    return <View />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        style={{ flex: 1 }}
        data={tasksList}
        renderItem={({ item, index }) => (
          <Task
            key={"task" + index}
            task={item}
            onChecked={handleTaskChecked}
            onTextChange={handleTaskTextChange}
            onAddPicture={handleTaskPicture}
            onDeletePicture={handleTaskDeletePicture}
          />
        )}
      />
      <View style={styles.buttonOpenMap}>
        <Button
          title="Validate tasks"
          type="solid"
          onPress={handleTaskValidation}
        />
      </View>
    </View>
  );
};

export default TasksScreen;

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
