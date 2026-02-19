import React, { useEffect, useState } from "react";
import axios from "axios";

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

  // UI
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Smart Data Rollover Dashboard</h1>

      {users.length === 0 ? (
        <p>No Users Found</p>
      ) : (
        users.map((user) => {
          // Check Expiry
          const rechargeDate = new Date(user.rechargeStartDate);
          const expiryDate = new Date(rechargeDate);
          expiryDate.setDate(expiryDate.getDate() + user.validity);

          const today = new Date();
          const isExpired = today > expiryDate;

          return (
            <div
              key={user._id}
              style={{
                border: "1px solid black",
                padding: "20px",
                margin: "20px",
                borderRadius: "10px",
              }}
            >
              <h3>{user.name}</h3>
              <p>Plan: {user.planType}</p>
              <p>Daily Limit: {user.dailyLimit} MB</p>

              {/* -------- EXPIRED PLAN UI -------- */}
              {isExpired ? (
                <>
                  <p style={{ color: "red", fontWeight: "bold" }}>
                    ❌ Plan Expired
                  </p>

                  <button
                    onClick={() => recharge(user._id)}
                    style={{
                      padding: "8px 14px",
                      backgroundColor: "green",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    🔄 Recharge Now
                  </button>
                </>
              ) : (
                <>
                  {/* -------- ACTIVE PLAN UI -------- */}
                  <p>Today Usage: {user.todayUsage} MB</p>
                  <p>Data Bank: {user.dataBank} MB</p>

                  <p>
                    Remaining Today:{" "}
                    {user.dailyLimit - user.todayUsage > 0
                      ? user.dailyLimit - user.todayUsage
                      : 0}{" "}
                    MB
                  </p>

                  <input
                    type="number"
                    placeholder="Enter Usage (MB)"
                    value={usageInputs[user._id] || ""}
                    onChange={(e) =>
                      setUsageInputs({
                        ...usageInputs,
                        [user._id]: e.target.value,
                      })
                    }
                    style={{ padding: "5px", marginRight: "10px" }}
                  />

                  <button
                    onClick={() => addUsage(user._id)}
                    style={{ padding: "5px 10px", cursor: "pointer" }}
                  >
                    Add Usage
                  </button>
                </>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

export default App;
