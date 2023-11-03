import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import DailyReports from "../DailyReports";
import YearlyReports from "../YearlyReports";
import MounthReports from "../MounthReports";
import WeeklyReports from "../WeeklyReports";

export default function IndexApp() {
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

  const [activeButton, setActiveButton] = useState(null);

  const handleButtonPress = (buttonName) => {
    setActiveButton(buttonName);
  };

  const renderContent = () => {
    switch (activeButton) {
      case "Diario":
        return (
          <View style={styles.graph}>
            {reports.length > 0 ? (
              <DailyReports reports={reports} />
            ) : (
              <Text>No hay informes disponibles.</Text>
            )}
          </View>
        );
      case "Semanal":
        return (
          <View style={styles.graph}>
            {reports.length > 0 ? (
              <WeeklyReports reports={reports} />
            ) : (
              <Text>No hay informes disponibles.</Text>
            )}
          </View>
        );
      case "Año":
        return (
          <View style={styles.graph}>
            {reports.length > 0 ? (
              <YearlyReports reports={reports} />
            ) : (
              <Text>No hay informes disponibles.</Text>
            )}
          </View>
        );
      case "Mes":
        return (
          <View style={styles.graph}>
            {reports.length > 0 ? (
              <MounthReports reports={reports} />
            ) : (
              <Text>No hay informes disponibles.</Text>
            )}
          </View>
        );
      default:
        return (
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>
              Bienvenido a la app que mejora tu consumo
            </Text>
          </View>
        );
    }
  };

  return (
    <View style={styles.view}>
      <View style={styles.consumoContainer}>
        <Text style={styles.consumo}>{`Consumo`}</Text>
      </View>

      <View style={styles.square}>{renderContent()}</View>

      <View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              activeButton === "Diario"
                ? {
                    backgroundColor: "rgba(1, 110, 163, 1)",
                    borderColor: "rgba(5, 93, 135, 1)",
                  }
                : {
                    backgroundColor: "rgba(185, 232, 254, 1)",
                    borderColor: "rgba(5, 93, 135, 1)",
                  },
            ]}
            onPress={() => handleButtonPress("Diario")}
          >
            <Text
              style={[
                styles.buttonText,
                activeButton === "Diario"
                  ? { color: "rgba(255, 255, 255, 1)" }
                  : { color: "rgba(1, 110, 163, 1)" },
              ]}
            >
              Diario
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              activeButton === "Semanal"
                ? {
                    backgroundColor: "rgba(1, 110, 163, 1)",
                    borderColor: "rgba(5, 93, 135, 1)",
                  }
                : {
                    backgroundColor: "rgba(185, 232, 254, 1)",
                    borderColor: "rgba(5, 93, 135, 1)",
                  },
            ]}
            onPress={() => handleButtonPress("Semanal")}
          >
            <Text
              style={[
                styles.buttonText,
                activeButton === "Semanal"
                  ? { color: "rgba(255, 255, 255, 1)" }
                  : { color: "rgba(1, 110, 163, 1)" },
              ]}
            >
              Semanal
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              activeButton === "Año"
                ? {
                    backgroundColor: "rgba(1, 110, 163, 1)",
                    borderColor: "rgba(5, 93, 135, 1)",
                  }
                : {
                    backgroundColor: "rgba(185, 232, 254, 1)",
                    borderColor: "rgba(5, 93, 135, 1)",
                  },
            ]}
            onPress={() => handleButtonPress("Año")}
          >
            <Text
              style={[
                styles.buttonText,
                activeButton === "Año"
                  ? { color: "rgba(255, 255, 255, 1)" }
                  : { color: "rgba(1, 110, 163, 1)" },
              ]}
            >
              Año
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              activeButton === "Mes"
                ? {
                    backgroundColor: "rgba(1, 110, 163, 1)",
                    borderColor: "rgba(5, 93, 135, 1)",
                  }
                : {
                    backgroundColor: "rgba(185, 232, 254, 1)",
                    borderColor: "rgba(5, 93, 135, 1)",
                  },
            ]}
            onPress={() => handleButtonPress("Mes")}
          >
            <Text
              style={[
                styles.buttonText,
                activeButton === "Mes"
                  ? { color: "rgba(255, 255, 255, 1)" }
                  : { color: "rgba(1, 110, 163, 1)" },
              ]}
            >
              Mes
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: "#35c3fb",
    alignItems: "center",
    justifyContent: "center",
  },
  consumoContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    padding: 10,
    shadowColor: "#35c3fb",
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 5,
    width: "100%",
    overflow: "hidden",
    borderColor: "rgba(185, 232, 254, 0.5)",
    borderWidth: 5,
    marginTop: 50,
  },
  consumo: {
    textAlign: "center",
    color: "rgba(1, 110, 163, 1)",
    fontSize: 32,
    fontWeight: "400",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    margin: 10,
  },
  button: {
    width: 150,
    height: 60,
    backgroundColor: "rgba(185, 232, 254, 1)",
    borderWidth: 1,
    borderColor: "rgba(5, 93, 135, 1)",
    borderRadius: 10,
    marginHorizontal: 10,
  },
  buttonText: {
    width: 150,
    height: 60,
    textAlign: "center",
    textAlignVertical: "center",
    lineHeight: 60,
    color: "rgba(1, 110, 163, 1)",
    fontSize: 32,
    fontWeight: "400",
  },
  graph: {
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    width: "100%",
  },
  square: {
    width: 400,
    height: 450,
    borderWidth: 0,
    borderColor: "black",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  welcomeContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "rgba(1, 110, 163, 1)",
    textAlign: "center",
  },
});
