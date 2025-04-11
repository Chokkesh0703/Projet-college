import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import PhoneIcon from "@mui/icons-material/Phone";
import HelpCenterIcon from "@mui/icons-material/HelpCenter";
import Logo from "../../assets/logo.png";


const Header = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {/* Main Header */}
      <div className="flex justify-between items-center bg-yellow-400 p-4 fixed w-full top-0 z-50 shadow-md 
       " style={{position: "relative"}} >
        {/* Logo Section */}
        <div className="flex items-center">
          <img src={Logo} alt="logo" className="h-20" />
        </div>

        {/* Navigation Links (hidden on small screens, visible on medium and above) */}
        <div className="hidden md:flex space-x-10">
          <Typography
            className="cursor-pointer text-black font-bold text-lg"
            onClick={() => navigate("/")}
          >
            <HomeIcon className="mr-4 ml-4" />Home
          </Typography>
          <Typography
            className="cursor-pointer text-black font-bold text-lg"
            onClick={() => navigate("/about")}
          >
            <InfoIcon className="mr-4 ml-4" />About
          </Typography>
          <Typography
            className="cursor-pointer text-black font-bold text-lg"
            onClick={() => navigate("/contact")}
          >
            <PhoneIcon className="mr-4 ml-4" />Contact
          </Typography>
          <Typography
            className="cursor-pointer text-black font-bold text-lg"
            onClick={() => navigate("/help")}
          >
            <HelpCenterIcon className="mr-4 ml-4" />How to Use ?
          </Typography>
        </div>

        {/* Mobile Menu Button (visible on small screens only) */}
        <div className="md:hidden">
          <IconButton
            edge="end"
            color="default"
            aria-label="menu"
            onClick={toggleSidebar}
            className="md:hidden" // Menu button hidden on medium screens and above
          >
            <MenuIcon />
          </IconButton>
        </div>
      </div>

      {/* Mobile Sidebar Drawer (visible on small screens only) */}
      <Drawer
        anchor="right"
        open={isSidebarOpen}
        onClose={toggleSidebar}
        className="" // Hide the Drawer on medium screens and above
      >
        <List>
          <ListItem
            button
            onClick={() => {
              navigate("/");
              toggleSidebar();
            }}
          >
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem
            button
            onClick={() => {
              navigate("/about");
              toggleSidebar();
            }}
          >
            <ListItemIcon>
              <InfoIcon />
            </ListItemIcon>
            <ListItemText primary="About" />
          </ListItem>
          <ListItem
            button
            onClick={() => {
              navigate("/contact");
              toggleSidebar();
            }}
          >
            <ListItemIcon>
              <PhoneIcon />
            </ListItemIcon>
            <ListItemText primary="Contact" />
          </ListItem>
          <ListItem
            button
            onClick={() => {
              navigate("/help");
              toggleSidebar();
            }}
          >
            <ListItemIcon>
              <HelpCenterIcon />
            </ListItemIcon>
            <ListItemText primary="Help" />
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};

export default Header;
