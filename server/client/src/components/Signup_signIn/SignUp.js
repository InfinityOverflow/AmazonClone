import React, { useState } from 'react'
import { Divider } from '@mui/material';
import { NavLink } from 'react-router-dom';
import "./sigin.css"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function SignUp() {

    const[udata,setData]=useState({
        name:"",
        email:"",
        mobile:"",
        password:"",
        cpassword:""
    })

    const addData=(e)=>{
        const {name,value}= e.target;
        setData(()=>{
            return {
                ...udata,
                [name]:value
            }
        })
        }

        const sendData=async(e)=>{
            e.preventDefault();

        const { name, email, mobile, password, cpassword } = udata;
        try {
            const res = await fetch("/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name, email, mobile, password, cpassword
                })
            });

            const data = await res.json();
            // console.log(data);

            if (res.status === 422 || !data) {
                toast.error("Invalid Details 👎!", {
                    position: "top-center"
                });
            } else {
                setData({
                    ...udata, name: "", email: "",
                    mobile: "", password: "", cpassword: ""
                });
                toast.success("Registration Successfully done 😃!", {
                    position: "top-center"
                });
            }
        } catch (error) {
            console.log("front end ka catch error hai" + error.message);
        }
        }

    return (
        <section>
            <div className="sign_container">
                <div className="sign_header">
                    <img src="./blacklogoamazon.png" alt="signupimg" />
                </div>
                <div className="sign_form">
                    <form method="POST">
                        <h1>Create account</h1>
                        <div className="form_data">
                            <label htmlFor="name">Your Name</label>
                            <input type="text" name="name"
                                onChange={addData} value={udata.name}
                                id="name" />
                        </div>
                        <div className="form_data">
                            <label htmlFor="email">Email</label>
                            <input type="email" name="email"
                                onChange={addData} value={udata.email}
                                id="email" />
                        </div>
                        <div className="form_data">
                            <label htmlFor="mobile">Mobile Number</label>
                            <input type="number" name="mobile"
                                onChange={addData} value={udata.mobile}
                                id="mobile" />
                        </div>
                        <div className="form_data">
                            <label htmlFor="password">Password</label>
                            <input type="password" name="password"
                                onChange={addData} value={udata.password}
                                id="password" placeholder="At least 6 characters" />
                        </div>
                        <div className="form_data">
                            <label htmlFor="passwordg">Repeat Password</label>
                            <input type="password" name="cpassword"
                                onChange={addData} value={udata.cpassword}
                                id="passwordg" />
                        </div>
                        <button type="submit" className="signin_btn" onClick={sendData}>Continue</button>

                        <Divider />

                        <div className="signin_info">
                            <p>Already have an account?</p>
                            <NavLink to="/login">Sign In</NavLink>
                        </div>
                    </form>
                </div>
                <ToastContainer/>
            </div>
        </section>
    )
}
