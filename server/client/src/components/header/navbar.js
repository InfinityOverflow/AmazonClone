import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { ToastContainer, toast } from "react-toastify";
import LogoutIcon from "@mui/icons-material/Logout";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import { Drawer, IconButton, List, ListItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Rightheader from "./Rightheader";
import { getProducts } from "../redux/action/action";
import { useSelector, useDispatch } from "react-redux";
import { React, useContext, useState, useEffect } from "react";
import "./navbar.css";
import SearchIcon from "@mui/icons-material/Search";
import Badge from "@mui/material/Badge";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Avatar from "@mui/material/Avatar";
import { NavLink } from "react-router-dom";
import { Logincontext } from "../context/ContextProvider";

const usestyle = makeStyles({
  component: {
    marginTop: 10,
    marginRight: "-50px",
    width: "300px",
    padding: 50,
    height: "300px",
  },
});

const Navbar = () => {
  const classes = usestyle();

  const history = useNavigate();

  const [text, setText] = useState("");
  // only for search
  const { products } = useSelector(state => state.getProductsData);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const [open, setOpen] = useState(false);
  const [liopen, setLiopen] = useState(true);

  const [dropen, setDropen] = useState(false);

  // const handleClick = (event) => {
  //     setOpen(event.currentTarget);
  // };
  // const handleClose = () => {
  //     setOpen(false)
  // };

  const { account, setAccount } = useContext(Logincontext);

  const [anchorEl, setAnchorEl] = useState(null);
  const Open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const getdetailsvaliduser = async () => {
    const res = await fetch("/validuser", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data = await res.json();
    // console.log(data);

    if (res.status !== 201) {
      console.log("first login");
    } else {
      // console.log("cart add ho gya hain");
      setAccount(data);
    }
  };

  useEffect(() => {
    getdetailsvaliduser();
  }, []);

  // for logout
  const logoutuser = async () => {
    const res2 = await fetch("/logout", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data2 = await res2.json();
    // console.log(data2);

    if (!res2.status === 201) {
      const error = new Error(res2.error);
      throw error;
    } else {
      history("/");

      toast.success("user Logout 😃!", {
        position: "top-center",
      });
      setAccount(false);
      setOpen(false);
    }
  };

  // for drawer

  const handelopen = () => {
    setDropen(true);
  };

  const handleClosedr = () => {
    setDropen(false);
  };

  const getText = (text) => {
    setText(text);
    setLiopen(false);
  };

  return (
    <header>
      <nav>
        <div className="left">
          <IconButton className="hamburgur" onClick={handelopen}>
            <MenuIcon style={{ color: "#fff" }} />
          </IconButton>

          <Drawer open={dropen} onClose={handleClosedr}>
            <Rightheader logclose={handleClosedr} userlog={logoutuser}/>
          </Drawer>
          <div className="navlogo">
            <NavLink to="/">
              <img src="./Amazon_logo.png" alt="" />
            </NavLink>
          </div>
          <div className="nav_searchbaar">
            <input type="text" name="" 
            onChange={(e)=>getText(e.target.value)}
            placeholder="Search Products"
            id="" />
            <div className="search_icon">
              <SearchIcon id="search" />
            </div>
            {
              text &&
              <List className="extrasearch" hidden={liopen}>
                  {
                      products.filter(product => product.title.longTitle.toLowerCase().includes(text.toLowerCase())).map(product => (
                          <ListItem>
                              <NavLink to={`/buyProduct/${product.id}`} onClick={() => setLiopen(true)}>
                                  {product.title.longTitle}
                              </NavLink>
                          </ListItem>
                      ))
                  }
              </List>
            }
          </div>
        </div>
        <div className="right">
          <div className="nav_btn">
            <NavLink to="/login">Sign In</NavLink>
          </div>
          {account ? (
            <NavLink to="/cart">
              <div className="cart_btn">
                <Badge
                  badgeContent={account.carts?.length || 0}
                  color="primary"
                >
                  <ShoppingCartIcon id="icon" />
                </Badge>
                <p>Cart</p>
              </div>
            </NavLink>
          ) : (
            <NavLink to="/login">
              <div className="cart_btn">
                <Badge badgeContent={0} color="primary">
                  <ShoppingCartIcon id="icon" />
                </Badge>
                <p>Cart</p>
              </div>
            </NavLink>
          )}
          <ToastContainer />
          {account ? (
            <Avatar
              id="demo-positioned-button"
              aria-controls={Open ? "demo-positioned-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={Open ? "true" : undefined}
              onClick={handleClick}
              className="avatar2"
              title={account.name.toUpperCase()}
            >
              {account.name[0].toUpperCase()}
            </Avatar>
          ) : (
            <Avatar
              className="avatar"
              id="demo-positioned-button"
              aria-controls={Open ? "demo-positioned-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={Open ? "true" : undefined}
              onClick={handleClick}
            />
          )}

          <div>
            <Menu
              id="demo-positioned-menu"
              aria-labelledby="demo-positioned-button"
              anchorEl={/*anchorEl*/ 1}
              open={Open}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              {/*<MenuItem onClick={handleClose}>Profile</MenuItem>*/}
              <MenuItem onClick={handleClose}>My account</MenuItem>
              <MenuItem onClick={logoutuser}>
                <LogoutIcon style={{ fontSize: 16, marginRight: 3 }} /> Logout
              </MenuItem>
            </Menu>
          </div>
        </div>
      </nav>
    </header>
  );
};
export default Navbar;
