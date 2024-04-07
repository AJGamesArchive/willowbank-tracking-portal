import './Journey.css';

// Import primereact features

// Declare parameter types for Journey
interface IJourney {
    level: number;
    experience: number;
    badges: number;
}

const Journey : React.FC<IJourney> = ({level, experience, badges}) => {
    return <>
        <p>Current level: <b>{level.toString(10)}</b></p>
        <p>Current experience: <b>{experience.toString(10)}</b></p>
        <p>Badges earned: <b>{badges.toString(10)}</b></p>
    </> 
}

export default Journey;