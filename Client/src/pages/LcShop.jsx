import React, { useEffect, useState } from "react";
import "../App.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const lcShop = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;

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
  return (
    <div className="lcShop">
      <div className="Back" onClick={() => navigate("/")}>
        {" "}
        <ArrowBackIcon />
      </div>
      <h1>LC Shop</h1>
      <div className="shopContainer">
        <div
          className="shopContainer inmanage"
          style={products?.length === 0 || loading ? { display: "flex" } : null}
        >
          {loading ? (
            <h1 className="nodata">Loading...</h1>
          ) : products && products.length > 0 ? (
            products?.map((item) => (
              <div
                className="shopCard"
                key={item._id}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  navigate("/product/" + item._id);
                }}
              >
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
      </div>
    </div>
  );
};

export default lcShop;
