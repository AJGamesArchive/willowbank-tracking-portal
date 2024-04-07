import './Badge.css';

// Import primereact features
import { Image } from "primereact/image"
import { Card } from "primereact/card"

// Declare parameter types for Badge
interface BadgeProps {
    title:string;
    description:string;
    iconURL:any;
}

const Badge : React.FC<BadgeProps> = ({title, description, iconURL}) => {
    return <Card className="student-badge">
        <div className="image">
            <Image className="icon" src={iconURL} alt="Badge icon" width='70px'/>
        </div>
        <div className="content">
            <h2>{title}</h2>
            <p>{description}</p>
        </div>
        </Card>

}

export default Badge;