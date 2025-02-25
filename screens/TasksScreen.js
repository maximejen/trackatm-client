import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Alert,
  Text,
  Platform,
  BackHandler,
} from "react-native";
import { Button, Icon } from "react-native-elements";
import { requestOperationDone } from "../utils/TasksRequests";
import LottieView from "lottie-react-native";
import { useNavigation, usePreventRemove } from "@react-navigation/native";
import Task from "../components/Task";

const TasksScreen = ({ route }) => {
  const navigation = useNavigation();
  const { job, tasks } = route.params;

  const beginningDate = React.useRef(Date.now());
  const [sending, setSending] = React.useState(false);

  const tasksList = React.useRef(
    tasks.map((task) => {
      return {
        ...task,
        key: task.name,
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
    });
  }, []);

  const onBackPress = React.useCallback(() => {
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

    return true;
  }, []);

  usePreventRemove(true, onBackPress);

  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress,
    );
    return () => backHandler.remove();
  }, []);

  const sendTasksToServer = React.useCallback(() => {
    setSending(true);

    requestOperationDone(
      beginningDate.current,
      tasksList.current,
      job,
      navigation.navigate,
    ).then(() => {});
  }, [job, beginningDate]);

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
    (idx, value) => {
      const task = tasksList.current[idx];
      if (task) {
        task.checked = value;
      }
    },
    [tasksList],
  );

  const handleTaskTextChange = React.useCallback(
    (idx, text) => {
      const task = tasksList.current[idx];
      if (task) {
        task.text = text;
      }
    },
    [tasksList],
  );

  const handleTaskPicture = React.useCallback(
    (idx, picture) => {
      const task = tasksList.current[idx];
      if (task) {
        if (!task.content) task.content = [];
        if (!task.date) task.date = [];
        task.content.push(picture);
        task.date.push(Date.now());
      }
    },
    [tasksList],
  );

  const handleTaskDeletePicture = React.useCallback(
    (idx, pictureIdx) => {
      const task = tasksList.current[idx];
      if (task) {
        task.content.splice(pictureIdx, 1);
      }
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

  if (!tasksList.current) {
    return <View />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        style={{ flex: 1 }}
        data={tasksList.current}
        renderItem={({ item, index }) => (
          <Task
            key={"task" + index}
            task={item}
            index={index}
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
