import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const URI = "http://localhost:8000/reports";

const CompShowReports = () => {
  const [reports, setReports] = useState([]);
  useEffect(() => {
    getReports();
  }, []);

  // Procedimiento para mostrar los reportes
  const getReports = async () => {
    const res = await axios.get(URI);
    setReports(res.data);
  };

  // Procedimiento para eliminar un reporte
  const deleteReport = async (id) => {
    await axios.delete(`${URI}/${id}`);
    getReports();
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <h1>Reportes</h1>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Fecha y hora</th>
                <th>Litros totales</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id}>
                  <td>{report.id}</td>
                  <td>{report.date_hour}</td>
                  <td>{report.totalLiters}</td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => deleteReport(report._id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CompShowReports;
