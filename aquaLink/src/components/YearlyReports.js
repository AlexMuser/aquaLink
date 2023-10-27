import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { Picker } from "@react-native-picker/picker";

const YearlyReports = (props) => {
  const { reports } = props;
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    extractYears(reports);
  }, [reports]);

  // Filtrar los datos por año seleccionado
  const yearlyData = reports
    .filter((item) => {
      const date = new Date(item.date_hour);
      return date.getFullYear() === selectedYear;
    })
    .reduce((acc, item) => {
      const date = new Date(item.date_hour);
      const month = date.toLocaleString("default", { month: "long" });

      if (!acc[month]) {
        acc[month] = 0;
      }
      acc[month] += item.totalLiters;

      return acc;
    }, {});

  // Crear el arreglo de datos para la gráfica
  const barData = Object.entries(yearlyData).map(([label, value]) => ({
    value,
    label,
    topLabelComponent: () => (
      <Text style={{ color: "black", fontSize: 12, marginTop: 4 }}>
        {value}
      </Text>
    ),
  }));

  //Extraer los años registrados y agregarlos a la variable 'years'
  const extractYears = () => {
    const uniqueYearsSet = new Set(
      reports.map((item) => {
        const date = new Date(item.date_hour);
        return date.getFullYear();
      })
    );

    setYears(Array.from(uniqueYearsSet));
  };

  return (
    <View>
      <View>
        <Text style={styles.headerText}>Reporte anual</Text>
        <Text style={styles.text}>Selecciona el año</Text>
        <Picker
          selectedValue={selectedYear}
          onValueChange={(itemValue) => setSelectedYear(itemValue)}
        >
          {years.map((year, index) => (
            <Picker.Item key={index} label={year.toString()} value={year} />
          ))}
        </Picker>
      </View>
      <View style={styles.barChart}>
        <BarChart
          showFractionalValue
          showYAxisIndices
          barWidth={30}
          noOfSections={3}
          barBorderRadius={4}
          frontColor="#D2EAEE"
          data={barData}
          yAxisThickness={0.5}
          xAxisThickness={1}
          isAnimated
        />
      </View>
    </View>
  );
};

export default YearlyReports;

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
});
