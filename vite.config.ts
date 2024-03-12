import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    "import.meta.env.APIKEY": JSON.stringify(process.env.APIKEY),
    "import.meta.env.AUTHDOMAIN": JSON.stringify(process.env.AUTHDOMAIN),
    "import.meta.env.PROJECTID": JSON.stringify(process.env.PROJECTID),
    "import.meta.env.STORAGEBUCKET": JSON.stringify(process.env.STORAGEBUCKET),
    "import.meta.env.MESSAGINGSENDERID": JSON.stringify(process.env.MESSAGINGSENDERID),
    "import.meta.env.APPID": JSON.stringify(process.env.APPID),
    "import.meta.env.MEASUREMENTID": JSON.stringify(process.env.MEASUREMENTID),
  },
});
