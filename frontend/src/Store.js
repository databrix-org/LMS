import { legacy_createStore, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
import MainReducer from "./reducer/MainReducer";

const initialState = {};

const middleware = [thunk];

let composedEnhancer = applyMiddleware(...middleware);

// Only add the devtools enhancer in development mode
if (process.env.NODE_ENV !== 'production') {
  const { composeWithDevTools } = require('@redux-devtools/extension');
  composedEnhancer = composeWithDevTools(composedEnhancer);
}

const Store = legacy_createStore(
    MainReducer,
    initialState,
    composedEnhancer
);

export default Store;