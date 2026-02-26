import React, { useEffect, useState } from "react";
import axios from "axios";
import History from "./History";

// ⭐ MUI Components
import {
  Card,
  CardContent,
  Button,
  TextField,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

// ⭐ Format Date Helper
const formatDate = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// ⭐ RECHARGE PLANS LIST
const rechargePlans = [
  { category: "Default", name: "No Recharge Selected", dailyLimit: null, validity: null, price: 0 },

  { category: "Yearly Plans", name: "1.5GB/day – 365 Days", dailyLimit: 1500, validity: 365, price: 2999 },
  { category: "Yearly Plans", name: "2GB/day – 365 Days", dailyLimit: 2000, validity: 365, price: 3499 },

  { category: "Long Validity", name: "2GB/day – 84 Days", dailyLimit: 2000, validity: 84, price: 719 },
  { category: "Long Validity", name: "1.5GB/day – 84 Days", dailyLimit: 1500, validity: 84, price: 666 },

  { category: "Medium Validity", name: "3GB/day – 56 Days", dailyLimit: 3000, validity: 56, price: 499 },
  { category: "Medium Validity", name: "2GB/day – 56 Days", dailyLimit: 2000, validity: 56, price: 444 },

  { category: "Monthly Plans", name: "2GB/day – 28 Days", dailyLimit: 2000, validity: 28, price: 299 },
  { category: "Monthly Plans", name: "1.5GB/day – 28 Days", dailyLimit: 1500, validity: 28, price: 249 },
  { category: "Monthly Plans", name: "1GB/day – 28 Days", dailyLimit: 1000, validity: 28, price: 199 },

  { category: "Top-up Booster", name: "Top-Up 1GB Data", extraData: 1000, dailyLimit: 0, validity: 0, price: 19 },
  { category: "Top-up Booster", name: "Top-Up 2GB Data", extraData: 2000, dailyLimit: 0, validity: 0, price: 29 },
  { category: "Top-up Booster", name: "Top-Up 6GB Data", extraData: 6000, dailyLimit: 0, validity: 0, price: 61 },

  { category: "1 Day Packs", name: "Unlimited + 2GB – 1 Day", dailyLimit: 2000, validity: 1, price: 15 },
  { category: "1 Day Packs", name: "Unlimited + 1GB – 1 Day", dailyLimit: 1000, validity: 1, price: 10 },

  { category: "OTT + Data Combo", name: "Disney+ Hotstar – 3 Months (2GB/day)", dailyLimit: 2000, validity: 90, price: 999 },
];

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(0);
  const [usageInputs, setUsageInputs] = useState({});

  // Fetch Users
  const fetchUsers = () => {
    axios
      .get("http://localhost:5000/api/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.log("Fetch Error:", err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ⭐ ADD NEW USER — FIXED
  const handleAddUser = () => {
    if (!name || !phone) {
      alert("Please enter Name and Phone Number");
      return;
    }

    axios
      .post("http://localhost:5000/api/users/add", {
        name: name.trim(),
        phoneNumber: phone.trim(), // FIX ✔
      })
      .then(() => {
        alert("User Added Successfully!");
        fetchUsers();
        setName("");
        setPhone("");
      })
      .catch((err) => console.log("Add User Error:", err.response?.data));
  };

  // ⭐ Add Usage
  const addUsage = (userId) => {
    axios
      .post("http://localhost:5000/api/users/usage", {
        userId,
        usage: Number(usageInputs[userId]),
      })
      .then(() => {
        fetchUsers();
        setUsageInputs({ ...usageInputs, [userId]: "" });
      });
  };

  // ⭐ DELETE USER — FIXED URL
const deleteUser = (userId) => {
  if (!window.confirm("Are you sure you want to delete this user?")) return;

  axios
    .delete(`http://localhost:5000/api/users/delete/${userId}`)
    .then(() => {
      alert("User Deleted Successfully!");
      fetchUsers();
    })
    .catch((err) => {
      console.log("DELETE ERROR:", err.response?.data);
      alert("Failed to delete user");
    });
};
  // ⭐ Recharge
  const handleRecharge = () => {
    if (!selectedUser) {
      alert("Select a user");
      return;
    }

    const plan = rechargePlans[selectedPlan];

    if (selectedPlan === 0) {
      alert("No plan selected");
      return;
    }

    if (plan.extraData) {
      axios
        .post("http://localhost:5000/api/users/add-topup", {
          userId: selectedUser,
          extraData: plan.extraData,
        })
        .then(() => {
          alert(`Top-Up Added: ${plan.extraData / 1000}GB`);
          fetchUsers();
        });
      return;
    }

    axios
      .post("http://localhost:5000/api/users/recharge", {
        userId: selectedUser,
        dailyLimit: plan.dailyLimit,
        validity: plan.validity,
      })
      .then(() => {
        alert(`Recharged with ${plan.name}`);
        fetchUsers();
      });
  };

  return (
    <div style={{ textAlign: "center", padding: "30px" }}>
      <Typography variant="h3" sx={{ fontWeight: "bold", mb: 3 }}>
        Smart Data Rollover Dashboard
      </Typography>

      {/* ADD USER */}
      <Typography variant="h4" sx={{ mb: 2 }}>
        Add New User
      </Typography>

      <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
        <TextField label="User Name" value={name} onChange={(e) => setName(e.target.value)} />
        <TextField label="Phone Number" type="number" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <Button variant="contained" onClick={handleAddUser}>ADD USER</Button>
      </div>

      {/* RECHARGE SECTION */}
      <Typography variant="h4" sx={{ mt: 5 }}>Recharge User Plan</Typography>

      <div style={{ marginTop: "20px" }}>
        <FormControl sx={{ width: "250px" }}>
          <InputLabel>Select User</InputLabel>
          <Select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
            {users.map((user) => (
              <MenuItem key={user._id} value={user._id}>
                {user.name} ({user.phoneNumber})  {/* FIXED */}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <br /><br />

        <FormControl sx={{ width: "350px" }}>
          <InputLabel>Select Recharge Plan</InputLabel>
          <Select value={selectedPlan} onChange={(e) => setSelectedPlan(e.target.value)}>
            {rechargePlans.map((plan, i) => (
              <MenuItem key={i} value={i}>
                <b>{plan.name}</b> — ₹{plan.price}
                <div style={{ fontSize: "12px", color: "gray" }}>{plan.category}</div>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <br />

        <Button variant="contained" color="success" sx={{ mt: 2 }} onClick={handleRecharge}>
          🔄 Recharge Now
        </Button>
      </div>

      {/* USER CARDS */}
      {users.map((user) => {
        const expiry = new Date(user.rechargeStartDate);
        expiry.setDate(expiry.getDate() + user.validity);

        const expired = new Date() > expiry;

        return (
          <Card key={user._id} sx={{ width: "55%", margin: "25px auto", padding: "15px", boxShadow: 5 }}>
            <CardContent>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>{user.name}</Typography>
                <Button variant="outlined" color="error" onClick={() => deleteUser(user._id)}>DELETE USER</Button>
              </div>

              <Typography sx={{ mt: 1 }}>Phone: {user.phoneNumber}</Typography>
              <Typography sx={{ mt: 1 }}>Daily Limit: {user.dailyLimit} MB</Typography>
              <Typography sx={{ mt: 1 }}>Recharge Start Date: <b>{formatDate(user.rechargeStartDate)}</b></Typography>
              <Typography>Recharge End Date: <b>{formatDate(expiry)}</b></Typography>

              {expired ? (
                <Typography sx={{ color: "red", fontWeight: "bold", mt: 2 }}>❌ Plan Expired</Typography>
              ) : (
                <>
                  <Typography sx={{ mt: 1 }}>Today Usage: {user.todayUsage} MB</Typography>
                  <Typography>Data Bank: {user.dataBank} MB</Typography>

                  <div style={{ marginTop: "15px", display: "flex", justifyContent: "center", gap: "15px" }}>
                    <TextField
                      type="number"
                      label="Enter Usage"
                      value={usageInputs[user._id] || ""}
                      onChange={(e) =>
                        setUsageInputs({ ...usageInputs, [user._id]: e.target.value })
                      }
                      sx={{ width: "150px" }}
                    />

                    <Button variant="contained" onClick={() => addUsage(user._id)}>Add Usage</Button>
                  </div>
                </>
              )}

              <History userId={user._id} />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default App;