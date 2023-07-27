import {React,useState,useEffect} from 'react'
import { useNavigate } from 'react-router';
const Right = ({item}) => {
    const [price,setPrice]= useState(0);

    const navigate=useNavigate("");

    useEffect(()=>{
        totalAmount();
    },[item])

    const totalAmount=()=>{
        let price =0;
        item?item.map((item)=>{
            price=item.price.cost + price
        }):price=0;
        setPrice(price)
    }
    const setOrder=()=>{
        navigate("/oder");
    }
    return (
        <div className="right_buy">
            <img src="https://images-eu.ssl-images-amazon.com/images/G/31/checkout/assets/TM_desktop._CB443006202_.png" alt="rightimg" />
            <div className="cost_right">
                <p>Your order is eligible for FREE Delivery. <br />
                    <span style={{ color: "#565959" }}> Select this option at checkout. Details</span></p>
                <h3>Subtotal ({item?item.length:0} items): <span style={{ fontWeight: "700" }}> ₹{price}.00</span></h3>
                <form action='/create-checkout-session' method='POST'>
                <button className="rightbuy_btn" type='submit' >Checkout</button>
                </form>
            </div>
        </div>
    )
}

export default Right
