import { combineReducers } from "redux";
import authenSlice from "../features/authentication/authenSlice";

const rootReducer = combineReducers({
  authenSlice: authenSlice,
});
export default rootReducer;
