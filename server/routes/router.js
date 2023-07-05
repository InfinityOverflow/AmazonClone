const express = require('express');
const router = new express.Router();
const Products=require("../models/productSchema");
const USER = require("../models/userSchema");
const bcrypt = require('bcryptjs');
const authenticate = require('../middleware/authenticate');


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
    //   console.log(productData + "The END");
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

            // yaha pe hashing krenge

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

// item remove ho rhi hain lekin api delete use krna batter hoga
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



module.exports= router;