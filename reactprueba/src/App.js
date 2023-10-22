import logo from "./logo.svg";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import CompShowReports from "./appReports/showReport";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <CompShowReports />
      </header>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CompShowReports />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
