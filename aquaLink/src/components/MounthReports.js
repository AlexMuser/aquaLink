import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { Picker } from "@react-native-picker/picker";
import { DateTime } from "luxon";

const MounthReports = (props) => {
  const { reports } = props;
  const [monthsAndYears, setMonthsAndYears] = useState([]);
  const [selectedMonthYear, setSelectedMonthYear] = useState("");

  useEffect(() => {
    extractMonthsAndYears(reports);
  }, [reports]);

  // Crear el arreglo de datos para la gráfica
  const monthlyData = reports
    .filter((item) => {
      const date = DateTime.fromISO(item.date_hour, { zone: "utc" });
      const monthYear = date.toFormat("MMMM yyyy", { zone: "utc" });
      return monthYear === selectedMonthYear;
    })
    .reduce((acc, item) => {
      const date = DateTime.fromISO(item.date_hour, { zone: "utc" });
      const startOfMonth = date.startOf("month");
      const endOfMonth = date.endOf("month");

      let currentWeek = startOfMonth.startOf("week");
      let weekOfMonth = 1;

      while (currentWeek <= endOfMonth && weekOfMonth <= 5) {
        if (date >= currentWeek && date <= currentWeek.endOf("week")) {
          if (!acc[weekOfMonth]) {
            acc[weekOfMonth] = 0;
          }
          acc[weekOfMonth] += item.totalLiters;
          break;
        }
        currentWeek = currentWeek.plus({ weeks: 1 });
        weekOfMonth++;
      }

      return acc;
    }, {});

  // Crear el arreglo de datos para la gráfica
  const barData = Object.entries(monthlyData).map(([label, value]) => ({
    value,
    label,
    topLabelComponent: () => (
      <Text style={{ color: "black", fontSize: 12, marginTop: 4 }}>
        {value.toFixed(0) + " L"}
      </Text>
    ),
  }));

  // Extraer meses y años en un useState y que sean únicos, ejemplo: October 2023
  const extractMonthsAndYears = () => {
    const uniqueMonthsAndYearsSet = new Set(
      reports.map((item) => {
        const date = DateTime.fromISO(item.date_hour, { zone: "utc" });
        return date.toFormat("MMMM yyyy", { zone: "utc" });
      })
    );

    setMonthsAndYears(Array.from(uniqueMonthsAndYearsSet));
  };

  return (
    <View>
      <View>
        <Text style={styles.headerText}>Reporte mensual</Text>
        <Text style={styles.text}>Selecciona el mes y el año</Text>
        <Picker
          selectedValue={selectedMonthYear}
          onValueChange={(itemValue) => setSelectedMonthYear(itemValue)}
        >
          {monthsAndYears.map((monthYear, index) => (
            <Picker.Item key={index} label={monthYear} value={monthYear} />
          ))}
        </Picker>
      </View>
      <View style={styles.barChart}>
        <BarChart
          showFractionalValue
          showYAxisIndices
          barWidth={45}
          noOfSections={3}
          barBorderRadius={4}
          frontColor="#D2EAEE"
          data={barData}
          yAxisThickness={0.5}
          xAxisThickness={1}
          isAnimated
        />
      </View>
      <Text style={styles.week}>Semana</Text>
    </View>
  );
};

export default MounthReports;

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
  datePicker: {
    marginBottom: 20,
  },
  barChart: {
    width: "80%",
  },
  text: {
    textAlign: "center",
    marginBottom: 10,
  },
  week: {
    textAlign: "center",
    marginBottom: 10,
  },
});
