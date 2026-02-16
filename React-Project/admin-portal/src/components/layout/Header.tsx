import Navbar from './Navbar';
import { NavLink } from 'react-router-dom';
import './Header.css';

import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';

const Header = () => {
  return (
    <>
      <div className="header-sticky">
        <Navbar />

        <div className="sub-navbar">
          <div className="sub-navbar-inner">
            <NavLink to="/dashboard" className="sub-link">
              <DashboardIcon fontSize="small" />
              Dashboard
            </NavLink>

            <NavLink to="/reports" className="sub-link">
              <BarChartIcon fontSize="small" />
              Reports
            </NavLink>

            <NavLink to="/users" className="sub-link">
              <PeopleIcon fontSize="small" />
              Users
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
