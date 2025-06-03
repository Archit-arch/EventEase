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
import RegisterClub from './pages/RegisterClub';
import Footer from './components/Footer/Footer.jsx';
import AdminDashboard from './pages/AdminDashboard';

import Unauthorized from "./pages/Unauthorized/Unauthorized.jsx";
import ViewRequests from "./pages/ViewRequests.jsx";
import ViewAdminLogs from "./pages/ViewAdminLogs.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/login" element = {<Login/>}/>
        <Route path="/register-club" element={<RegisterClub/>} />

        
        
        <Route path="/create-event" element={<EventCreation/>} />  
        <Route path="/register" element={<Register/>} />

        <Route path="/studentDashboard" element={<StudentDashboard/>} />
        <Route path="/eventManager" element={<EventManager/>} />
        <Route path="/adminDashboard" element={<AdminDashboard/>} />
        
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/view-requests" element={<ViewRequests />} />
        
        <Route path="/view-admin-logs" element={< ViewAdminLogs />} />
      </Routes>
      <Footer />
    </Router>
   
  );
}

export default App;