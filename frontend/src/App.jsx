import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import CreateGroup from "./components/CreateGroup";
import Dashboard from "./components/Dashboard";
import GroupInfo from "./components/GroupInfo";
import MainChat from "./components/MainChat";
import PageNotFound from "./components/PageNotFound";
import ShowGroups from "./components/ShowGroups";
import { Signin } from "./pages/Signin";
import { Signup } from "./pages/Signup";

const isAuthenticated = () => {
  return localStorage.getItem("token") !== null;
};

const PrivateRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/signin" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route
            index
            element={
              <PrivateRoute element={<Navigate replace to="dashboard" />} />
            }
          />
          <Route
            path="/dashboard"
            element={<PrivateRoute element={<Dashboard />} />}
          />
          <Route
            path="/create"
            element={<PrivateRoute element={<CreateGroup />} />}
          />
          <Route
            path="/groups"
            element={<PrivateRoute element={<ShowGroups />} />}
          />
          <Route
            path="/group/:groupId"
            element={<PrivateRoute element={<GroupInfo />} />}
          />
          <Route
            path="/chat/:groupId"
            element={<PrivateRoute element={<MainChat />} />}
          />
        </Route>
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
