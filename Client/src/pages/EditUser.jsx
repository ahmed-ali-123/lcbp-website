import React, { useEffect, useState } from "react";
import "./updateProfile.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const EditUser = () => {
  const navigate = useNavigate();
  const usersid = useParams().id;
  const apiUrl = import.meta.env.VITE_API_URL;
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [planner, setPlanner] = useState("");

  const [data, setData] = useState({
    name: "",
    email: "",
    phone: 0,
    password: "",
    plan: "",
    balance: 0,
    _id: "",
    reffer: "",
  });
  function isValidNumber(inputString) {
    return /^\d+$/.test(inputString);
  }
  function hasEmail(text) {
    const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/;

    return emailPattern.test(text);
  }

  const updateProfile = async () => {
    if (!usersid || !apiUrl) {
      toast.error("Could not update profile: missing id or API URL");
      return;
    }

    if (!isValidNumber(data.phone)) {
      toast.error(`Phone number can only contain numbers`);
      return;
    } else if (data.phone.length < 11) {
      toast.error("Phone number must be 11 digits");
      return;
    } else if (!hasEmail(data.email)) {
      toast.error("Invalid Email");
      return;
    }

    try {
      if (data.reffer === planner) {
        const response = await fetch(`${apiUrl}/api/auth/updateall`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            changeplanner: false,
            id: data._id,
            name: data.name,
            email: data.email,
            phone: data.phone,
            password: data.password,
            plan: data.plan,
            balance: data.balance,
          }),
        });

        const result = await response.json();
        console.log(result);

        if (!response.ok || !result || result.success === false) {
          toast.error(result?.message || "Could not update profile");
          console.error({ result, response });
          setLoading(false);
          return;
        }

        toast.success(result.message);

        navigate("/lcbpadminssecretdashboard");
      } else {
        const response = await fetch(`${apiUrl}/api/auth/updateall`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            changeplanner: true,
            planner: data.reffer,
            id: data._id,
            name: data.name,
            email: data.email,
            phone: data.phone,
            password: data.password,
            plan: data.plan,
            balance: data.balance,
          }),
        });

        const result = await response.json();
        console.log(result);

        if (!response.ok || !result || result.success === false) {
          toast.error(result?.message || "Could not update profile");
          console.error({ result, response });
          setLoading(false);
          return;
        }

        toast.success(result.message);

        navigate("/lcbpadminssecretdashboard");
      }
    } catch (error) {
      toast.error(error?.message || "Could not update profile");
      console.error({ error });
      setLoading(false);
      return;
    }
  };
  const getplans = async () => {
    try {
      setLoading(true);
      let res = await fetch(`${apiUrl}/api/plan/userplans`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: usersid,
        }),
      });

      let response = await res.json();

      if (!response.success) {
        toast.error(response.message);
        setLoading(false);
        return;
      } else {
        console.log(response);
        const filteredPlans = response.plans.filter(
          (plan) => plan._id !== "662327127cc61c15f06b4f83"
        );
        setPlans(filteredPlans);
        setData({
          ...data,
          name: response.user.name,
          email: response.user.email,
          phone: response.user.phone,
          plan: response.user.plan,
          balance: response.user.balance,
          _id: response.user._id,
          reffer: response.user.reffer,
        });
        setPlanner(response.user.reffer);
        setLoading(false);
        return;
      }
    } catch (e) {
      toast.error(e.message);
      setLoading(false);
      return;
    }
  };
  useEffect(() => {
    getplans();
  }, []);

  return (
    <div className="updateProfilePage">
      <div className="Back" onClick={() => navigate(-1)}>
        {" "}
        <ArrowBackIcon />
      </div>
      <h1>Update Profile</h1>
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <>
          <label className="updateProfileLabel" htmlFor="name">
            Change Name
          </label>
          <input
            className="updateProfileInput"
            placeholder="Name"
            id="name"
            onChange={(e) => setData({ ...data, name: e.target.value })}
            value={data?.name}
          />
          <label className="updateProfileLabel" htmlFor="email">
            Change Email
          </label>

          <input
            className="updateProfileInput"
            placeholder="Email"
            id="email"
            onChange={(e) => setData({ ...data, email: e.target.value })}
            value={data?.email}
          />
          <label className="updateProfileLabel" htmlFor="number">
            Change Phone Number
          </label>
          <input
            id="number"
            type="text"
            className="updateProfileInput inputNumber"
            placeholder="Phone Number"
            value={data?.phone}
            onChange={(e) => setData({ ...data, phone: e.target.value })}
          />
          <label className="updateProfileLabel" htmlFor="password">
            Change Password
          </label>
          <input
            id="password"
            className="updateProfileInput"
            placeholder="Password"
            type="text"
            onChange={(e) => setData({ ...data, password: e.target.value })}
            value={data?.password}
          />
          <label className="updateProfileLabel" htmlFor="balance">
            Change Balance
          </label>
          <input
            id="balance"
            className="updateProfileInput"
            placeholder="Balance"
            type="number"
            onChange={(e) => setData({ ...data, balance: e.target.value })}
            value={data?.balance}
          />
          <label className="updateProfileLabel" htmlFor="reffer">
            Change Planner
          </label>
          <input
            id="reffer"
            className="updateProfileInput"
            placeholder="Planner"
            type="text"
            onChange={(e) => setData({ ...data, reffer: e.target.value })}
            value={data?.reffer}
          />
          <label className="updateProfileLabel" htmlFor="plan">
            Change Plan
          </label>

          <select
            className="updateProfileInput"
            id="plan"
            onChange={(e) => setData({ ...data, plan: e.target.value })}
            value={data.plan === null ? "" : data.plan} // Handle both null and undefined values
          >
            {plans?.map((plan) => (
              <option key={plan._id} value={plan._id}>
                {plan.name}
              </option>
            ))}
            <option key="none" value="">
              None
            </option>{" "}
          </select>

          <button onClick={() => updateProfile()}>Update</button>
        </>
      )}
    </div>
  );
};

export default EditUser;
