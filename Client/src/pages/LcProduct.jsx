import React, { useEffect, useState } from "react";
import "./gigdetails.css";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { toast } from "sonner";

const lcProduct = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(false);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;
  const [data, setData] = useState({
    name: "",
    phone: "",
    address: "",
    item: "",
    imageurl: "",
  });
  const [method, setMethod] = useState("COD");
  const [selectedImage, setSelectedImage] = useState(null);
  const userid = localStorage.getItem("AUTHUSERUNIQUEID");

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(method);
    if (name === "phone") {
      const allowedChars = /^[0-9\b.]+$/;
      if (allowedChars.test(value)) {
        setData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    } else {
      setData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  const getProduct = async () => {
    try {
      if (!id) {
        navigate("/");
        return;
      }
      const res = await fetch(`${apiUrl}/api/product/product/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await res.json();
      if (response.success) {
        setProduct(response.product);
        setLoading(false);
      } else {
        toast.error(response.message);
        setLoading(false);
      }
    } catch (e) {
      toast.error(e.message || "an error occured");
      console.log(e);
      navigate("/");
    }
  };
  useEffect(() => {
    getProduct();
  }, []);
  const addOrder = async () => {
    try {
      if (!data.name || !data.phone || !data.address) {
        toast.error("Please fill all fields");
        return;
      }
      let data1;
      if (method === "EasyPaisa") {
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
        if (!id) {
          throw new Error("Missing product id");
        }
        if (loading2) {
          return;
        }
        setLoading2(true);
        let image = new FormData();
        image.append("file", selectedImage);
        image.append("cloud_name", "dbntul88v");
        image.append("upload_preset", "pvkxzd6k");
        const url = "https://api.cloudinary.com/v1_1/dbntul88v/image/upload";
        const resp = await fetch(url, {
          method: "POST",
          body: image,
        });
        data1 = await resp.json();
        if (!data1.url) {
          throw new Error("Error with image");
        }
      }
      setLoading2(true);

      console.log(data);
      let response;
      if (method === "COD") {
        response = await fetch(`${apiUrl}/api/order/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...data,
            item: id,
            itemname: product.title,
            method,
          }),
        });
      } else {
        response = await fetch(`${apiUrl}/api/order/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...data,
            item: id,
            imageurl: data1.url,
            itemname: product.title,
            method,
          }),
        });
      }
      const res = await response.json();
      if (res.success) {
        toast.success("Order placed successfully");
        setLoading2(false);
        setOpen(false);
      } else {
        toast.error(res.message);
        setLoading2(false);
      }
    } catch (e) {
      toast.error(e.message || "an error occured");
      console.log(e);
      setLoading2(false);
    }
  };
  return (
    <div className="gigDetailsPage">
      <div
        className="Back"
        onClick={() => {
          open ? setOpen(false) : navigate(-1);
        }}
      >
        <ArrowBackIcon />
      </div>
      <h1>{open ? "Order" : "Product Details"}</h1>
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <>
          {open ? (
            <div className="addProductDiv">
              {method === "COD" ? (
                <h3>Cash on delivery</h3>
              ) : (
                <>
                  <h3>
                    Please send <span>{product?.price}pkr</span> to{" "}
                  </h3>
                  <h3 className="addProductdetails">
                    <b>Easypaisa</b>
                    <b>Rashid Rashid</b>
                    <b>03104998317</b>
                  </h3>
                </>
              )}
              <div className="selectpayment">
                <div className="inp1">
                  <input
                    type="radio"
                    name="method"
                    value="COD"
                    id="cod"
                    onChange={(e) => setMethod(e.target.value)}
                    defaultChecked
                  />{" "}
                  <label htmlFor="cod">Cash on delivery</label>
                </div>
                <div className="inp1">
                  <input
                    type="radio"
                    name="method"
                    value="EasyPaisa"
                    id="easy"
                    onChange={(e) => setMethod(e.target.value)}
                  />{" "}
                  <label htmlFor="easy">Easypaisa</label>
                </div>
              </div>
              <h5>
                The product will be deliverd to you within the next 2-3 days
              </h5>
              <input
                type="text"
                placeholder="Name"
                name="name"
                value={data.name}
                onChange={handleChange}
              />
              <input
                type="text"
                placeholder="Reciever's Phone number"
                name="phone"
                onChange={handleChange}
                value={data.phone}
              />
              <input
                type="text"
                placeholder="Address"
                name="address"
                onChange={handleChange}
                value={data.address}
              />
              {method === "EasyPaisa" ? (
                <input
                  type="file"
                  placeholder="upload image"
                  accept="image/png image/jpeg image/jpg"
                  onChange={(e) => setSelectedImage(e.target.files[0])}
                />
              ) : null}

              <button onClick={addOrder}>
                {loading2 ? "Loading..." : "Order"}
              </button>
            </div>
          ) : product ? (
            <div className="gigdetailswrapper">
              <img
                src={
                  product?.imageurl
                    ? product?.imageurl
                    : "https://i.pinimg.com/736x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg"
                }
                alt="image"
                className="gigImage"
              />

              <div className="gigdetailstext gigdetails2">
                <h2>{product?.title}</h2>
                <h5>{product?.desc}</h5>
              </div>
              <div className="price">
                <h1>{product?.price}pkr</h1>
              </div>
              <button
                className="orderbutton"
                onClick={() => {
                  if (userid) {
                    setOpen((prev) => !prev);
                  } else {
                    navigate("/login");
                  }
                }}
              >
                Order
              </button>
            </div>
          ) : (
            <>loading</>
          )}

          <h3
            style={{
              marginBottom: "20px",
            }}
          >
            Help Line number : 03104998317{" "}
          </h3>
        </>
      )}
    </div>
  );
};

export default lcProduct;
