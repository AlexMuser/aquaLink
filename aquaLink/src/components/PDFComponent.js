import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export const PDFDay = (props) => {
  const data = props.reports;
  const dataByDay = {};

  data.forEach((item) => {
    const date = item.date_hour.slice(0, 10);

    if (dataByDay[date]) {
      dataByDay[date].push(item);
    } else {
      dataByDay[date] = [item];
    }
  });

  const html = `
  <html>
  <head>
    <title>Reporte de Consumo de Agua por dia</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f0f0f0;
      }
      h1 {
        color: #333;
      }
      .container {
        padding: 20px;
      }
      .box {
        border: 1px solid #ccc;
        background-color: #fff;
        padding: 20px;
        margin: 20px 0;
      }
      h2 {
        font-size: 18px;
        color: #333;
      }
      ul {
        list-style: none;
        padding: 0;
      }
      li {
        margin: 5px 0;
        font-size: 16px;
        color: #666;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Reporte de Consumo de Agua por dia</h1>
      <p>Hola, aquí está tu reporte de consumo de agua:</p>
      ${Object.keys(dataByDay)
        .map((date) => {
          let totalLiters = 0; // Inicializa el total de litros
          return `
          <div class="box">
            <h2>${date}</h2>
            <ul>
            ${dataByDay[date]
              .map((item, index) => {
                const dateHour = new Date(item.date_hour);
                const formattedHour =
                  (dateHour.getUTCHours() % 12 || 12) +
                  ":" +
                  (dateHour.getUTCMinutes() < 10 ? "0" : "") +
                  dateHour.getUTCMinutes() +
                  " " +
                  (dateHour.getUTCHours() < 12 ? "AM" : "PM");
                totalLiters += item.totalLiters; // Actualiza el total de litros
                return `<li>Hora: ${formattedHour}, Total consumido: ${
                  item.totalLiters
                } L</li>${
                  index === dataByDay[date].length - 1
                    ? `<li>Total del día: ${totalLiters} L</li>`
                    : ""
                }`;
              })
              .join("")}            
            </ul>
          </div>
          `;
        })
        .join("")}
    </div>
  </body>
</html>
`;

  const printToPdf = async () => {
    const response = await Print.printToFileAsync({
      html,
    });

    // cambia el título del PDF
    const pdfName = `${response.uri.slice(
      0,
      response.uri.lastIndexOf("/") + 1
    )}Report_Days.pdf`;

    await FileSystem.moveAsync({
      from: response.uri,
      to: pdfName,
    });

    // comparte el PDF
    sharePdf(pdfName);
  };

  const sharePdf = (url) => {
    Sharing.shareAsync(url);
  };

  return (
    <TouchableOpacity style={styles.button}>
      <Text style={styles.buttonText} onPress={printToPdf}>
        Diario
      </Text>
    </TouchableOpacity>
  );
};

export const PDFWeekly = (props) => {
  const data = props.reports;
  const dataByWeek = {};

  data.forEach((item) => {
    const date = new Date(item.date_hour);
    date.setHours(0, 0, 0, 0);

    const weekNumber = getWeekNumber(date);
    const monthName = date.toLocaleString("default", { month: "long" });

    if (!dataByWeek[weekNumber]) {
      dataByWeek[weekNumber] = {
        month: monthName,
        data: [],
      };
    }

    dataByWeek[weekNumber].data.push(item);
  });

  const html = `
    <html>
    <head>
      <title>Reporte de Consumo de Agua Semanal</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f0f0f0;
        }
        h1 {
          color: #333;
        }
        .container {
          padding: 20px;
        }
        .box {
          border: 1px solid #ccc;
          background-color: #fff;
          padding: 20px;
          margin: 20px 0;
        }
        h2 {
          font-size: 18px;
          color: #333;
        }
        ul {
          list-style: none;
          padding: 0;
        }
        li {
          margin: 5px 0;
          font-size: 16px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Reporte de Consumo de Agua Semanal</h1>
        <p>Hola, aquí está tu informe de consumo de agua semanal:</p>
        ${Object.keys(dataByWeek)
          .map((weekNumber) => {
            const weekData = dataByWeek[weekNumber];
            let totalLiters = 0;
            return `
            <div class="box">
              <h2>Semana ${weekNumber} del mes de ${weekData.month}</h2>
              <ul>
              ${weekData.data
                .map((item, index) => {
                  totalLiters += item.totalLiters;
                  return `<li>Fecha: ${item.date_hour}, Total consumido: ${
                    item.totalLiters
                  } L</li>${
                    index === weekData.data.length - 1
                      ? `<li>Total semanal: ${totalLiters} L</li>`
                      : ""
                  }`;
                })
                .join("")}            
              </ul>
            </div>
            `;
          })
          .join("")}
      </div>
    </body>
  </html>
  `;

  const printToPdf = async () => {
    const response = await Print.printToFileAsync({
      html,
    });

    const pdfName = `${response.uri.slice(
      0,
      response.uri.lastIndexOf("/") + 1
    )}Report_Weekly.pdf`;

    await FileSystem.moveAsync({
      from: response.uri,
      to: pdfName,
    });

    sharePdf(pdfName);
  };

  const sharePdf = (url) => {
    Sharing.shareAsync(url);
  };

  return (
    <TouchableOpacity style={styles.button}>
      <Text style={styles.buttonText} onPress={printToPdf}>
        Semanal
      </Text>
    </TouchableOpacity>
  );
};

export const PDFMonths = (props) => {
  const data = props.reports;
  const dataByMonth = {};

  data.forEach((item) => {
    const date = new Date(item.date_hour);
    date.setHours(0, 0, 0, 0);

    const monthYear = `${date.toLocaleString("default", {
      month: "long",
    })} ${date.getFullYear()}`;

    if (!dataByMonth[monthYear]) {
      dataByMonth[monthYear] = [];
    }

    dataByMonth[monthYear].push(item);
  });

  const html = `
    <html>
    <head>
      <title>Reporte de Consumo de Agua Mensual</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f0f0f0;
        }
        h1 {
          color: #333;
        }
        .container {
          padding: 20px;
        }
        .box {
          border: 1px solid #ccc;
          background-color: #fff;
          padding: 20px;
          margin: 20px 0;
        }
        h2 {
          font-size: 18px;
          color: #333;
        }
        ul {
          list-style: none;
          padding: 0;
        }
        li {
          margin: 5px 0;
          font-size: 16px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Reporte de Consumo de Agua Mensual</h1>
        <p>Hola, aquí está tu informe de consumo de agua mensual:</p>
        ${Object.keys(dataByMonth)
          .map((monthYear) => {
            let totalLiters = 0;
            return `
            <div class="box">
              <h2>${monthYear}</h2>
              <ul>
              ${dataByMonth[monthYear]
                .map((item, index) => {
                  totalLiters += item.totalLiters;
                  return `<li>Fecha: ${item.date_hour}, Total consumido: ${
                    item.totalLiters
                  } L</li>${
                    index === dataByMonth[monthYear].length - 1
                      ? `<li>Total mensual: ${totalLiters} L</li>`
                      : ""
                  }`;
                })
                .join("")}            
              </ul>
            </div>
            `;
          })
          .join("")}
      </div>
    </body>
  </html>
  `;

  const printToPdf = async () => {
    const response = await Print.printToFileAsync({
      html,
    });

    const pdfName = `${response.uri.slice(
      0,
      response.uri.lastIndexOf("/") + 1
    )}Report_Monthly.pdf`;

    await FileSystem.moveAsync({
      from: response.uri,
      to: pdfName,
    });

    sharePdf(pdfName);
  };

  const sharePdf = (url) => {
    Sharing.shareAsync(url);
  };

  return (
    <TouchableOpacity style={styles.button}>
      <Text style={styles.buttonText} onPress={printToPdf}>
        Mensual
      </Text>
    </TouchableOpacity>
  );
};

export const PDFYears = (props) => {
  const data = props.reports;
  const dataByYear = {};

  data.forEach((item) => {
    const date = new Date(item.date_hour);
    date.setHours(0, 0, 0, 0);

    const year = date.getFullYear();
    const month = date.getMonth();
    const monthName = date.toLocaleString("default", { month: "long" });

    if (!dataByYear[year]) {
      dataByYear[year] = {};
    }

    if (!dataByYear[year][month]) {
      dataByYear[year][month] = {
        monthName: monthName,
        data: [],
      };
    }

    dataByYear[year][month].data.push(item);
  });

  const html = `
    <html>
    <head>
      <title>Reporte de Consumo de Agua Anual</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f0f0f0;
        }
        h1 {
          color: #333;
        }
        .container {
          padding: 20px;
        }
        .box {
          border: 1px solid #ccc;
          background-color: #fff;
          padding: 20px;
          margin: 20px 0;
        }
        h2 {
          font-size: 18px;
          color: #333;
        }
        ul {
          list-style: none;
          padding: 0;
        }
        li {
          margin: 5px 0;
          font-size: 16px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Reporte de Consumo de Agua Anual</h1>
        <p>Hola, aquí está tu informe de consumo de agua anual:</p>
        ${Object.keys(dataByYear)
          .map((year) => {
            return `
            <div class="box">
              <h2>${year}</h2>
              ${Object.keys(dataByYear[year])
                .map((month) => {
                  const monthData = dataByYear[year][month];
                  let totalLiters = 0;
                  return `
                  <h3>${monthData.monthName}</h3>
                  <ul>
                  ${monthData.data
                    .map((item, index) => {
                      totalLiters += item.totalLiters;
                      return `<li>Fecha: ${item.date_hour}, Total consumido: ${
                        item.totalLiters
                      } L</li>${
                        index === monthData.data.length - 1
                          ? `<li>Total mensual: ${totalLiters} L</li>`
                          : ""
                      }`;
                    })
                    .join("")}
                  </ul>
                  `;
                })
                .join("")}
            </div>
            `;
          })
          .join("")}
      </div>
    </body>
  </html>
  `;

  const printToPdf = async () => {
    const response = await Print.printToFileAsync({
      html,
    });

    const pdfName = `${response.uri.slice(
      0,
      response.uri.lastIndexOf("/") + 1
    )}Report_Yearly.pdf`;

    await FileSystem.moveAsync({
      from: response.uri,
      to: pdfName,
    });

    sharePdf(pdfName);
  };

  const sharePdf = (url) => {
    Sharing.shareAsync(url);
  };

  return (
    <TouchableOpacity style={styles.button}>
      <Text style={styles.buttonText} onPress={printToPdf}>
        Anual
      </Text>
    </TouchableOpacity>
  );
};

function getWeekNumber(date) {
  const d = new Date(date);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const weekNumber = Math.ceil((date.getDate() + day) / 7);
  return weekNumber;
}

const styles = StyleSheet.create({
  button: {
    alignSelf: "stretch",
    backgroundColor: "rgba(185, 232, 254, 1)",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#016ea3",
    height: 48,
    width: 110,
    justifyContent: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonText: {
    fontStyle: "normal",
    fontSize: 16,
    color: "#016ea3",
    textAlign: "center",
    lineHeight: 20,
    letterSpacing: -0.25,
  },
});
