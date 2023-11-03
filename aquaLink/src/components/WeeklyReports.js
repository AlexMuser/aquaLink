import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
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

    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    const startDate = new Date(year, month, 1);
    const startDayOfWeek = startDate.getDay();

    let weekNumber = Math.ceil((day + startDayOfWeek) / 7);

    if (startDayOfWeek !== 0) {
      // Adjust for the case where the first day of the month is not a Monday
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
        {value + " L"}
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
            barWidth={30}
            noOfSections={7}
            barBorderRadius={4}
            frontColor="#D2EAEE"
            data={dailyBarData}
            yAxisThickness={0.5}
            xAxisThickness={1}
            isAnimated
          />
        </View>
      )}
    </View>
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
    width: "80%",
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
});
