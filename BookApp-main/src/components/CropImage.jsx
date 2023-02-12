import React, { useRef, useState } from 'react'
import "../App.css"
import { Button } from '@mui/material'
import Cropper from 'react-easy-crop'
import { Slider } from '@mui/material'
import { generateDownload } from './utils/cropImage'
import CancelIcon from '@mui/icons-material/Cancel';
import { IconButton } from '@mui/material'
import { makeStyles } from "@mui/styles";
import getCroppedImg from './utils/cropImage'

const useStyles=makeStyles({
    iconButton:{
        position:'absolute !important',
        top:'20px',
        right:'20px',
        zIndex:"1"
       
    },
    cancelIcon:{
        color:'#3f51b5',
        fontSize:'50px',
        '&:hover':{
            color:'red'
        }
    },
    button:{
        margin:"0 20px"
    }
})
const CropImage = ({handleCrop,onupload}) => {
    const classes=useStyles()
    const inputRef = useRef()

    const openClick = () => {
        inputRef.current.click()
    }
    

    const [image, setImage] = useState(null)
    const [cropArea, setCropArea] = useState(null)
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    
    const onCropComplete = (cropAreaPercentage, cropAreaPixel) => {
        setCropArea(cropAreaPixel)
    }

    const onSelectFile = (e) => {
        console.log("hello")
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader()
            reader.readAsDataURL(e.target.files[0])
            reader.addEventListener('load', () => {
                
                console.log(reader)
                setImage(reader.result)
            })
        }

    }

    const onDownload=()=>{
        generateDownload(image,cropArea)
    }

    const onUpload=async()=>{
        const canvas = await getCroppedImg(image, cropArea);
    const canvasDataUrl = canvas.toDataURL("image/jpeg");
    // const convertedUrlToFile = dataURLtoFile(
    //   canvasDataUrl,
    //   "cropped-image.jpeg"
    // );
    console.log(canvasDataUrl)
onupload(canvasDataUrl)
  
    }



    const onClear=()=>{
        setImage(null)
    }

    return (
        <div className="container">
<IconButton  className={classes.iconButton} onClick={handleCrop}>
    <CancelIcon className={classes.cancelIcon}/>
</IconButton>
            <div className='container-cropper'>
                {image ?
                    <><div className='cropper'><Cropper image={image} crop={crop} zoom={zoom} aspect={1} onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={onCropComplete} />
                    </div>
                        <div className='slider'><Slider min={1} max={3} step={0.1} value={zoom} onChange={(e, zoom) => setZoom(zoom)} /></div></> : null
                }
            </div>

            <div className='container-buttons'>
            <input type="file" accept="image/*" ref={inputRef} style={{ display: "none" }} onChange={onSelectFile} />
            <Button variant="contained" color="primary" className={classes.button} onClick={openClick}>Choose</Button>
            <Button variant="contained" color="primary" className={classes.button} onClick={onUpload}>Upload</Button>
            </div>
         
        </div>
    )
}

export default CropImage