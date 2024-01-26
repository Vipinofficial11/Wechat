import VideoSection from "./VideoSection";
import ChatSection from "./ChatSection";

function Home({
  localVideoRef,
  remoteVideoRef,
}: {
  localVideoRef: HTMLVideoElement;
  remoteVideoRef: HTMLVideoElement;
}) {
  return (
    <div className="flex gap-5 p-5">
      <VideoSection
        localVideoRef={localVideoRef}
        remoteVideoRef={remoteVideoRef}
      />
      <ChatSection />
    </div>
  );
}

export default Home;
