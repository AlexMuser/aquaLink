import React, { createContext, useContext, useState } from "react";
import { Text, View, Button, StyleSheet, TouchableOpacity } from "react-native";

const NotificationContext = createContext();

export const useNotification = () => {
  return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);

  const showWarning = (message) => {
    setNotification({ type: "warning", message });
  };

  const hideNotification = () => {
    setNotification(null);
  };

  return (
    <NotificationContext.Provider value={{ showWarning }}>
      {children}
      {notification && (
        <View style={styles.notificationContainer}>
          <View style={styles.notification}>
            <View style={styles.alertContainer}>
              <Text style={styles.textClose}>⚠️ Alerta ⚠️</Text>
            </View>

            <Text style={styles.notificationText}>{notification.message}</Text>
            <TouchableOpacity
              style={styles.buttonClose}
              onPress={hideNotification}
            >
              <Text style={styles.textClose}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </NotificationContext.Provider>
  );
};

const styles = StyleSheet.create({
  notificationContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  notification: {
    backgroundColor: "#e0f3fe",
    width: "85%",
    height: "30%",
    borderRadius: 20,
    borderWidth: 4,
    borderColor: "#90caf9",
    justifyContent: "center",
    alignItems: "center",
  },
  notificationText: {
    color: "black",
    fontWeight: "600",
    fontSize: 20,
    textAlign: "center",
    marginTop: 16,
  },
  buttonClose: {
    backgroundColor: "#ffeceb",
    height: 60,
    width: 200,
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 10,
    alignSelf: "center",
  },
  textClose: {
    color: "#d51601",
    fontWeight: "bold",
    fontSize: 30,
    textAlign: "center",
  },
  alertContainer: {
    width: 300,
    backgroundColor: "#ffeceb",
    height: 60,
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 10,
    alignSelf: "center",
  },
});
