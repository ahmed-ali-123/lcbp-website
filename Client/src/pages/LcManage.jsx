import React, { useEffect, useState } from "react";
import "../App.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "sonner";
const LcManage = () => {
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL;
  const { state } = useParams();
  const [selectedImage, setSelectedImage] = useState(null);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState(0);
  const [products, setProducts] = useState(null);
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(0);

  const addProduct = async () => {
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
      if (price <= 0 || !price || !title || !desc) {
        throw new Error("All fields are required");
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
      const data1 = await resp.json();
      if (!data1.url) {
        throw new Error("Error with image");
      }

      const res = await fetch(`${apiUrl}/api/product/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          desc,
          price,
          imageurl: data1.url,
        }),
      });
      const response = await res.json();
      if (response.success) {
        toast.success("Product added sucessfully");
        setTitle("");
        setDesc("");
        setPrice(0);
        setSelectedImage(null);
        navigate("/manageshop");
        setLoading2(false);
        getProducts();
      } else {
        toast.error(response.message);
        setLoading2(false);
      }
    } catch (e) {
      toast.error(e.message || "an error occured");
      setLoading2(false);
    }
  };

  const getProducts = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/product/get`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await res.json();
      if (response.success) {
        setProducts(response.products);
        setOrders(response.orders);
        setLoading(false);
      } else {
        toast.error(response.message);
        setLoading(false);
      }
    } catch (e) {
      toast.error(e.message || "an error occured");
      setLoading(false);
    }
  };
  useEffect(() => {
    getProducts();
  }, []);
  const deleteProduct = async (id) => {
    try {
      const res = await fetch(`${apiUrl}/api/product/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await res.json();
      if (response.success) {
        toast.success("Product deleted sucessfully");
        getProducts();
      } else {
        toast.error(response.message);
      }
    } catch (e) {
      toast.error(e.message || "an error occured");
    }
  };
  const completeorder = async (id) => {
    try {
      if (loading3 === id) {
        return;
      }
      setLoading3(id);
      const res = await fetch(`${apiUrl}/api/order/complete/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await res.json();
      if (response.success) {
        toast.success("Order completed sucessfully");
        setOrders((prev) => {
          return prev.filter((order) => order._id !== id);
        });
        setLoading3(0);
      } else {
        toast.error(response.message);
        setLoading3(0);
      }
    } catch (e) {
      toast.error(e.message || "an error occured");
      setLoading3(0);
    }
  };
  return (
    <div className="lcShop">
      <div className="Back" onClick={() => navigate("/")}>
        {" "}
        <ArrowBackIcon />
      </div>
      <h1>LC Shop</h1>
      <div className="buttons">
        <button
          className="selected"
          onClick={() => {
            state === "add"
              ? navigate("/manageshop")
              : navigate("/manageshop/add");
          }}
        >
          Add Product
        </button>
        <button
          onClick={() => {
            state === "orders"
              ? navigate("/manageshop")
              : navigate("/manageshop/orders");
          }}
        >
          View orders
        </button>
        <button
          onClick={() => {
            navigate("/manageshop");
          }}
        >
          View products
        </button>
      </div>
      {state === "add" ? (
        <div className="addProductDiv">
          <input
            type="text"
            placeholder="Product title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Product description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          ></textarea>
          <input
            type="number"
            placeholder="Product price"
            onChange={(e) => {
              const allowedChars = /^[0-9\b.]+$/;
              if (allowedChars.test(e.target.value)) {
                setPrice(e.target.value);
              }
            }}
            value={price}
          />
          <input
            type="file"
            onChange={(e) => setSelectedImage(e.target.files[0])}
            accept="image/png image/jpeg image/jpg"
          />
          <button onClick={addProduct}>
            {loading2 ? "loading..." : "Add Product"}
          </button>
        </div>
      ) : state === "orders" ? (
        <div className="table">
          {loading ? (
            <h1 className="nodata">Loading...</h1>
          ) : orders && orders.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone number</th>
                  <th>Address</th>
                  <th>Item</th>
                  <th>Method</th>
                  <th>Proof</th>
                </tr>
              </thead>
              <tbody>
                {orders?.map((item) => (
                  <tr>
                    <td>{item.name}</td>
                    <td>{item.phone}</td>
                    <td>{item.address}</td>
                    <td
                      onClick={() => {
                        window.open(
                          "https://lcbpbusinessplan.com/product/" + item.item,
                          "_blank"
                        );
                      }}
                      style={{
                        cursor: "pointer",
                        textDecoration: "underline",
                        color: "blue",
                      }}
                    >
                      {item.itemname}
                    </td>
                    <td>{item.method}</td>
                    {item.imageurl ? (
                      <td
                        onClick={() => {
                          window.open(item.imageurl, "_blank");
                        }}
                        style={{
                          cursor: "pointer",
                          textDecoration: "underline",
                          color: "blue",
                        }}
                      >
                        image
                      </td>
                    ) : (
                      <td>No Image</td>
                    )}

                    <button
                      className="banintable unban"
                      onClick={() => {
                        completeorder(item._id);
                      }}
                    >
                      {loading3 == item._id ? "loading..." : "Complete order"}
                    </button>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <h1 className="nodata">No orders found</h1>
          )}
        </div>
      ) : (
        <div
          className="shopContainer inmanage"
          style={products?.length === 0 || loading ? { display: "flex" } : null}
        >
          {loading ? (
            <h1 className="nodata">Loading...</h1>
          ) : products && products.length > 0 ? (
            products?.map((item) => (
              <div className="shopCard" key={item._id}>
                <div
                  className="closeIcon"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    deleteProduct(item._id);
                  }}
                >
                  <DeleteIcon />
                </div>
                <div
                  className="cardImage"
                  style={{
                    backgroundImage: `url(${item.imageurl})`,
                    backgroundColor: "transparent",
                    backgroundSize: "cover",
                  }}
                ></div>
                <div className="cardContent">
                  <h1 className="productHeading">{item.title}</h1>
                  <h2>{item.price}pkr</h2>
                </div>
              </div>
            ))
          ) : (
            <h1 className="nodata">No products found</h1>
          )}
        </div>
      )}
    </div>
  );
};

export default LcManage;
