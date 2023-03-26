import React ,{useState,useContext,useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import './avatar.css'
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { IconButton } from '@mui/material';
import { makeStyles } from "@mui/styles";
import CropImage from '../CropImage';
import axios from 'axios';
import { AuthContext } from '../../store/authContext';
import Modal from '@mui/material/Modal';
import Avatar from '@mui/material/Avatar';

const useStyles=makeStyles((theme)=>({
    root:{
        display:"flex"
    },
    paper:{
        marginRight:"2px"
    },
    cameraIcon: {
		height: "3rem",
		width: "3rem",
		position:"absolute  ! important",
		bottom: "0",
		left: "140px",
		backgroundColor: "#e6e6e6 ! important",
		"&:hover": {
			backgroundColor: "white",
		}
	}
}))

const ProfilePic=({setPopper})=>{
    const {user,dispatch}=useContext(AuthContext)
    const classes=useStyles()
    const [open, setOpen] = React.useState(false);

    const [cropper,setCropper]=React.useState(false)
    const anchorRef = React.useRef(null);
    const [image,setImage]=useState(null)
    const navigate = useNavigate()

    useEffect(()=>{
        if(user!=null){
        setImage(user.image)
        }
    },[user])

    const handleCropper=()=>{
       setCropper(prevValue=>!prevValue)
    }
    const handleToggle = () => {
      
      setOpen((prevOpen) => !prevOpen);
    
    };
  
    const handleClose = (event) => {
      if (anchorRef.current && anchorRef.current.contains(event.target)) {
        return;
      }
   
      setOpen(false);
    };
  

    const upload=async(image)=>{
        console.log(image)
        try{
            const res=await axios.patch("http://localhost:8000/user/profilepic",{image},
            {headers: {
              'Authorization': `Bearer ${user.token}`
            }
          })
           
       if(res.status==200){
        dispatch({type:'IMAGE',payload:res.data.image})
        navigate('/')
       }
        }catch(e){
            console.log(e)

      }
    }


    function handleListKeyDown(event) {
      if (event.key === 'Tab') {
        event.preventDefault();
        setOpen(false);
      } else if (event.key === 'Escape') {
        setOpen(false);
      }
    }
  
    // return focus to the button when we transitioned from !open -> open
    const prevOpen = React.useRef(open);
    React.useEffect(() => {
      if (prevOpen.current === true && open === false) {
        anchorRef.current.focus();
      }
      setPopper()
      prevOpen.current = open;
    }, [open]);
  
return(
    <>
    <>
        <div className='avatar'>
            <Avatar src={image} alt={user.name[0].toUpperCase()} className='avatar-img'/>
        </div>
        <IconButton
        className={classes.cameraIcon}
          ref={anchorRef}
          id="composition-button"
          aria-controls={open ? 'composition-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
        >
          <CameraAltIcon/>
        </IconButton>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          placement="bottom-start"
          transition
    
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === 'bottom-start' ? 'left top' : 'left bottom',
              }}
            >
              <Paper      >
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={open}
                    id="composition-menu"
                    aria-labelledby="composition-button"
                    onKeyDown={handleListKeyDown}
                  >
                    <MenuItem onClick={(e)=>{handleCropper(); handleClose(e)}}>Change</MenuItem>
                    <MenuItem onClick={()=>{upload(null)}}>Remove</MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      
    </>
      {
      <Modal   open={cropper}
      onClose={handleCropper}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"> 
      <div>
      <CropImage handleCrop={handleCropper} onupload={upload}/>

      </div>
      </Modal>
    }
      </>
)
}

export default ProfilePic