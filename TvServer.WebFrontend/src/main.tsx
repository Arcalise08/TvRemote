import {createRoot} from 'react-dom/client'
import './global.css'
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css'
import AppRoutes from "./app-routes.tsx";
createRoot(document.getElementById('root')!).render(
  <>
    <AppRoutes />
    <ToastContainer/>
  </>,
)
