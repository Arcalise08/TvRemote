export const ST_BASE_URL = "https://api.smartthings.com/v1";

//export const HOME_SERVER_BASE_URL = `${window.location.origin}`;
export const HOME_SERVER_BASE_URL = `http://raspberrypi.local:1123`;


export const AsyncTimeout = (duration : number) => new Promise(resolve => setTimeout(resolve, duration));

export const KnownSTApiIds = {
    Youtube: "111299001912",//check
    Plex: "3201512006963",//checked
    Netflix: "3201907018807",//checked
    AmazonVideo:"3201512006785", //checked
    Max:"3201601007230",
    DisneyPlus:"3201901017640",//checked
    Hulu:"3201601007625" //checked
}

