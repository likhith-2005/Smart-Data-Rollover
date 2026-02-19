import React, { useEffect, useState } from "react";
import axios from "axios";

function Recharge() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");

  // Fetch all users
  useEffect(() => {
    axios.get("http://localhost:5000/api/users")
      .then(res => setUsers(res.data))
      .catch(err => console.log(err));
  }, []);

  // Recharge function
  const handleRecharge = () => {
    if (!selectedUser) {
      alert("Please select a user!");
      return;
    }

    axios.post("http://localhost:5000/api/users/recharge", {
      userId: selectedUser
    })
    .then(() => {
      alert("Recharge Successful!");
      setSelectedUser("");
    })
    .catch(err => console.log(err));
  };

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>Recharge User Plan</h2>

      <select
        style={{ padding: "10px", width: "250px" }}
        value={selectedUser}
        onChange={(e) => setSelectedUser(e.target.value)}
      >
        <option value="">Select User</option>
        {users.map(user => (
          <option key={user._id} value={user._id}>
            {user.name} ({user.planType})
          </option>
        ))}
      </select>

      <br /><br />

      <button
        onClick={handleRecharge}
        style={{
          padding: "10px 20px",
          cursor: "pointer",
          backgroundColor: "green",
          color: "white",
          border: "none",
          borderRadius: "5px"
        }}
      >
        🔄 Recharge Now
      </button>
    </div>
  );
}

export default Recharge;
