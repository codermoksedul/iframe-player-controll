import VideoPlayer from "./VideoPlayer";

export default function page() {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="w-full h-full max-w-4xl ">
        <VideoPlayer />
      </div>
    </div>
  );
}
