import './App.css';
import React, {useState } from 'react';
import {AdminRouter} from './components/admin/AdminLayout';
import {StudentRouter} from './components/student/StudentLayout';
import {InstructorRouter} from './components/instructor/InstructorLayout';
import Login from './Login';
import logo from './img/CSUMBLogo.png';


function App() {

  const[isAuthenticated, setAuth] = useState(false);
  const[userType, setUserType] = useState('');

  const logout = () => {
    setAuth(false);
    sessionStorage.removeItem("jwt");
  }

    const logoStyle = {
        position: 'fixed',
        bottom: '10px', // Adjust as needed
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: '9999', // Ensure it's above other content
    };

  if (! isAuthenticated) {
      return (
          <div>
              <Login setAuth={setAuth} setUserType={setUserType}/>
              <img src={logo} alt="Logo" style={logoStyle}/>
          </div>
      );
  } else if (userType === 'ADMIN') {
      return (
          <div>
              <AdminRouter logout={logout}/>
              <img src={logo} alt="Logo" style={logoStyle}/>
          </div>
      )
  } else if (userType === 'STUDENT') {
      return (
          <div>
              <StudentRouter logout={logout}/>
              <img src={logo} alt="Logo" style={logoStyle}/>
          </div>
      )

  } else if (userType === 'INSTRUCTOR') {
      return (
          <div>
              <InstructorRouter logout={logout}/>
              <img src={logo} alt="Logo" style={logoStyle}/>
          </div>
      )

  } else {
      return (
          <div>
              <h1>Unknown user type</h1>
              <img src={logo} alt="Logo" style={logoStyle} />
          </div>
      );
  }
}

export default App;
