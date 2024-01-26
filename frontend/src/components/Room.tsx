import { useState, useEffect, useRef } from "react";
import { Socket, io } from "socket.io-client";
import Home from "./Home";
import Navbar from "./Navbar";

function Room({
  name,
  localAudioTrack,
  localVideoTrack,
}: {
  name: string;
  localAudioTrack: MediaStreamTrack | null;
  localVideoTrack: MediaStreamTrack | null;
}) {
  // States
  const [lobby, setLobby] = useState(true);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [sendingPeerConnection, setsendingPeerConnection] =
    useState<RTCPeerConnection | null>(null);
  const [receivingPeerConnection, setReceivingPeerConnection] =
    useState<RTCPeerConnection | null>(null);
  const [remoteMediaStream, setRemoteMediaStream] =
    useState<MediaStream | null>(null);
  const [remoteAudioTrack, setRemoteAudioTrack] =
    useState<MediaStreamTrack | null>(null);
  const [remoteVideoTrack, setRemoteVideoTrack] =
    useState<MediaStreamTrack | null>(null);

  // Creating 2 video refs, one for local video stream and one for remote video stream.
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const socket = io("http://localhost:3000");

    // Creating an event to send offer to the STUN/Signaling server.
    socket.on("send-offer", async ({ roomId }) => {
      console.log("INFO - Sending offer...");
      setLobby(false);

      // Creating a new peer connection and setting it in the state variable.
      const peerConnection = new RTCPeerConnection();
      setsendingPeerConnection(peerConnection);

      // Now set the local audio and video tracks we get from in state variables.
      if (localVideoTrack) {
        console.log("INFO - Adding local video track.");
        peerConnection.addTrack(localVideoTrack);
      }

      if (localAudioTrack) {
        console.log("INFO - Adding local audio track.");
        peerConnection.addTrack(localAudioTrack);
      }

      peerConnection.onicecandidate = async (e) => {
        console.log("INFO - Receiving ice candidate locally.");
        if (e.candidate) {
          socket.emit("add-ice-candidate", {
            candidate: e.candidate,
            roomId: roomId,
            type: "sender",
          });
        }
      };

      peerConnection.onnegotiationneeded = async () => {
        console.log("INFO - When negotiation neeeded, sending offer");
        const sdp = await peerConnection.createOffer();
        peerConnection.setLocalDescription(sdp);
        socket.emit("offer", {
          sdp,
          roomId,
        });
      };
    });

    // Creating an event when offer is received.
    socket.on("offer", async ({ roomId, sdp: remoteSdp }) => {
      console.log("INFO - received offer");
      setLobby(false);

      // Creating a peer connection and setting the sdp from user2.
      const peerConnection = new RTCPeerConnection();
      peerConnection.setRemoteDescription(remoteSdp);

      // Creating a SDP for user1.
      const sdp = await peerConnection.createAnswer();
      peerConnection.setLocalDescription(sdp);

      const stream = new MediaStream();
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
      }
      setRemoteMediaStream(stream);
      // trickle ice.
      setReceivingPeerConnection(peerConnection);
      // missing code ..

      // On Ice candidate.
      peerConnection.onicecandidate = async (e) => {
        if (e.candidate) {
          socket.emit("add-ice-candidate", {
            candidate: e.candidate,
            roomId: roomId,
            type: "receiver",
          });
        }
      };

      // Once user have received an offer it needs to send an answer.
      socket.emit("answer", {
        roomId: roomId,
        sdp: sdp,
      });

      // Setting the audio and video track for remote user with a timeout.
      setTimeout(() => {
        const track1 = peerConnection.getTransceivers()[0].receiver.track;
        const track2 = peerConnection.getTransceivers()[1].receiver.track;

        if (track1.kind === "video") {
          setRemoteVideoTrack(track1);
          setRemoteAudioTrack(track2);
        } else {
          setRemoteVideoTrack(track2);
          setRemoteAudioTrack(track1);
        }

        // Adding the tracks to Remote video ref and playing the video.
        //@ts-ignore
        remoteVideoRef.current.srcObject.addTrack(track1);
        //@ts-ignore
        remoteVideoRef.current.srcObject.addTrack(track2);
        //@ts-ignore
        remoteVideoRef.current.play();
      }, 5000);
    });

    // Creating an event when answer is received.
    socket.on("answer", ({ roomId, sdp: remoteSdp }) => {
      setLobby(false);
      setsendingPeerConnection((peerConnection) => {
        peerConnection?.setRemoteDescription(remoteSdp);
        return peerConnection;
      });
    });

    socket.on("lobby", () => {
      console.log("INFO - User is in lobby.");
      setLobby(true);
    });

    // Creating an event to set ice candidates for sender and reciever.
    socket.on("add-ice-candidate", ({ candidate, type }) => {
      console.log("INFO - Add ice candidate from remote");

      if (type === "sender") {
        setReceivingPeerConnection((peerConnection) => {
          if (!peerConnection) {
            console.error("Receiving Peer Connection not found.");
          }
          // removed else here.
          peerConnection?.addIceCandidate(candidate);
          return peerConnection;
        });
      } else {
        setsendingPeerConnection((peerConnection) => {
          if (!peerConnection) {
            console.error("Sending Peer connection not found.");
          }

          peerConnection?.addIceCandidate(candidate);
          return peerConnection;
        });
      }
    });

    setSocket(socket);
  }, [name]);

  useEffect(() => {
    if (localVideoRef.current) {
      if (localVideoTrack) {
        localVideoRef.current.srcObject = new MediaStream([localVideoTrack]);
        localVideoRef.current.play();
      }
    }
  }, [localVideoRef]);

  return (
    <div className="flex flex-col gap-12">
      <Navbar />
      <Home localVideoRef={localVideoRef} remoteVideoRef={remoteVideoRef} />
    </div>
  );
}

export default Room;
