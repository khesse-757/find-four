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
      // TODO: Implement PeerJS host creation
      // For now, generate a mock room code
      const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      set({
        peerId: roomCode,
        connectionStatus: 'connected'
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
    
    // Validate room code
    if (!roomCode?.length || roomCode.length !== 6) {
      throw new Error('Invalid room code');
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
        peerId: Math.random().toString(36).substring(2, 8),
        remotePeerId: roomCode,
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