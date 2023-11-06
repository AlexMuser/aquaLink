import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingApp from "./screens/LoadingApp";

const ConfigContext = createContext();

export const useConfig = () => {
  return useContext(ConfigContext);
};

export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState({
    API_BASE_URL: "http://192.168.100.13:8000",
    ESP32_URL: "http://192.168.100.14",
  }); // Inicializa como valores predeterminados
  const [isLoading, setIsLoading] = useState(true); // Agrega un estado para indicar si se está cargando

  // Cargar la configuración desde AsyncStorage al inicio
  useEffect(() => {
    async function loadConfigFromStorage() {
      try {
        const savedConfig = await AsyncStorage.getItem("app_config");
        if (savedConfig) {
          const parsedConfig = JSON.parse(savedConfig);
          console.log(
            "Configuración cargada desde AsyncStorage:",
            parsedConfig
          );
          setConfig(parsedConfig);
          setIsLoading(false); // Marca que ya no se está cargando
        }
      } catch (error) {
        console.error("Error loading config from AsyncStorage:", error);
        setIsLoading(false); // Marca que ya no se está cargando en caso de error
      }
    }
    loadConfigFromStorage();
  }, []);

  // Suscribirse a cambios en la configuración y actualizar cuando cambia
  useEffect(() => {
    // Cuando config cambie, guarda la configuración en AsyncStorage
    async function saveConfigToStorage() {
      try {
        await AsyncStorage.setItem("app_config", JSON.stringify(config));
      } catch (error) {
        console.error("Error saving config to AsyncStorage:", error);
      }
    }
    saveConfigToStorage();
  }, [config]);

  if (isLoading) {
    // Muestra un indicador de carga o contenido de espera mientras se carga la configuración
    return <LoadingApp />;
  }

  return (
    <ConfigContext.Provider value={{ config, setConfig }}>
      {children}
    </ConfigContext.Provider>
  );
};
