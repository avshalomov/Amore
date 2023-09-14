// import { Link } from "react-router-dom";
// import DetailsCard from "../components/DetailsCard";
// import Pagination from "../components/Pagination";
// import React, { useContext } from "react";
// import { DataContext } from "../App";

// const ManageProductsPage = () => {
//     const { users } = useContext(DataContext);

//     return (
//         <>
//             <Pagination itemsPerPage={5}>
//                 {users.data.map((user) => (
//                     <Link
//                         to={`/manage-users/${user.userId}`}
//                         key={user.userId}
//                         onClick={() => window.scrollTo(0, 0)}
//                     >
//                         <DetailsCard resource={user} />
//                     </Link>
//                 ))}
//             </Pagination>
//         </>
//     );
// };

// export default ManageProductsPage;

const ManageUsersPage = () => {
    return (
        <>
            <h1>Manage Users Page</h1>
        </>
    );
};

export default ManageUsersPage;