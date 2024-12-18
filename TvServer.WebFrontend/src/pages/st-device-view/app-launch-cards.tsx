import {KnownSTApiIds} from "../../constants.ts";
import PressableIcon from "../../components/pressable-icon.tsx";


type AppLaunchCardProps = {
    onClick: (appId : string) => void;
}
const AppLaunchCards = ({onClick} : AppLaunchCardProps) => {
    return (
        <div className={"grid grid-cols-2 gap-2 w-full mt-4"}>
            <PressableIcon
                onClick={() => onClick(KnownSTApiIds.AmazonVideo)}
                src={"/images/amazon-prime.jpg"}
                imgWidth={200}
                imgHeight={150}
            />
            <PressableIcon
                onClick={() => onClick(KnownSTApiIds.DisneyPlus)}
                src={"/images/disneyplus.webp"}
                imgWidth={200}
                imgHeight={150}
            />
            <PressableIcon
                onClick={() => onClick(KnownSTApiIds.Hulu)}
                src={"/images/hulu.jpeg"}
                imgWidth={200}
                imgHeight={150}
            />
            <PressableIcon
                onClick={() => onClick(KnownSTApiIds.Netflix)}
                src={"/images/netflix.jpg"}
                imgWidth={200}
                imgHeight={150}
            />
            <PressableIcon
                onClick={() => onClick(KnownSTApiIds.Plex)}
                src={"/images/plex.webp"}
                imgWidth={200}
                imgHeight={150}
            />
            <PressableIcon
                onClick={() => onClick(KnownSTApiIds.Youtube)}
                src={"/images/youtube.png"}
                imgWidth={200}
                imgHeight={150}
            />
        </div>
    );
};

export default AppLaunchCards;