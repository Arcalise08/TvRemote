import loadingGif from "./assets/loading.gif"
const Loading = () => {
    return (
        <div className="bg-transparent">
            <img
                src={loadingGif}
                style={{ width: 120, height: 120 }}/>
        </div>
    );
};

export default Loading;