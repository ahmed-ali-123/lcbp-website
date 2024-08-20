import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { toast } from "sonner";
import "./buyplan.css";

const BuyPlan = () => {
  const { planid } = useParams();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  const [plan, setPlan] = useState({});
  const [loading, setLoading] = useState(false);
  const [accountnum, setAccountnum] = useState("");
  const [method, setMethod] = useState("");
  const [transactionid, setTransactionid] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const username = localStorage.getItem("LCBPUSERNAME");
  const usersemail = localStorage.getItem("LCBPEMAIL");
  const usersimageurl = localStorage.getItem("LCBPIMAGEURL");
  const usersid = localStorage.getItem("AUTHUSERUNIQUEID");

  function isValidNumber(inputString) {
    return /^\d+$/.test(inputString);
  }
  const getPlanDetails = async (id) => {
    try {
      if (!id) {
        throw new Error("Missing plan id");
      }
      setLoading(true);
      const plan = await fetch(`${apiUrl}/api/plan/details`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planid: id }),
      });
      if (!plan) {
        throw new Error("Failed to fetch plan details");
      }
      const result = await plan.json();
      if (!result) {
        throw new Error("Failed to parse plan details");
      }
      if (!result.success) {
        throw new Error(result.message || "Unknown error");
      }
      if (!result.plan) {
        throw new Error("Missing plan details");
      }
      setPlan(result.plan);
      console.log(result.plan);
      setLoading(false);
    } catch (e) {
      toast.error(e.message);
      setLoading(false);
      navigate("/");
    }
  };

  useEffect(() => {
    if (!planid) {
      navigate("/");
    } else {
      window.scroll(0, 0, { behavior: "smooth" });
      getPlanDetails(planid);
    }
  }, []);

  const submitrequest = async () => {
    try {
      if (!selectedImage) {
        throw new Error("No image selected.");
      }
      if (
        !selectedImage.type ||
        !(
          selectedImage.type === "image/jpeg" ||
          selectedImage.type === "image/png" ||
          selectedImage.type === "image/jpg"
        )
      ) {
        throw new Error(
          "Invalid image format. Only JPEG, PNG, and JPG formats are allowed."
        );
      }
      if (!planid) {
        throw new Error("Missing plan id");
      }
      if (!accountnum) {
        throw new Error("Missing account number");
      }
      if (!isValidNumber(accountnum)) {
        throw new Error("Account number can only contain numbers");
      }

      if (
        !username ||
        !usersemail ||
        !usersimageurl ||
        !usersid ||
        !transactionid
      ) {
        localStorage.clear();
        throw new Error("Please login to continue");
      }

      setLoading(true);
      console.log("Function started");

      let image = new FormData();
      image.append("file", selectedImage);
      image.append("cloud_name", "dbntul88v");
      image.append("upload_preset", "pvkxzd6k");

      console.log("Before cloud req");
      const url = "https://api.cloudinary.com/v1_1/dbntul88v/image/upload";
      const resp = await fetch(url, {
        method: "POST",
        body: image,
      });
      const data1 = await resp.json();
      if (!data1.url) {
        throw new Error("Error with image");
      }

      console.log("data1 url : " + data1.url);
      const res = await fetch(`${apiUrl}/api/request/addreq`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usersname: username,
          usersemail,
          usersimageurl,
          usersid,
          planname: plan.name,
          planid: plan._id,
          planprice: plan.amountpkr,
          proof: data1.url,
          accountnum,
          method: "easypaisa",
          transactionid,
        }),
      });
      console.log("Plan fetched");
      if (!plan) {
        throw new Error("Failed to fetch plan details");
      }
      const result = await res.json();

      console.log("result : ", result);
      if (!result) {
        throw new Error("Failed to parse plan details");
      }
      if (!result.success) {
        throw new Error(result.message || "Unknown error");
      }
      toast.success("Your request has been submitted");
      navigate("/userdashboard");
    } catch (e) {
      toast.error(e.message);
      console.error(e);
      setLoading(false);
    }
  };

  return (
    <div className="buyPlanPage">
      <div className="Back" onClick={() => navigate(-1)}>
        <ArrowBackIcon />
      </div>
      <div className="contentWrapper">
        <h1 className="buyplanheading">Buy Plan</h1>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="planDetails">
            <h3>Name: {plan.name}</h3>
            <h3>
              Price: ${plan.price} ({plan.amountpkr}pkr)
            </h3>
            <h3>Box Cooltime : {plan.boxcooltime}m</h3>
            <h3>Box Limit : {plan.boxlimit}/day</h3>
            <h3>Box Prize : {plan.boxprice} pkr</h3>
          </div>
        )}
        <p className="payp">
          Send Rs : <span>{plan.amountpkr}</span>pkr to either of the Easypaisa
          account tu buy the plan.
        </p>
        <h1 className="easypaisa easypaisa1">
          <span>EasyPaisa</span> : <br></br> 0310 4998317 | Rashid Rashid
        </h1>
        {/* <h1 className="easypaisa easypaisa2">
          <span>Jazzcash</span> : <br></br> Unavailable | Unavailable
        </h1> */}
        {/* <div className="radios">
          <div className="radiodivs">
            <label className="label" htmlFor="easypaisa">
              EasyPaisa
            </label>
            <input
              type="radio"
              className="inputinpayment"
              id="easypaisa"
              onChange={(e) => {
                setMethod(e.target.id);
              }}
              name="payment"
            />
          </div>
          <div className="radiodivs">
            <label className="label" htmlFor="jazzcash">
              JazzCash
            </label>
            <input
              type="radio"
              className="inputinpayment"
              id="jazzcash"
              name="payment"
              onChange={(e) => {
                setMethod(e.target.id);
              }}
            />
          </div> 
        </div>*/}
        <label className="label" style={{ marginTop: "20px" }}>
          Account Number
        </label>
        <input
          className="inputinpayment"
          type="text"
          value={accountnum}
          onChange={(e) => setAccountnum(e.target.value)}
          placeholder="Your Account Number"
        />
        <label className="label">Transaction id</label>
        <input
          className="inputinpayment"
          type="text"
          value={transactionid}
          onChange={(e) => setTransactionid(e.target.value)}
          placeholder="Transaction id"
        />
        <label className="label">Proof of payment</label>
        <div
          className={selectedImage ? "imageInputDiv green" : "imageInputDiv"}
        >
          <input
            type="file"
            onChange={(e) => setSelectedImage(e.target.files[0])}
            accept="image/png image/jpeg image/jpg"
          />
          <h1>+</h1>
        </div>
        {loading ? (
          <button className="submitbutton">Loading...</button>
        ) : (
          <button className="submitbutton" onClick={submitrequest}>
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default BuyPlan;
