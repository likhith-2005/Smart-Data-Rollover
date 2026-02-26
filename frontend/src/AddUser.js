import React, { useState } from "react";
import axios from "axios";

function AddUser() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleAddUser = async () => {
    console.log("SENDING:", name, phone);

    try {
      const res = await axios.post("http://localhost:5000/api/users/add", {
        name: name.trim(),
        phoneNumber: phone.trim(),   // MUST SEND THIS
      });

      setMessage("User Added Successfully ✔️");
      setName("");
      setPhone("");

    } catch (err) {
      console.log(err);
      setMessage(err.response?.data?.message || "Error adding user ❌");
    }
  };

  return (
    <div>
      <h2>Add New User</h2>

      <input
        type="text"
        placeholder="User Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="text"
        placeholder="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <button onClick={handleAddUser}>ADD USER</button>

      {message && <p>{message}</p>}
    </div>
  );
}

export default AddUser;