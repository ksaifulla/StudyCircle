import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import CreateGroup from "./components/CreateGroup";
import CreateSchedule from "./components/CreateSchedule";
import Dashboard from "./components/Dashboard";
import EditNote from "./components/EditNote";
import GroupInfo from "./components/GroupInfo";
import GroupNotes from "./components/GroupNotes";
import MainChat from "./components/MainChat";
import Notes from "./components/Notes";
import PageNotFound from "./components/PageNotFound";
import Schedule from "./components/Schedules";
import Settings from "./components/Settings";
import ShowGroups from "./components/ShowGroups";
import { Signin } from "./pages/Signin";
import { Signup } from "./pages/Signup";

const isAuthenticated = () => {
  return localStorage.getItem("token") !== null;
};

const PrivateRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/signin" />;
};
const PublicRoute = ({ element }) => {
  return isAuthenticated() ? <Navigate to="/dashboard" /> : element;
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
            path="group/:groupId/schedule"
            element={<PrivateRoute element={<Schedule />} />}
          />{" "}
          <Route
            path="group/:groupId/schedule/create"
            element={<PrivateRoute element={<CreateSchedule />} />}
          />
          <Route
            path="/chat/:groupId"
            element={<PrivateRoute element={<MainChat />} />}
          />
          <Route
            path="/:groupId/notes"
            element={<PrivateRoute element={<Notes />} />}
          />
          <Route
            path="group/:groupId/notes"
            element={<PrivateRoute element={<GroupNotes />} />}
          />
          <Route
            path="edit-note/:noteId/"
            element={<PrivateRoute element={<EditNote />} />}
          />
          <Route
            path="/settings"
            element={<PrivateRoute element={<Settings />} />}
          />
        </Route>
        <Route path="/signup" element={<PublicRoute element={<Signup />} />} />
        <Route path="/signin" element={<PublicRoute element={<Signin />} />} />

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
