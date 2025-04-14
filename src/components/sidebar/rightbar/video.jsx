import React from "react";

const Video = () => {
  return (
    <video
      className="h-[30%] w-[100%] my-25"
      autoPlay
      muted
      playsInline
      controls={false}
      controlsList="nodownload nofullscreen noremoteplayback"
    >
      <source
        src="https://docs.material-tailwind.com/demo.mp4"
        type="video/mp4"
      />
      Your browser does not support the video tag.
    </video>
  );
};

export default Video;
