import { useRef, useCallback } from 'react';
import Peer, { type DataConnection } from 'peerjs';
import { useConnectionStore } from '../store/connectionStore';
import { useGameStore } from '../store/gameStore';

interface PeerMessage {
  type: 'move';
  column: number;
}

export function usePeerConnection() {
  const peerRef = useRef<Peer | null>(null);
  const connectionRef = useRef<DataConnection | null>(null);
  
  const connectionStore = useConnectionStore();
  const { dropPiece } = useGameStore();

  // PeerJS configuration with ICE servers for better WebRTC connectivity
  const peerConfig = {
    debug: 2,
    config: {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' }
      ]
    }
  };

  const setupConnectionHandlers = useCallback((connection: DataConnection) => {
    console.log('Setting up connection handlers for peer:', connection.peer);
    
    connection.on('data', (data: unknown) => {
      try {
        console.log('Received data:', data);
        const message = data as PeerMessage;
        
        if (message.type === 'move' && typeof message.column === 'number') {
          // Get fresh state from stores to avoid stale closure
          const { currentPlayer } = useGameStore.getState();
          const { isHost } = useConnectionStore.getState();
          
          console.log('Processing move:', { 
            column: message.column, 
            currentPlayer, 
            isHost,
            shouldProcess: (isHost && currentPlayer === 2) || (!isHost && currentPlayer === 1)
          });
          
          // Only process moves if it's the remote player's turn
          if ((isHost && currentPlayer === 2) || (!isHost && currentPlayer === 1)) {
            console.log('Dropping piece at column:', message.column);
            dropPiece(message.column);
          } else {
            console.log('Ignoring move - not remote player turn');
          }
        }
      } catch (error) {
        console.error('Error processing received data:', error);
      }
    });

    connection.on('open', () => {
      console.log('Connection opened with peer:', connection.peer);
    });

    connection.on('close', () => {
      console.log('Connection closed with peer:', connection.peer);
      connectionStore.setError('Opponent disconnected');
      disconnect();
    });

    connection.on('error', (error) => {
      console.error('Connection error with peer:', connection.peer);
      console.error('Full error object:', error);
      connectionStore.setError('Connection error occurred');
    });
  }, [dropPiece]);

  const createGame = useCallback(async (roomCode: string): Promise<void> => {
    try {
      // Create peer with room code as ID (using public PeerJS server)
      const peer = new Peer(roomCode, peerConfig);
      
      peerRef.current = peer;

      peer.on('open', (id) => {
        console.log('Host peer opened with ID:', id);
        console.log('Peer object:', peer);
        connectionStore.createGame().then(() => {
          // Host stays in 'connecting' state until opponent joins
          console.log('Host created, waiting for connections...');
        }).catch((error) => {
          console.error('Error in connectionStore.createGame:', error);
        });
      });

      peer.on('connection', (connection) => {
        console.log('Incoming connection from:', connection.peer);
        connectionRef.current = connection;
        
        // Set up connection handlers
        setupConnectionHandlers(connection);
        
        // Update connection store to 'connected'
        connectionStore.setError(null);
        // Manually update to connected state since we have a connection
        useConnectionStore.setState({
          ...useConnectionStore.getState(),
          connectionStatus: 'connected',
          remotePeerId: connection.peer
        });
      });

      peer.on('error', (error) => {
        console.error('Host peer error:', error);
        console.error('Full error object:', error);
        connectionStore.setError(`Connection failed: ${error.message || error}`);
      });

      peer.on('disconnected', () => {
        console.log('Peer disconnected from signaling server');
      });

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create game';
      connectionStore.setError(message);
      throw error;
    }
  }, [connectionStore, setupConnectionHandlers]);

  const joinGame = useCallback(async (roomCode: string): Promise<void> => {
    try {
      // Create peer with auto-generated ID (using public PeerJS server)
      const peer = new Peer(undefined, peerConfig);
      peerRef.current = peer;

      peer.on('open', (id) => {
        console.log('Guest peer opened with ID:', id);
        console.log('Attempting to connect to room code:', roomCode);
        
        // Connect to host
        const connection = peer.connect(roomCode, { reliable: true });
        connectionRef.current = connection;
        console.log('Connection object created with reliable=true:', connection);

        connection.on('open', () => {
          console.log('Guest connection opened - successfully connected to host:', roomCode);
          setupConnectionHandlers(connection);
          
          // Update connection store
          connectionStore.joinGame(roomCode).catch((error) => {
            console.error('Error in connectionStore.joinGame:', error);
          });
        });

        connection.on('error', (error) => {
          console.error('Guest connection error:', error);
          console.error('Full error object:', error);
          connectionStore.setError(`Could not connect to room: ${error.message || error}`);
        });
      });

      peer.on('error', (error) => {
        console.error('Guest peer error:', error);
        console.error('Full error object:', error);
        connectionStore.setError(`Failed to join game: ${error.message || error}`);
      });

      peer.on('disconnected', () => {
        console.log('Peer disconnected from signaling server');
      });

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to join game';
      connectionStore.setError(message);
      throw error;
    }
  }, [connectionStore, setupConnectionHandlers]);

  const sendMove = useCallback((column: number): void => {
    const connection = connectionRef.current;
    if (!connection || !connection.open) {
      console.warn('Cannot send move: no active connection');
      return;
    }

    try {
      const message: PeerMessage = {
        type: 'move',
        column
      };
      connection.send(message);
    } catch (error) {
      console.error('Failed to send move:', error);
      connectionStore.setError('Failed to send move');
    }
  }, [connectionStore]);

  const disconnect = useCallback((): void => {
    try {
      if (connectionRef.current) {
        connectionRef.current.close();
        connectionRef.current = null;
      }
      
      if (peerRef.current) {
        peerRef.current.destroy();
        peerRef.current = null;
      }
      
      connectionStore.disconnect();
    } catch (error) {
      console.error('Error during disconnect:', error);
    }
  }, [connectionStore]);

  const isConnected = connectionStore.connectionStatus === 'connected';
  const error = connectionStore.error;

  return {
    createGame,
    joinGame,
    sendMove,
    disconnect,
    isConnected,
    error
  };
}