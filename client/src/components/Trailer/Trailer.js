import React from "react";

export default function Trailer(movie) {
  // todo: find youtubeAPI workaround
  // issue: API has limit of 100 search calls per day
  const q =
    movie.Title.replace(/\s+/g, "+").toLowerCase() +
    "+" +
    movie.Year +
    "+trailer";
  return (
    <iframe
      style={{ width: "100%", height: "100%" }}
      key={q}
      id={movie.Title}
      title={movie.Title}
      frameBorder="0"
      allow="autoplay"
      src={`https://www.youtube.com/embed/?
      enablejsapi=1&
      rel=0&
      showinfo=0&
      controls=0&
      autohide=1&
      mute=1&listType=search&list=${q}`}
    ></iframe>
  );
}
