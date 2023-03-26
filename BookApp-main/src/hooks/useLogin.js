import axios from 'axios'
import {useState} from 'react'
import { AuthContext } from '../store/authContext'
import { useContext } from 'react'
const useLogin=()=>{
    const [error,setError]=useState()
    const [loading,setLoading]=useState()
    const {dispatch}=useContext(AuthContext)
    const login=async(data)=>{
        setLoading(true)
        let res
        try{
        res=await axios.post("http://localhost:8000/user/login",{
            ...data
        },{
            headers:{'Content-Type':'application/json'}
        })
        console.log(res)
        localStorage.setItem('user',JSON.stringify(res.data))
        dispatch({type:'LOGIN',payload:{...res.data}})

        }catch(e){

        setError(e.response.data.error)
        console.log(error)
        }

      
        setLoading(false)
    }

return {error,loading,login}
}

export default useLogin