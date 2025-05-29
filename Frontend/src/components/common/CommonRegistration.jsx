import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import InstructionAdmin from "../instructions/InstructionAdmin"
import InstructionFaculty from "../instructions/InstructionFaculty"
import InstructionStudents from "../instructions/InstructionStudents"
import InFooter from './InFooter';
import Header from './Header';


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

export default function BasicTabs() {
    const [value, setValue] = React.useState(0);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className="h-auto">
            <Header />
            <Box sx={{ width: '100%' }}>
                <Box sx={{
                    borderBottom: 1,
                    borderColor: 'divider',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                    backgroundColor: 'white',
                    display:'flex',
                    justifyContent:"center",
                    alignItems:'center',
                    height:'10vh',
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
                        <Tab label={isMobile ? "Student" : "Student Guide"} {...a11yProps(0)} />
                        <Tab label={isMobile ? "Faculty" : "Faculty Guide"} {...a11yProps(1)} />
                        <Tab label={isMobile ? "Admin" : "Admin Guide"} {...a11yProps(2)} />
                    </Tabs>
                </Box>

                {/* Tab panels without swipe functionality */}
                <CustomTabPanel value={value} index={0}>
                    <InstructionStudents />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    <InstructionFaculty/>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={2}>
                    <InstructionAdmin />
                </CustomTabPanel>
            </Box>
            <InFooter/>
        </div>
    );
}

