import { useEffect, useState } from 'react';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
    };
    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => {
        setVisible(false);
      });
    }
  };

  if (!visible) return null;

  return (
    <div style={{ position: 'fixed', bottom: 20, right: 20 }}>
      <button onClick={handleClick} className="capture-button">
        📲 Instalar aplicación
      </button>
    </div>
  );
};

export default InstallPrompt;
