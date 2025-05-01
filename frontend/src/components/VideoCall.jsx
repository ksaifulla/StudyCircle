import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import AgoraRTC from "agora-rtc-sdk-ng";

const APP_ID = "YOUR_APP_ID"; // Replace with your App ID
const TOKEN = null; // Replace with a dynamic token for production

const VideoCall = () => {
  const { groupId } = useParams();
  const [joined, setJoined] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState({});
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);

  const localContainerRef = useRef(null);
  const clientRef = useRef(null);
  const localAudioTrack = useRef(null);
  const localVideoTrack = useRef(null);

  const joinMeeting = async () => {
    const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    clientRef.current = client;

    client.on("user-published", async (user, mediaType) => {
      await client.subscribe(user, mediaType);

      setRemoteUsers((prev) => ({
        ...prev,
        [user.uid]: { user, videoMuted: false, audioMuted: false },
      }));

      if (mediaType === "video" && user.videoTrack) {
        user.videoTrack.play(`remote-${user.uid}`);
      }
    });

    client.on("user-unpublished", (user, mediaType) => {
      setRemoteUsers((prev) => {
        const updated = { ...prev };
        if (mediaType === "video" && updated[user.uid]) {
          updated[user.uid].videoMuted = true;
        }
        if (mediaType === "audio" && updated[user.uid]) {
          updated[user.uid].audioMuted = true;
        }
        return updated;
      });
    });

    client.on("user-left", (user) => {
      setRemoteUsers((prev) => {
        const updated = { ...prev };
        delete updated[user.uid];
        return updated;
      });
    });

    await client.join(APP_ID, groupId, TOKEN, null);

    localAudioTrack.current = await AgoraRTC.createMicrophoneAudioTrack();
    localVideoTrack.current = await AgoraRTC.createCameraVideoTrack();

    await client.publish([localAudioTrack.current, localVideoTrack.current]);

    setJoined(true);
  };

  useEffect(() => {
    if (joined && localContainerRef.current && localVideoTrack.current) {
      localVideoTrack.current.play(localContainerRef.current);
    }
  }, [joined]);

  const leaveCall = async () => {
    if (localAudioTrack.current) {
      await localAudioTrack.current.stop();
      await localAudioTrack.current.close();
      localAudioTrack.current = null;
    }
    if (localVideoTrack.current) {
      await localVideoTrack.current.stop();
      await localVideoTrack.current.close();
      localVideoTrack.current = null;
    }
    if (clientRef.current) {
      await clientRef.current.leave();
      clientRef.current.removeAllListeners();
      clientRef.current = null;
    }

    setRemoteUsers({});
    setJoined(false);
  };

  const toggleVideo = async () => {
    if (localVideoTrack.current) {
      const newState = !videoEnabled;
      setVideoEnabled(newState);
      await localVideoTrack.current.setEnabled(newState);
    }
  };

  const toggleAudio = async () => {
    if (localAudioTrack.current) {
      const newState = !audioEnabled;
      setAudioEnabled(newState);
      await localAudioTrack.current.setEnabled(newState);
    }
  };

  return (
    <div className="flex flex-col h-screen p-4 bg-gray-900 text-white">
      <h2 className="text-xl font-bold mb-4 text-center">
        Video Chat Room - <br /> Group ID: {groupId}
      </h2>

      {!joined ? (
        <div className="flex-1 flex items-center justify-center">
          <button
            onClick={joinMeeting}
            className="bg-blue-600 px-6 py-3 rounded hover:bg-blue-700 text-lg"
          >
            Join Meeting
          </button>
        </div>
      ) : (
        <>
          <div
            className={`grid gap-4 flex-1 overflow-y-auto ${
              Object.keys(remoteUsers).length + 1 === 1
                ? "grid-cols-1"
                : Object.keys(remoteUsers).length + 1 === 2
                ? "grid-cols-2"
                : Object.keys(remoteUsers).length + 1 <= 4
                ? "grid-cols-2 md:grid-cols-3"
                : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            }`}
          >
            {/* Local Video */}
            <div className="relative w-full h-[300px] sm:h-[400px] bg-black rounded overflow-hidden flex items-center justify-center">
              <div
                ref={localContainerRef}
                className={`w-full h-full absolute top-0 left-0 ${
                  !videoEnabled ? "hidden" : ""
                }`}
              ></div>

              {!videoEnabled && (
                <div className="flex flex-col items-center justify-center text-white z-10">
                  <div className="bg-gray-700 rounded-full w-20 h-20 flex items-center justify-center text-2xl">
                    👤
                  </div>
                </div>
              )}
              <div className="absolute bottom-1 left-1 text-white text-xs bg-blue-600 px-2 py-1 rounded z-10">
                You
              </div>
            </div>

            {/* Remote Users */}
            {Object.values(remoteUsers).map(({ user, videoMuted, audioMuted }) => (
              <div
                key={user.uid}
                className="relative w-full h-[300px] sm:h-[400px] bg-black rounded overflow-hidden flex items-center justify-center"
              >
                <div
                  id={`remote-${user.uid}`}
                  className={`w-full h-full absolute top-0 left-0 ${
                    videoMuted ? "hidden" : ""
                  }`}
                />
                {videoMuted && (
                  <div className="flex flex-col items-center justify-center text-white z-10 absolute top-0 left-0 w-full h-full">
                    <div className="bg-gray-700 rounded-full w-20 h-20 flex items-center justify-center text-2xl">
                      👤
                    </div>
                  </div>
                )}
                <div className="absolute bottom-1 left-1 text-white text-xs bg-gray-700 px-2 py-1 rounded flex items-center gap-2 z-10">
                  <span>UID: {user.uid}</span>
                  {videoMuted && <span title="Camera Off">🎥</span>}
                  {audioMuted && <span title="Mic Off">🎤</span>}
                </div>
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="flex flex-wrap justify-center gap-4 py-4 mt-4">
            <button
              onClick={toggleVideo}
              className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
            >
              {videoEnabled ? "Stop Video" : "Start Video"}
            </button>
            <button
              onClick={toggleAudio}
              className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
            >
              {audioEnabled ? "Mute Audio" : "Unmute Audio"}
            </button>
            <button
              onClick={leaveCall}
              className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
            >
              Leave Meeting
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default VideoCall;
