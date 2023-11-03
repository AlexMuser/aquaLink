import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import MounthReports from "./src/components/MounthReports";
import { useEffect, useState } from "react";
import DailyReports from "./src/components/DailyReports";
import YearlyReports from "./src/components/YearlyReports";
import LoadingApp from "./src/components/screens/LoadingApp";
import TabNavApp from "./src/components/screens/TabNavApp";

export default function App() {
  //Arreglo con la información
  const [reports, setReports] = useState([]);

  useEffect(() => {
    getReports();
  }, []);

  const getReports = async () => {
    //Recopilar la información con la ruta generada por el API
    const res = await fetch("http://192.168.100.4:8000/reports");
    const data = await res.json();
    setReports(data);
  };
  return (
    <>
      <TabNavApp />
    </>
  );
}
