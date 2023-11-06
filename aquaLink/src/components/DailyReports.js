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
import { DateTime } from "luxon";

const DailyReports = (props) => {
  const { reports } = props;
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    DateTime.now().setZone("America/Mexico_City")
  );
  const [dailyData, setDailyData] = useState([]);

  useEffect(() => {
    updateDailyData(selectedDate);
  }, [selectedDate, reports]);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setSelectedDate(DateTime.fromJSDate(date).setZone("America/Mexico_City"));
    hideDatePicker();
  };

  const createDailyBarData = (data) => {
    return data.map((item) => ({
      value: item.value,
      label: DateTime.fromISO(item.label)
        .setZone("America/Mexico_City")
        .toLocaleString(DateTime.TIME_SIMPLE),
      topLabelComponent: () => (
        <Text style={{ color: "black", fontSize: 12, marginTop: 4 }}>
          {item.value + " L"}
        </Text>
      ),
    }));
  };

  const updateDailyData = (date) => {
    const dailyData = reports
      .filter((item) => {
        const itemDate = DateTime.fromISO(item.date_hour, {
          zone: "utc",
        });
        return (
          itemDate.day === date.day &&
          itemDate.month === date.month &&
          itemDate.year === date.year
        );
      })
      .map((item) => {
        return {
          label: item.date_hour,
          value: parseInt(item.totalLiters, 10),
        };
      });

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
        <Text>
          Fecha Seleccionada: {selectedDate.toLocaleString(DateTime.DATE)}
        </Text>
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
