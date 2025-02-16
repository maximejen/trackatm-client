import React from "react";
import { View } from "react-native";

const Task = ({ task, index }) => {
  const isImageTask = React.useMemo(() => {
    return task.imageForced;
  }, [task]);

  return <View></View>;
};

export default Task;
