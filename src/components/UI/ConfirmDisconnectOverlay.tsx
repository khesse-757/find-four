interface ConfirmDisconnectOverlayProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDisconnectOverlay({
  onConfirm,
  onCancel
}: ConfirmDisconnectOverlayProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="bg-black border-2 border-amber-500 p-8 max-w-md w-full mx-4 text-center">
        {/* ASCII-style border effect */}
        <div className="border border-amber-600 p-6">
          <div className="space-y-6">
            {/* Title */}
            <div className="text-amber-500 font-mono text-xl uppercase tracking-wider">
              DISCONNECT?
            </div>

            {/* Message */}
            <div className="text-amber-600 font-mono text-sm uppercase">
              Are you sure you want to leave the game?
            </div>

            {/* Buttons */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={onConfirm}
                className="px-6 py-3 border border-red-400 text-red-400 font-mono text-sm uppercase hover:bg-red-400 hover:text-black transition-colors"
              >
                Yes, Leave
              </button>
              <button
                onClick={onCancel}
                className="px-6 py-3 border border-amber-500 text-amber-500 font-mono text-sm uppercase hover:bg-amber-500 hover:text-black transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
