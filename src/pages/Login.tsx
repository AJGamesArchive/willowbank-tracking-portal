import reactLogo from '/assets/react.svg';
import viteLogo from '/icons/vite.svg';
import './Login.css';

import Documentation from '../components/Documentation';

const Login: React.FC = () => {
  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <h1>Willowbank Education Tracking Portal</h1>
      <Documentation/>
    </>
  );
};

export default Login;
