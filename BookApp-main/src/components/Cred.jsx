import React, { useState, useEffect } from 'react'
import { Box } from '@mui/system'
import { TextField } from '@mui/material'
import { Typography } from '@mui/material'
import { useParams,useNavigate } from 'react-router-dom'
import { Button } from '@mui/material'
import { Snackbar } from '@mui/material';
import {Alert} from '@mui/material'
import useLogin from '../hooks/useLogin'
import useSignup from '../hooks/useSignup'

const Cred = () => {
    const [open, setOpen] = React.useState(false);

  const navigate=useNavigate()
  
    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
  
      setOpen(false);
    };
    const [type, setType] = useState('signup')
    const [valid, setValid] = useState(true)

    const [error, setError] = useState()
    const [loading, setLoading] = useState()

    const { signup, error: signerror, loading: signloading } = useSignup()
    const { login, error: lerror, loading: lLoading } = useLogin()
    const { id } = useParams()

    const [data, setData] = useState({
        name:"",
        email: "",
        password: ''
    })

    const onChangeData = (e) => {
        setData(prevData => ({
            ...prevData,
            [e.target.name]: e.target.value
        }))
    }

    useEffect(() => {

        if(id!=type){
            if (id == 'login') {
                setType('login')
               
            }
            else{
                setType('signup')
            }
            setData({
                name:"",
                email: "",
                password: ''
            })
        }
        else{
        if (id == 'login') {
            setType('login')
            setError(lerror)
            setLoading(lLoading)
        }
        else {
            setType('signup')
            setData(prevData => ({
                ...prevData, confirm: ""
            }))

            setError(signerror)
           if(signerror){
            setData(prevData => ({
                ...prevData,password:"", confirm: ""
            }))
           }
            setLoading(signloading)
        }
        if(signerror || lerror){
            setOpen(true)
        }
    }
        console.log(error)
    }, [id,signerror,lerror]);


    const submitHandler = async (e) => {
        e.preventDefault()
        if (type === 'signup') {
            if (data.password !== data.confirm) {
                setValid(false)
               
                return
            }
            await signup(data)
        }
        else {
            await login(data)
        }
    }


    const handleType=()=>{
        if(type=="signup"){
            navigate('/user/login')
        }
        else{
            navigate("/user/signup")
        }
    }

    return (
        <div>

           
                <Box display={"flex"} flexDirection={"column"} maxWidth={400} alignItems="center" justifyContent="center" margin="auto" marginTop={3} marginBottom={3} padding={4} minHeight={500}
                    boxShadow="2px 2px 3px #cccccc" borderRadius={2}
                    sx={{
                        ":hover": {
                            boxShadow: "10px 10px 10px #cccccc"
                        }, height: '400px'
                    }}>
                         <form onSubmit={submitHandler}>
                    <Typography style={{ fontSize: "20px", color: "#0047AB" }}>{type == 'login' ? 'Login' : 'Signup'}</Typography>
                    {type == 'signup' && <TextField variant="outlined" label='User Name' type="text" fullWidth margin='normal' value={data.name} name="name" onChange={onChangeData} />}
                    <TextField variant="outlined" label='Email' type="email" fullWidth margin='normal' value={data.email} name="email" onChange={onChangeData} />
                    <TextField variant="outlined" label='Password' type="password" fullWidth margin='normal' value={data.password} name="password" onChange={onChangeData} />
                    {type == 'signup' && <TextField variant="outlined" label='Confirm Password' type="password" fullWidth margin='normal' value={data.confirm} name="confirm" onChange={onChangeData} error={!valid} helperText={!valid && "Password did not match"} />}
                    <Button type="submit" disabled={loading} fullWidth style={{ marginTop: '20px', padding: '10px' }} variant='contained'>{type == 'signup' ? 'Submit' : 'LogIn'}</Button>
                    </form>
                    <Typography>OR</Typography>
                    <Button  disabled={loading} type="button"  fullWidth style={{ marginTop: '20px', padding: '10px' }} variant='contained' onClick={handleType}>{type != 'signup' ? 'SignUp' : 'LogIn'}</Button>

                </Box>

           
            {error && <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
  <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
    
       {error}
  </Alert>
</Snackbar>}
        </div>
    )
}

export default Cred
