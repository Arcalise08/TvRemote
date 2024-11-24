import {useState} from 'react';
import useTokenStore from "../../stores/useTokenStore.ts";
import {useNavigate} from "react-router-dom";

const TokenRequired = () => {
    const [tmpToken, setTmpToken] = useState<string>("");
    const navigate = useNavigate();
    const {setToken} = useTokenStore()

    const saveToken = () => {
        setToken(tmpToken);
        navigate("/devices")
    }

    return (
        <div className="flex items-center justify-center min-h-screen w-full bg-[rgba(0,0,0,0.2)]">
            <div className={"flex flex-col items-center bg-white shadow rounded-md p-2"}>
                <h3 className={"w-[250px] text-center"}>Please insert a Personal Access Token for Samsung Smart Things</h3>
                <input
                    value={tmpToken}
                    onChange={(e) => setTmpToken(e.target.value)}
                    className={"p-1 rounded border shadow my-3 mx-auto"}/>
                <button
                    onClick={saveToken}
                    className={"bg-black mx-auto text-white rounded p-2 active:scale-90 hover:opacity-80"}>
                    Save
                </button>
            </div>
        </div>
    )
};

export default TokenRequired;