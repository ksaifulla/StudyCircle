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
import { Profile } from "./components/Profile";
import CustomNavbar from "./components/Navbar";
import Footer from "./components/Footer";
import FileUpload from "./components/FileUpload";
import Quizzes from "./components/Quizzes";
import CreateQuiz from "./components/CreateQuiz";
import QuizAttempt from "./components/QuizAttempt";
import Whiteboard from "./components/Whiteboard";
import StudyAssistant from "./components/StudyAssistant";
import VideoCall from "./components/VideoCall";

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
      {isAuthenticated() && <CustomNavbar />}
      <Routes>
        <Route element={<AppLayout />}>
          <Route
            index
            element={<PrivateRoute element={<Navigate replace to="dashboard" />} />}
          />
          <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
          <Route path="/create" element={<PrivateRoute element={<CreateGroup />} />} />
          <Route path="/groups" element={<PrivateRoute element={<ShowGroups />} />} />
           <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
          <Route path="/group/:groupId" element={<PrivateRoute element={<GroupInfo />} />} />
          <Route path="/group/:groupId/upload" element={<PrivateRoute element={<FileUpload />} />} />
          <Route path="/group/:groupId/schedule" element={<PrivateRoute element={<Schedule />} />} />
          <Route path="/group/:groupId/schedule/create" element={<PrivateRoute element={<CreateSchedule />} />} />
          <Route path="/chat/:groupId" element={<PrivateRoute element={<MainChat />} />} />
          <Route path="/:groupId/notes" element={<PrivateRoute element={<Notes />} />} />
          <Route path="/group/:groupId/notes" element={<PrivateRoute element={<GroupNotes />} />} />
          <Route path="/edit-note/:noteId/" element={<PrivateRoute element={<EditNote />} />} />
          <Route path="/group/:groupId/quizzes" element={<PrivateRoute element={<Quizzes />} />} />
          <Route path="/group/:groupId/quizzes/create" element={<PrivateRoute element={<CreateQuiz />} />} />
          <Route path="/group/:groupId/quizzes/:quizId/attempt" element={<PrivateRoute element={<QuizAttempt />} />} />
          <Route path="/settings" element={<PrivateRoute element={<Settings />} />} />



          <Route path="/group/:groupId/whiteboard" element={<PrivateRoute element={<Whiteboard />} />} />



          <Route
            path="/group/:groupId/recommendations"
            element={<PrivateRoute element={<StudyAssistant />} />}
          />

          <Route path="/group/:groupId/video-call" element={<PrivateRoute element={<VideoCall />} />} />

        </Route>

        {/* Public Routes */}
        <Route path="/signup" element={<PublicRoute element={<Signup />} />} />
        <Route path="/signin" element={<PublicRoute element={<Signin />} />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
