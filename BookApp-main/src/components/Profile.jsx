import { Button, Grid, TextField, Typography } from '@mui/material'
import React from 'react'
import { useContext, useState } from 'react'
import axios from 'axios'
import { AuthContext } from '../store/authContext'
import { Box } from '@mui/material'
import ProfilePic from './avatar/ProfilePic'
import Modal from '@mui/material/Modal';
import './avatar/avatar.css'
import {Alert} from '@mui/material'


const Profile = () => {

  const { user } = useContext(AuthContext)
  const [open, setOpen] = React.useState(false);
  const [popper, setPopper] = useState(false)
  const handleOpen = () => {
    setOpen(true);
  }
  const handleClose = () => setOpen(false);
 
  const [image, setImage] = useState({ myFile: "" })
  const [oldPassword,setOldPassword]=useState("")
  const [newPassword,setNewPassword]=useState("")
  const [confirm,setConfirm]=useState("")
  const [message, setMessage] = useState(null)
  const [valid, setValid] = useState({
    oldP: true,
    newP: true,
    confirmP: true
  })

  const handleSubmit = async (e) => {
    e.preventDefault()

    if(oldPassword===""){
      setValid(prevValid=>({...prevValid,oldP:false}))
      return 
    }
    else if(oldPassword!==""){
      setValid(prevValid=>({...prevValid,oldP:true}))
    }
    if(newPassword===""){
      setValid(prevValid=>({...prevValid,newP:false}))
      return 
    }

    else if(newPassword!==""){
      setValid(prevValid=>({...prevValid,newP:true}))
    }
    if(confirm===""){
      setValid(prevValid=>({...prevValid,confirmP:false}))
      return 
    }
    else if(confirm!==""){
      setValid(prevValid=>({...prevValid,confirmP:true}))
    }

    try {
      const res = await axios.post("http://localhost:8000/user/changepassword", { oldPassword,newPassword},
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type':'application/json'
          }
        })
        console.log(res)
        if(res.status==200){
          setMessage(res.data.message)
          setOpen(prevOpen=>!prevOpen)
          alert(message)
        }
        else{
          setMessage(res.data.error)
        
          alert(message)
        }

     
    } catch (e) {
       setMessage(e.response.data.error)
       alert(message)
    }
  }


 

  const handlePopper = () => {
    setPopper(pop => !pop)
  }

  return (
    <Grid container justifyContent="space-around" m>
      <Grid item xs={12} md={4} style={{ boxShadow: "2px 2px 3px #cccccc", marginBottom: "20px" }} borderRadius={2} p={2}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: 'center' }} className="avatar-container">

          <ProfilePic setPopper={handlePopper} />
        </div>
        <div style={{ display: "flex", justifyContent: "center", flexDirection: "column", paddingTop: "20px" }}>
          <Typography> {user.name}</Typography>
          <Typography>{user.email}</Typography>
        </div>


        <Button className={popper ? "popper" : "npopper"} onClick={handleOpen}>Change Password</Button>
      </Grid>
      <Grid item xs={12} md={6} style={{ border: "1px solid red", marginBottom: "20px" }}>

      </Grid>
     
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}>
          <form onSubmit={handleSubmit}>
            <Typography>Change Password</Typography>
            <TextField  fullWidth margin='normal' type="password" value={oldPassword} onChange={(e)=>setOldPassword(e.target.value)} label="Current Password"  error={!valid.oldP} helperText={!valid.oldP && "Please enter current password"} />
            <TextField type="password" fullWidth margin='normal' label="New Password" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} error={!valid.newP} helperText={!valid.newP && "Please enter new password"}/>
            <TextField type="password" fullWidth margin='normal' label="Confirm New Password" value={confirm} onChange={(e)=>setConfirm(e.target.value)} error={!valid.confirmP} helperText={!valid.confirmP && "Please confirm new password"}/>
            <Button variant="contained" fullWidth type="submit">Change</Button>
          </form>
        </Box>
      </Modal>
    </Grid>
  )
}

export default Profile

