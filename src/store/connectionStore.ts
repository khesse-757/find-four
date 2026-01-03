import { create } from 'zustand';
import type { ConnectionState, ConnectionActions, Move } from '../types';

interface ConnectionStore extends ConnectionState, ConnectionActions {}

const initialState: ConnectionState = {
  peerId: null,
  remotePeerId: null,
  connectionStatus: 'disconnected',
  isHost: false,
  error: null
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
      error: null 
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
      error: null 
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
    
    // Only send if connected
    if (state.connectionStatus !== 'connected') {
      console.warn('Cannot send move: not connected');
      return;
    }
    
    try {
      // TODO: Implement PeerJS message sending
      console.log('Sending move:', move);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send move';
      set({ 
        connectionStatus: 'error',
        error: errorMessage 
      });
    }
  },

  disconnect: (): void => {
    try {
      // TODO: Implement PeerJS cleanup
      console.log('Disconnecting...');
    } catch (error) {
      console.error('Error during disconnect:', error);
    } finally {
      // Reset to initial state
      set({
        ...initialState
      });
    }
  },

  setError: (error: string | null): void => {
    set({ 
      error,
      connectionStatus: error !== null ? 'error' : 'disconnected'
    });
  }
}));