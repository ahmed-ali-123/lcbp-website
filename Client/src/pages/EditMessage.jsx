import React, { useEffect, useState } from "react";
import "./about.css";
import { toast } from "sonner";
const EditAbout = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [value, setValue] = useState({});
  const [loading, setLoading] = useState(true);
  const changeValues = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/api/auth/updatevalues`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ value }),
      });
      const res = await response.json();
      if (!res.success) {
        toast.error(res.message || "An unexpected error occured");
        setLoading(false);
        return;
      } else {
        toast.success("Values Updated Successfully");
        setLoading(false);
      }
    } catch (e) {
      toast.error(e.message || "Server Error");
      setLoading(false);
    }
  };
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
    <div className="EditAboutPage">
      {!loading ? (
        <>
          <h1>Set Message</h1>
          <label htmlFor="heading1"> Message Heading : </label>
          <textarea
            type="text"
            id="heading1"
            placeholder="Heading 1"
            value={value.newHeading}
            onChange={(e) => setValue({ ...value, newHeading: e.target.value })}
          />
          <label htmlFor="paragraph1"> Message Paragraph : </label>
          <textarea
            rows="5"
            type="text"
            id="paragraph1"
            placeholder="Paragraph 1"
            value={value.newMessage}
            onChange={(e) => setValue({ ...value, newMessage: e.target.value })}
          />

          <button onClick={changeValues}>Update</button>
        </>
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  );
};

export default EditAbout;
