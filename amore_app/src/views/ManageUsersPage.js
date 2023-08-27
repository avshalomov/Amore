import { DBContext } from "../App";
import React, { useContext } from "react";
import DetailsCard from "../components/DetailsCard";
import Pagination from "../components/Pagination";

function ManageProductsPage() {
    const users = useContext(DBContext).users.resourceData;

    return (
        <>
            <Pagination itemsPerPage={5}>
                {users.map((user) => (
                    <DetailsCard resource={user} />
                ))}
            </Pagination>
        </>
    );
}

export default ManageProductsPage;
