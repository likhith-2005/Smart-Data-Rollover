import AddUser from "./AddUser";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, Button, TextField, Typography } from "@mui/material";
import Recharge from "./Recharge";
import History from "./History";


function App() {
  const [users, setUsers] = useState([]);
  const [usageInputs, setUsageInputs] = useState({});

  // Fetch Users
  const fetchUsers = () => {
    axios
      .get("http://localhost:5000/api/users")
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Add Usage
  const addUsage = (userId) => {
    axios
      .post("http://localhost:5000/api/users/usage", {
        userId: userId,
        usage: Number(usageInputs[userId]),
      })
      .then(() => {
        fetchUsers();
        setUsageInputs({ ...usageInputs, [userId]: "" });
      })
      .catch((err) => console.log(err));
  };

  // Recharge
  const recharge = (userId) => {
    axios
      .post("http://localhost:5000/api/users/recharge", {
        userId: userId,
      })
      .then(() => fetchUsers())
      .catch((err) => console.log(err));
  };

  return (
    <div style={{ textAlign: "center", padding: "30px" }}>
      <Typography variant="h3" sx={{ mb: 3, fontWeight: "bold" }}>
        Smart Data Rollover Dashboard
      </Typography>

      {/* Add User Form */}
      <AddUser />

      <Recharge />

      <hr style={{ margin: "30px 0" }} />

      {users.length === 0 ? (
        <Typography>No Users Found</Typography>
      ) : (
        users.map((user) => {
          const rechargeDate = new Date(user.rechargeStartDate);
          const expiryDate = new Date(rechargeDate);
          expiryDate.setDate(expiryDate.getDate() + user.validity);

          const today = new Date();
          const isExpired = today > expiryDate;

          return (
            <Card
              key={user._id}
              sx={{
                width: "50%",
                margin: "20px auto",
                padding: "10px",
                boxShadow: 5,
                borderRadius: "12px",
              }}
            >
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  {user.name}
                </Typography>

                <Typography sx={{ mt: 1 }}>Plan: {user.planType}</Typography>
                <Typography>Daily Limit: {user.dailyLimit} MB</Typography>

                {isExpired ? (
                  <>
                    <Typography sx={{ color: "red", fontWeight: "bold", mt: 2 }}>
                      ❌ Plan Expired
                    </Typography>

                    <Button
                      variant="contained"
                      color="success"
                      sx={{ mt: 2 }}
                      onClick={() => recharge(user._id)}
                    >
                      🔄 Recharge Now
                    </Button>
                  </>
                ) : (
                  <>
                    <Typography sx={{ mt: 1 }}>
                      Today Usage: {user.todayUsage} MB
                    </Typography>
                    <Typography>Data Bank: {user.dataBank} MB</Typography>
                    <Typography sx={{ mb: 2 }}>
                      Remaining Today:{" "}
                      {user.dailyLimit - user.todayUsage > 0
                        ? user.dailyLimit - user.todayUsage
                        : 0}{" "}
                      MB
                    </Typography>

                    <TextField
                      type="number"
                      label="Enter Usage (MB)"
                      variant="outlined"
                      value={usageInputs[user._id] || ""}
                      onChange={(e) =>
                        setUsageInputs({
                          ...usageInputs,
                          [user._id]: e.target.value,
                        })
                      }
                      sx={{ width: "200px", mb: 2 }}
                    />

                    <br />

                    <Button
                      variant="contained"
                      onClick={() => addUsage(user._id)}
                    >
                      Add Usage
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}

export default App;
