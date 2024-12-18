import {KnownSTApiIds} from "../../constants.ts";


type AppLaunchCardProps = {
    onClick: (appId : string) => void;
}
const AppLaunchCards = ({onClick} : AppLaunchCardProps) => {
    return (
        <div className={"grid grid-cols-2 gap-2 w-full mt-4"}>
            <img onClick={() => onClick(KnownSTApiIds.AmazonVideo)} className={"cursor-pointer hover:opacity-90 active:scale-95"} src={"/images/amazon-prime.jpg"} width={200} height={150}/>
            <img onClick={() => onClick(KnownSTApiIds.DisneyPlus)} className={"cursor-pointer hover:opacity-90 active:scale-95"} src={"/images/disneyplus.webp"} width={200} height={150}/>
            <img onClick={() => onClick(KnownSTApiIds.Hulu)} className={"cursor-pointer hover:opacity-90 active:scale-95"} src={"/images/hulu.jpeg"} width={200} height={150}/>
            <img onClick={() => onClick(KnownSTApiIds.Netflix)} className={"cursor-pointer hover:opacity-90 active:scale-95"} src={"/images/netflix.jpg"} width={200} height={150}/>
            <img onClick={() => onClick(KnownSTApiIds.Plex)} className={"cursor-pointer hover:opacity-90 active:scale-95"} src={"/images/plex.webp"} width={200} height={150}/>
            <img onClick={() => onClick(KnownSTApiIds.Youtube)} className={"cursor-pointer hover:opacity-90 active:scale-95"} src={"/images/youtube.png"} width={200} height={150}/>
        </div>
    );
};

export default AppLaunchCards;