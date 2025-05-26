import './styles/styles.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import Navbar from "./components/Navbar";
import StudentDashboard from "./pages/StudentDashboard";
import EventManager from './pages/EventManager';
import EventCreation from './pages/EventCreation';
import Login from './pages/Login';
import Register from './pages/Register';
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/login" element = {<Login/>}/>
        <Route path="/studentDashboard" element={<StudentDashboard/>} />
        <Route path="/eventManager" element={<EventManager/>} />
        
        <Route path="/eventCreation" element={<EventCreation/>} />  
        <Route path="/register" element={<Register/>} />
      </Routes>

    </Router>
   
  );
}

export default App;