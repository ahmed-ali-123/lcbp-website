import React, { useEffect, useState } from "react";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { toast } from "sonner";

const Withdwalreq = ({ show }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [withdrawalPending, setWithdrawalPending] = useState("");
  const apiUrl = import.meta.env.VITE_API_URL;

  const load = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/api/withdraws/get`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const res = await response?.json();
      console.log(res);
      if (!res.success) {
        console.error(res);
        toast.error(res.message || "An unexpected error occured");
        setLoading(false);
        return;
      }
      setData(res.withdrawals);
      setLoading(false);
    } catch (e) {
      toast.error(e.message || "An unexpected error occured");
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

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
  const accept = async (id) => {
    try {
      setWithdrawalPending(id);
      const result = await fetch(`${apiUrl}/api/withdraws/accept`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });
      const res = await result?.json();
      if (!res.success) {
        toast.error(res.message || "An unexpected error occured");
        setWithdrawalPending("");
      }
      toast.success("Withdrawal request accepted successfully");
      setWithdrawalPending("");
      load();
    } catch (e) {
      toast.error(e.message || "An unexpected error occured");
      setWithdrawalPending("");
    }
  };
  const reject = async (id) => {
    try {
      const result = await fetch(`${apiUrl}/api/withdraws/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });
      const res = await result?.json();
      if (!res.success) {
        toast.error(res.message || "An unexpected error occured");
      }
      toast.success("Withdrawal request rejected successfully");
      load();
    } catch (e) {
      toast.error(e.message || "An unexpected error occured");
    }
  };
  return (
    <div>
      <div className="PendingPage">
        <MenuOpenIcon
          className="DashboardMenuIcon"
          style={{
            margin: "0",
            padding: "0",
            transform: "rotate(180deg)",
            color: "black",
            fontSize: "2.5rem",
            marginBottom: "10px",
            cursor: "pointer",
          }}
          onClick={() => {
            show();
          }}
        />
        <h1
          className="usersheading"
          onClick={() => {
            console.log(data);
          }}
        >
          Pending Withdrawals
        </h1>
        <div className="plansDiv">
          {loading ? (
            <h1>Loading...</h1>
          ) : data.length > 0 ? (
            data.map((e, i) => (
              <div
                className="plan"
                key={i}
                style={
                  e.blocked || e.banned
                    ? { border: "2px solid red" }
                    : { border: "2px solid green" }
                }
              >
                <p>
                  <span>Username :</span> {e.username}
                </p>
                <p>
                  <span>User Balance :</span> {e.userbalance} pkr
                </p>
                <p>
                  <span>Withdraw amount :</span> {e.amount} pkr
                </p>
                <p>
                  <span>Withdraw fees :</span> {e.amount * 0.1} pkr
                </p>
                <p
                  style={{
                    color: "green",
                    fontSize: "2rem",
                  }}
                >
                  <span>Amount to send :</span> {e.amount - e.amount * 0.1} pkr
                </p>
                <p>
                  <span>Account Platform :</span> {e.AccountPlatform}
                </p>
                <p>
                  <span>Account number :</span> {e.accountnum}
                </p>
                <p>
                  <span>Account Name :</span> {e.accountName}
                </p>
                <p>
                  <span>Date :</span> {formatDate(e.date)}
                </p>
                <div className="buttons">
                  {withdrawalPending !== e._id ? (
                    <button
                      onClick={() => {
                        accept(e._id);
                      }}
                    >
                      Approve
                    </button>
                  ) : (
                    <button>Wait...</button>
                  )}

                  <button
                    onClick={() => {
                      reject(e._id);
                    }}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No Pending requests</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Withdwalreq;
