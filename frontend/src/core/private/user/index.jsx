import { createColumnHelper } from "@tanstack/react-table";
import { useState } from "react";
import toast from "react-hot-toast";
import useFetchUsers from "../../../hooks/useFetchUsers";
import DataTable from "../../../shared/DataTable/DataTable";
import Pagination from "../../../shared/Pagination/Pagination";

const UsersPage = () => {
  const { users, loading } = useFetchUsers();

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;

  const totalPages = Math.ceil(users.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id).then(() => {
      toast.success("ID copied to clipboard!");
    });
  };

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("_id", {
      header: "ID",
      cell: (info) => (
        <div
          className="truncate max-w-xs cursor-pointer"
          style={{
            width: "50px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          title={info.getValue()}
          onClick={() => handleCopy(info.getValue())}
        >
          {info.getValue()}
        </div>
      ),
    }),

    columnHelper.accessor("name", {
      header: "Name",
      cell: (info) => {
        const user = info.row.original;
        return (
          <div className="flex items-center">
            <img
              src={`/api/uploads/users/${user.avatar}`}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-sm text-gray-500 -mt-1">{user.email}</p>
            </div>
          </div>
        );
      },
    }),

    columnHelper.accessor("phone", {
      header: "Phone",
      cell: (info) => info.getValue() || "N/A",
    }),

    columnHelper.accessor("book_listings", {
      header: "Properties", // changed label only
      cell: (info) => info.getValue().length,
    }),

    columnHelper.accessor("role", {
      header: "Role",
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => {
        const status = info.getValue();
        return (
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              status === "Active"
                ? "text-green-700 bg-green-100"
                : status === "Away"
                ? "text-yellow-700 bg-yellow-100"
                : "text-red-700 bg-red-100"
            }`}
          >
            {status}
          </span>
        );
      },
    }),

    columnHelper.accessor("createdAt", {
      header: "Created At",
      cell: (info) => new Date(info.getValue()).toLocaleDateString() || "N/A",
    }),
  ];

  return (
    <div className="px-4 py-1.5 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold">Users</h2>

      {loading ? (
        <div></div>
      ) : (
        <div className="bg-white shadow rounded-lg p-4 mt-4">
          <DataTable columns={columns} data={currentUsers} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={users.length}
          />
        </div>
      )}
    </div>
  );
};

export default UsersPage;

