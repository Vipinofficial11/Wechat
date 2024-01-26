function VideoSection({
  localVideoRef,
  remoteVideoRef,
}: {
  localVideoRef: HTMLVideoElement;
  remoteVideoRef: HTMLVideoElement;
}) {
  return (
    <div className="flex flex-col gap-16">
      <div className="w-[35vw] h-[35vh] border rounded-lg bg-gray-100 shadow-md shadow-slate-300">
        <video
          autoPlay
          className="w-[35vw] h-[35vh] object-cover rounded-lg"
          ref={localVideoRef}
        />
      </div>

      <div className="w-[35vw] h-[35vh] border rounded-lg bg-gray-100 shadow-md shadow-slate-300">
        <video
          autoPlay
          className="w-[35vw] h-[35vh] object-cover rounded-lg"
          ref={remoteVideoRef}
        />
      </div>
    </div>
  );
}

export default VideoSection;
