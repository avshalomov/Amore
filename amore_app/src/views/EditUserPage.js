import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import EditResourceForm from "../components/EditResourceForm";
import { DataContext } from "../App";
import axios from "axios";

export default function EditUserPage() {
    const { users } = useContext(DataContext);
    const { userId } = useParams();
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (!users || !userId) return;
        const foundUser = users.data.find(
            (u) => String(u.userId) === String(userId)
        );
        setUser(foundUser);
    }, [users, userId]);

    // handleSubmit with axios
    const handleSubmit = (editedUser) => {
        const userToUpdate = {
            userId: editedUser.userId,
            username: editedUser.username,
            email: editedUser.email,
            userRole: editedUser.userRole,
            lastLoginDate: editedUser.lastLoginDate,
            dateCreated: editedUser.dateCreated,
            passwordHash: editedUser.passwordHash,
            picture: editedUser.picture,
        };
        console.log("Updating user: ", userToUpdate);

        axios
            .put(
                `http://localhost:5164/api/Users/${editedUser.userId}`,
                userToUpdate
            )
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
                console.log(error.response.data);
            });
    };

    const handleDelete = (user) => {
        console.log("Deleting user: ", user);
        users.deleteData(user.userId);
    };

    return (
        <>
            {user ? (
                <EditResourceForm
                    resource={user}
                    resourceType="User"
                    handleSubmit={handleSubmit}
                    handleDelete={handleDelete}
                />
            ) : (
                <div>Loading...</div>
            )}
        </>
    );
}
