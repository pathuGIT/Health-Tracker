import React, { useState, useEffect } from "react";

function App() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8080/api/users")
            .then((res) => res.json())
            .then((data) => setUsers(data))
            .catch((err) => console.error(err));
    }, []);

    return (
        <div className="App">
            <h1>HealthTracker Users</h1>
            {users.length === 0 ? (
                <p>No users found.</p>
            ) : (
                <ul>
                    {users.map((user) => (
                        <li key={user.userId}>
                            {user.name} - {user.email} - Age: {user.age}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default App;
