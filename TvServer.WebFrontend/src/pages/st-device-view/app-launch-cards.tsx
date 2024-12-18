import {KnownSTApiIds} from "../../constants.ts";
import {Button} from "@headlessui/react";


type AppLaunchCardProps = {
    onClick: (appId : string) => void;
}
const AppLaunchCards = ({onClick} : AppLaunchCardProps) => {
    return (
        <div className={"grid grid-cols-2 gap-2 w-full mt-4"}>
            <Button
                onClick={() => onClick(KnownSTApiIds.AmazonVideo)}>
                <img 
                     className={"cursor-pointer hover:opacity-90 active:scale-95 select-none pointer-events-none"} 
                     src={"/images/amazon-prime.jpg"}
                     width={200} height={150}/>

            </Button>
            <Button
                onClick={() => onClick(KnownSTApiIds.DisneyPlus)}>
                <img 
                     className={"cursor-pointer hover:opacity-90 active:scale-95 select-none pointer-events-none"} 
                     src={"/images/disneyplus.webp"}
                     width={200} height={150}/>

            </Button>
            <Button
                onClick={() => onClick(KnownSTApiIds.Hulu)}>
                <img 
                     className={"cursor-pointer hover:opacity-90 active:scale-95 select-none pointer-events-none"}
                     src={"/images/hulu.jpeg"} width={200}
                     height={150}/>

            </Button>
            <Button
                onClick={() => onClick(KnownSTApiIds.Netflix)}>
                <img 
                     className={"cursor-pointer hover:opacity-90 active:scale-95 select-none pointer-events-none"} 
                     src={"/images/netflix.jpg"}
                     width={200} height={150}/>

            </Button>
            <Button
                onClick={() => onClick(KnownSTApiIds.Plex)}>
                <img 
                     className={"cursor-pointer hover:opacity-90 active:scale-95 select-none pointer-events-none"} 
                     src={"/images/plex.webp"}
                     width={200}
                     height={150}/>
            </Button>
            <Button
                onClick={() => onClick(KnownSTApiIds.Youtube)}>
                <img 
                     className={"cursor-pointer hover:opacity-90 active:scale-95 select-none pointer-events-none"} 
                     src={"/images/youtube.png"}
                     width={200} height={150}/>
            </Button>
        </div>
    );
};

export default AppLaunchCards;