import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import DailyReports from "../DailyReports";
import YearlyReports from "../YearlyReports";
import MounthReports from "../MounthReports";
import WeeklyReports from "../WeeklyReports";
import { API_BASE_URL, ESP32_URL } from "../config";
import axios from "axios";
import { useNotification } from "../NotificationProvider";

export default function IndexApp() {
  //Arreglo con la información
  const [reports, setReports] = useState([]);
  const [data, setData] = useState({
    total_liters: 0,
    date_hour: new Date().toISOString().split("T")[0] + "T00:00:00.000Z",
  });

  const { showWarning } = useNotification();

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
    //console.log(data);
    findReportsByDate();
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

      const date = currentDateTime.getDate().toString().padStart(2, "0");
      const month = (currentDateTime.getMonth() + 1)
        .toString()
        .padStart(2, "0");
      const year = currentDateTime.getFullYear();
      const hours = currentDateTime.getHours().toString().padStart(2, "0");
      const minutes = currentDateTime.getMinutes().toString().padStart(2, "0");
      const seconds = currentDateTime.getSeconds().toString().padStart(2, "0");

      const date_hour = `${date}/${month}/${year} ${hours}:${minutes}:${seconds}`;

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

  //Funcion para crear un reporte en la BD
  const createReport = async (newReportData) => {
    try {
      // Realizar una solicitud POST a la API para crear un nuevo informe
      const response = await axios.post(
        `${API_BASE_URL}/reports`,
        newReportData,
        {
          headers: {
            "Content-Type": "application/json", // Asegurarse de establecer el tipo de contenido
          },
        }
      );

      // Verificar la respuesta y manejarla según sea necesario
      if (response.status === 200) {
        //console.log("Informe creado correctamente.");
        getReports();
      } else {
        console.error("Error al crear el informe.");
      }
    } catch (error) {
      console.error("Error al hacer la solicitud POST:", error);
    }
  };

  //Funcion para actualizar en la BD
  const updateReport = async (reportId, updatedReportData) => {
    try {
      // Realizar una solicitud PUT a la API para actualizar el informe existente
      const response = await axios.put(
        `${API_BASE_URL}/reports/${reportId}`,
        updatedReportData,
        {
          headers: {
            "Content-Type": "application/json", // Asegurarse de establecer el tipo de contenido
          },
        }
      );

      // Verificar la respuesta y manejarla según sea necesario
      if (response.status === 200) {
        //console.log("Informe actualizado correctamente.");
        getReports(); // Opcional: Realizar una recarga de informes o cualquier otra acción necesaria
      } else {
        console.error("Error al actualizar el informe.");
      }
    } catch (error) {
      console.error("Error al hacer la solicitud PUT:", error);
    }
  };

  //Funcion para encontrar id del reporte segun la fecha
  function findReportIdByDate() {
    const indiceDondeSeEncontro = reports.findIndex((report) => {
      // Crea una variable con la fecha y hora para buscar si coincide un valor
      const isoDate = new Date(report.date_hour);

      // Obtén la hora, minutos y segundos sin afectar la zona horaria
      const hours = isoDate.getUTCHours().toString().padStart(2, "0");
      const minutes = isoDate.getUTCMinutes().toString().padStart(2, "0");
      const seconds = isoDate.getUTCSeconds().toString().padStart(2, "0");

      // Formatear la fecha en el formato deseado sin cambiar la hora
      const formattedDate =
        isoDate.toLocaleDateString("es-MX", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }) + ` ${hours}:${minutes}:${seconds}`;

      // Regresa true si encuentra la fecha o false si no lo encuentra en reports
      return formattedDate === data.date_hour;
    });

    if (indiceDondeSeEncontro !== -1) {
      return reports[indiceDondeSeEncontro].id;
    } else {
      return null; // O cualquier otro valor que desees cuando no se encuentra una coincidencia.
    }
  }

  //Funcion para visualizar si ya existe en la base de datos lo que nos arroja el ESP32
  const findReportsByDate = () => {
    const foundReport = reports.some((report) => {
      // Crea una variable con la fecha y hora para buscar si coincide un valor
      const isoDate = new Date(report.date_hour);

      // Obtén la hora, minutos y segundos sin afectar la zona horaria
      const hours = isoDate.getUTCHours().toString().padStart(2, "0");
      const minutes = isoDate.getUTCMinutes().toString().padStart(2, "0");
      const seconds = isoDate.getUTCSeconds().toString().padStart(2, "0");

      // Formatear la fecha en el formato deseado sin cambiar la hora
      const formattedDate =
        isoDate.toLocaleDateString("es-MX", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }) + ` ${hours}:${minutes}:${seconds}`;

      //Aqui regresa true si encuentra la fecha o false si no lo encuentra en reports
      return formattedDate === data.date_hour;
    });

    // Dividir la cadena en día, mes, año y hora
    var parts = data.date_hour.split(" ");
    var dateParts = parts[0].split("/");
    var timePart = parts[1];

    // Formatear la fecha en el nuevo formato
    var year = dateParts[2];
    var month = dateParts[1];
    var day = dateParts[0];
    var newFormattedDate = `${year}-${month}-${day}T${timePart}.000Z`;

    //Dependiendo si se encuentra o no el reporte, se crea o actualiza
    if (foundReport) {
      const updReport = {
        totalLiters: data.total_liters,
      };

      if (data.total_liters > 0) {
        updateReport(findReportIdByDate(), updReport);
      }
    } else {
      //console.log(newFormattedDate);
      //console.log(data.total_liters);
      const newReport = {
        date_hour: newFormattedDate,
        totalLiters: data.total_liters,
      };
      if (newReport.totalLiters > 0) {
        createReport(newReport);
      }
    }
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
