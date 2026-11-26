import React, { Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { DarkModeProvider } from "./context/DarkModeContext";
import { SocketProvider } from "./context/SocketContext";
import { useUser } from "./features/authentication/useUser";
import ProtectedRoute from "./ui/ProtectedRoute";
import AppLayout from "./ui/AppLayout";
import ErrorBoundary from "./ui/ErrorBoundary";
import Spinner from "./ui/spinner/Spinner";
import Buildings from "./pages/Buildings";

const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Login = React.lazy(() => import("./pages/Login"));
const PageNotFound = React.lazy(() => import("./pages/PageNotFound"));
const Users = React.lazy(() => import("./pages/Users"));
const UserInfo = React.lazy(() => import("./features/users/UserInfo"));
const Settings = React.lazy(() => import("./pages/Settings"));
const Account = React.lazy(() => import("./pages/Account"));
const BuildingsMap = React.lazy(() => import("./pages/BuildingsMap"));
const BuildingDetails = React.lazy(() => import("./pages/BuildingDetails"));
const UsersStatistic = React.lazy(
  () => import("./features/users/UsersStatistic"),
);
const ClientDashboard = React.lazy(
  () => import("./features/client/dashboard/ClientDashboard"),
);
const ClientDashboardForAdmin = React.lazy(
  () => import("./features/client/dashboard/ClientDashboardForAdmin"),
);
const Contact = React.lazy(() => import("./features/client/Contact"));
const Profile = React.lazy(() => import("./features/client/Profile"));
const UserConsumption = React.lazy(() => import("./pages/UserConsumption"));

function App() {
  const { type, id, isLoading } = useUser();

  if (isLoading) return <Spinner />;

  return (
    <DarkModeProvider>
      <ErrorBoundary>
        <SocketProvider>
          <BrowserRouter>
            <Suspense fallback={<Spinner />}>
              <Routes>
                {type === undefined && (
                  <Route path="*" element={<Navigate to="/login" replace />} />
                )}
                <Route path="login" element={<Login />} />
                <Route path="*" element={<PageNotFound />} />

                <Route
                  element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  {type === false && (
                    <>
                      <Route
                        index
                        element={<Navigate replace to="clientDashboard" />}
                      />
                      <Route
                        path="clientDashboard"
                        element={<ClientDashboard id={id} />}
                      />

                      <Route path="contact" element={<Contact />} />
                      <Route path="profile" element={<Profile id={id} />} />
                    </>
                  )}

                  {type === true && (
                    <>
                      <Route
                        index
                        element={<Navigate replace to="dashboard" />}
                      />
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="users" element={<Users />} />
                      <Route path="buildings" element={<Buildings />} />
                      <Route path="buildings-map" element={<BuildingsMap />} />
                      <Route
                        path="building/:id"
                        element={<BuildingDetails />}
                      />
                      <Route
                        path="usersStatistic"
                        element={<UsersStatistic />}
                      />
                      <Route path="user/:id" element={<UserInfo />} />
                      <Route
                        path="user/:id/consumption"
                        element={<UserConsumption />}
                      />
                      <Route path="settings" element={<Settings />} />
                      <Route path="account" element={<Account />} />

                      <Route
                        path="clientDashboardForAdmin/:id"
                        element={<ClientDashboardForAdmin />}
                      />
                    </>
                  )}
                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
        </SocketProvider>
      </ErrorBoundary>

      {/* Toast library settings */}
      <Toaster
        position="top-center"
        gutter={12}
        containerStyle={{ margin: "8px" }}
        toastOptions={{
          success: {
            duration: 3000,
          },
          error: {
            duration: 5000,
          },
          style: {
            fontSize: "16px",
            maxWidth: "500px",
            padding: "16px 24px",
            backgroundColor: "var(--color-grey-0)",
            color: "var(--color-grey-900)",
          },
        }}
      />
    </DarkModeProvider>
  );
}

export default App;
