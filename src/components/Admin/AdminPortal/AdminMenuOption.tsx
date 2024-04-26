import './AdminMenuOption.css'
import React from "react";
import { Card } from 'primereact/card'

interface IMenu {
    title : string
    destinationPage : string;
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

const MenuOption : React.FC<IMenu> = ({imageSRC, imageAltText, destinationPage, title}) => {
    return <Card className="menuOption"
        header={<Header 
            altText={imageAltText} 
            src={imageSRC}
        />}
        title={title}
        onClick={() => {window.location.href = destinationPage;}}
    />
}

export default MenuOption;