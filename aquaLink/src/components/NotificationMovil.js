import React, { useEffect } from "react";
import { Button } from "react-native";
import * as Notifications from "expo-notifications";

export default function NotificationMovil() {
  useEffect(() => {
    // Solicitar permisos para notificaciones siempre
    Notifications.requestPermissionsAsync().then((status) => {
      if (status.granted) {
        // Si se otorgan los permisos, puedes crear una notificación
        scheduleNotification();
      } else {
        console.log("Permisos de notificación denegados");
      }
    });
  }, []);

  const scheduleNotification = () => {
    // Configurar la notificación
    Notifications.scheduleNotificationAsync({
      content: {
        title: "Mi Notificación",
        body: "¡Esta es una notificación de prueba!",
      },
      trigger: {
        seconds: 5, // La notificación se mostrará después de 5 segundos
      },
    });
  };

  return (
    <Button
      title="Enviar Notificación"
      onPress={() => {
        scheduleNotification();
      }}
    />
  );
}
