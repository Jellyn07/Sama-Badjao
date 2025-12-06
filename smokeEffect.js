(function () {
  const createSmokeParticle = () => {
    const smoke = document.createElement("div");
    smoke.classList.add("smoke");
    smoke.style.width = `${Math.random() * 40 + 20}px`;
    smoke.style.height = smoke.style.width;
    smoke.style.left = `${Math.random() * 100}vw`;
    smoke.style.bottom = `-${Math.random() * 50 + 50}px`;
    smoke.style.opacity = "0.4"; 
    document.body.appendChild(smoke);

    const animationDuration = Math.random() * 6 + 6;
    smoke.style.transition = `transform ${animationDuration}s ease-in, opacity ${animationDuration}s ease-in`;
    setTimeout(() => {
      smoke.style.transform = `translateY(-200vh) translateX(${Math.random() * 50 - 25}px)`;
      smoke.style.opacity = "0";
    }, 50);

    setTimeout(() => {
      smoke.remove();
    }, animationDuration * 1000);
  };

  const startSmokeEffect = () => {
    setInterval(() => {
      createSmokeParticle();
    }, 100); 
  };

  const addStyles = () => {
    const style = document.createElement("style");
    style.textContent = `
      .smoke {
        position: fixed;
        bottom: 0;
        background: radial-gradient(circle, rgba(128, 128, 128, 0.3) 0%, rgba(0, 0, 0, 0) 100%);
        border-radius: 50%;
        z-index: -2;
      }
    `;
    document.head.appendChild(style);
  };

  addStyles();
  startSmokeEffect();
})();