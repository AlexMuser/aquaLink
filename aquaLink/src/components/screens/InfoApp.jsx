import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";
import { useConfig } from "../ConfigContext";

const InfoApp = () => {
  const { config, setConfig } = useConfig();
  const [newAPIBaseURL, setNewAPIBaseURL] = useState(config.API_BASE_URL);
  const [newESP32URL, setNewESP32URL] = useState(config.ESP32_URL);

  const handleSaveConfig = () => {
    setConfig({
      ...config,
      API_BASE_URL: newAPIBaseURL,
      ESP32_URL: newESP32URL,
    });

    Alert.alert(
      "Configuración Actualizada",
      "Se ha guardado la nueva configuración. Reinicia la app para ver los cambios"
    );
  };

  const openWebsite = () => {
    const url = "https://github.com/AlexMuser/aquaLink";

    Linking.openURL(url).catch((err) =>
      console.error("No se pudo abrir la URL", err)
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.nameApp}>
        <Text style={styles.textApp}>AquaLink</Text>
      </View>
      <View style={styles.textTitle}>
        <Text style={styles.text}>Soporte</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.text}>Version</Text>
        <Text>1.0.0</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.text}>Desarrolladores</Text>
        <Text>Ing. Noel Jenaro Ortega Aguilar</Text>
        <Text>Ing. Brayham Pavon Martell</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.text}>Repositorio</Text>
        <TouchableOpacity onPress={openWebsite} style={styles.textLink}>
          <Text style={styles.textLink}>Proyecto AquaLink GitHub</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.textContainer}>
        <Text>
          Esta aplicación fue desarrollada con el fin de monitorear el consumo
          de agua en tiempo real en una casa habitación.
        </Text>
        <Text>
          El proyecto se encuentra en desarrollo, por lo que es posible que
          encuentres errores en la aplicación.
        </Text>
      </View>
      <View style={styles.textContainer}>
        <Text>API_BASE_URL:</Text>
        <TextInput
          style={styles.input}
          value={newAPIBaseURL}
          onChangeText={(text) => setNewAPIBaseURL(text)}
        />
        <Text>ESP32_URL:</Text>
        <TextInput
          value={newESP32URL}
          style={styles.input}
          onChangeText={(text) => setNewESP32URL(text)}
        />
        <TouchableOpacity style={styles.button} onPress={handleSaveConfig}>
          <Text>Guardar la cnfiguración</Text>
        </TouchableOpacity>
        {/* Texto para mostrar las IP actuales */}
        <Text>IP Actual - API_BASE_URL: {newAPIBaseURL}</Text>
        <Text>IP Actual - ESP32_URL: {newESP32URL}</Text>
      </View>
    </View>
  );
};

export default InfoApp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  nameApp: {
    marginTop: 50,
  },
  textTitle: {
    marginTop: 20,
  },
  textContainer: {
    marginTop: 10,
  },
  textLink: {
    color: "blue",
    fontSize: 16,
    paddingHorizontal: 10,
  },
  section: {
    marginTop: 20,
  },
  input: {
    height: 40,
    width: 300,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#fff",
  },
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    marginTop: 10,
    padding: 10,
    marginBottom: 10,
    borderRadius: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
  textApp: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#016ea3",
  },
});
