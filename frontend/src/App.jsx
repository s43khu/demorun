import React, { useEffect, useState } from 'react';
import LandingPage from './LandingPage';
import JumpGame from './JumpGame';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [showGame, setShowGame] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [showNameModal, setShowNameModal] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem('playerName');
    if (storedName) {
      setPlayerName(storedName);
    }
  }, []);

  const handlePlay = () => {
    if (!playerName) {
      setShowNameModal(true);
    } else {
      setShowGame(true);
    }
  };

  const handleNameSubmit = (e) => {
    e.preventDefault();
    const rawName = e.target.elements.name.value.trim();

    const isValid = /^[a-zA-Z0-9]{1,7}$/.test(rawName);

    if (!isValid) {
      toast.error(
        'Name must be 1–7 characters with no spaces or special characters.'
      );
      return;
    }

    localStorage.setItem('playerName', rawName);
    setPlayerName(rawName);
    setShowNameModal(false);
  };

  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 5000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: 'green',
              secondary: 'black',
            },
          },
        }}
      />

      {showGame ? (
        <JumpGame playerName={playerName} />
      ) : (
        <LandingPage
          onPlay={handlePlay}
          onSetName={() => setShowNameModal(true)}
        />
      )}

      <AnimatePresence>
        {showNameModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.form
              onSubmit={handleNameSubmit}
              className="bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md text-center relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h2 className="text-2xl font-bold mb-4 text-white">
                Save your name
              </h2>
              <input
                type="text"
                name="name"
                placeholder="Your name"
                defaultValue={playerName}
                className="w-full px-4 py-2 mb-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                autoFocus
                maxLength={7}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
                }}
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700 transition"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setShowNameModal(false)}
                className="absolute top-2 right-4 text-gray-500 hover:text-red-500"
              >
                ✕
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
