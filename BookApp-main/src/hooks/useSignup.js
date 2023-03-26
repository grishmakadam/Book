import axios from 'axios'
import {useState} from 'react'

import { AuthContext } from '../store/authContext'
import { useContext } from 'react'
const useSignup=()=>{
    const [error,setError]=useState()
    const [loading,setLoading]=useState()
    const {dispatch}=useContext(AuthContext)

    const signup=async(data)=>{
        setError(null)
        setLoading(true)
        console.log(data)
        let res
        try{
         res=await axios.post(
            'http://localhost:8000/user/signup',{
                ...data
            },{
                headers:{
                    'Content-Type':'application/json'
                }
            }
        )
       
        localStorage.setItem('user',JSON.stringify(res.data))
        dispatch({type:'LOGIN',payload:{...res.data}})
        }catch(e){
            setError(e.response.data.error)
        }

        
        setLoading(false)
       
      
            

    }
    return {error,signup,loading}

}

export default useSignup