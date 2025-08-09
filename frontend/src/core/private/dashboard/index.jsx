import { createColumnHelper } from "@tanstack/react-table";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { format } from "date-fns";
import { Bar, Line } from "react-chartjs-2";
import { FaBook } from "react-icons/fa";
import { FaCartShopping, FaSackDollar, FaUserPlus } from "react-icons/fa6";
import { Link } from "react-router-dom";
import useDashboardGraphs from "../../../hooks/useDashboardGraphs";
import useDashboardSummary from "../../../hooks/useDashboardSummary";
import useFetchUsers from "../../../hooks/useFetchUsers";
import DataTable from "../../../shared/DataTable/DataTable";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { summary, loading: summaryLoading, error: summaryError } =
    useDashboardSummary();
  const { users = [], loading: usersLoading } = useFetchUsers();
  const {
    propertyListingsData = [],
    userActivityData = [],
    loading: graphsLoading,
    error: graphsError,
  } = useDashboardGraphs();

  if (summaryLoading) {
    return <div className="p-8">Loading dashboard...</div>;
  }
  if (summaryError) {
    return (
      <div className="p-8 text-red-600">
        Failed to load dashboard summary: {summaryError}
      </div>
    );
  }

  const safeBookListings = Array.isArray(propertyListingsData)
    ? propertyListingsData
    : [];
  const safeUserActivity = Array.isArray(userActivityData)
    ? userActivityData
    : [];

  const bookListingsGraphData = {
    labels: safeBookListings.map((item) => `Week ${item._id}`),
    datasets: [
      {
        label: "Properties Listed",
        data: safeBookListings.map((item) => item.count),
        borderWidth: 1,
      },
    ],
  };

  const userActivityGraphData = {
    labels: safeUserActivity.map((item) => `Week ${item._id}`),
    datasets: [
      {
        label: "Active Users",
        data: safeUserActivity.map((item) => item.count),
        borderWidth: 1,
      },
    ],
  };

  const summaryCards = [
    {
      id: 1,
      value: summary?.totalBooksCount ?? 0,
      label: "Total Listings",
      bgColor: "bg-red-100",
      icon: <FaCartShopping />,
      iconBgColor: "bg-red-500",
      link: "/admin/booklistings",
    },
    {
      id: 2,
      value: summary?.booksPending ?? 0,
      label: "Listings Pending",
      bgColor: "bg-yellow-100",
      icon: <FaSackDollar />,
      iconBgColor: "bg-yellow-500",
      link: "/admin/booklistings",
      showDot: (summary?.booksPending ?? 0) > 0,
    },
    {
      id: 3,
      value: summary?.newUsersCount ?? 0,
      label: "New Users",
      bgColor: "bg-purple-100",
      icon: <FaUserPlus />,
      iconBgColor: "bg-purple-500",
      link: "/admin/users",
    },
    {
      id: 4,
      value: summary?.newBooksCount ?? 0,
      label: "New Properties Added",
      bgColor: "bg-green-100",
      icon: <FaBook />,
      iconBgColor: "bg-green-500",
      link: "/admin/booklistings",
    },
  ];

  const recentUsers = Array.isArray(users)
    ? users
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3)
    : [];

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("avatar", {
      header: "User",
      cell: (info) => (
        <div className="flex items-center">
          <img
            src={`/api/uploads/users/${info.getValue()}`}
            alt="Avatar"
            className="w-8 h-8 rounded-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/fallback_avatar.png";
            }}
          />
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">
              {info.row.original.name}
            </p>
            <p className="text-sm text-gray-500 -mt-1">
              {info.row.original.email}
            </p>
          </div>
        </div>
      ),
    }),
    columnHelper.accessor("phone", {
      header: "Phone",
      cell: (info) => info.getValue() || "N/A",
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
    columnHelper.accessor("lastActivity", {
      header: "Last Activity",
      cell: (info) => {
        const lastActivity = info.getValue();
        return lastActivity
          ? format(new Date(lastActivity), "dd MMM yyyy, hh:mm a")
          : "N/A";
      },
    }),
  ];

  return (
    <div className="px-4 py-1.5 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      {usersLoading ? (
        <div>Loading users...</div>
      ) : (
        <div>
          <div className="bg-white rounded-xl px-6 pt-3 pb-6 mt-4">
            <h1 className=" font-bold text-lg">Sales summary</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mt-3">
              {summaryCards.map((card) => (
                <Link key={card.id} to={card.link}>
                  <div
                    className={`relative px-3 py-4 flex items-center gap-3 rounded-lg shadow cursor-pointer hover:shadow-lg ${card.bgColor}`}
                  >
                    {card.showDot && (
                      <span className="absolute top-2 right-2 w-2 h-2 bg-orange-600 rounded-full"></span>
                    )}
                    <div
                      className={`text-lg text-white w-9 h-10 flex items-center justify-center rounded-lg ${card.iconBgColor}`}
                    >
                      {card.icon}
                    </div>
                    <div className="flex flex-col">
                      <p className="text-gray-500 text-sm font-gilroyMedium">
                        {card.label}
                      </p>
                      <h3 className="text-xl font-gilroySemiBold -mt-1">
                        {card.value}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-white px-6 py-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">
                Property Listings Over Time
              </h2>
              <Bar data={bookListingsGraphData} />
            </div>

            <div className="bg-white px-6 py-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">User Activity</h2>
              <Line data={userActivityGraphData} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow mt-6">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Recent Users
                </h3>
                <Link to={"/admin/users"}>
                  <button className="px-3 py-1.5 text-sm font-gilroyMedium text-custom bg-gray-700 bg-opacity-10 rounded-lg hover:bg-opacity-20 !rounded-button">
                    View All
                  </button>
                </Link>
              </div>
              <DataTable data={recentUsers} columns={columns} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
