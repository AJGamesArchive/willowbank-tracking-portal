import './Documentation.css';

const Documentation: React.FC = () => {
  return (
    <ul className='unordered-list'>
      <li>
        <a target="_blank" rel="noopener noreferrer" href="https://www.typescriptlang.org/docs/">TypeScript</a> - Programming Language
      </li>
      <li>
        <a target="_blank" rel="noopener noreferrer" href="https://primereact.org/button/">Prime React</a> - UI/UX Builder
      </li>
      <li>
        <a target="_blank" rel="noopener noreferrer" href="https://vitejs.dev/guide/">Vite</a> - Build Tool & Development Server
      </li>
      <li>
        <a target="_blank" rel="noopener noreferrer" href="https://react.dev/learn/installation">React</a> - Framework
      </li>
      <li>
        <a target="_blank" rel="noopener noreferrer" href="https://tailwindcss.com/docs/installation/framework-guides">Tailwind CSS</a> - Optional CSS Library
      </li>
    </ul>
  );
};

export default Documentation;
