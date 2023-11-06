import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
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

  return (
    <View>
      <Text>API_BASE_URL:</Text>
      <TextInput
        value={newAPIBaseURL}
        onChangeText={(text) => setNewAPIBaseURL(text)}
      />
      <Text>ESP32_URL:</Text>
      <TextInput
        value={newESP32URL}
        onChangeText={(text) => setNewESP32URL(text)}
      />
      <Button title="Guardar Configuración" onPress={handleSaveConfig} />

      {/* Texto para mostrar las IP actuales */}
      <Text>IP Actual - API_BASE_URL: {newAPIBaseURL}</Text>
      <Text>IP Actual - ESP32_URL: {newESP32URL}</Text>
    </View>
  );
};

export default InfoApp;
