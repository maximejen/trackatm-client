import React from "react";
import {
  FlatList,
  ImageBackground,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Icon, Tooltip } from "react-native-elements";
import { material } from "react-native-typography";
import { useNavigation } from "@react-navigation/native";
import WrapComponent from "../utils/WrapComponent";
import { calcWidth } from "../utils/deviceResponsiveHelper";

const Task = ({
  task,
  index,
  onChecked,
  onTextChange,
  onAddPicture,
  onDeletePicture,
}) => {
  const { navigate } = useNavigation();

  const isImageTask = React.useMemo(() => {
    return task.imagesForced;
  }, [task]);

  const [editMode, setEditMode] = React.useState(false);
  const [viewMedias, setViewMedias] = React.useState(false);

  const [checked, setChecked] = React.useState(task.checked ?? false);
  React.useEffect(() => onChecked?.(index, checked), [index, checked]);

  const [text, setText] = React.useState(task.text ?? "");
  React.useEffect(() => onTextChange?.(index, text), [index, text]);

  const [medias, setMedias] = React.useState([]);
  const mediasRef = React.useRef(medias);
  React.useEffect(() => {
    mediasRef.current = medias;
  }, [medias]);

  const handleAddPicture = React.useCallback(
    (picture) => {
      setMedias([...mediasRef.current, picture]);
      onAddPicture(index, picture);
    },
    [index, medias],
  );

  const handleRemovePicture = React.useCallback(
    (pictureIdx) => {
      const ms = [...mediasRef.current];
      ms.splice(pictureIdx, 1);
      setMedias(ms);
      onDeletePicture(index, pictureIdx);
    },
    [index, medias],
  );

  return (
    <View
      style={{
        paddingLeft: calcWidth(3),
        paddingRight: calcWidth(3),
        flex: 1,
        paddingBottom: 15,
      }}
    >
      <View
        style={{
          borderStyle: "solid",
          borderWidth: 1,
          borderRadius: 15,
          borderColor: "#d6d6d6",
          overflow: "hidden",
        }}
      >
        <View
          style={{
            backgroundColor: "#f5f5f5",
            paddingLeft: calcWidth(3),
            height: 45,
            flex: 1,
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <View
            style={{
              alignItems: "center",
              flexDirection: "row",
              gap: calcWidth(3),
            }}
          >
            <TouchableOpacity onPress={() => setEditMode(!editMode)}>
              <Icon name="edit" type="feather" />
            </TouchableOpacity>
            <WrapComponent
              condition={task.comment && task?.comment !== ""}
              wrap={(children) => {
                return (
                  <Tooltip popover={<Text>{task.comment}</Text>}>
                    {children}
                  </Tooltip>
                );
              }}
            >
              <Text style={material.subheading}>{task.name}</Text>
            </WrapComponent>
          </View>
          <View
            style={{
              alignItems: "center",
              flexDirection: "row",
              gap: calcWidth(3),
            }}
          >
            {isImageTask && (
              <TouchableOpacity
                onPress={() =>
                  navigate("TaskCamera", {
                    setPicture: handleAddPicture,
                  })
                }
              >
                <Icon name="camera" type="feather" />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={{ paddingRight: calcWidth(3) }}
              onPress={() => setChecked(!checked)}
            >
              <Icon name={checked ? "check-square" : "square"} type="feather" />
              ;
            </TouchableOpacity>
          </View>
        </View>
        {editMode && (
          <View style={{ paddingLeft: calcWidth(3) }}>
            <TextInput
              style={{ height: 40 }}
              placeholder="Type here to write a comment"
              placeholderTextColor={"grey"}
              onChangeText={(text) => setText(text)}
              value={text}
            />
          </View>
        )}
        {isImageTask && (
          <>
            <FlatList
              style={{
                height: 100 + calcWidth(6),
                paddingTop: calcWidth(3),
                paddingBottom: calcWidth(3),
                paddingHorizontal: calcWidth(3),
              }}
              horizontal={true}
              keyExtractor={(item, index) => index.toString()}
              data={[...medias, null]}
              renderItem={({ item, index }) => {
                if (!item) {
                  return (
                    <View
                      style={{
                        height: "100",
                        alignItems: "center",
                        marginLeft: "3%",
                        flexDirection: "row",
                        justifyContent: "center",
                        width: "100",
                        borderRadius: 8,
                        borderWidth: 2,
                        borderColor: "black",
                      }}
                    >
                      <TouchableOpacity
                        onPress={() =>
                          navigate("TaskCamera", {
                            setPicture: handleAddPicture,
                          })
                        }
                      >
                        <Icon name="camera" type="feather" size={50} />
                      </TouchableOpacity>
                    </View>
                  );
                }
                return (
                  <View
                    key={task.id + "image" + index}
                    style={{
                      marginRight: calcWidth(3),
                    }}
                  >
                    <TouchableOpacity onPress={() => setViewMedias(true)}>
                      <ImageBackground
                        source={{ uri: item.uri }}
                        style={{
                          width: 100,
                          height: 100,
                          borderRadius: 8,
                          overflow: "hidden",
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => handleRemovePicture(index)}
                          style={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                          }}
                        >
                          <Icon name="clear" size={30} color="#ff0000" />
                        </TouchableOpacity>
                        <View
                          style={{
                            position: "absolute",
                            right: 0,
                            top: 0,
                            margin: 5,
                            padding: 2,
                            borderRadius: 4,
                            backgroundColor: "#ffffff88",
                          }}
                        >
                          <Icon
                            name="camera"
                            type={"feather"}
                            size={18}
                            color="black"
                          />
                        </View>
                      </ImageBackground>
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
          </>
        )}
      </View>
    </View>
  );
};

export default Task;
