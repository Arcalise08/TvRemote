import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import DeviceList from "./pages/device-list";
import STDeviceView from "./pages/st-device-view";
import TokenRequired from "./pages/token-required";
import useTokenStore from "./stores/useTokenStore.ts";
import {useEffect, useState} from "react";
import RokuDeviceView from "./pages/roku-device-view";
import SamsungDeviceView from "./pages/samsung-device-view";

const versionNumber = "1.0.1"
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
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path={"/devices"} element={<DeviceList/>} />
                    <Route path={"/samsung-devices/:deviceId"} element={<SamsungDeviceView/>} />
                    <Route path={"/st-devices/:deviceId"} element={<STDeviceView/>} />
                    <Route path={"/roku-devices/:deviceId"} element={<RokuDeviceView/>} />
                    <Route path={"/token-required"} element={<TokenRequired/>} />
                    <Route path={"/"} element={<Navigate to={"/devices"}/>} />
                </Routes>
            </BrowserRouter>
            <small className={"text-gray-300"}>v${versionNumber}</small>
        </div>

    );
};

export default AppRoutes;