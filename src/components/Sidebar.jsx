import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, faBolt, faTachometerAlt, faAddressBook, 
  faComments, faCalendarAlt, faCreditCard, faEnvelope, 
  faFileAlt, faCog, faSignOutAlt, faBars 
} from '@fortawesome/free-solid-svg-icons';
import axios from "axios";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const [user, setUser] = useState({ firstName: "", lastName: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://82.180.137.7:5000/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser({
          firstName: response.data.firstName || "First Name",
          lastName: response.data.lastName || "Last Name",
        });
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/get-started");
  };

  return (
    <>
      <button 
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-40 lg:hidden bg-gray-800 p-2 rounded-lg text-white"
      >
        <FontAwesomeIcon icon={faBars} />
      </button>

      <div className={`w-64 bg-gradient-to-b from-red-900 to-black p-5 flex flex-col justify-between h-full`}>
        <div>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl text-red-600 mb-5">Lead Savvy</h1>
            <button onClick={toggleSidebar} className="text-white text-2xl lg:hidden">
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          <div className="bg-white/10 backdrop-blur-lg p-3 rounded-lg mb-5">
            <div className="flex items-center">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIs3peZbmHi0e-uTv4_RB4RWFfqEzE7BNNSg&s"
                alt="Profile"
                className="w-12 h-12 rounded-full mr-3"
              />
              <div>
                <span className="text-white">{`${user.firstName} ${user.lastName}`}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center mb-5">
            <div className="flex-grow bg-white/10 backdrop-blur-lg p-2 rounded-lg mr-2">
              <input
                type="text"
                placeholder="Search"
                className="w-full bg-transparent text-white outline-none"
              />
            </div>
            <div className="bg-white/10 backdrop-blur-lg p-2 rounded-lg">
              <FontAwesomeIcon icon={faBolt} className="text-green-400" />
            </div>
          </div>

          <nav className="flex-grow">
            <NavLink to="/dashboard" className={({ isActive }) => `flex items-center p-3 text-white rounded-lg mb-2 hover:bg-black/70 hover:opacity-80 transition-all ${isActive ? 'bg-black/70' : ''}`}>
              <FontAwesomeIcon icon={faTachometerAlt} className="mr-3" /> Dashboard
            </NavLink>
            <NavLink to="/contacts" className={({ isActive }) => `flex items-center p-3 text-white rounded-lg mb-2 hover:bg-black/70 hover:opacity-80 transition-all ${isActive ? 'bg-black/70' : ''}`}>
              <FontAwesomeIcon icon={faAddressBook} className="mr-3" /> Contact
            </NavLink>
            <NavLink to="/conversation" className={({ isActive }) => `flex items-center p-3 text-white rounded-lg mb-2 hover:bg-black/70 hover:opacity-80 transition-all ${isActive ? 'bg-black/70' : ''}`}>
              <FontAwesomeIcon icon={faComments} className="mr-3" /> Conversation
            </NavLink>
            <NavLink to="/calendar" className={({ isActive }) => `flex items-center p-3 text-white rounded-lg mb-2 hover:bg-black/70 hover:opacity-80 transition-all ${isActive ? 'bg-black/70' : ''}`}>
              <FontAwesomeIcon icon={faCalendarAlt} className="mr-3" /> Calendar
            </NavLink>
            <NavLink to="/opportunities" className={({ isActive }) => `flex items-center p-3 text-white rounded-lg mb-2 hover:bg-black/70 hover:opacity-80 transition-all ${isActive ? 'bg-black/70' : ''}`}>
              <FontAwesomeIcon icon={faCreditCard} className="mr-3" /> Opportunities
            </NavLink>
            <NavLink to="/email" className={({ isActive }) => `flex items-center p-3 text-white rounded-lg mb-2 hover:bg-black/70 hover:opacity-80 transition-all ${isActive ? 'bg-black/70' : ''}`}>
              <FontAwesomeIcon icon={faEnvelope} className="mr-3" /> Email Marketing
            </NavLink>
            <NavLink to="/scraper" className={({ isActive }) => `flex items-center p-3 text-white rounded-lg mb-2 hover:bg-black/70 hover:opacity-80 transition-all ${isActive ? 'bg-black/70' : ''}`}>
              <FontAwesomeIcon icon={faEnvelope} className="mr-3" /> Data Scrapper
            </NavLink>
            <NavLink to="http://82.180.137.7:8080" className={({ isActive }) => `flex items-center p-3 text-white rounded-lg mb-2 hover:bg-black/70 hover:opacity-80 transition-all ${isActive ? 'bg-black/70' : ''}`}>
              <FontAwesomeIcon icon={faFileAlt} className="mr-3" /> Landing Page Builder
            </NavLink>
          </nav>

          <hr className="border-white/20 my-5" />
        </div>

        <div>
          <NavLink to="/settings" className={({ isActive }) => `flex items-center p-3 text-white rounded-lg mb-2 hover:bg-black/70 hover:opacity-80 transition-all ${isActive ? 'bg-black/70' : ''}`}>
            <FontAwesomeIcon icon={faCog} className="mr-3" /> Settings
          </NavLink>
          <button onClick={handleLogout} className="w-full flex items-center p-3 text-white rounded-lg hover:bg-black/70 hover:opacity-80 transition-all">
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-3" /> Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;