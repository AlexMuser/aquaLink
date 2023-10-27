import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import MounthReports from "./src/components/MounthReports";
import { useEffect, useState } from "react";
import DailyReports from "./src/components/DailyReports";

export default function App() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    getReports();
  }, []);

  const getReports = async () => {
    const res = await fetch("http://192.168.64.1:8000/reports"); //10.0.2.2:8000 para Android Studio y localhost:8000 para dispositivos fisicos
    const data = await res.json();
    setReports(data);
  };
  return (
    <View style={styles.container}>
      {reports.length > 0 ? (
        <DailyReports reports={reports} />
      ) : (
        <Text>No hay informes disponibles.</Text>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
