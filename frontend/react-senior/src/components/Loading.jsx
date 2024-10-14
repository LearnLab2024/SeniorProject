import { useEffect } from "react";

const Loading = () => {
  useEffect(() => {
    // Dynamically import the Lottie player script
    const script = document.createElement("script");
    script.src = "https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs";
    script.type = "module";
    document.body.appendChild(script);
  }, []); // Empty dependency array to ensure it runs once

  return (
    <div>
      {/* Lottie animation player */}
      <dotlottie-player
        src="https://lottie.host/c04e837c-a2ac-4a75-9a9e-b1284cee6fe1/4A9dJ13Sep.json"
        background="transparent"
        speed="1"
        style={{ width: '70px', height: '70px' }}
        loop
        autoplay
      ></dotlottie-player>
    </div>
  );
};

export default Loading;
