import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import CaseDetails from "./pages/CaseDetails";
import Whitepaper from "./pages/Whitepaper";
import PitchDeck from "./pages/PitchDeck";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/cases/:caseId" element={<CaseDetails />} />
          <Route path="/whitepaper" element={<Whitepaper />} />
          <Route path="/pitch-deck" element={<PitchDeck />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
