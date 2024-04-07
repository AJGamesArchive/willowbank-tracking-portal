// Import core functions
import { Divider } from 'primereact/divider';

// Import CSS
import './HomeDesktop.css';
import './HomeGlobal.css';

// Import core UI components
// ---

// Import UI components
import Badge from '../../components/StudentHome/Badge';
import Journey from '../../components/StudentHome/Journey';

const HomeDesktop: React.FC = () => {
    return (
      <>
      <h1>Welcome (name)</h1>
      <h2>My Journey</h2>
      <Journey level={5} experience={10} badges={3}></Journey>
      <Divider />
      <h2>My Badges</h2>
      <Badge title="Badge 1" description="This badge is awarded for xyz" iconURL="./../../public/assets/placeholder-badges/pink.jpg"></Badge>
      <Badge title="Badge 2" description="This badge is awarded for xyz" iconURL="./../../public/assets/placeholder-badges/blue.jpg"></Badge>
      <Badge title="Badge 3" description="This badge is awarded for xyz" iconURL="./../../public/assets/placeholder-badges/purple.jpg"></Badge>
      <p><u>Load more badges</u> (to be added)</p>
      <Divider/>
      <h2>New section etc.</h2>
      </>
    );
  };
  
  export default HomeDesktop;