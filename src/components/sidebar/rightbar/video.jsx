import React from "react";

const Video = () => {
  return (
    <div className="w-100% h-[350px] flex justify-center items-center bg-stone-900 rounded-xl mx-1 my-4">
      <video
        className="w-full h-full rounded-xl object-fill"
        autoPlay
        muted
        playsInline
        controls={true}
        controlsList="nodownload nofullscreen noremoteplayback"
      >
        <source
          src="https://docs.material-tailwind.com/demo.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default Video;
