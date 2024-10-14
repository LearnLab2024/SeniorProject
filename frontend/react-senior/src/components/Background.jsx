import React, { useEffect } from 'react';

const Background = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs';
    script.type = 'module';
    document.body.appendChild(script);
  }, []);

  return (
    <div>
      <dotlottie-player
        src="https://lottie.host/cc1e8bf0-eb91-4635-a5af-8eba8a5d8a37/E4foBTFlG3.json"
        background="transparent"
        speed="1"
        style={{ width: '500px', height: '500px' }}
        loop
        autoplay
      />
    </div>
  );
};

export default Background;
