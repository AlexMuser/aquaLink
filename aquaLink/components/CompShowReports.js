import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { Picker } from "@react-native-picker/picker";

const CompShowReports = () => {
  const [reports, setReports] = useState([]);
  const [monthsAndYears, setMonthsAndYears] = useState([]);
  const [selectedMonthYear, setSelectedMonthYear] = useState("");

  useEffect(() => {
    getReports();
  }, []);

  const getReports = async () => {
    const res = await fetch("http://10.0.2.2:8000/reports"); //10.0.2.2:8000 para Android Studio y localhost:8000 para dispositivos fisicos
    const data = await res.json();
    setReports(data);
    extractMonthsAndYears(data);
  };

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
        {value}
      </Text>
    ),
  }));

  //Extraer meses y años en un useState y que sean unicos, ejemplo: October 2023
  const extractMonthsAndYears = (data) => {
    const uniqueMonthsAndYearsSet = new Set(
      data.map((item) => {
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
        <Text>Selecciona el mes y el año:</Text>
        <Picker
          selectedValue={selectedMonthYear}
          onValueChange={(itemValue) => setSelectedMonthYear(itemValue)}
        >
          {monthsAndYears.map((monthYear, index) => (
            <Picker.Item key={index} label={monthYear} value={monthYear} />
          ))}
        </Picker>
        <Text>Tu escogiste: {selectedMonthYear}</Text>
      </View>
      <View style={styles.barChart}>
        <BarChart
          barWidth={30} // Ajusta el ancho del gráfico a un valor mayor
          noOfSections={3}
          barBorderRadius={4}
          frontColor="#D2EAEE"
          data={barData}
          yAxisThickness={0}
          xAxisThickness={0}
          labelStyle={{ fontSize: 6 }} // Ajusta el tamaño de fuente más pequeño para las etiquetas
        />
      </View>
    </View>
  );
};

export default CompShowReports;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 16,
    marginBottom: 10,
  },
  datePicker: {
    marginBottom: 20,
  },
  barChart: {
    width: "80%",
  },
});
