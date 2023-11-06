import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNotification } from "../NotificationProvider";
import { PDFDay, PDFMonths, PDFWeekly, PDFYears } from "../PDFComponent";
import { useConfig } from "../ConfigContext";

export default function SettingsApp() {
  const { config } = useConfig();

  const API_BASE_URL = config.API_BASE_URL;
  const ESP32_URL = config.ESP32_URL;

  const { showWarning } = useNotification();
  const [isAlertActive, setIsAlertActive] = useState(false);
  const [isNotificationActive, setIsNotificationActive] = useState(false);
  const [litersLim, setLitersLim] = useState(0);
  const [totalLitrosDiaActual, setTotalLitrosDiaActual] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    getReports();
  }, []);

  useEffect(() => {
    // Llamar a updateTotalLiters cada 1 minuto (60000 milisegundos)
    const interval = setInterval(getReports, 10000);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Establecer la zona horaria a la de México
    const mexicoTimeZone = "America/Mexico_City";
    const currentDate = new Date()
      .toLocaleString("en-US", { timeZone: mexicoTimeZone })
      .split(", ")[0];

    // Filtrar los datos según la fecha actual en la zona horaria de México
    const litrosDiaActual = reports
      .filter((report) => {
        const reportDate = new Date(report.date_hour)
          .toLocaleString("en-US", { timeZone: mexicoTimeZone })
          .split(", ")[0];
        return reportDate === currentDate;
      })
      .reduce((total, report) => total + report.totalLiters, 0);

    console.log(litrosDiaActual);
    console.log(isAlertActive);
    console.log(litersLim);

    if (litrosDiaActual > litersLim && isAlertActive && litersLim > 0) {
      showWarning("Se supero el limite de consumo diario");
    }

    setTotalLitrosDiaActual(litrosDiaActual);
  }, [reports]);

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

  const handleShowWarning = () => {
    if (isAlertActive) {
      setIsAlertActive(false); // Cambia a Desactivado
    } else {
      setIsAlertActive(true); // Cambia a Activado
    }
  };

  const handleShowNotification = () => {
    if (isNotificationActive) {
      setIsNotificationActive(false); // Cambia a Desactivado
    } else {
      setIsNotificationActive(true); // Cambia a Activado
    }
  };

  const onRefresh = () => {
    // Maneja la lógica de recarga aquí
    getReports();
    setIsRefreshing(false);
  };

  /*const handleShowWarning = () => {
    showWarning("Se supero el limite de consumo diario");
  };*/

  return (
    <ScrollView
      refreshControl={
        // Agrega el RefreshControl
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.view}>
        {/* Cuadro de ajuste */}
        <View style={styles.ajusteContainer}>
          <Text style={styles.ajuste}>{`Ajustes`}</Text>
        </View>
        {/* Cuadro de activar y establecer alerta */}
        <View style={styles.alertaContainer}>
          <View style={styles.activarContainer}>
            <Text style={styles.ajusteText}>Alerta de consumo</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    backgroundColor: isAlertActive
                      ? "rgba(185, 232, 254, 1)"
                      : "#ffeceb",
                    borderColor: isAlertActive ? "#016ea3" : "red", // Cambia el color del borde
                  },
                ]}
                onPress={handleShowWarning}
              >
                <Text
                  style={[
                    styles.buttonText,
                    { color: isAlertActive ? "#016ea3" : "red" },
                  ]}
                >
                  {isAlertActive ? "Activado" : "Desactivado"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ alignItems: "center" }}>
            <TextInput
              onChangeText={(text) => setLitersLim(text)}
              style={styles.input}
              placeholder="Litros"
              keyboardType="numeric"
            />
          </View>
          <View>
            <Text style={styles.litros}>
              Total de consumo de hoy: {totalLitrosDiaActual.toFixed(0)} Litros
            </Text>
          </View>
        </View>
        {/* Cuadro de descargas */}
        <View style={styles.descargaContainer}>
          <Text style={styles.ajusteText}>Descargar historial</Text>
          <View style={styles.buttonDescargas}>
            {/* Se colocara cada boton */}
            <PDFDay reports={reports} />
            <PDFWeekly reports={reports} />
          </View>
          <View style={styles.buttonDescargas}>
            <PDFMonths reports={reports} />
            <PDFYears reports={reports} />
          </View>
        </View>
        {/* Cuadro de notificaciones
        <View style={styles.notificacionContainer}>
          <Text style={styles.ajusteText}>Notificaciones</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: isNotificationActive
                    ? "rgba(185, 232, 254, 1)"
                    : "#ffeceb",
                  borderColor: isNotificationActive ? "#016ea3" : "red",
                },
              ]}
              onPress={handleShowNotification}
            >
              <Text
                style={[
                  styles.buttonText,
                  { color: isNotificationActive ? "#016ea3" : "red" },
                ]}
              >
                {isNotificationActive ? "Activado" : "Desactivado"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>*/}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 0.9,
    alignItems: "center",
    justifyContent: "center",
  },
  ajusteContainer: {
    backgroundColor: "#e0f3fe",
    shadowColor: "#35c3fb",
    shadowOpacity: 0.9,
    shadowRadius: 10,
    padding: 10,
    width: "110%",
    overflow: "hidden",
    borderColor: "#b9e8fe",
    borderWidth: 5,
    marginTop: 46.7,
  },
  ajuste: {
    textAlign: "center",
    color: "black",
    fontSize: 32,
    fontWeight: "400",
  },
  alertaContainer: {
    backgroundColor: "#e0f3fe",
    height: 150,
    margin: 40,
    width: "85%",
    borderRadius: 20,
  },
  activarContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 2,
    borderColor: "#35c3fb",
    justifyContent: "center",
  },
  ajusteText: {
    fontSize: 19,
    lineHeight: 24,
    letterSpacing: -0.25,
  },
  buttonContainer: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "stretch",
    marginLeft: 40,
  },
  button: {
    alignSelf: "stretch",
    backgroundColor: "rgba(185, 232, 254, 1)",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#016ea3",
    height: 48,
    width: 110,
    justifyContent: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonText: {
    fontStyle: "normal",
    fontSize: 16,
    color: "#016ea3",
    textAlign: "center",
    lineHeight: 20,
    letterSpacing: -0.25,
  },
  input: {
    height: 40,
    width: 200,
    margin: 12,
    borderWidth: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderColor: "#016ea3",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },
  descargaContainer: {
    backgroundColor: "#e0f3fe",
    height: 180,
    margin: 10,
    width: "85%",
    borderRadius: 20,
    alignItems: "center",
    padding: 10,
    marginTop: 5,
  },
  buttonDescargas: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    alignItems: "center",
    margin: 10,
  },
  notificacionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#e0f3fe",
    height: 80,
    margin: 10,
    width: "85%",
    borderRadius: 20,
    alignItems: "center",
    padding: 10,
    justifyContent: "center",
  },
  litros: {
    textAlign: "center",
    color: "black",
    fontSize: 18,
    fontWeight: "400",
    marginTop: 8,
  },
});
