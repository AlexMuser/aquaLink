import * as React from "react";
import {
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import IndexApp from "./IndexApp";
import SettingsApp from "./SettingsApp";
import { ConfigProvider } from "../ConfigContext";
import InfoApp from "./InfoApp";

const FirstRoute = () => (
  <View style={{ flex: 1 }}>
    <InfoApp />
  </View>
);

const SecondRoute = () => (
  <View style={{ flex: 1 }}>
    <IndexApp />
  </View>
);

const ThirdRoute = () => (
  <View style={{ flex: 1 }}>
    <SettingsApp />
  </View>
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
    <ConfigProvider>
      <ImageBackground
        source={require("../../../assets/background.png")}
        style={styles.backgroundImage}
      >
        <SafeAreaView style={{ flex: 1 }}>
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
        </SafeAreaView>
      </ImageBackground>
    </ConfigProvider>
  );
}

const styles = StyleSheet.create({
  tabBarLabelContainer: {
    alignItems: "center",
  },
  tabImage: {
    width: 24,
    height: 24,
  },
  tabLabelText: {
    color: "gray",
  },
  tabLabelFocused: {
    color: "white",
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    width: "100%",
    height: "100%",
  },
});
