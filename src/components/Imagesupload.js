import { useState,useEffect } from "react"
import {storage} from '../firebaseconfig'
import {ref, getDownloadURL,listAll, uploadBytesResumable} from 'firebase/storage'
import Imagecss from './image.module.css'
import Imageholder from '../images/empty.jpg'
const Imagesupload = () => {
    const [images,setImages] = useState([])
    const [list,setList] = useState([])
    const [progress,setProgress] = useState(0)
    const imRef = ref(storage,'images/')
    const handleupload = async ()=>{
        if(images.length === 0) return
        
        images.map(image=>{
            const imageRef = ref(storage,`images/${image.name + new Date().getTime()}`)
            const uploadTask = uploadBytesResumable(imageRef,image)
            uploadTask.on('state_changed',(snapshot)=>{
                const progress = Math.round((snapshot.bytesTransferred/snapshot.totalBytes) * 100)
                setProgress(progress)
            }, (error) =>{
                alert(error)
            },()=>{
                getDownloadURL(uploadTask.snapshot.ref).then(url=>{
                setList(pre=>[...pre,url])
            })
            })
        })
        setImages([])
    }
    function uploadfile(){
        document.getElementById("selectfile").click()
    }
    const sel = (e)=>{
        for( let i=0;i<e.target.files.length;i++){
            const newImage = e.target.files[i]
            setImages(pre=>[...pre,newImage])
        }
    }
    const effect = async ()=>{ 
     const res= await listAll(imRef)
      res.items.map(i=>{
        getDownloadURL(i).then(url=>
             setList(pre=>[...pre,url]))
      })
    }
    useEffect(() => {
        
      effect()
    }, [])
    return (
        <div>
            <div className={Imagecss.imageupload}>
                <div className={Imagecss.outer}>
                <div className={Imagecss.outer} style={{width:`${progress}%`, backgroundColor:"salmon"}}></div>
                </div>
                <p>{progress}%</p>
                <input id="selectfile" type="file" style={{display:'none'}} multiple onChange={sel} />
                <div className={Imagecss.button}>
                    <button onClick={uploadfile} style={{width:"20rem", height:'20rem'}}>
                    <img src={Imageholder} style={{height:'100%', width:'100%'}} alt="" />
                    </button>
                    <button style={{width:"20rem", height:'4rem', marginTop:'.5rem'}} onClick={handleupload}>upload</button>
                </div>
            </div>
            
           
            <div className={Imagecss.image}>
                {
                    list.map((i,index)=>{
                        return (
                        <div key={index} className={Imagecss.imagediv}>
                            <img src={i} alt="" />
                        </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Imagesupload
