import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { Picker } from "@react-native-picker/picker";

const WeekReports = (props) => {
  const { reports } = props;
  const [weeksAndMonthsAndYears, setWeeksAndMonthsAndYears] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState("");
  const [dailyData, setDailyData] = useState([]);

  useEffect(() => {
    extractWeeksAndMonthsAndYears(reports);
  }, [reports]);

  useEffect(() => {
    if (selectedWeek) {
      const dailyConsumption = getDailyConsumption(selectedWeek, reports);
      setDailyData(dailyConsumption);
    }
  }, [selectedWeek, reports]);

  const getWeekAndMonth = (date) => {
    const monthNames = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];

    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();
    const day = date.getUTCDate();
    const startDayOfWeek = date.getUTCDay();

    // Ajuste para que la semana comience en Domingo (0)
    let weekNumber = Math.ceil((day + 1 - startDayOfWeek) / 7);

    if (startDayOfWeek !== 0) {
      // Si el primer día de la semana no es Domingo, ajustamos la semana
      if (weekNumber === 0) {
        weekNumber = Math.ceil((day - startDayOfWeek + 7) / 7);
      }
    }

    return `Semana ${weekNumber}, ${monthNames[month]} ${year}`;
  };

  const getDailyConsumption = (selectedWeek, reports) => {
    const dailyData = {};
    const selectedWeekData = reports.filter((item) => {
      const date = new Date(item.date_hour);
      const weekMonthYear = getWeekAndMonth(date);
      return weekMonthYear === selectedWeek;
    });

    selectedWeekData.forEach((item) => {
      const date = new Date(item.date_hour);
      const dayOfWeek = date
        .toLocaleDateString("es-ES", { weekday: "short" })
        .toUpperCase()[0]; // Obtenemos el primer carácter de la abreviatura del día
      if (!dailyData[dayOfWeek]) {
        dailyData[dayOfWeek] = 0;
      }
      dailyData[dayOfWeek] += item.totalLiters;
    });

    return dailyData;
  };

  const dailyBarData = Object.entries(dailyData).map(([label, value]) => ({
    value,
    label,
    topLabelComponent: () => (
      <Text style={{ color: "black", fontSize: 12, marginTop: 4 }}>
        {value.toFixed(0) + " L"}
      </Text>
    ),
  }));

  const extractWeeksAndMonthsAndYears = () => {
    const uniqueWeeksAndMonthsAndYearsSet = new Set(
      reports.map((item) => {
        const date = new Date(item.date_hour);
        return getWeekAndMonth(date);
      })
    );

    setWeeksAndMonthsAndYears(Array.from(uniqueWeeksAndMonthsAndYearsSet));
  };

  return (
    <ScrollView
      horizontal={true}
      contentContainerStyle={styles.scrollViewContent}
    >
      <View>
        <Text style={styles.headerText}>Reporte semanal</Text>
        <Text style={styles.text}>Selecciona la semana</Text>
        <View style={styles.container}>
          <View style={styles.pickerStyle}>
            <Picker
              selectedValue={selectedWeek}
              onValueChange={(itemValue) => setSelectedWeek(itemValue)}
            >
              {weeksAndMonthsAndYears.map((weekMonthYear, index) => (
                <Picker.Item
                  key={index}
                  label={weekMonthYear}
                  value={weekMonthYear}
                />
              ))}
            </Picker>
          </View>
        </View>
        {selectedWeek && (
          <View style={styles.barChart}>
            <BarChart
              showFractionalValue
              showYAxisIndices
              barWidth={45}
              noOfSections={7}
              barBorderRadius={4}
              frontColor="#b9e8fe"
              data={dailyBarData}
              yAxisThickness={0.5}
              xAxisThickness={1}
              isAnimated
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default WeekReports;

const styles = StyleSheet.create({
  container: {
    flex: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
  datePicker: {
    marginBottom: 20,
  },
  barChart: {
    width: "100%",
  },
  text: {
    textAlign: "center",
    marginBottom: 10,
  },
  pickerStyle: {
    backgroundColor: "rgba(185, 232, 254, 1)",
    borderColor: "rgba(5, 93, 135, 1)",
    width: 300,
    borderWidth: 1,
    borderRadius: 20,
    marginBottom: 10,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
