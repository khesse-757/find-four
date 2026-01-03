import { useRef, useCallback } from 'react';
import Peer, { type DataConnection } from 'peerjs';
import { useConnectionStore } from '../store/connectionStore';
import { useGameStore } from '../store/gameStore';

interface PeerMessage {
  type: 'move' | 'rematch' | 'rematch-accept';
  column?: number;
}

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

export function usePeerConnection() {
  const peerRef = useRef<Peer | null>(null);
  const connectionRef = useRef<DataConnection | null>(null);
  
  const connectionStore = useConnectionStore();
  const { dropPiece } = useGameStore();

  const disconnect = useCallback((): void => {
    try {
      console.log('=== MANUAL DISCONNECT INITIATED ===');
      console.log('Current connection state:', {
        connectionExists: !!connectionRef.current,
        connectionOpen: connectionRef.current?.open,
        peerExists: !!peerRef.current,
        peerDestroyed: peerRef.current?.destroyed
      });
      
      // Set disconnect reason to 'self' when manually disconnecting
      connectionStore.setDisconnectReason('self');
      
      if (connectionRef.current) {
        console.log('Closing data connection...');
        connectionRef.current.close();
        connectionRef.current = null;
      }
      
      if (peerRef.current) {
        console.log('Destroying peer...');
        peerRef.current.destroy();
        peerRef.current = null;
      }
      
      console.log('Calling connectionStore.disconnect()...');
      connectionStore.disconnect();
      console.log('Manual disconnect completed');
    } catch (error) {
      console.error('Error during disconnect:', error);
    }
  }, [connectionStore]);

  const setupConnectionHandlers = useCallback((connection: DataConnection) => {
    console.log('=== SETTING UP CONNECTION HANDLERS ===');
    console.log('Setting up connection handlers for peer:', connection.peer);
    console.log('Connection state:', { 
      open: connection.open, 
      type: connection.type,
      reliable: connection.reliable
    });
    
    connection.on('data', (data: unknown) => {
      try {
        console.log('Received data:', data);
        const message = data as PeerMessage;
        
        if (message.type === 'move' && typeof message.column === 'number') {
          // Get fresh state from stores for debugging
          const { currentPlayer } = useGameStore.getState();
          const { isHost } = useConnectionStore.getState();
          
          console.log('Processing remote move:', { 
            column: message.column, 
            currentPlayer, 
            isHost,
            note: 'Always executing remote moves (sender already validated turn)'
          });
          
          // ALWAYS execute moves from remote peer - sender already validated it was their turn
          console.log('Dropping piece from remote peer at column:', message.column);
          dropPiece(message.column);
        } else if (message.type === 'rematch') {
          console.log('Received rematch request from opponent');
          connectionStore.setRematchRequested(true);
        } else if (message.type === 'rematch-accept') {
          console.log('Received rematch acceptance from opponent');
          const { resetGame } = useGameStore.getState();
          resetGame();
          connectionStore.setRematchRequested(false);
        }
      } catch (error) {
        console.error('Error processing received data:', error);
      }
    });

    connection.on('open', () => {
      console.log('Connection opened with peer:', connection.peer);
    });

    connection.on('close', () => {
      console.log('=== CONNECTION CLOSE EVENT FIRED ===');
      console.log('Connection closed with peer:', connection.peer);
      console.log('Connection state before close:', { 
        open: connection.open, 
        type: connection.type,
        metadata: connection.metadata 
      });
      connectionStore.setDisconnectReason('opponent-left');
      connectionStore.setError('Opponent disconnected');
      disconnect();
    });

    connection.on('error', (error) => {
      console.log('=== CONNECTION ERROR EVENT FIRED ===');
      console.error('Connection error with peer:', connection.peer);
      console.error('Error type:', error.type);
      console.error('Error message:', error.message);
      console.error('Full error object:', error);
      connectionStore.setDisconnectReason('connection-lost');
      connectionStore.setError('Connection error occurred');
    });
  }, [dropPiece, disconnect, connectionStore]);

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
        console.log('Host: connectionRef.current set to:', connectionRef.current);
        console.log('Host: connectionRef.current.open:', connectionRef.current?.open);
        
        // Store connection in Zustand store
        console.log('=== STORING CONNECTION IN ZUSTAND (HOST) ===');
        console.log('Connection to store:', connection.peer);
        connectionStore.setConnection(connection);
        
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
        console.log('=== HOST PEER ERROR EVENT ===');
        console.error('Host peer error:', error);
        console.error('Error type:', error.type);
        console.error('Error message:', error.message);
        console.error('Full error object:', error);
        connectionStore.setError(`Connection failed: ${error.message || error}`);
      });

      peer.on('disconnected', () => {
        console.log('=== HOST PEER DISCONNECTED FROM SIGNALING SERVER ===');
        console.log('Peer disconnected from signaling server');
        // Note: This doesn't mean the data connection closed, just the signaling connection
      });

      peer.on('close', () => {
        console.log('=== HOST PEER CONNECTION CLOSED ===');
        console.log('Peer connection closed completely');
        connectionStore.setDisconnectReason('connection-lost');
        connectionStore.setError('Peer connection closed');
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
      const peer = new Peer(peerConfig);
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
          
          // Store connection in Zustand store
          console.log('=== STORING CONNECTION IN ZUSTAND (GUEST) ===');
          console.log('Connection to store:', connection.peer);
          connectionStore.setConnection(connection);
          
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
        console.log('=== GUEST PEER ERROR EVENT ===');
        console.error('Guest peer error:', error);
        console.error('Error type:', error.type);
        console.error('Error message:', error.message);
        console.error('Full error object:', error);
        connectionStore.setError(`Failed to join game: ${error.message || error}`);
      });

      peer.on('disconnected', () => {
        console.log('=== GUEST PEER DISCONNECTED FROM SIGNALING SERVER ===');
        console.log('Peer disconnected from signaling server');
        // Note: This doesn't mean the data connection closed, just the signaling connection
      });

      peer.on('close', () => {
        console.log('=== GUEST PEER CONNECTION CLOSED ===');
        console.log('Peer connection closed completely');
        connectionStore.setDisconnectReason('connection-lost');
        connectionStore.setError('Peer connection closed');
      });

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to join game';
      connectionStore.setError(message);
      throw error;
    }
  }, [connectionStore, setupConnectionHandlers]);

  const sendMove = useCallback((column: number): void => {
    console.log('sendMove called with column:', column);
    const connection = connectionRef.current;
    console.log('Connection status:', { 
      connection: !!connection, 
      open: connection?.open,
      peer: connection?.peer 
    });
    
    if (connection?.open !== true) {
      console.warn('Cannot send move: no active connection');
      return;
    }

    try {
      const message: PeerMessage = {
        type: 'move',
        column
      };
      console.log('Sending message to peer:', message);
      connection.send(message);
      console.log('Message sent successfully');
    } catch (error) {
      console.error('Failed to send move:', error);
      connectionStore.setError('Failed to send move');
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
    error,
    requestRematch: connectionStore.requestRematch,
    acceptRematch: connectionStore.acceptRematch,
    rematchRequested: connectionStore.rematchRequested
  };
}