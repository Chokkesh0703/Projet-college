import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import InHeader from "../common/InHeader";
import InFooter from "../common/InFooter"

import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import AdminPost from "./Adminpost";
import StudentApprove from "../student/StudentApprove";

const AdminHome = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Ensure authentication state is loaded before checking user role
  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/"); // Redirect to login if not an admin
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout(); // Clear authentication state
  };

  function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: { xs: 1, sm: 0 } }}>{children}</Box>}
      </div>
    );
  }

  CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  const [value, setValue] = React.useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="bg-cover bg-no-repeat" style={{
      // backgroundImage:`url(${BgAdmin2})`
    }}>
      <InHeader />
      <Box sx={{ width: '100%' }}>
        <Box sx={{
          borderBottom: 1,
          borderColor: 'divider',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          backgroundColor: 'white',
          display: 'flex',
          justifyContent: "center",
          alignItems: 'center',
          height: '10vh',
        }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            variant={isMobile ? "scrollable" : "standard"}
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              maxWidth: '100%',
              '& .MuiTab-root': {
                minWidth: 'unset',
                padding: { xs: '12px 8px', sm: '12px 16px' },
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }
            }}
          >
            <Tab label={isMobile ? "Posts" : "Posts"} {...a11yProps(0)} />
            <Tab label={isMobile ? "Requests" : "User Requests"} {...a11yProps(1)} />
          </Tabs>
        </Box>

        {/* Tab panels without swipe functionality */}
        <CustomTabPanel value={value} index={0}>
          <AdminPost />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <StudentApprove />
        </CustomTabPanel>
      </Box>
      <InFooter/>
    </div>
  );
};

export default AdminHome;
