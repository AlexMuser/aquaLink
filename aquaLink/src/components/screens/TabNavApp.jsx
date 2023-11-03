import * as React from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import IndexApp from "./IndexApp";

const FirstRoute = () => (
  <View style={{ flex: 1, backgroundColor: "#ff4081" }} />
);

const SecondRoute = () => (
  <View style={{ flex: 1 }}>
    <IndexApp />
  </View>
);

const ThirdRoute = () => (
  <View style={{ flex: 1, backgroundColor: "#673ab7" }} />
);

const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
  third: ThirdRoute,
});

export default function TabNavApp() {
  const layout = useWindowDimensions();

  const iconMapping = {
    first: require("../../../assets/Info.png"),
    second: require("../../../assets/home.png"),
    third: require("../../../assets/settings.png"),
  };

  const [index, setIndex] = React.useState(1);
  const [routes] = React.useState([
    { key: "first", title: "Información" },
    { key: "second", title: "Inicio" },
    { key: "third", title: "Ajustes" },
  ]);

  return (
    <View style={{ flex: 1 }}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        tabBarPosition="bottom"
        renderTabBar={(props) => (
          <TabBar
            {...props}
            style={{ backgroundColor: "rgb(7, 49, 74)" }}
            indicatorStyle={{ backgroundColor: "white" }} // Cambia el color de la barra indicadora
            renderLabel={({ route, focused }) => (
              <View style={styles.tabBarLabelContainer}>
                <Image
                  source={iconMapping[route.key]}
                  style={styles.tabImage}
                />
                <Text
                  style={[
                    styles.tabLabelText,
                    focused && styles.tabLabelFocused,
                  ]}
                >
                  {route.title}
                </Text>
              </View>
            )}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarLabelContainer: {
    alignItems: "center",
  },
  tabImage: {
    width: 44,
    height: 44,
  },
  tabLabelText: {
    color: "gray",
  },
  tabLabelFocused: {
    color: "white",
  },
});
