import React, { useEffect, useState } from 'react'
import { Divider } from '@mui/material';
import Option from "./Option"
import Subtotal from './Subtotal';
import Right from './Right';
import Empty from './Empty';
import "./cart.css"
function Cart() {

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

    return (
        <>
            {
                
                cartData.length ? <div className="cart_section">
                <div className="cart_container">
                    <div className="left_buy">
                        <h1>Shopping Cart</h1>
                        <p>Select all items</p>
                        <span className="leftbuyprice">Price</span>
                        <Divider />

                        {
                            cartData.map((e,k)=>{
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
                                                <Option deletedata={e.id} get={getCartData} />
                                            </div>
                                            <h3 className="item_price">₹{e.price.cost}</h3>
                                            <Divider />
                                        </div>
                                    </>
                                )
                            })
                        }
                            
                                        
                        <Subtotal item={cartData} />
                    </div>
                    <Right item={cartData}/>
                </div>
            </div>: <Empty/>
            }
                 
        </>
    )
}

export default Cart
