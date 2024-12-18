import {ProcessedRokuApp, RokuApp} from "../../models/roku-types.ts";
import PressableIcon from "../../components/pressable-icon.tsx";


type AppLaunchCardProps = {
    onClick: (appId : RokuApp) => void;
    rokuApps: ProcessedRokuApp[] ;
}
const AppLaunchCards = ({onClick, rokuApps} : AppLaunchCardProps) => {
    type FavoriteRatings = { [key: string]: number };
    const sortBasedOnFavorites = () => {
        const favorites = [
            { name: "Plex - Free Movies & TV", rating: 100 },
            { name: "YouTube", rating: 95 },
            { name: "Hulu", rating: 80},
            { name: "Netflix", rating:85 },
            { name: "Disney Plus", rating: 75},
            { name: "Prime Video", rating:70 }
        ];
        const hide = [
            "Roku TV Intro",
            "The Roku Channel",
            "Apple TV",
            "discovery+ | Stream TV Shows",
            "Peacock TV",
            "Paramount Plus",
            "TCL TV+",
            "Kids & Family on The Roku Channel",
            "Tubi - Free Movies & TV",
            "Frndly TV",
            "Backdrops"
        ]
        const favoriteRatings: FavoriteRatings = favorites.reduce((acc, favorite) => {
            acc[favorite.name.toLowerCase()] = favorite.rating;
            return acc;
        }, {} as FavoriteRatings);
        const filtered = rokuApps.filter(item => !hide.includes(item.rokuApp.name));
        const sorted = filtered.sort((a, b) => {
            const aName = a.rokuApp.name.toLowerCase();
            const bName = b.rokuApp.name.toLowerCase();
            const aIsTvInput = aName.includes("tvinput");
            const bIsTvInput = bName.includes("tvinput");
            const aRating = favoriteRatings[aName] || 0;
            const bRating = favoriteRatings[bName] || 0;

            if (aIsTvInput && !bIsTvInput) return -1;
            if (!aIsTvInput && bIsTvInput) return 1;

            if (aRating !== bRating) return bRating - aRating;
            return 0;
        });
        return sorted
    }

    return (
        <div className={"grid grid-cols-2 gap-2 w-full mt-4"}>
            {
                sortBasedOnFavorites().map((app, key) => (
                    <PressableIcon
                        key={key}
                        onClick={() => onClick(app.rokuApp)}
                        src={app.imgUrl}
                        imgWidth={200}
                        imgHeight={150}
                    />
                ))
            }
        </div>
    );
};

export default AppLaunchCards;