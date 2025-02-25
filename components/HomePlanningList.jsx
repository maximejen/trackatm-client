import React from "react";
import {
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  SectionList,
} from "react-native";
import { Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { ShowVersion } from "../screens/HomeScreen";
import { calcWidth } from "../utils/deviceResponsiveHelper";
import useResponsiveFlatlistColumns from "../utils/useResponsiveFlatlistColumns";
import { useAlertContext } from "./AlertContext";

const DaysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const PlanningItem = ({ item, section, getDistance, itemWidth }) => {
  const { navigate } = useNavigation();

  const distance = getDistance(item.place.geoCoords);

  return (
    <TouchableOpacity
      onPress={() => {
        navigate("JobInformation", {
          job: item,
          initialDate: section.title.substr(-10, 10),
        });
      }}
      style={[
        styles.itemContainer,
        { backgroundColor: item.color, width: itemWidth },
      ]}
    >
      <Text style={styles.itemName}>{item.place.name}</Text>
      <Text style={styles.itemCode}>{item.template.name}</Text>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text style={styles.itemCode}>
          {distance ? `${distance.toFixed(2)}km` : "Unknown distance"}
        </Text>
        {item.done ? <Icon name="check" type="feather" /> : null}
      </View>
    </TouchableOpacity>
  );
};

const HomePlanningList = ({ planning, onRefresh, getDistance }) => {
  const [refreshing, setRefreshing] = React.useState(true);

  const handleRefresh = () => {
    setRefreshing(true);
    onRefresh?.();
  };

  const sortedArray = React.useMemo(() => {
    setRefreshing(false);
    let sortedArray = [];
    Object.keys(planning).map((date) => {
      const dayOperations = planning[date];
      const actualDay = new Date(date);
      let filteredOperations = dayOperations.filter(
        (operation) => !operation.done,
      );
      if (filteredOperations.length > 0) {
        let operations = filteredOperations.map((operation) => {
          const color = operation.template.color;
          return { ...operation, color: color ? color : "#2089dc" };
        });
        let item = {
          title: DaysOfWeek[actualDay.getDay()] + " - " + date,
          data: operations,
        };
        sortedArray.push(item);
      }
    });
    function chunkArray(arr, size = 3) {
      const result = [];
      for (let i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size));
      }
      return result;
    }
    return sortedArray.map((section) => {
      return {
        ...section,
        data: chunkArray(section.data), // divide all items into arrays of 3
      };
    });
  }, [planning]);

  const { setContainerWidth, nbColumns, itemWidth, containerWidth } =
    useResponsiveFlatlistColumns({
      itemMaxWidth: calcWidth(30),
      gap: calcWidth(2),
      maxColumns: 3,
    });

  return (
    <View
      style={{
        flex: 1,
      }}
      onLayout={(event) => {
        setContainerWidth(event.nativeEvent.layout.width - calcWidth(2));
      }}
    >
      {containerWidth > 0 && (
        <SectionList
          itemDimension={120}
          sections={sortedArray}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          style={styles.gridView}
          contentContainerStyle={styles.contentContainer}
          renderItem={({ item, section, index: inSectionIndex }) => {
            return (
              <View style={styles.sectionLine}>
                {item.map((element, index) => {
                  return (
                    <PlanningItem
                      key={section.title + inSectionIndex + index}
                      item={element}
                      section={section}
                      getDistance={getDistance}
                      itemWidth={itemWidth}
                    />
                  );
                })}
              </View>
            );
          }}
          renderSectionHeader={({ section }) => (
            <Text style={styles.sectionHeader}>{section.title}</Text>
          )}
        />
      )}
      <ShowVersion />
    </View>
  );
};

export default HomePlanningList;

const styles = StyleSheet.create({
  gridView: {
    flex: 1,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    flexDirection: "column",
  },
  container: {
    flex: 1,
  },
  sectionLine: {
    marginBottom: calcWidth(2),
    marginHorizontal: calcWidth(2),
    flexDirection: "row",
    gap: calcWidth(2),
  },
  sectionHeaderImportant: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: "bold",
    backgroundColor: "#ff220f",
  },
  sectionHeader: {
    marginBottom: calcWidth(2),
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
    backgroundColor: "rgba(247,247,247,1.0)",
  },
  itemContainer: {
    justifyContent: "flex-end",
    borderRadius: 20,
    padding: 10,
    height: 110,
  },
  itemName: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
  itemCode: {
    fontWeight: "600",
    fontSize: 10,
    color: "#fff",
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
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
    width: "100%",
    alignItems: "center",
  },
  animationWrapper: {
    width: "100%",
    height: "100%",
  },
});
