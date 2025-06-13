// import React, { useEffect, useRef, useState } from "react";
// import useSocket from "../hooks/useSocket";
// import { BACKEND_URL } from "../config";

// const GroupVideoCall = ({ groupId, userId }) => {
//   const socket = useSocket(BACKEND_URL);
//   const localVideoRef = useRef(null);
//   const localStreamRef = useRef(null);
//   const peerConnections = useRef({});
//   const [peers, setPeers] = useState({});
//   const [localStream, setLocalStream] = useState(null);
//   const [cameraEnabled, setCameraEnabled] = useState(true);
//   const [micEnabled, setMicEnabled] = useState(true);

//   const joinCall = async () => {
//   try {
//     const stream = await navigator.mediaDevices.getUserMedia({
//       video: true,
//       audio: true,
//     });

//     localStreamRef.current = stream;
//     setLocalStream(stream);

  
//     socket?.emit("join-video-call", { groupId, userId });
//   } catch (err) {
//     console.error("Error accessing media devices:", err);
//   }
// };
// useEffect(() => {
//   if (localStream && localVideoRef.current) {
//     localVideoRef.current.srcObject = localStream;
//   }
// }, [localStream]);

//   const leaveCall = () => {
//     socket?.emit("leave-video-call", { groupId });
//     localStreamRef.current?.getTracks().forEach((track) => track.stop());
//     if (localVideoRef.current) {
//       localVideoRef.current.srcObject = null;
//     }
//     localStreamRef.current = null;
//     setLocalStream(null);

//     Object.values(peerConnections.current).forEach((pc) => pc.close());
//     peerConnections.current = {};
//     setPeers({});

//     setCameraEnabled(false);
//     setMicEnabled(false);
//   };

//   const toggleCamera = () => {
//     const videoTrack = localStreamRef.current?.getVideoTracks()[0];
//     if (videoTrack) {
//       videoTrack.enabled = !videoTrack.enabled;
//       setCameraEnabled(videoTrack.enabled);
//     }
//   };

//   const toggleMic = () => {
//     const audioTrack = localStreamRef.current?.getAudioTracks()[0];
//     if (audioTrack) {
//       audioTrack.enabled = !audioTrack.enabled;
//       setMicEnabled(audioTrack.enabled);
//     }
//   };

//   const createPeerConnection = async (remoteSocketId, isInitiator) => {
//     if (peerConnections.current[remoteSocketId]) return;

//     const pc = new RTCPeerConnection({
//       iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
//     });

//     localStreamRef.current?.getTracks().forEach((track) => {
//       pc.addTrack(track, localStreamRef.current);
//     });

//     const remoteStream = new MediaStream();

//     pc.ontrack = (event) => {
//       event.streams[0]?.getTracks().forEach((track) => {
//         remoteStream.addTrack(track);
//       });
//       setPeers((prev) => ({
//         ...prev,
//         [remoteSocketId]: remoteStream,
//       }));
//     };

//     pc.onicecandidate = (event) => {
//       if (event.candidate) {
//         socket.emit("ice-candidate", {
//           groupId,
//           to: remoteSocketId,
//           candidate: event.candidate,
//         });
//       }
//     };

//     pc.onconnectionstatechange = () => {
//       if (["disconnected", "failed", "closed"].includes(pc.connectionState)) {
//         pc.close();
//         delete peerConnections.current[remoteSocketId];
//         setPeers((prev) => {
//           const updated = { ...prev };
//           delete updated[remoteSocketId];
//           return updated;
//         });
//       }
//     };

//     peerConnections.current[remoteSocketId] = pc;

//     if (isInitiator) {
//       try {
//         const offer = await pc.createOffer();
//         await pc.setLocalDescription(offer);
//         socket.emit("video-offer", {
//           groupId,
//           offer,
//           to: remoteSocketId,
//         });
//       } catch (err) {
//         console.error("Error creating offer:", err);
//       }
//     }
//   };

//   useEffect(() => {
//     if (!socket) return;

//     const handleUserJoined = ({ socketId }) => {
//       if (socketId === socket.id) return;
//       createPeerConnection(socketId, true);
//     };

//     const handleExistingUsers = ({ users }) => {
//       users.forEach((socketId) => {
//         if (socketId !== socket.id) {
//           createPeerConnection(socketId, false);
//         }
//       });
//     };

//     const handleVideoOffer = async ({ offer, from }) => {
//       let pc = peerConnections.current[from];
//       if (!pc) {
//         await createPeerConnection(from, false);
//         pc = peerConnections.current[from];
//       }

//       try {
//         await pc.setRemoteDescription(new RTCSessionDescription(offer));
//         const answer = await pc.createAnswer();
//         await pc.setLocalDescription(answer);

//         socket.emit("video-answer", {
//           groupId,
//           answer: pc.localDescription,
//           to: from,
//         });
//       } catch (err) {
//         console.error("Error handling video offer:", err);
//       }
//     };

//     const handleVideoAnswer = async ({ answer, from }) => {
//       const pc = peerConnections.current[from];
//       if (pc) {
//         try {
//           await pc.setRemoteDescription(new RTCSessionDescription(answer));
//         } catch (err) {
//           console.error("Error setting remote answer:", err);
//         }
//       }
//     };

//     const handleIceCandidate = async ({ candidate, from }) => {
//       const pc = peerConnections.current[from];
//       if (pc && candidate) {
//         try {
//           await pc.addIceCandidate(new RTCIceCandidate(candidate));
//         } catch (err) {
//           console.error("Error adding ICE candidate:", err);
//         }
//       }
//     };

//     const handleUserLeft = ({ socketId }) => {
//       const pc = peerConnections.current[socketId];
//       if (pc) {
//         pc.close();
//         delete peerConnections.current[socketId];
//       }

//       setPeers((prev) => {
//         const updated = { ...prev };
//         delete updated[socketId];
//         return updated;
//       });
//     };

//     socket.on("user-joined-call", handleUserJoined);
//     socket.on("existing-users-in-call", handleExistingUsers);
//     socket.on("video-offer", handleVideoOffer);
//     socket.on("video-answer", handleVideoAnswer);
//     socket.on("ice-candidate", handleIceCandidate);
//     socket.on("user-left-call", handleUserLeft);

//     return () => {
//       socket.off("user-joined-call", handleUserJoined);
//       socket.off("existing-users-in-call", handleExistingUsers);
//       socket.off("video-offer", handleVideoOffer);
//       socket.off("video-answer", handleVideoAnswer);
//       socket.off("ice-candidate", handleIceCandidate);
//       socket.off("user-left-call", handleUserLeft);
//     };
//   }, [socket]);

//   return (
//     <div className="mx-auto w-full h-full p-6 text-white bg-gradient-to-b from-fuchsia-900 via-zinc-800 to-gray-900">
//       <h2 className="text-3xl font-semibold text-center mb-6">
//         Group Video Call
//       </h2>

//       {localStream ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-center mb-8">
//           <div className="flex flex-col items-center">
//             <p className="mb-2 text-sm text-green-400">You</p>
//             <video
//               ref={localVideoRef}
//               autoPlay
//               muted
//               playsInline
//               className="w-full h-48 rounded-xl border-4 border-green-500 shadow"
//             />
//           </div>
//           {Object.entries(peers).map(([id, stream]) => (
//             <div key={id} className="flex flex-col items-center">
//               <p className="mb-2 text-sm text-blue-400">Peer</p>
//               <video
//                 autoPlay
//                 playsInline
//                 ref={(video) => {
//                   if (video && stream && video.srcObject !== stream) {
//                     video.srcObject = stream;
//                   }
//                 }}
//                 className="w-full h-48 rounded-xl border-4 border-blue-500 shadow"
//               />
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p className="text-center text-gray-400 mb-8">
//           Join the call to see video streams here.
//         </p>
//       )}

//       <div className="flex flex-wrap justify-center gap-4 mt-4">
//         {!localStream ? (
//           <button
//             onClick={joinCall}
//             className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-md text-white shadow"
//           >
//             Join Call
//           </button>
//         ) : (
//           <>
//             <button
//               onClick={leaveCall}
//               className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-md text-white shadow"
//             >
//               Leave Call
//             </button>
//             <button
//               onClick={toggleCamera}
//               className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-md text-white shadow"
//             >
//               {cameraEnabled ? "Disable Camera" : "Enable Camera"}
//             </button>
//             <button
//               onClick={toggleMic}
//               className="bg-yellow-500 hover:bg-yellow-600 px-6 py-2 rounded-md text-white shadow"
//             >
//               {micEnabled ? "Mute Mic" : "Unmute Mic"}
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default GroupVideoCall;

import React, { useEffect, useRef, useState } from "react";
import useSocket from "../hooks/useSocket";
import { BACKEND_URL } from "../config";

const GroupVideoCall = ({ groupId, userId }) => {
  const socket = useSocket(BACKEND_URL);
  const localVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const peerConnections = useRef({});
  const [peers, setPeers] = useState({});
  const [localStream, setLocalStream] = useState(null);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);

  const joinCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localStreamRef.current = stream;
      setLocalStream(stream);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      socket?.emit("join-video-call", { groupId, userId });
    } catch (err) {
      console.error("Error accessing media devices:", err);
    }
  };

  const leaveCall = () => {
    socket?.emit("leave-video-call", { groupId });

    // Stop all local media tracks
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    localVideoRef.current.srcObject = null;
    localStreamRef.current = null;
    setLocalStream(null);

    // Close and clean up all peer connections
    Object.values(peerConnections.current).forEach((pc) => pc.close());
    peerConnections.current = {};
    setPeers({});

    setCameraEnabled(false);
    setMicEnabled(false);
  };

  const toggleCamera = () => {
    const videoTrack = localStreamRef.current?.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setCameraEnabled(videoTrack.enabled);
    }
  };

  const toggleMic = () => {
    const audioTrack = localStreamRef.current?.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setMicEnabled(audioTrack.enabled);
    }
  };

  const createPeerConnection = async (remoteSocketId, isInitiator) => {
    if (peerConnections.current[remoteSocketId]) return;

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    // Add local media tracks to the peer connection
    localStreamRef.current?.getTracks().forEach((track) => {
      pc.addTrack(track, localStreamRef.current);
    });

    const remoteStream = new MediaStream();

    pc.ontrack = (event) => {
      event.streams[0]?.getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      });
      setPeers((prev) => ({
        ...prev,
        [remoteSocketId]: remoteStream,
      }));
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          groupId,
          to: remoteSocketId,
          candidate: event.candidate,
        });
      }
    };

    pc.onconnectionstatechange = () => {
      if (
        ["disconnected", "failed", "closed"].includes(pc.connectionState)
      ) {
        pc.close();
        delete peerConnections.current[remoteSocketId];
        setPeers((prev) => {
          const updated = { ...prev };
          delete updated[remoteSocketId];
          return updated;
        });
      }
    };

    peerConnections.current[remoteSocketId] = pc;

    if (isInitiator) {
      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit("video-offer", {
          groupId,
          offer,
          to: remoteSocketId,
        });
      } catch (err) {
        console.error("Error creating offer:", err);
      }
    }
  };

  useEffect(() => {
    if (!socket) return;

    const handleUserJoined = ({ socketId }) => {
      if (socketId === socket.id) return;
      createPeerConnection(socketId, true);
    };

    const handleExistingUsers = ({ users }) => {
      users.forEach((socketId) => {
        if (socketId !== socket.id) {
          createPeerConnection(socketId, false);
        }
      });
    };

    const handleVideoOffer = async ({ offer, from }) => {
      let pc = peerConnections.current[from];
      if (!pc) {
        await createPeerConnection(from, false);
        pc = peerConnections.current[from];
      }

      try {
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socket.emit("video-answer", {
          groupId,
          answer: pc.localDescription,
          to: from,
        });
      } catch (err) {
        console.error("Error handling video offer:", err);
      }
    };

    const handleVideoAnswer = async ({ answer, from }) => {
      const pc = peerConnections.current[from];
      if (pc) {
        try {
          await pc.setRemoteDescription(new RTCSessionDescription(answer));
        } catch (err) {
          console.error("Error setting remote answer:", err);
        }
      }
    };

    const handleIceCandidate = async ({ candidate, from }) => {
      const pc = peerConnections.current[from];
      if (pc && candidate) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {
          console.error("Error adding ICE candidate:", err);
        }
      }
    };

    const handleUserLeft = ({ socketId }) => {
      const pc = peerConnections.current[socketId];
      if (pc) {
        pc.close();
        delete peerConnections.current[socketId];
      }

      setPeers((prev) => {
        const updated = { ...prev };
        delete updated[socketId];
        return updated;
      });
    };

    socket.on("user-joined-call", handleUserJoined);
    socket.on("existing-users-in-call", handleExistingUsers);
    socket.on("video-offer", handleVideoOffer);
    socket.on("video-answer", handleVideoAnswer);
    socket.on("ice-candidate", handleIceCandidate);
    socket.on("user-left-call", handleUserLeft);

    return () => {
      socket.off("user-joined-call", handleUserJoined);
      socket.off("existing-users-in-call", handleExistingUsers);
      socket.off("video-offer", handleVideoOffer);
      socket.off("video-answer", handleVideoAnswer);
      socket.off("ice-candidate", handleIceCandidate);
      socket.off("user-left-call", handleUserLeft);
    };
  }, [socket]);

  return (
    <div className="mx-auto w-full h-full p-6 text-white bg-gradient-to-b from-fuchsia-900 via-zinc-800 to-gray-900">
    <div className="p-4">
      <h2 className="text-3xl text-white font-bold mb-4 text-center">Group Video Call</h2>
      <p className="text-center text-white mb-8 text-xl">
           Connect seamlessly with fellow group members...
        </p>

      <div className="flex flex-wrap gap-4 justify-center mb-6">
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          className="w-72 h-48 border-4 border-green-500 rounded-lg"
        />
        {Object.entries(peers).map(([id, stream]) => (
          <video
            key={id}
            autoPlay
            playsInline
            ref={(video) => {
              if (video && stream && video.srcObject !== stream) {
                video.srcObject = stream;
              }
            }}
            className="w-72 h-48 border-4 border-blue-500 rounded-lg"
          />
        ))}
      </div>

      <div className="flex justify-center gap-4 mt-4">
        {!localStream ? (
          <button
            onClick={joinCall}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
          >
            Join Call
          </button>
          
        ) : (
          <button
            onClick={leaveCall}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
          >
            Leave Call
          </button>
        )}
        {localStream && (
          <>
            <button
              onClick={toggleCamera}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              {cameraEnabled ? "Disable Camera" : "Enable Camera"}
            </button>
            <button
              onClick={toggleMic}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md"
            >
              {micEnabled ? "Mute Mic" : "Unmute Mic"}
            </button>
          </>
        )}
      </div>
    </div>
    </div>
  );
};

export default GroupVideoCall;
