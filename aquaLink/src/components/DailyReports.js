import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { BarChart } from "react-native-gifted-charts";
import { format } from "date-fns";

const DailyReports = (props) => {
  const { reports } = props;
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dailyData, setDailyData] = useState([]);

  useEffect(() => {
    updateDailyData(selectedDate);
  }, [selectedDate, reports]);

  // Función para mostrar el selector de fecha
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  // Función para ocultar el selector de fecha
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  // Función para confirmar la fecha seleccionada en el selector
  const handleConfirm = (date) => {
    setSelectedDate(date);
    hideDatePicker();
  };

  // Función para crear el formato de datos del gráfico diario
  const createDailyBarData = (data) => {
    return data.map((item) => ({
      value: item.value,
      label: item.label, // Mantén el formato de hora original
      topLabelComponent: () => (
        <Text style={{ color: "black", fontSize: 12, marginTop: 4 }}>
          {item.value + " L"}
        </Text>
      ),
    }));
  };

  // Función para actualizar los datos diarios en función de la fecha seleccionada
  const updateDailyData = (date) => {
    const dailyData = reports
      .filter((item) => {
        const itemDate = new Date(item.date_hour);
        return (
          itemDate.getDate() === date.getDate() &&
          itemDate.getMonth() === date.getMonth() &&
          itemDate.getFullYear() === date.getFullYear()
        );
      })
      .map((item) => ({
        label: new Date(item.date_hour).toLocaleTimeString("default", {
          hour: "numeric",
          hour12: true,
          timeZone: "UTC",
        }),
        value: parseInt(item.totalLiters, 10), // Convierte a número usando parseInt
      }));

    setDailyData(dailyData);
  };

  return (
    <ScrollView
      horizontal={true}
      contentContainerStyle={styles.scrollViewContent}
    >
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={showDatePicker}>
            <Text style={styles.buttonText}>Seleccionar Fecha</Text>
          </TouchableOpacity>
        </View>
        <Text>Fecha Seleccionada: {selectedDate.toDateString()}</Text>
        <View style={styles.barChart}>
          <BarChart
            data={createDailyBarData(dailyData)}
            xKey="label"
            yKey="value"
            showFractionalValue
            showYAxisIndices
            barWidth={50}
            noOfSections={3}
            barBorderRadius={4}
            frontColor="#D2EAEE"
            yAxisThickness={0.5}
            xAxisThickness={1}
            isAnimated
          />
        </View>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
      </View>
    </ScrollView>
  );
};

export default DailyReports;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
  barChart: {
    width: "100%", // Cambia el ancho al 100% en lugar del 80%
  },
  text: {
    textAlign: "center",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    margin: 10,
  },
  button: {
    width: 150,
    height: 40,
    backgroundColor: "rgba(185, 232, 254, 1)",
    borderWidth: 1,
    borderColor: "rgba(5, 93, 135, 1)",
    borderRadius: 20,
  },
  buttonText: {
    width: 150,
    height: 60,
    textAlign: "center",
    lineHeight: 35,
    color: "rgba(1, 110, 163, 1)",
    fontSize: 12,
    fontWeight: "400",
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
