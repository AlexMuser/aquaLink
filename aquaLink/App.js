import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import MounthReports from "./src/components/MounthReports";
import { useEffect, useState } from "react";
import DailyReports from "./src/components/DailyReports";
import YearlyReports from "./src/components/YearlyReports";
import LoadingApp from "./src/components/screens/LoadingApp";
import TabNavApp from "./src/components/screens/TabNavApp";
import { NotificationProvider } from "./src/components/NotificationProvider";

export default function App() {
  return (
    <NotificationProvider>
      <TabNavApp />
    </NotificationProvider>
  );
}
