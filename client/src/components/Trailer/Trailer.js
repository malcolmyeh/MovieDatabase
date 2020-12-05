import React from "react";

export default function Trailer(videoSrc) {

  // console.log("Trailer videoSrc:", videoSrc);
  return (
    <iframe
      style={{ width: "100%", height: "100%" }}
      key={videoSrc}
      id={videoSrc}
      title={videoSrc}
      frameBorder="0"
      allow="autoplay"
      src={videoSrc}
    ></iframe>
  );
}
