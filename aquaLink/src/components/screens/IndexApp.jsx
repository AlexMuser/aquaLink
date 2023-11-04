import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import DailyReports from "../DailyReports";
import YearlyReports from "../YearlyReports";
import MounthReports from "../MounthReports";
import WeeklyReports from "../WeeklyReports";
import { API_BASE_URL, ESP32_URL } from "../config";

export default function IndexApp() {
  //Arreglo con la información
  const [reports, setReports] = useState([]);
  const [data, setData] = useState({
    total_liters: 0,
    date_hour: new Date().toISOString().split("T")[0] + "T00:00:00.000Z",
  });

  useEffect(() => {
    getReports();
  }, []);

  useEffect(() => {
    getESP32();
  }, []);

  useEffect(() => {
    // Llamar a updateTotalLiters cada 1 minuto (60000 milisegundos)
    const interval = setInterval(getESP32, 60000);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    console.log(data);
  }, [data]);

  const getESP32 = async () => {
    try {
      // Recopilar la información con la ruta generada por el API
      const res = await fetch(`${ESP32_URL}/json`);

      if (!res.ok) {
        throw new Error(`Error en la solicitud: ${res.status}`);
      }

      const jsonData = await res.json();
      const { hour, total_liters } = jsonData;

      const currentDateTime = new Date();
      currentDateTime.setHours(hour, 0, 0, 0);
      // Obtener la hora local en formato de cadena
      const date_hour = currentDateTime.toLocaleString("es-MX", {
        timeZone: "America/Mexico_City",
      });

      setData({ total_liters, date_hour });
    } catch (error) {
      // Manejar el error de la solicitud de red
      console.error("Error en la solicitud de red con el ESP32:", error);
      // Puedes agregar un manejo adicional aquí si es necesario
    }
  };

  const getReports = async () => {
    try {
      // Recopilar la información con la ruta generada por el API
      const res = await fetch(`${API_BASE_URL}/reports`);

      if (!res.ok) {
        throw new Error(`Error en la solicitud: ${res.status}`);
      }

      const data = await res.json();
      setReports(data);
    } catch (error) {
      // Manejar el error de la solicitud de red
      console.error("Error en la solicitud de red con la API:", error);
      // Puedes agregar un manejo adicional aquí si es necesario
    }
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
    flex: 0.9,
    alignItems: "center",
    justifyContent: "center",
  },
  consumoContainer: {
    backgroundColor: "#e0f3fe",
    shadowColor: "#35c3fb",
    shadowOpacity: 0.9,
    shadowRadius: 10,
    padding: 10,
    width: "110%",
    overflow: "hidden",
    borderColor: "#b9e8fe",
    borderWidth: 5,
    marginTop: 110,
  },
  consumo: {
    textAlign: "center",
    color: "black",
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
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    width: "100%",
  },
  square: {
    width: 400,
    height: 400,
    borderWidth: 0,
    borderColor: "black",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
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
