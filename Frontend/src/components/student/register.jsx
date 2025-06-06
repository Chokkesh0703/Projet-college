import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Paper,
  Divider
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InFooter from "../common/InFooter"
import Header from "../common/Header";


const API_BASE_URL = "http://localhost:8000";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    course: "",
    collegeid: "",
    unid: "",
    yearofpass: "",
    email: "",
    phoneno: "",
    Password: "",
    role: "student", // Default role selection
  });

  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    const isRegistered = sessionStorage.getItem("registered");
    if (isRegistered) {
      setRegistered(false);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value.trim() });
  };

  const validateForm = () => {
    if (!formData.email.includes("@")) {
      alert("Enter a valid email address");
      return false;
    }
    if (!/^\d{10}$/.test(formData.phoneno)) {
      alert("Enter a valid 10-digit phone number");
      return false;
    }
    return true;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await axios.post(`${API_BASE_URL}/api/login/register`, formData);

      if (res.data === "exist") {
        alert("Already registered!");
      } else if (res.data === "notexist") {
        setRegistered(true);
        sessionStorage.setItem("registered", "true");
      } else {
        alert("Something went wrong.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Server error. Try again.");
    }
  };
  return (
    <div className="h-screen">
      <Header />
      <Container component="main" maxWidth="md" sx={{ py: 4, height:'auto', }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          {!registered ? (
            <>
              <Typography component="h1" variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold',color:'#08415C' }}>
                Student Registration
              </Typography>
              <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4, color:'#08415C' }}>
                Please fill in your details to create an account
              </Typography>

              <Box component="form" onSubmit={submit} sx={{ mt: 2 }}>
                <Grid container spacing={3}>
                  {/* Personal Information Section */}
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom sx={{ color: '#08415C' }}>
                      Personal Information
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Full Name"
                      name="name"
                      autoComplete="name"
                      autoFocus
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Email Address"
                      name="email"
                      type="email"
                      autoComplete="email"
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Phone Number"
                      name="phoneno"
                      onChange={handleChange}
                      inputProps={{ maxLength: 10 }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      name="Password"
                      label="Password"
                      type="password"
                      autoComplete="new-password"
                      onChange={handleChange}
                    />
                  </Grid>

                  {/* Academic Information Section */}
                  <Grid item xs={12} sx={{ mt: 1 }}>
                    <Typography variant="h6" gutterBottom sx={{ color: '#08415C' }}>
                      Academic Information
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Course/Designation"
                      name="course"
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="College ID"
                      name="collegeid"
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="University Register Number"
                      name="unid"
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Year of Passout"
                      name="yearofpass"
                      type="number"
                      onChange={handleChange}
                      inputProps={{ min: 2000, max: 2099 }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Role</InputLabel>
                      <Select
                        name="role"
                        value={formData.role}
                        label="Role"
                        onChange={handleChange}
                      >
                        <MenuItem value="student">Student</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{ mt: 4, py: 1.5,backgroundColor:'#08415C' }}
                >
                  Register
                </Button>
              </Box>
            </>
          ) : (
            <Box sx={{ textAlign: 'center', p: 4 }}>
              <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Registration Successful!
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Your account has been created successfully.
              </Typography>
              <Button
                variant="contained"
                onClick={() => {
                  sessionStorage.removeItem("registered");
                  navigate("/");
                }}
                sx={{ mt: 2, px: 4 }}
              >
                Back to Login
              </Button>
            </Box>
          )}
        </Paper>
      </Container>
      <InFooter/>
    </div>
  );
};

export default Register;
