import React, { useEffect, useState } from "react";
import logo from "../images/logo.png";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import "./userdashboard.css";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { toast } from "sonner";
import RightPage from "./RightPage";
import Transactions from "./Transactions";
import Withdraw from "./Withdraw";
import Box from "./Box";
import Spin from "./Spin";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const id = localStorage.getItem("AUTHUSERUNIQUEID");
  const apiUrl = import.meta.env.VITE_API_URL;
  const [planpending, setPlanpending] = useState(false);
  const [user, setUser] = useState({});
  const [plan, setPlan] = useState({});
  const [transactions, setTransactions] = useState([]);
  const innerPage = useParams().inner;
  const fetchdata = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/plan/userplan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userid: id,
        }),
      });

      const res = await response.json();
      if (!res.success) {
        toast.error(res.message || "An unexpected error occured");
        return;
      }
      if (res.banned) {
        localStorage.clear();
        navigate("/login");
        return;
      }
      if (res.planpending) {
        setPlanpending(true);
      } else if (res.plan === null) {
        toast.error("Unexpected error :-(");
        console.log(res);
        navigate("/");
      } else {
        setPlanpending(false);
        setUser(res.user);
        console.log(res.user);
        setPlan(res.plan);
      }
    } catch (e) {
      console.error(e);
      toast.error(e.message);
    }
  };
  function formatDate(inputDate) {
    const date = new Date(inputDate);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear().toString().slice(-2);
    const formattedDate = `${hours}:${minutes
      .toString()
      .padStart(2, "0")}${ampm}, ${day} ${month} ${year}`;

    return formattedDate;
  }

  useEffect(() => {
    fetchdata();
  }, []);
  const fetchTransactions = async () => {
    let response = await fetch(`${apiUrl}/api/transactions/get`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: user.username,
        limit: 10,
      }),
    });
    const res = await response?.json();
    if (!res.success) {
      toast.error(res.message || "An unexpected error occured");
      return;
    }
    if (res.transactions) {
      setTransactions(res.transactions);
    }
    try {
    } catch (e) {}
  };
  useEffect(() => {
    try {
      if (user) {
        fetchTransactions();
      }
    } catch (e) {
      toast.error(e.message || "An unexpected error occured");
    }
  }, [user]);

  return (
    <div className="userDashboard">
      <div className="Back" onClick={() => navigate("/profile")}>
        <ArrowBackIcon onClick={() => navigate("/profile")} />
      </div>
      <div className="sidebar">
        <div className="logoimg">
          <img src={logo} alt="logo" />

          <KeyboardArrowDownIcon
            onClick={() => {
              setOpen((prev) => !prev);
            }}
            style={open ? { transform: "rotate(180deg)" } : {}}
            className="arrowicon"
          />
        </div>
        {open ? (
          <div className="links">
            <p
              onClick={() => {
                navigate("/userdashboard");
                setOpen(false);
              }}
            >
              Dashboard
            </p>
            <p
              onClick={() => {
                navigate("/userdashboard/withdraw");
                setOpen(false);
              }}
            >
              Withdraw
            </p>
            <p onClick={() => navigate("/referrals")}>Referrals</p>
            <p
              onClick={() => {
                navigate("/userdashboard/transactions");
                setOpen(false);
              }}
            >
              Transactions
            </p>
            <p
              onClick={() => {
                navigate("/userdashboard/box");
                setOpen(false);
              }}
            >
              Box
            </p>
            <p
              onClick={() => {
                navigate("/userdashboard/spin");
                setOpen(false);
              }}
            >
              Spin
            </p>
            {user && !planpending ? (
              <p
                onClick={() => {
                  window.open(
                    "https://chat.whatsapp.com/BYxufkXcY4O2vhigVqTmsz",
                    "_blank"
                  );
                }}
              >
                Join Whatsapp Group
              </p>
            ) : (
              <></>
            )}
          </div>
        ) : (
          <div className="links desktop">
            <p
              onClick={() => {
                navigate("/userdashboard");
                setOpen(false);
              }}
            >
              Dashboard
            </p>

            <p
              onClick={() => {
                navigate("/userdashboard/withdraw");
                setOpen(false);
              }}
            >
              Withdraw
            </p>
            <p onClick={() => navigate("/referrals")}>Referrals</p>
            <p
              onClick={() => {
                navigate("/userdashboard/transactions");
                setOpen(false);
              }}
            >
              Transactions
            </p>
            <p
              onClick={() => {
                navigate("/userdashboard/box");
                setOpen(false);
              }}
            >
              Box
            </p>
            <p
              onClick={() => {
                navigate("/userdashboard/spin");
                setOpen(false);
              }}
            >
              Spin
            </p>
            {!planpending && user ? (
              <p
                onClick={() => {
                  window.open(
                    "https://chat.whatsapp.com/B6vRHXAeupkEnpWqgM84JI",
                    "_blank"
                  );
                }}
              >
                Join Whatsapp Group
              </p>
            ) : (
              <></>
            )}
          </div>
        )}
      </div>
      {innerPage === "transactions" ? (
        <Transactions user={user} />
      ) : innerPage === undefined ? (
        <RightPage
          user={user}
          plan={plan}
          transactions={transactions}
          formatDate={formatDate}
          planpending={planpending}
        />
      ) : innerPage === "withdraw" ? (
        <Withdraw user={user} />
      ) : innerPage === "box" ? (
        <Box user={user} />
      ) : innerPage === "spin" ? (
        <Spin user={user} />
      ) : (
        <h1>
          Page not found{" "}
          <span
            onClick={() => navigate("/userdashboard")}
            style={{
              cursor: "pointer",
              color: "blue",
              textDecoration: "underline",
            }}
          >
            Go Back
          </span>
        </h1>
      )}
    </div>
  );
};

export default UserDashboard;
