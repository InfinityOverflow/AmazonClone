import { colors } from '@mui/material'
import React from 'react'
import Carousel from 'react-material-ui-carousel'
import "./banner.css"
const data =[
  "https://rukminim1.flixcart.com/flap/1680/280/image/1defb861e409319b.jpg?q=50",
  " https://rukminim1.flixcart.com/flap/1680/280/image/685712c6cefb3c02.jpg?q=50",
  "https://rukminim1.flixcart.com/flap/1680/280/image/8d4150cc4f3f967d.jpg?q=50",
  "https://rukminim1.flixcart.com/flap/1680/280/image/685712c6cefb3c02.jpg?q=50"
]
const banner = () => {
  return (
    <Carousel className='cara' autoPlay={true} animation='slide' indicators={false} cycleNavigation={true} navButtonsAlwaysVisible={true} navButtonsProps={{
      style :{
        backgroundColor:"#fff",
        color:"#494949",
        borderRadius:0,
        marginTop:-22,
        height:"104px"
      }
    }}>
       {
          data.map((imag ,i)=>{
            return (
              <>
                 <img src={imag} key={i} className='banner_img'/>
              </>
            )
          })
       }
    </Carousel>
  )
}

export default banner
