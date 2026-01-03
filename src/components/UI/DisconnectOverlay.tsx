import type { DisconnectReason } from '../../types';

interface DisconnectOverlayProps {
  disconnectReason: DisconnectReason;
  onReturnToMenu: () => void;
}

export default function DisconnectOverlay({ 
  disconnectReason, 
  onReturnToMenu 
}: DisconnectOverlayProps) {
  const getDisconnectMessage = () => {
    switch (disconnectReason) {
      case 'opponent-left':
        return 'OPPONENT DISCONNECTED';
      case 'connection-lost':
        return 'CONNECTION LOST';
      default:
        return 'DISCONNECTED';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="bg-black border-2 border-amber-500 p-8 max-w-md w-full mx-4 text-center">
        {/* ASCII-style border effect */}
        <div className="border border-amber-600 p-6">
          <div className="space-y-6">
            {/* Disconnect message */}
            <div className="space-y-2">
              <div className="text-red-400 font-mono text-xl uppercase tracking-wider">
                CONNECTION ERROR
              </div>
              <div className="text-amber-500 font-mono text-lg uppercase tracking-wide">
                {getDisconnectMessage()}
              </div>
            </div>
            
            {/* Subtitle */}
            <div className="text-amber-600 font-mono text-sm uppercase">
              Game session ended
            </div>
            
            {/* Return button */}
            <button
              onClick={onReturnToMenu}
              className="px-8 py-3 border border-amber-500 text-amber-500 font-mono text-sm uppercase hover:bg-amber-500 hover:text-black transition-colors w-full"
            >
              Return to Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}