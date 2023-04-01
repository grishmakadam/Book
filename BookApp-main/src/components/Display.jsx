import React from 'react'
import { Typography,Button, Grid} from '@mui/material'
import { useNavigate } from 'react-router-dom'

const Display = () => {
    const navigate=useNavigate()

    const goBack=()=>{
        navigate("/user/login")
    }
  return (
    <Grid display={"flex"} justifyContent="center" alignItems="center" flexDirection={"column"}>
    <Typography variant='h4'>Verification mail has been sent to registered mail</Typography>
    <Button onClick={goBack}>Go Back </Button>
    </Grid >
  )
}

export default Display