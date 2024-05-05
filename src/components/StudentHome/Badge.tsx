import './Badge.css';

// Import primereact features
import { Card } from "primereact/card"
import { Image } from 'primereact/image';

// Import functions
import { generateBadgeSVG } from '../../functions/Badges/GenerateBadgeSVG';

// Import types
import { BadgeData } from '../../types/Global/Badges';

// Declare parameter types for Badge
interface BadgeProps {
  badge: BadgeData;
  id: number;
}

// React function to render the badge cards for the student portal page
const Badge : React.FC<BadgeProps> = ({badge, id}) => {
  // Define the badge card header template
  const badgeHeader = (
    <div style={{backgroundColor: `#${badge.colour}`}}>
      <img style={{ width: '100%', filter:`brightness(${(badge.textColour === "Black") ? 0 : 100})`}} src={`/assets/program-images/${badge.awardedProgram.replace(/\s/g, "").toLowerCase()}.png`} alt='Program image'/>
    </div>
  );

  // Returning core JSX
  return (
    <Card className="student-badge" header={badgeHeader} key={id}>
      <div className="content">
        <h2 style={{textAlign: 'center'}}>{`${badge.awardedProgram} Badge LvL ${badge.level}`}</h2>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px' }}>
          <div className="leftContent">
            <p><b>Awarded For:</b></p>
            <p>{badge.awardedFor}</p>
            <p><b>Date Awarded:</b></p>
            <p>{badge.dateAwarded}</p>
          </div>
          <div className="rightContent">
            <Image src={generateBadgeSVG(badge.shape, badge.colour, badge.textColour, String(badge.level))}/>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Badge;