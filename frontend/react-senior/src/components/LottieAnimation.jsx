import React, { useEffect } from 'react';

const LottieAnimation = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs';
    script.type = 'module';
    document.body.appendChild(script);
  }, []);

  return (
    <div>
      <dotlottie-player
        src="https://lottie.host/a066ad9d-8da0-49fe-a638-f5741ccbd96f/Y15NyC3Fbb.json"
        background="transparent"
        speed="1"
        style={{ width: '500px', height: '500px' }}
        loop
        autoplay
      />
    </div>
  );
};



export default LottieAnimation;
