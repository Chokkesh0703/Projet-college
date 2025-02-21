// import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';

import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import PhoneIcon from '@mui/icons-material/Phone';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
// import SchoolIcon from '@mui/icons-material/School';
import Logo from '../../assets/logo.png';

import { useState } from 'react';

const MyHeader = styled(Grid)(({ theme }) => ({
    backgroundColor: '#ffc13b',
    // backgroundColor: '#2ab7ca',
    // backgroundColor: 'ghostwhite',
    // backgroundColor: '#f4efe8',
    color: 'white',
    display: 'flex',
    justifyContent: 'left',
    alignItems: 'center',
    height: '12vh',
    width: '100vw',
    position: 'fixed',
    top: 0,
    zIndex: 100,
    padding: '0 20px',
    '& img': {
        height: '80px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    '& .typography': {
        display: 'flex',
        justifyContent: 'right',
        alignItems: 'center',
        gap: '50px',
    },
    '& .IndivialTypo': {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '4px',
        color: 'black',
        fontFamily: 'sans-serif',
        fontWeight: 'bold',
        fontSize: '20px',
        cursor: 'pointer'
    },
    '& Drawer': {
        display: 'none'
    },
    [theme.breakpoints.down('lg')]: {
        justifyContent: 'space-between',
        '& img': {
            height: '80px',
        },
        '& .typography': {
            display: 'none'
        },
    },
    [theme.breakpoints.down('md')]: {
        justifyContent: 'space-between',
        '& img': {
            height: '80px',
        },
        '& .typography': {
            display: 'none'
        },
    },
    [theme.breakpoints.down('sm')]: {
        justifyContent: 'space-between',
        '& img': {
            height: '80px',
        },
        '& .typography': {
            display: 'none'
        },
    },
}));

const Header = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    return (
        <>
            <MyHeader container>
                <Grid item md={1} xs={6} sm={6}>
                    <img src={Logo} alt="logo" />
                </Grid>
                <Grid item md={11} xs={6} sm={6} className="typography">
                    <Typography className='IndivialTypo' onClick={() => navigate('/')}><HomeIcon />Home</Typography>
                    <Typography className='IndivialTypo' onClick={() => navigate('/about')}><InfoIcon />About</Typography>
                    <Typography className='IndivialTypo' onClick={() => navigate('/contact')}><PhoneIcon />Contact</Typography>
                    <Typography className='IndivialTypo' onClick={() => navigate('/help')}><HelpCenterIcon />How to Use ?</Typography>
                </Grid>
                <IconButton edge="end" color="default" aria-label="menu" onClick={toggleSidebar} sx={{
                    display: { xs: 'block', sm: 'block', md: 'block', lg: 'none', xl: 'none' },
                }}>
                    <MenuIcon />
                </IconButton>
            </MyHeader>
            <Drawer anchor="right" open={isSidebarOpen} onClose={toggleSidebar}>
                <List>
                    <ListItem button onClick={() => { navigate('/'); toggleSidebar(); }}>
                        <ListItemIcon><HomeIcon /></ListItemIcon>
                        <ListItemText primary="Home" />
                    </ListItem>
                    <ListItem button onClick={() => { navigate('/about'); toggleSidebar(); }}>
                        <ListItemIcon><InfoIcon /></ListItemIcon>
                        <ListItemText primary="About" />
                    </ListItem>
                    <ListItem button onClick={() => { navigate('/contact'); toggleSidebar(); }}>
                        <ListItemIcon><PhoneIcon /></ListItemIcon>
                        <ListItemText primary="Contact" />
                    </ListItem>
                    <ListItem button onClick={() => { navigate('/help'); toggleSidebar(); }}>
                        <ListItemIcon><HelpCenterIcon /></ListItemIcon>
                        <ListItemText primary="Help" />
                    </ListItem>
                </List>
            </Drawer>
        </>
    );
};

export default Header;
