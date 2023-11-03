import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { Picker } from "@react-native-picker/picker";

const MounthReports = (props) => {
  const { reports } = props;
  const [monthsAndYears, setMonthsAndYears] = useState([]);
  const [selectedMonthYear, setSelectedMonthYear] = useState("");

  useEffect(() => {
    extractMonthsAndYears(reports);
  }, [reports]);

  // Agrupar los informes por semana y calcular la suma total de litros
  const monthlyData = reports
    //Se filtra los datos de acuerdo al mes y año seleccionado
    .filter((item) => {
      const date = new Date(item.date_hour);
      const monthYear = `${date.toLocaleString("default", {
        month: "long",
      })} ${date.getFullYear()}`;
      return monthYear === selectedMonthYear;
    })
    //Una vez que se filtra, aplica un reduce para guardar un objeto con el numero de semana como clave y como valor el numero de litros
    .reduce((acc, item) => {
      const date = new Date(item.date_hour);
      const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);

      // Calcular el número de semana dentro del mes
      const weekOfMonth = Math.ceil(
        (date.getDate() + firstDayOfMonth.getDay()) / 7
      );

      // Acumula el total de litros de acuerdo a la semana, si cambia vuelve a cero para empezar acumular la siguiente semana calculada arriba
      if (!acc[weekOfMonth]) {
        acc[weekOfMonth] = 0;
      }
      acc[weekOfMonth] += item.totalLiters;

      return acc;
    }, {});

  // Crear el arreglo de datos para la gráfica
  const barData = Object.entries(monthlyData).map(([label, value]) => ({
    value,
    label,
    topLabelComponent: () => (
      <Text style={{ color: "black", fontSize: 12, marginTop: 4 }}>
        {value + " L"}
      </Text>
    ),
  }));

  //Extraer meses y años en un useState y que sean unicos, ejemplo: October 2023
  const extractMonthsAndYears = () => {
    const uniqueMonthsAndYearsSet = new Set(
      reports.map((item) => {
        const date = new Date(item.date_hour);
        return `${date.toLocaleString("default", {
          month: "long",
        })} ${date.getFullYear()}`;
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
          barWidth={35} // Ajusta el ancho del gráfico a un valor mayor
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
