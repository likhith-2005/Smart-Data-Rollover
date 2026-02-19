import React, { useEffect, useState } from "react";
import axios from "axios";

function History({ userId }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/users/history/${userId}`)
      .then(res => setHistory(res.data))
      .catch(err => console.log(err));
  }, [userId]);

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Usage History</h3>
      {history.length === 0 ? (
        <p>No history found</p>
      ) : (
        history.map((item, index) => (
          <p key={index}>
            {new Date(item.date).toLocaleDateString()} — {item.usage} MB
          </p>
        ))
      )}
    </div>
  );
}

export default History;
