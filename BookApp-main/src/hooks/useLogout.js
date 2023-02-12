import { AuthContext } from "../store/authContext";
import { dataAction } from "../store/data";
import { useDispatch } from "react-redux";
import { useContext } from "react";
const useLogout=()=>{
    const {dispatch}=useContext(AuthContext)
    const dispatchLogout=useDispatch()

    const logout=()=>{
        localStorage.removeItem('user')
        dispatch({type:'LOGOUT'})
        dispatchLogout(dataAction.clearData())
    }

return {logout}
}

export default useLogout