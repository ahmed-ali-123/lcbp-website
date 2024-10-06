import React, { useEffect, useState } from "react";
import "./about.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const About = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [value, setValue] = useState({});
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const fetchData = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/auth/getvalues`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const res = await response.json();
      if (!res.success) {
        toast.error(res.message || "An unexpected error occured");
        setLoading(false);
        return;
      } else {
        setValue(res.value);
        console.log(res.value);
        setLoading(false);
      }
    } catch (e) {
      toast.error(e.message || "Server Error");
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <div className="Back" onClick={() => navigate(-1)}>
        <ArrowBackIcon />
      </div>
      <div className="aboutPage">
        {!loading ? (
          <>
            <h1>{value.newHeading}</h1>
            <p>{value.newMessage}</p>
          </>
        ) : (
          <h1>Loading...</h1>
        )}
      </div>
    </>
  );
};

export default About;
