import React, { useEffect, useState } from "react";
import "../index.css";
import { toast } from "sonner";
const seeAllUsers = () => {
  const [users, setUsrs] = useState([]);
  const [plan, setPlan] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(false);
  const [userloading, setUserLoading] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchUsers = async () => {
    try {
      if (loading2) {
        return;
      }

      setLoading2(true);
      const response = await fetch(`${apiUrl}/api/auth/all`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          plan,
          search,
          page,
        }),
      });

      const res = await response.json();
      console.log(res);
      if (!res.success || res.users.length === 0) {
        toast.error(res.message || "An unexpected error occured");
        setLoading(false);
        setLoading2(false);
        return;
      } else {
        if (page === 1) {
          setUsrs(res.users);
        } else {
          setUsrs((prev) => [...prev, ...res.users]);
        }
      }
      setLoading(false);
      setLoading2(false);
    } catch (e) {
      toast.error("Server error");
      console.log(e);
      setLoading(false);
      setLoading2(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const banuser = async (id) => {
    try {
      const confirmation = confirm("Are you sure you want to ban this user?");
      if (!confirmation) {
        return;
      }

      setUserLoading(id);

      const result = await fetch(`${apiUrl}/api/auth/deleteuser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });
      const res = await result.json();
      if (!res.success) {
        toast.error(res.message || "An unexpected error occured");
        setUserLoading("");
        return;
      }
      toast.success("User banned successfully");
      setUserLoading("");
    } catch (e) {
      console.log(e);
      toast.error("Server error");
      setUserLoading("");
    }
  };

  const unbanuser = async (id) => {
    try {
      const confirmation = confirm("Are you sure you want to unban this user?");
      if (!confirmation) {
        return;
      }

      setUserLoading(id);
      const result = await fetch(`${apiUrl}/api/auth/unbanuser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });
      const res = await result.json();
      if (!res.success) {
        toast.error(res.message || "An unexpected error occured");
        setUserLoading("");
        return;
      }
      toast.success("User unbanned successfully");
      setUserLoading("");
    } catch (e) {
      toast.error(e.message || "An unexpected error occured");
      setUserLoading("");
    }
  };
  return (
    <div className="seeall">
      <h1>seeAllUsers</h1>
      <div className="selectplan">
        <label htmlFor="plan">Plan</label>
        <select id="plan" onChange={(e) => setPlan(e.target.value)}>
          <option>all</option>
          <option>Free Plan</option>
          <option>Silver</option>
          <option>Golden</option>
          <option>Diamond</option>
          <option>Platinum</option>
          <option>Super Platinum</option>
          <option>Best Platinum</option>
          <option>Max plan</option>
          <option>Super max</option>
          <option>Best Max</option>
          <option>Biggest offer</option>
        </select>
      </div>
      <div className="selectplan" style={{ marginTop: "20px" }}>
        <label htmlFor="plan2">Search</label>
        <input
          id="plan2"
          placeholder="Search"
          type="text"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="selectplan" style={{ marginTop: "20px" }}>
        <button
          onClick={() => {
            if (page !== 1) {
              setPage(1);
            } else {
              setLoading(true);
              fetchUsers();
            }
          }}
        >
          Get Users
        </button>
      </div>
      <div className="table">
        {loading ? (
          "Loading..."
        ) : (
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Name</th>
                <th>Balance</th>
                <th>Join Date</th>
                <th>Banned</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => (
                <tr
                  style={
                    user.banned
                      ? { borderLeft: "3px solid red" }
                      : { borderLeft: "3px solid limegreen" }
                  }
                  key={user._id}
                >
                  <td>{user.username}</td>
                  <td>{user.name}</td>
                  <td>{user.balance}</td>
                  <td>
                    {user.planJoinDate
                      ? new Date(user.planJoinDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>{user.banned ? "banned" : "not banned"}</td>
                  {user.banned ? (
                    <button
                      className="banintable unban"
                      onClick={() => {
                        unbanuser(user._id);
                      }}
                    >
                      {userloading === user._id ? "Loading..." : "Unban User"}
                    </button>
                  ) : (
                    <button
                      className="banintable"
                      onClick={() => {
                        banuser(user._id);
                      }}
                    >
                      {" "}
                      {userloading === user._id ? "Loading..." : "Ban User"}
                    </button>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="buttondivintable">
          <button
            className="seemore2"
            onClick={() => {
              setPage((prev) => prev + 1);
            }}
          >
            {loading2 ? "Loading..." : "Load More"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default seeAllUsers;
