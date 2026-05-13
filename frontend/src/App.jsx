import { createBrowserRouter, Navigate, RouterProvider, useParams } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import RootLayout from "./components/RootLayout";
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import AdminDashboard from "./components/AdminDashboard";
import WorkspaceDashboard from "./components/WorkspaceDashboard";
import ChannelScreen from "./components/ChannelScreen";
import DirectMessageScreen from "./components/DirectMessageScreen";
import NotificationList from "./components/NotificationList";
import ReminderList from "./components/ReminderList";
import Unauthorized from "./components/Unauthorized";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./store/authStore";

const allowedRoles = ["USER", "ADMIN"];
const userRoles = ["USER"];

const protectedPage = (element, roles = allowedRoles) => (
  <ProtectedRoute allowedRoles={roles}>{element}</ProtectedRoute>
);

function WorkspaceEntry() {
  const { currentUser } = useAuth();

  if (currentUser?.role === "ADMIN") {
    return <AdminDashboard />;
  }

  return <WorkspaceDashboard />;
}

function ChannelRoute() {
  const { workspaceId, channelId } = useParams();

  return <ChannelScreen workspaceId={workspaceId} channelId={channelId} />;
}

function DirectMessageRoute() {
  const { workspaceId, receiverId } = useParams();

  return <DirectMessageScreen workspaceId={workspaceId} receiverId={receiverId} />;
}

function App() {
  const routerObj = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "register",
          element: <Register />,
        },
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "workspace",
          element: protectedPage(<WorkspaceEntry />),
        },
        {
          path: "workspace/:workspaceId",
          element: protectedPage(<WorkspaceEntry />),
        },
        {
          path: "admin",
          element: protectedPage(<AdminDashboard />, ["ADMIN"]),
        },
        {
          path: "workspace/:workspaceId/channels/:channelId",
          element: protectedPage(<ChannelRoute />, userRoles),
        },
        {
          path: "workspace/:workspaceId/direct/:receiverId",
          element: protectedPage(<DirectMessageRoute />, userRoles),
        },
        {
          path: "channels/:channelId",
          element: protectedPage(<ChannelRoute />, userRoles),
        },
        {
          path: "direct/:workspaceId/:receiverId",
          element: protectedPage(<DirectMessageRoute />, userRoles),
        },
        {
          path: "notifications",
          element: protectedPage(<NotificationList />, userRoles),
        },
        {
          path: "reminders",
          element: protectedPage(<ReminderList />, userRoles),
        },
        {
          path: "unauthorized",
          element: <Unauthorized />,
        },
        {
          path: "*",
          element: <Navigate to="/" replace />,
        },
      ],
    },
  ]);

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <RouterProvider router={routerObj} />
    </div>
  );
}

export default App;
