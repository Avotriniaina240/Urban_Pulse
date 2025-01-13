import { useState } from 'react';
import LoginModal from '../components/Auth/LoginModal';

export default function Home() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  return (
    <>
      <button 
        onClick={handleLoginClick}
        className="text-white hover:text-gray-200"
      >
        Se connecter
      </button>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </>
  );
}
