import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import InHeader from '../common/InHeader';
import FacultyHome from './FacultyHome';
import StudentDetails from '../student/StudentDetails';
import { motion, AnimatePresence } from 'framer-motion';

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

export default function BasicTabs() {
    const [value, setValue] = React.useState(0);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className="">
            <InHeader />
            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', minHeight: '100vh' }}>
                {/* Sidebar for desktop */}
                {!isMobile && (
                    <Box sx={{
                        width: '200px',
                        flexShrink: 0,
                        borderRight: 1,
                        borderColor: 'divider',
                        backgroundColor: 'white',
                        height: '100vh',
                        position: 'sticky',
                        top: 0,
                    }}>
                        <Tabs
                            orientation="vertical"
                            value={value}
                            onChange={handleChange}
                            aria-label="faculty tabs"
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
                            <Tab label="Students Details" {...a11yProps(1)} />
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
                                aria-label="faculty mobile tabs"
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
                                <Tab label="Students" {...a11yProps(1)} />
                            </Tabs>
                        </Box>
                    )}

                    {/* Tab panels with animations */}
                    <CustomTabPanel value={value} index={0}>
                        <FacultyHome />
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={1}>
                        <StudentDetails />
                    </CustomTabPanel>
                </Box>
            </div>
        </div>
    );
}

// import * as React from 'react';
// import PropTypes from 'prop-types';
// import Tabs from '@mui/material/Tabs';
// import Tab from '@mui/material/Tab';
// import Box from '@mui/material/Box';
// import { useTheme } from '@mui/material/styles';
// import { useMediaQuery } from '@mui/material';
// import InHeader from '../common/InHeader';
// import FacultyHome from './FacultyHome';
// import StudentDetails from '../student/StudentDetails';


// function CustomTabPanel(props) {
//     const { children, value, index, ...other } = props;

//     return (
//         <div
//             role="tabpanel"
//             hidden={value !== index}
//             id={`simple-tabpanel-${index}`}
//             aria-labelledby={`simple-tab-${index}`}
//             {...other}
//         >
//             {value === index && <Box sx={{ p: { xs: 1, sm: 0 } }}>{children}</Box>}
//         </div>
//     );
// }

// CustomTabPanel.propTypes = {
//     children: PropTypes.node,
//     index: PropTypes.number.isRequired,
//     value: PropTypes.number.isRequired,
// };

// function a11yProps(index) {
//     return {
//         id: `simple-tab-${index}`,
//         'aria-controls': `simple-tabpanel-${index}`,
//     };
// }

// export default function BasicTabs() {
//     const [value, setValue] = React.useState(0);
//     const theme = useTheme();
//     const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

//     const handleChange = (event, newValue) => {
//         setValue(newValue);
//     };

//     return (
//         <div className="">
//             <InHeader />
//             <Box sx={{ width: '100%' }}>
//                 <Box sx={{
//                     borderBottom: 1,
//                     borderColor: 'divider',
//                     position: 'sticky',
//                     top: 0,
//                     zIndex: 10,
//                     backgroundColor: 'white',
//                     display: 'flex',
//                     justifyContent: "center",
//                     alignItems: 'center',
//                     height: '10vh',
//                 }}>
//                     <Tabs
//                         value={value}
//                         onChange={handleChange}
//                         aria-label="basic tabs example"
//                         variant={isMobile ? "scrollable" : "standard"}
//                         scrollButtons="auto"
//                         allowScrollButtonsMobile
//                         sx={{
//                             maxWidth: '100%',
//                             '& .MuiTab-root': {
//                                 minWidth: 'unset',
//                                 padding: { xs: '12px 8px', sm: '12px 16px' },
//                                 fontSize: { xs: '0.75rem', sm: '0.875rem' }
//                             }
//                         }}
//                     >
//                         <Tab label="POsts" {...a11yProps(0)} />
//                         <Tab label={isMobile ? "Students" : "Students Details"} {...a11yProps(1)} />
//                     </Tabs>
//                 </Box>

//                 {/* Tab panels without swipe functionality */}
//                 <CustomTabPanel value={value} index={0}>
//                     <FacultyHome />
//                 </CustomTabPanel>
//                 <CustomTabPanel value={value} index={1}>
//                     <StudentDetails />
//                 </CustomTabPanel>
//             </Box>
//         </div>
//     );
// }
