import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChangePassword from "./Pages/ChangePassword";
import EmailVerification from "./Pages/EmailVerification";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import ResetPassword from "./Pages/ResetPassword";
import ResetPasswordConfirm from "./Pages/ResetPasswordConfirm";
import Signup from "./Pages/Signup";
import Layout from "./High Order Function/Layout";
import "./css/main.css";
import { Provider } from "react-redux";
import Store from "./Store";
import Settings from "./Pages/Settings";
import Courses from "./Pages/mycourses";
import CourseDetails from "./Pages/CourseDetails";
import LearnCourse from "./Pages/LearnCourse";
import InstructorDashboard from "./Pages/InstructorDashboard";
import ManageCourse from "./Pages/ManageCourse";

const App = () => {
  return (
    <Provider store={Store}>
      <Router>
        <Routes>
          <Route path="login/" Component={Login} />
          <Route path="signup/" Component={Signup} />
          <Route path="change/password/" Component={ChangePassword} />
          <Route path="reset/password/" Component={ResetPassword} />
          <Route path="dj-rest-auth/registration/account-confirm-email/:key/" Component={EmailVerification} />
          <Route path="reset/password/confirm/:uid/:token" Component={ResetPasswordConfirm} />
          <Route path="mycourses/" element={
            <Layout>
              <Courses />
            </Layout>
          } />
          <Route path="settings/" element={
            <Layout>
              <Settings />
            </Layout>
          } />
          <Route path="home/" element={
            <Layout>
              <Home />
            </Layout>
          } />
          <Route path="/course/:courseId" element={
            <Layout>
              <CourseDetails />
            </Layout>
          } />
          <Route path="/course/:courseId/learn" element={
            <Layout>
              <LearnCourse />
            </Layout>
          } />
          <Route path="instructor/" element={
            <Layout>
              <InstructorDashboard />
            </Layout>
          } />
          <Route path="instructor/managecourse" element={
            <Layout>
              <ManageCourse />
            </Layout>
          } />
        </Routes>
      </Router>
    </Provider>
  )
}

export default App