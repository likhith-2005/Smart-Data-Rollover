import React, { useEffect, useState } from "react";
import axios from "axios";

function History({ userId }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (userId) {
      axios.get(`http://localhost:5000/api/users/history/${userId}`)
        .then(res => setHistory(res.data))
        .catch(err => console.log(err));
    }
  }, [userId]);

  return (
    <div>
      <h2>Usage History</h2>
      {history.length === 0 ? (
        <p>No history found</p>
      ) : (
        history.map((h) => (
          <div key={h._id} style={{ borderBottom: "1px solid #ccc", margin: "10px" }}>
            <p><b>Date:</b> {new Date(h.date).toLocaleString()}</p>
            <p><b>Usage:</b> {h.usage} MB</p>
            <p><b>Message:</b> {h.message}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default History;
