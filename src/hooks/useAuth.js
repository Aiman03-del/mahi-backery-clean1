import { useContext } from "react";
import AuthContext from "../provider/AuthContext";
const useAuth = () => useContext(AuthContext);

export default useAuth;
