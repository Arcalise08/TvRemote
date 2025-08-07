export const ST_BASE_URL = import.meta.env.VITE_ST_BASE_URL;
export const HOME_SERVER_BASE_URL = import.meta.env.VITE_HOME_SERVER_BASE_URL;


export const AsyncTimeout = (duration : number) => new Promise(resolve => setTimeout(resolve, duration));

export const KnownSTApiIds = {
    Youtube: "111299001912",//check
    Plex: "3201512006963",//checked
    Netflix: "3201907018807",//checked
    AmazonVideo:"3201512006785", //checked
    Max:"3202301029760",
    DisneyPlus:"3201901017640",//checked
    Hulu:"3201601007625", //checked
    Crunchyroll:"3202302030097"
}

