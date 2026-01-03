import { create } from 'zustand';
import type { DataConnection } from 'peerjs';
import type { ConnectionState, ConnectionActions, Move, DisconnectReason } from '../types';
import { useGameStore } from './gameStore';

interface ConnectionStore extends ConnectionState, ConnectionActions {}

const initialState: ConnectionState = {
  peerId: null,
  remotePeerId: null,
  connectionStatus: 'disconnected',
  isHost: false,
  error: null,
  connection: null,
  rematchRequested: false,
  disconnectReason: 'none'
};

const generateRoomCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const useConnectionStore = create<ConnectionStore>((set, get) => ({
  ...initialState,

  createGame: async (): Promise<string> => {
    const state = get();
    
    // Don't create if already connected
    if (state.connectionStatus !== 'disconnected') {
      throw new Error('Already connected or connecting');
    }
    
    set({ 
      connectionStatus: 'connecting',
      isHost: true,
      error: null,
      disconnectReason: 'none'
    });
    
    try {
      // Generate room code
      const roomCode = generateRoomCode();
      
      // TODO: Implement PeerJS host creation
      // For now, simulate waiting for opponent
      set({
        peerId: roomCode,
        connectionStatus: 'connecting' // Stay in connecting until opponent joins
      });
      
      return roomCode;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create game';
      set({
        connectionStatus: 'error',
        error: errorMessage
      });
      throw error;
    }
  },

  joinGame: async (roomCode: string): Promise<void> => {
    const state = get();
    
    // Don't join if already connected
    if (state.connectionStatus !== 'disconnected') {
      throw new Error('Already connected or connecting');
    }
    
    // Validate room code format (6 alphanumeric characters)
    if (!roomCode?.trim()) {
      throw new Error('Room code is required');
    }
    
    const cleanCode = roomCode.trim().toUpperCase();
    if (cleanCode.length !== 6 || !/^[A-Z0-9]{6}$/.test(cleanCode)) {
      throw new Error('Room code must be 6 alphanumeric characters');
    }
    
    set({ 
      connectionStatus: 'connecting',
      isHost: false,
      error: null,
      disconnectReason: 'none'
    });
    
    try {
      // TODO: Implement PeerJS client connection
      // For now, simulate connection
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      set({
        peerId: generateRoomCode(),
        remotePeerId: cleanCode,
        connectionStatus: 'connected'
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to join game';
      set({
        connectionStatus: 'error',
        error: errorMessage
      });
      throw error;
    }
  },

  sendMove: (move: Move): void => {
    const state = get();
    const connection = state.connection as DataConnection | null;
    
    console.log('ConnectionStore sendMove called with:', move);
    console.log('Connection state:', { 
      status: state.connectionStatus, 
      connection: connection !== null,
      connectionOpen: connection?.open === true 
    });
    
    // Only send if connected
    if (state.connectionStatus !== 'connected' || connection?.open !== true) {
      console.warn('Cannot send move: not connected or connection not open');
      return;
    }
    
    try {
      const message = { type: 'move', column: move.column };
      console.log('Sending move via connection:', message);
      connection.send(message);
      console.log('Move sent successfully');
    } catch (error) {
      console.error('Error sending move:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to send move';
      set({ 
        connectionStatus: 'error',
        error: errorMessage 
      });
    }
  },

  disconnect: (): void => {
    const currentReason = get().disconnectReason;
    try {
      // TODO: Implement PeerJS cleanup
      console.log('Disconnecting...');
    } catch (error) {
      console.error('Error during disconnect:', error);
    } finally {
      // Reset to initial state but preserve disconnect reason if it was set by connection handlers
      set({
        ...initialState,
        // Keep the disconnect reason if it was set by connection error/close handlers
        disconnectReason: currentReason === 'none' ? 'self' : currentReason
      });
    }
  },

  setError: (error: string | null): void => {
    set({ 
      error,
      connectionStatus: error !== null ? 'error' : 'disconnected'
    });
  },

  setConnection: (connection: any | null): void => { // eslint-disable-line @typescript-eslint/no-explicit-any
    console.log('=== CONNECTIONSTORE: SETTING CONNECTION ===');
    console.log('ConnectionStore: Setting connection to:', connection?.peer ?? 'null');
    console.log('Connection state:', { 
      open: connection?.open ?? 'undefined', 
      type: connection?.type ?? 'undefined',
      reliable: connection?.reliable ?? 'undefined'
    });
    set({ connection });
  },

  requestRematch: (): void => {
    const state = get();
    const connection = state.connection as DataConnection | null;
    
    console.log('Requesting rematch from opponent');
    
    // Only send if connected
    if (state.connectionStatus !== 'connected' || connection?.open !== true) {
      console.warn('Cannot request rematch: not connected');
      return;
    }
    
    try {
      const message = { type: 'rematch' };
      console.log('Sending rematch request:', message);
      connection.send(message);
      console.log('Rematch request sent successfully');
    } catch (error) {
      console.error('Error sending rematch request:', error);
    }
  },

  acceptRematch: (): void => {
    const state = get();
    const connection = state.connection as DataConnection | null;
    
    console.log('Accepting rematch request');
    
    // Only send if connected
    if (state.connectionStatus !== 'connected' || connection?.open !== true) {
      console.warn('Cannot accept rematch: not connected');
      return;
    }
    
    try {
      const message = { type: 'rematch-accept' };
      console.log('Sending rematch acceptance:', message);
      connection.send(message);
      console.log('Rematch acceptance sent successfully');
      
      // Reset local game state
      const { resetGame } = useGameStore.getState();
      resetGame();
      
      // Clear rematch requested state
      set({ rematchRequested: false });
    } catch (error) {
      console.error('Error accepting rematch:', error);
    }
  },

  setRematchRequested: (requested: boolean): void => {
    console.log('Setting rematch requested to:', requested);
    set({ rematchRequested: requested });
  },

  setDisconnectReason: (reason: DisconnectReason): void => {
    console.log('Setting disconnect reason to:', reason);
    set({ disconnectReason: reason });
  }
}));