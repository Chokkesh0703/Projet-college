import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import InHeader from "../common/InHeader";
import InFooter from "../common/InFooter";
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import AdminPost from "./Adminpost";
import StudentApprove from "../student/StudentApprove";
import { motion, AnimatePresence } from 'framer-motion';

const AdminHome = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
  };

  // Enhanced CustomTabPanel with animations
  function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: { xs: 1, sm: 0 }, overflow: 'hidden' }}>
            <AnimatePresence mode='wait'>
              <motion.div
                key={index}
                initial={{ opacity: 0, x: isMobile ? 0 : (value > index ? 50 : -50) }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isMobile ? 0 : (value < index ? 50 : -50) }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </Box>
        )}
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
    <div className="bg-cover bg-no-repeat">
      {/* <InHeader /> */}
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', minHeight: 'calc(100vh - 128px)' }}>
        {/* Sidebar for desktop */}
        {!isMobile && (
          <Box sx={{
            width: '200px',
            flexShrink: 0,
            borderRight: 1,
            borderColor: 'divider',
            backgroundColor: 'white',
            height: 'calc(100vh - 64px)',
            position: 'sticky',
            top: '64px',
          }}>
            <Tabs
              orientation="vertical"
              value={value}
              onChange={handleChange}
              aria-label="admin tabs"
              sx={{
                mt: 2,
                '& .MuiTab-root': {
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  padding: '12px 16px',
                  fontSize: '0.875rem',
                  transition: 'all 0.2s ease',
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.action.selected,
                    transform: 'translateX(5px)',
                    fontWeight: 'bold'
                  },
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  }
                }
              }}
            >
              <Tab label="Posts" {...a11yProps(0)} />
              <Tab label="User Requests" {...a11yProps(1)} />
            </Tabs>
          </Box>
        )}

        {/* Main content area */}
        <Box sx={{ flexGrow: 1, width: isMobile ? '100%' : 'calc(100% - 200px)' }}>
          {/* Mobile tabs */}
          {isMobile && (
            <Box sx={{
              borderBottom: 1,
              borderColor: 'divider',
              position: 'sticky',
              top: '64px',
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
                aria-label="admin mobile tabs"
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                sx={{
                  maxWidth: '100%',
                  '& .MuiTab-root': {
                    minWidth: 'unset',
                    padding: '12px 16px',
                    fontSize: '0.875rem',
                    transition: 'all 0.2s ease',
                    '&.Mui-selected': {
                      color: theme.palette.primary.main,
                      transform: 'scale(1.05)',
                      fontWeight: 'bold'
                    },
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    }
                  }
                }}
              >
                <Tab label="Posts" {...a11yProps(0)} />
                <Tab label="Requests" {...a11yProps(1)} />
              </Tabs>
            </Box>
          )}

          {/* Tab panels with animations */}
          <CustomTabPanel value={value} index={0}>
            <AdminPost />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <StudentApprove />
          </CustomTabPanel>
        </Box>
      </div>
      <InFooter />
    </div>
  );
};

export default AdminHome;

