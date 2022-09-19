import React from 'react';
import { Header } from "./components";
import './App.css';
import {BrowserRouter} from "react-router-dom";
import {Calendar} from "./pages";

function App() {
  return (
    <div id="App">
      <Header />
      <Calendar />
    </div>
  );
}

export default App;
