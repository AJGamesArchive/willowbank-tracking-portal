import React from 'react';
import './Banner.css'

interface IBanner {
    backgroundimage : string;
    text : string
}

const Banner : React.FC<IBanner> = ({backgroundimage, text}) => {
    return <div className="banner">
        <img 
            className='bannerimage'
            src={backgroundimage} 
            alt="Banner image"
        />
        <div className="text">
            <h1>{text}</h1>
        </div>
    </div>
}

export default Banner;