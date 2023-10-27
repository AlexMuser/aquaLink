import React, { useState, useEffect } from "react";
import { View, Text, Button } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { BarChart } from "react-native-gifted-charts";

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
      label: item.label,
      topLabelComponent: () => (
        <Text style={{ color: "black", fontSize: 12, marginTop: 4 }}>
          {item.value}
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
        label: new Date(item.date_hour).toLocaleTimeString(),
        value: item.totalLiters,
      }));

    setDailyData(dailyData);
  };

  return (
    <View>
      <Button title="Seleccionar Fecha" onPress={showDatePicker} />
      <Text>Fecha Seleccionada: {selectedDate.toDateString()}</Text>
      <View style={{ width: "100%", height: 200 }}>
        <BarChart
          data={createDailyBarData(dailyData)}
          xKey="label"
          yKey="value"
          showFractionalValue
          showYAxisIndices
          barWidth={30}
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
  );
};

export default DailyReports;
