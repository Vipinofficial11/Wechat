import { useEffect, useRef, useState } from "react";
import Room from "./Room";

function Landing() {
  const [name, setName] = useState("");
  const [submitted, setIsSubmitted] = useState(false);
  const [localAudioTrack, setLocalAudioTrack] =
    useState<MediaStreamTrack | null>(null);
  const [localVideoTrack, setLocalVideoTrack] =
    useState<MediaStreamTrack | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);

  // Method to access user video and audio.
  const getUserCam = async () => {
    const stream = await window.navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    const audioTrack = stream.getAudioTracks()[0];
    const videoTrack = stream.getVideoTracks()[0];

    // Setting the Audio and Video stream coming from browser in state.
    setLocalVideoTrack(videoTrack);
    setLocalAudioTrack(audioTrack);

    if (!videoRef.current) {
      return;
    }
    videoRef.current.srcObject = new MediaStream([videoTrack]);
    videoRef.current?.play();
  };

  useEffect(() => {
    if (videoRef && videoRef.current) {
      getUserCam();
    }
  }, [videoRef]);

  if (!submitted) {
    return (
      <>
        <div className="flex min-h-screen flex-col px-12 py-40 md:py-28 bg-gradient-to-r from-[#e4b580] to-[#e8729e]">
          <div className="flex justify-center">
            <video
              autoPlay
              ref={videoRef}
              className="h-60 w-[900px] md:h-72 md:w-[1000px]"
            ></video>
          </div>
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Enter your name
            </h2>
          </div>

          <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6">
              <div>
                <div className="mt-2">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Alex"
                    required
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-2 md:px-3"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-[#5e4644] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#7f6867] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#382e2d]"
                  onClick={() => setIsSubmitted(true)}
                >
                  Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      </>
    );
  }
  return (
    <Room
      name={name}
      localAudioTrack={localAudioTrack}
      localVideoTrack={localVideoTrack}
    />
  );
}

export default Landing;
