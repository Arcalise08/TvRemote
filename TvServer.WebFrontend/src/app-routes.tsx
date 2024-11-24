import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import DeviceList from "./pages/device-list";
import STDeviceView from "./pages/st-device-view";
import TokenRequired from "./pages/token-required";
import useTokenStore from "./stores/useTokenStore.ts";
import {useEffect, useState} from "react";
import RokuDeviceView from "./pages/roku-device-view";


const AppRoutes = () => {
    const [authRequired, setAuthRequired] = useState<boolean>(true);
    const {token} = useTokenStore();
    useEffect(() => {handleToken()}, [token])


    const handleToken = () => {
        setAuthRequired(!token);
    }

    if (authRequired)
        return (
            <BrowserRouter>
                <Routes>
                    <Route path={"/token-required"} element={<TokenRequired/>} />
                    <Route path={"/"} element={<Navigate to={"/token-required"}/>} />
                </Routes>
            </BrowserRouter>
        )
    return (
        <BrowserRouter>
            <Routes>
                <Route path={"/devices"} element={<DeviceList/>} />
                <Route path={"/st-devices/:deviceId"} element={<STDeviceView/>} />
                <Route path={"/roku-devices/:deviceId"} element={<RokuDeviceView/>} />
                <Route path={"/token-required"} element={<TokenRequired/>} />
                <Route path={"/"} element={<Navigate to={"/devices"}/>} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;