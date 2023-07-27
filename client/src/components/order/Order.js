import {React,useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import { Divider } from '@mui/material';
import Option from '../cart/Option';
import Right from './Right';
import "./order.css"
import "../cart/cart.css"


const ProductDisplay = ({ele}) => (
    <>
    <div className="cart_section">
    <div className="cart_container">
        <div className="left_buy">
            <h1>Shopping Cart</h1>
            <span className="leftbuyprice">Price</span>
            <Divider />

            {
                ele.map((e,k)=>{
                    return (
                        <>
                        <div className="item_containert">
                                <img src={e.detailUrl} alt="imgitem" />
                                <div className="item_details">
                                    <h3>{e.title.longTitle}</h3>
                                    <h3>{e.title.shortTitle}</h3>
                                    <h3 className="diffrentprice">₹{e.price.cost}</h3>
                                    <p className="unusuall">Usually dispatched in 8 days.</p>
                                    <p>Eligible for FREE Shipping</p>
                                    <img src="https://m.media-amazon.com/images/G/31/marketing/fba/fba-badge_18px-2x._CB485942108_.png" alt="logo" />
                                    
                                </div>
                                <h3 className="item_price">₹{e.price.cost}</h3>
                                <Divider />
                            </div>
                        </>
                    )
                })
            }
        </div>
    </div>
</div>
    </>
  );

  const Message = ({ message }) => (
    <section>
      <p>{message}</p>
    </section>
  );

const Order = () => {

    const [message, setMessage] = useState("");

    const [cartData,setCartData]=useState([]);

    const getCartData=async()=>{
        const res =await fetch("/cartdetails",{
            method : "GET",
            headers:{
                Accept: "application/json",
                "Content-Type":"application/json"
            },
            credentials: "include"
        });

        const data =await res.json();

        if(res.status!==201)
        {
            alert("no data available");
        }
        else{
            setCartData(data.carts);
        }
    }
    useEffect(()=>{
        getCartData();
    },[]);

   
    useEffect(() => {
        // Check to see if this is a redirect back from Checkout
        const query = new URLSearchParams(window.location.search);
    
        if (query.get("success")) {
          setMessage("Order placed! You will receive an email confirmation.");
        }
    
        if (query.get("canceled")) {
          setMessage(
            "Order canceled -- continue to shop around and checkout when you're ready."
          );
        }
      }, []);

    return message ? (
        <Message message={message} />
      ) : (
        <>
        <ProductDisplay ele={cartData} />
        <Right item={cartData}/>
        </>
        
      );
}

export default Order
