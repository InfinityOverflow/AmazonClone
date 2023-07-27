require("dotenv").config();
const express = require('express');
const router = new express.Router();
const Products=require("../models/productSchema");
const USER = require("../models/userSchema");
const bcrypt = require('bcryptjs');
const authenticate = require('../middleware/authenticate');
const stripe = require('stripe')(process.env.STRIPE_PRVT_KEY);


//GET product api
router.get("/getproducts",async(req,res)=>{
    try {
        const AllproductData =await Products.find();
        // console.log("Here is the API call " + productData +" Here is the end to the API call");
        res.status(201).json(AllproductData);
    } catch (error) {
        res.status(400).json(AllproductData)
        console.log(error.message);
    }
})

// GET individual product api

router.get("/buyProduct/:id", async (req, res) => {
    try {
      const { id } = req.params;
  
      const productData = await Products.findOne({ id: id });
      console.log(productData + "The END");
      res.status(201).json(productData);
    } catch (error) {
      res.status(400).json(productData)
      console.log(error.message);
    }
  });

  // POST register USER details
  router.post("/register", async (req, res) => {
    // console.log(req.body);
    const { name, email, mobile, password, cpassword } = req.body;

    if (!name || !email || !mobile || !password || !cpassword) {
        res.status(422).json({ error: "filll the all details" });
        console.log("Fill all data entrys");
    };

    try {

        const preuser = await USER.findOne({ email: email });

        if (preuser) {
            res.status(422).json({ error: "This email already exist" });
        } else if (password !== cpassword) {
            res.status(422).json({ error: "password are not matching" });;
        } else {

            const finaluser = new USER({
                name, email, mobile, password, cpassword
            });


            const storedata = await finaluser.save();
            // console.log(storedata + "user successfully added");
            res.status(201).json(storedata);
        }

    } catch (error) {
        console.log("error the bhai catch ma for registratoin time" + error.message);
        res.status(422).send(error);
    }

});

// login data
router.post("/login", async (req, res) => {
    // console.log(req.body);
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ error: "fill the details" });
    }

    try {

        const userlogin = await USER.findOne({ email: email });
        //console.log(userlogin);
        if (userlogin) {
            const isMatch = await bcrypt.compare(password, userlogin.password);
            //console.log(isMatch);
            if (!isMatch) {
                res.status(400).json({ error: "invalid crediential pass" });
            } else {
                
                const token = await userlogin.generatAuthtoken();
                //console.log(token);

                res.cookie("eccomerce", token, {
                    expires: new Date(Date.now() + 2589000),
                    httpOnly: true
                });
                res.status(201).json(userlogin);
            }

        } else {
            res.status(400).json({ error: "user not exist" });
        }

    } catch (error) {
        res.status(400).json({ error: "invalid crediential pass" });
        console.log("error the bhai catch ma for login time" + error.message);
    }
});

// adding the data into cart
router.post("/addcart/:id", authenticate, async (req, res) => {

    try {
        console.log("perfect 6................");
        const { id } = req.params;
        const product = await Products.findOne({ id: id });
        console.log(product + "Product to be added");

        const Usercontact = await USER.findOne({ _id: req.userID });
        console.log(Usercontact + "user milta hain");


        if (Usercontact) {
            const cartData = await Usercontact.addcartdata(product);

            await Usercontact.save();
            console.log(cartData + " thse save wait kr");
            console.log(Usercontact + "userjode save");
            res.status(201).json(Usercontact);
        }
        else {
            res.status(401).json({error:"invalid user"});
        }
    } catch (error) {
        console.log(error);
    }
});


// get data into the cart
router.get("/cartdetails", authenticate, async (req, res) => {
    try {
        const buyuser = await USER.findOne({ _id: req.userID });
        //console.log(buyuser + "user hain buy pr");
        res.status(201).json(buyuser);
    } catch (error) {
        console.log(error + "error for buy now");
    }
});



// get user is login or not
router.get("/validuser", authenticate, async (req, res) => {
    try {
        const validuserone = await USER.findOne({ _id: req.userID });
        console.log(validuserone + "user hain home k header main pr");
        res.status(201).json(validuserone);
    } catch (error) {
        console.log(error + "error for valid user");
    }
});

// for userlogout

router.get("/logout", authenticate, async (req, res) => {
    try {
        req.rootUser.tokens = req.rootUser.tokens.filter((curelem) => {
            return curelem.token !== req.token
        });

        res.clearCookie("eccomerce", { path: "/" });
        req.rootUser.save();
        res.status(201).json(req.rootUser.tokens);
        console.log("user logout");

    } catch (error) {
        console.log(error + "jwt provide then logout");
    }
});


// remove item from the cart

router.get("/remove/:id", authenticate, async (req, res) => {
    try {
        const { id } = req.params;

        req.rootUser.carts = req.rootUser.carts.filter((elem) => {
            return elem.id != id
        });

        req.rootUser.save();
        res.status(201).json(req.rootUser);
        //console.log("iteam remove");

    } catch (error) {
        // console.log(error + "jwt provide then remove");
        res.status(400).json(error);
    }
});

//Paymet API
// /create-checkout-session
// router.post('/create-checkout-session',authenticate,async(req,res)=>{
//     try {
//         const session = await stripe.checkout.sessions.create({
//             line_items:  await req.rootUser.carts.map(async(obj)=>{
//                 let ProductData;
//                 const getProductData=  async () => {
//                     const res = await fetch(`http://localhost:8005/buyProduct/${obj.id}`, {
//                       method: "GET",
//                       headers: {
//                         Accept: "application/json",
//                         "Content-Type": "application/json",
//                       },
//                       credentials: "include",
//                     });
//                     const data = await res.json();
//                     console.log("Helooo Pls exuces me ");
//                     console.log(data);
//                     if (res.status !== 201) {
//                     //   alert("no data available");
//                     console.log("ERoRRRR")
//                     } else {
//                         ProductData=data;
//                         return data;
//                       // console.log("ind mila hain");
//                     //   setIndedata(data);
//                     }
//                   }
//                   const Call= await getProductData();
//                   console.log("AYUSH IS HERE   ")
//                   console.log(ProductData)
//                   return{
//                     price_data:{
//                         currency:"inr",
//                         product_data: {
//                             name: ProductData.name,
//                         },
//                         unit_amount: ProductData.price.cost,
//                     },
//                     quantity: 1
//                   }
                  
//             }) /*[
//               {
//                 // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
//                 // price: '{{req.rootUser.carts}}',
//                 // quantity: 1,
//               },
//             ]*/,
//             mode: 'payment',
//             success_url: `http://localhost:3000/order?success=true`,
//             cancel_url: `http://localhost:3000/order?canceled=true`,
//           });
//           res.json({ url: session.url })
        
//     } catch (error) {
//         res.status(500).json({ error: error.message })
//         console.log(error.message);
//     }
// })
// router.post('/create-checkout-session', authenticate, async (req, res) => {
//     try {
//       const lineItems = await Promise.all(
//         req.rootUser.carts.map(async (obj) => {
//           let ProductData;
//           const getProductData = async () => {
//             try {
//               const res = await fetch(`http://localhost:8005/buyProduct/${obj.id}`, {
//                 method: "GET",
//                 headers: {
//                   Accept: "application/json",
//                   "Content-Type": "application/json",
//                 },
//                 credentials: "include",
//               });
//               const data = await res.json();
//               console.log("Hello, please excuse me:");
//               console.log(data);
//               if (res.status !== 201) {
//                 console.log("Error fetching product data");
//                 return null;
//               } else {
//                 ProductData = data;
//                 return data;
//               }
//             } catch (error) {
//               console.log("Error fetching product data:", error.message);
//               return null;
//             }
//           };
  
//           const Call = await getProductData();
//           console.log("AYUSH IS HERE:");
//           console.log(ProductData);
//           return {
//             price_data: {
//               currency: "inr",
//               product_data: {
//                 name: ProductData.name
//               },
//               unit_amount: ProductData.price.cost,
//             },
//             quantity: 1,
//           };
//         })
//       );
  
//       const session = await stripe.checkout.sessions.create({
//         line_items: lineItems,
//         mode: "payment",
//         success_url: "http://localhost:3000/order?success=true",
//         cancel_url: "http://localhost:3000/order?canceled=true",
//       });
  
//       res.json({ url: session.url });
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//       console.log(error.message);
//     }
//   });
router.post('/create-checkout-session', authenticate, async (req, res) => {
    try {
      const lineItems = await Promise.all(
        req.rootUser.carts.map(async (obj) => {
          let productData;
          const getProductData = async () => {
            try {
              const res = await fetch(`http://localhost:8005/buyProduct/${obj.id}`, {
                method: "GET",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                credentials: "include",
              });
              const data = await res.json();
              console.log("Hello, please excuse me:");
              console.log(data);
              if (res.status !== 201) {
                console.log("Error fetching product data");
                return null;
              } else {
                productData = data;
                return data;
              }
            } catch (error) {
              console.log("Error fetching product data:", error.message);
              return null;
            }
          };
  
          const call = await getProductData();
          console.log("AYUSH IS HERE:");
          console.log(productData);
          return {
             price: productData.price.cost,
             quantity:1
          };
        })
      );
  
      const session = await stripe.checkout.sessions.create({
        line_items: lineItems,
        mode: "payment",
        success_url: "http://localhost:3000/order?success=true",
        cancel_url: "http://localhost:3000/order?canceled=true",
      });
  
      res.json({ url: session.url });
    } catch (error) {
      res.status(500).json({ error: error.message });
      console.log(error.message);
    }
  });
  
  

module.exports= router;