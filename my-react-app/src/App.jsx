import './styles/styles.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import StudentDashboard from "./pages/StudentDashboard";
import Footer from "./components/Footer";
import EventManager from './pages/EventManager';
import EventCreation from './pages/EventCreation';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/studentDashboard" element={<StudentDashboard/>} />
        <Route path="/eventManager" element={<EventManager/>} />
        <Route path="/create-event" element={<EventCreation/>} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;