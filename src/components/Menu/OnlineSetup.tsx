import { useState, useEffect } from 'react';
import { useConnectionStore } from '../../store/connectionStore';
import { useGameStore } from '../../store/gameStore';
import { usePeerConnection } from '../../hooks/usePeerConnection';

export default function OnlineSetup() {
  const [mode, setMode] = useState<'menu' | 'hosting' | 'joining'>('menu');
  const [roomCode, setRoomCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  
  const { 
    connectionStatus, 
    error 
  } = useConnectionStore();
  
  const { 
    createGame: peerCreateGame, 
    joinGame: peerJoinGame, 
    disconnect: peerDisconnect 
  } = usePeerConnection();
  
  const { setGameMode } = useGameStore();

  const handleCreateGame = async () => {
    try {
      setMode('hosting');
      // Generate room code locally (same logic as in connectionStore)
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let code = '';
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      setGeneratedCode(code);
      // Create peer connection with the room code
      await peerCreateGame(code);
    } catch (err) {
      console.error('Failed to create game:', err);
    }
  };

  const handleJoinGame = async () => {
    try {
      await peerJoinGame(roomCode);
    } catch (err) {
      console.error('Failed to join game:', err);
    }
  };

  const handleBack = () => {
    peerDisconnect();
    setGameMode('menu');
    setMode('menu');
    setRoomCode('');
    setGeneratedCode('');
  };

  // Auto-start game when connected
  useEffect(() => {
    if (connectionStatus === 'connected') {
      // Small delay to ensure connection is fully established
      setTimeout(() => {
        // Game will start automatically via App.tsx routing
      }, 500);
    }
  }, [connectionStatus]);

  const getStatusMessage = () => {
    switch (connectionStatus) {
      case 'connecting':
        return mode === 'hosting' ? 'WAITING FOR OPPONENT...' : 'CONNECTING...';
      case 'connected':
        return 'CONNECTED';
      case 'error':
        return error ?? 'CONNECTION ERROR';
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connecting':
        return 'text-yellow-400 animate-pulse';
      case 'connected':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      default:
        return '';
    }
  };

  if (mode === 'menu') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-amber-500 p-8">
        <div className="space-y-8 text-center">
          <h1 className="text-3xl font-mono font-bold tracking-wider">
            ONLINE MULTIPLAYER
          </h1>
          
          <div className="flex flex-col items-center space-y-4">
            <button
              onClick={handleCreateGame}
              className="w-64 px-6 py-3 border border-amber-500 text-amber-500 font-mono text-lg uppercase hover:bg-amber-500 hover:text-black transition-colors"
            >
              Create Game
            </button>
            
            <button
              onClick={() => setMode('joining')}
              className="w-64 px-6 py-3 border border-cyan-500 text-cyan-500 font-mono text-lg uppercase hover:bg-cyan-500 hover:text-black transition-colors"
            >
              Join Game
            </button>
          </div>

          <button
            onClick={handleBack}
            className="px-4 py-2 border border-gray-500 text-gray-500 font-mono text-sm uppercase hover:bg-gray-500 hover:text-black transition-colors"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'hosting') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-amber-500 p-8">
        <div className="space-y-8 text-center">
          <h1 className="text-2xl font-mono font-bold tracking-wider">
            HOST GAME
          </h1>
          
          <div className="space-y-4">
            <div>
              <p className="text-amber-600 font-mono text-sm uppercase mb-2">
                Room Code
              </p>
              <div className="text-4xl font-mono font-bold tracking-widest border border-amber-500 px-8 py-4">
                {generatedCode}
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-amber-600 font-mono text-sm">
                Share this code with your opponent
              </p>
            </div>
          </div>

          {getStatusMessage() !== null && (
            <div className={`text-lg font-mono font-bold ${getStatusColor()}`}>
              {getStatusMessage()}
            </div>
          )}

          <button
            onClick={handleBack}
            className="px-4 py-2 border border-gray-500 text-gray-500 font-mono text-sm uppercase hover:bg-gray-500 hover:text-black transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'joining') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-amber-500 p-8">
        <div className="space-y-8 text-center">
          <h1 className="text-2xl font-mono font-bold tracking-wider">
            JOIN GAME
          </h1>
          
          <div className="space-y-4">
            <div>
              <p className="text-cyan-600 font-mono text-sm uppercase mb-2">
                Enter Room Code
              </p>
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="ABC123"
                maxLength={6}
                className="text-2xl font-mono font-bold tracking-widest text-center border border-cyan-500 bg-black text-cyan-500 px-4 py-2 focus:outline-none focus:border-cyan-400"
              />
            </div>
            
            <button
              onClick={handleJoinGame}
              disabled={roomCode.length !== 6 || connectionStatus === 'connecting'}
              className="px-8 py-3 border border-cyan-500 text-cyan-500 font-mono text-lg uppercase hover:bg-cyan-500 hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {connectionStatus === 'connecting' ? 'CONNECTING...' : 'Connect'}
            </button>
          </div>

          {getStatusMessage() !== null && (
            <div className={`text-lg font-mono font-bold ${getStatusColor()}`}>
              {getStatusMessage()}
            </div>
          )}

          <button
            onClick={() => setMode('menu')}
            className="px-4 py-2 border border-gray-500 text-gray-500 font-mono text-sm uppercase hover:bg-gray-500 hover:text-black transition-colors"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return null;
}