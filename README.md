# Willowbank Education Tracking Portal

Website Development Assessment 2 - Group Development Project

| Name | Contact Email Address |
|:-----|----------------------:|
|Jessica Excell|je398@canterbury.ac.uk|
|Ethan McGuiness|em814@canterbury.ac.uk|
|Trinity Sayer|ts560@canterbury.ac.uk|
|Alfie Skinner|as2679@canterbury.ac.uk|
|Alex Ward|aw949@canterbury.ac.uk|

Assessment Due Date: **Tuesday 7th May**

Final website link: https://willowbank-tracking-portal.web.app 

## Setup

- Install [NodeJS](https://nodejs.org/dist/v18.14.1/node-v18.14.1-x64.msi)
- Clone the Repo: ``git clone https://github.com/AJGamesArchive/willowbank-tracking-portal.git``
- When you open the cloned repo within VS Code, your editor should turn blue!
- Install Node Modules: ``npm install``
- Set Execution Policy **If** Needed `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`
- Start DEV Server: ``npm run dev``
- Compile Production Built: ``npm run build``

## Firebase Commands
- `npm install -g firebase-tools` - Install Firebase Tools
- `firebase login` - Login To Firebase
- `firebase init` - Setup Web Deployment To Firebase
- `firebase deploy` - Deploy A Production Build

## Documentation

- [TypeScript](https://www.typescriptlang.org/docs/) - Programming Language
- [Prime React](https://primereact.org/button/) - UI/UX Builder
- [Vite](https://vitejs.dev/guide/) - Build Tool & Development Server
- [React](https://react.dev/learn/installation) - Framework
- [Tailwind CSS](https://tailwindcss.com/docs/installation/framework-guides) - Optional CSS Library

## Firebase Docs

- [Information On Firebase Deployment](https://ionicframework.com/docs/react/pwa)
- [Information On Cloud Firestore](https://firebase.google.com/docs/web/setup?authuser=1)
- [Firestore Docs: Getting Started](https://cloud.google.com/firestore/docs/create-database-web-mobile-client-library#web-version-9_2) - Information On Firebase Database
- [Firestore Docs: Adding Data](https://cloud.google.com/firestore/docs/manage-data/add-data) - How To Write Data To Cloud Firestore
- [Firestore Docs: Reading Data](https://cloud.google.com/firestore/docs/query-data/get-data) - How To Read Data From Cloud Firestore

Developer Notes on Web Tech
-------

<details>

## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

### Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

</details>

Backups
-------

<details>

## CMD Backup

- Created with: ``npm create vite@latest my-vue-app -- --template react-ts``
- Install PrimeReact into the Project ``npm install primereact primeicons``
- Install React Router for Navigation System: ``npm install react-router-dom`` or ``npm install react-router-dom@latest``

## Tech Examples

- [Vite React Example](https://github.com/primefaces/primereact-examples/tree/main/vite-basic-ts)

</details>