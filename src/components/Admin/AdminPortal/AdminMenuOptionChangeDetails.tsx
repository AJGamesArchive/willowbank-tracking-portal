import './AdminMenuOption.css'
import React from "react";
import { Card } from 'primereact/card'

interface IMenu {
    title : string
    imageSRC : string;
    imageAltText : string;
}

interface IHeader {
    altText : string;
    src : string;
}

const Header : React.FC<IHeader> = ({altText, src}) => {
    return <img className='image' alt={altText} src={src}/>
}

const ModifyOption : React.FC<IMenu> = ({imageSRC, imageAltText, title}) => {
    return <Card className="menuOption"
        header={ <Header altText={imageAltText} src={imageSRC} /> }
        title={title}
    />
}

export default ModifyOption;