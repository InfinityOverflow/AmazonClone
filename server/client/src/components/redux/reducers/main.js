import { getProductsreducer } from "./Productsreducer";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  getProductsData : getProductsreducer
});

export default rootReducer;
