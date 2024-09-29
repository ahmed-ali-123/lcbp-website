import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App";
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
import Profile from "./pages/Profile";
import Referrals from "./pages/Referrals";
import UpdateProfile from "./pages/EditProfile";
import ChangeBanned from "./pages/ChangeBanned";
import Freelancers from "./pages/Freelancers";
import MyGigs from "./pages/MyGigs";
import Addgig from "./pages/Addgig";
import GigDetails from "./pages/GigDetails";
import Editgig from "./pages/Editgig";
import BasicEarning from "./pages/BasicEarning";
import AdminPass from "./pages/Adminpass";
import Dashboard from "./pages/dashboard/Dashboard";
import BuyPlan from "./pages/BuyPlan";
import UserDashboard from "./pages/UserDashboard";
import EditUser from "./pages/EditUser";
import UpdateValues from "./pages/UpdateValues";
import EditPlan from "./pages/EditPlan";
import Contact from "./pages/contact/contact";
import Help from "./pages/Help";
import Chatspage from "./pages/Chatspage";
import Reply from "./pages/reply";
import Classes from "./pages/Classes";
import ManageClasses from "./pages/ManageClasses";
import ManageClass from "./pages/ManageClass";
import CutFine from "./pages/CutFine";
import About from "./pages/About";
import EditAbout from "./pages/EditAbout";
import Terms from "./pages/Terms";
import SeeAllUsers from "./pages/SeeAllUsersInProgram";
import LcShop from "./pages/LcShop";
import LcManage from "./pages/LcManage";
import LcProduct from "./pages/LcProduct";
import "./App.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/product/:id",
        element: <LcProduct />,
      },
      {
        path: "/login",
        element: <Login />,

        children: [
          {
            path: "/login/:id",
            element: <Login />,
          },
        ],
      },
      {
        path: "/profile",
        element: <Profile />,
        children: [],
      },
      {
        path: "/about",
        element: <About />,
        children: [],
      },
      {
        path: "/termsandservices",
        element: <Terms />,
        children: [],
      },
      {
        path: "/manageshop",
        element: <LcManage />,
        children: [
          {
            path: "/manageshop/:state",
            element: <LcManage />,
          },
        ],
      },
      {
        path: "/editaboutvaluesandothertext",
        element: <EditAbout />,
        children: [],
      },
      {
        path: "/manageClasses",
        element: <ManageClasses />,
        children: [],
      },
      {
        path: "/manageClass/:id",
        element: <ManageClass />,
      },
      {
        path: "/lcbpadminssecretchatspage",
        element: <Chatspage />,
        children: [],
      },
      {
        path: "/helpuser/:id",
        element: <Reply />,
        children: [],
      },
      {
        path: "/help",
        element: <Help />,
      },
      {
        path: "/changebanned",
        element: <ChangeBanned />,
      },
      {
        path: "/referrals",
        element: <Referrals />,
      },
      {
        path: "/cutfines",
        element: <CutFine />,
      },
      {
        path: "/updateprofile",
        element: <UpdateProfile />,
      },
      {
        path: "/freelancers",
        element: <Freelancers />,
      },
      {
        path: "/mygigs",
        element: <MyGigs />,
      },
      {
        path: "/classes",
        element: <Classes />,
      },
      {
        path: "/addgig",
        element: <Addgig />,
      },
      {
        path: "/gigdetails/:gigid",
        element: <GigDetails />,
      },
      {
        path: "/editgig/:edtgigid",
        element: <Editgig />,
      },
      {
        path: "/basicEarning",
        element: <BasicEarning />,
      },
      {
        path: "/buyPlan/:planid",
        element: <BuyPlan />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/userdashboard",
        element: <UserDashboard />,
        children: [
          {
            path: "/userdashboard/:inner",
            element: <UserDashboard />,
          },
        ],
      },
      {
        path: "/edituserprofileinfo",
        element: <EditUser />,
        children: [
          {
            path: "/edituserprofileinfo/:id",
            element: <EditUser />,
          },
        ],
      },

      {
        path: "/updatestaticvalues",
        element: <UpdateValues />,
      },
      {
        path: "/see",
        element: <SeeAllUsers />,
      },
      {
        path: "/shop",
        element: <LcShop />,
      },
      {
        path: "/editplan",
        element: <EditPlan />,
        children: [
          {
            path: "/editplan/:id",
            element: <EditPlan />,
          },
        ],
      },
      {
        path: "/lcbpadminssecretdashboard",
        element: <AdminPass />,
        children: [
          {
            path: "/lcbpadminssecretdashboard",
            element: <Dashboard />,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
