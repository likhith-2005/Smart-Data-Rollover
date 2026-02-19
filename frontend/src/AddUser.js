import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, MenuItem, Box } from "@mui/material";

function AddUser() {
  const [user, setUser] = useState({
    name: "",
    planType: "",
    dailyLimit: "",
    validity: ""
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const createUser = () => {
    axios.post("http://localhost:5000/api/users", user)
      .then(() => {
        alert("User Added Successfully");
        setUser({ name: "", planType: "", dailyLimit: "", validity: "" });
      })
      .catch(err => console.log(err));
  };

  return (
    <Box sx={{ maxWidth: 400, margin: "0 auto", padding: 3 }}>
      <h2>Add New User</h2>

      <TextField 
        fullWidth 
        label="User Name" 
        name="name"
        value={user.name}
        onChange={handleChange}
        margin="normal"
      />

      <TextField
        select
        fullWidth
        label="Plan Type"
        name="planType"
        value={user.planType}
        onChange={handleChange}
        margin="normal"
      >
        <MenuItem value="1GB/day">1GB/day</MenuItem>
        <MenuItem value="2GB/day">2GB/day</MenuItem>
        <MenuItem value="3GB/day">3GB/day</MenuItem>
      </TextField>

      <TextField
        fullWidth
        label="Daily Limit (MB)"
        name="dailyLimit"
        type="number"
        value={user.dailyLimit}
        onChange={handleChange}
        margin="normal"
      />

      <TextField
        fullWidth
        label="Validity (Days)"
        name="validity"
        type="number"
        value={user.validity}
        onChange={handleChange}
        margin="normal"
      />

      <Button 
        variant="contained" 
        fullWidth 
        sx={{ marginTop: 2 }}
        onClick={createUser}
      >
        Add User
      </Button>
    </Box>
  );
}

export default AddUser;
