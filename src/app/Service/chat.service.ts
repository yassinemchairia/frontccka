import { Injectable, OnDestroy } from '@angular/core';
import { Client, Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { takeUntil, filter, tap } from 'rxjs/operators';

export interface ChatMessageDTO {
  senderId: number;
  receiverId: number;
 content: string;
  filePath?: string; // Add file path
  fileType?: string; // Add file type
  fileName?: string; // Add file name
  timestamp: string;
}

export interface Utilisateur {
  idUser: number;
  nom: string;
  prenom: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService implements OnDestroy {
  private wsUrl = 'http://localhost:8087/ws/chat';
  private apiUrl = 'http://localhost:8087/api/chat';
  private fileApiUrl = 'http://localhost:8087/api/files';
  private stompClient: Client | null = null;
  private messagesSubject = new BehaviorSubject<ChatMessageDTO[]>([]);
  private connectedUsersSubject = new BehaviorSubject<Utilisateur[]>([]);
  private currentUserId: number | null = null;
  private currentUserEmail: string | null = null;
  private destroy$ = new Subject<void>();
  private isConnected = false;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.initializeConnection();
  }

  private initializeConnection(): void {
    this.authService.currentUserId$
      .pipe(takeUntil(this.destroy$))
      .subscribe(id => {
        console.log('[ChatService] User ID updated:', id);
        this.currentUserId = id;
        if (id) {
          this.setupUserEmailAndConnect();
        } else {
          this.disconnectWebSocket();
        }
      });
  }

  private setupUserEmailAndConnect(): void {
    this.authService.currentUserRole$
      .pipe(takeUntil(this.destroy$), filter(role => !!role))
      .subscribe(() => {
        const token = this.authService.getAccessToken();
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            this.currentUserEmail = payload.sub;
            console.log('[ChatService] Initializing WebSocket with email:', this.currentUserEmail, 'userId:', this.currentUserId);
            this.initWebSocketConnection();
            this.fetchConnectedUsers();
          } catch (e) {
            console.error('[ChatService] Error parsing token:', e);
          }
        }
      });
  }

  private initWebSocketConnection(): void {
    if (this.isConnected) {
      console.log('[ChatService] WebSocket already connected');
      return;
    }

    console.log('[ChatService] Creating new WebSocket connection');
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(this.wsUrl),
      connectHeaders: { userId: this.currentUserId?.toString() || '' },
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      debug: (str) => console.log('[STOMP]', str),
      onConnect: (frame) => {
        this.isConnected = true;
        console.log('[ChatService] WebSocket connected successfully', frame);
        this.subscribeToChannels();
        this.notifyUserConnected();
      },
      onStompError: (frame) => {
        console.error('[ChatService] STOMP error:', frame.headers.message, frame.body);
        this.isConnected = false;
        this.reconnect();
      },
      onWebSocketError: (error) => {
        console.error('[ChatService] WebSocket error:', error);
        this.isConnected = false;
        this.reconnect();
      },
      onWebSocketClose: (event) => {
        console.log('[ChatService] WebSocket closed:', event);
        this.isConnected = false;
        this.reconnect();
      }
    });

    this.stompClient.activate();
  }

  private reconnect(): void {
    console.log('[ChatService] Attempting to reconnect WebSocket in 5 seconds');
    setTimeout(() => {
      if (!this.isConnected) {
        this.initWebSocketConnection();
      }
    }, 5000);
  }

  resubscribeToChannels(): void {
    console.log('[ChatService] Forcing re-subscription to WebSocket channels');
    if (this.stompClient?.connected) {
      this.stompClient.unsubscribe('sub-messages');
      this.subscribeToChannels();
    }
  }

  private subscribeToChannels(): void {
    if (!this.stompClient || !this.currentUserId) {
      console.error('[ChatService] Cannot subscribe - STOMP client not initialized or no user ID');
      return;
    }

    const messageDestination = `/topic/messages/${this.currentUserId}`;
    this.stompClient.subscribe(messageDestination, (message) => {
      console.log('[ChatService] Raw WebSocket message received on', messageDestination, ':', message.body);
      this.handleIncomingMessage(message);
    }, { id: 'sub-messages' });

    this.stompClient.subscribe('/topic/connected-users', (message) => {
      console.log('[ChatService] Received connected users update:', message.body);
      this.handleConnectedUsersUpdate(message);
    }, { id: 'sub-users' });

    setInterval(() => {
      if (this.stompClient?.connected) {
        console.log('[ChatService] Still subscribed to:', messageDestination);
      }
    }, 10000);

    console.log('[ChatService] Subscribed to WebSocket channels');
  }

  private handleIncomingMessage(message: any): void {
    try {
      const chatMessage: ChatMessageDTO = JSON.parse(message.body);
      console.log('[ChatService] Parsed incoming message:', chatMessage);
      console.log('[ChatService] Message details: senderId=', chatMessage.senderId, 
                  'receiverId=', chatMessage.receiverId, 
                  'content=', chatMessage.content, 
                  'filePath=', chatMessage.filePath,
                  'fileType=', chatMessage.fileType,
                  'fileName=', chatMessage.fileName,
                  'timestamp=', chatMessage.timestamp,
                  'currentUserId=', this.currentUserId);

      if (chatMessage.receiverId === this.currentUserId || chatMessage.senderId === this.currentUserId) {
        const currentMessages = this.messagesSubject.value;
        const isDuplicate = currentMessages.some(m => 
          m.senderId === chatMessage.senderId &&
          m.receiverId === chatMessage.receiverId &&
          m.content === chatMessage.content &&
          m.filePath === chatMessage.filePath
        );

        if (!isDuplicate) {
          console.log('[ChatService] Adding new message to state:', chatMessage);
          this.messagesSubject.next([...currentMessages, chatMessage]);
        } else {
          console.log('[ChatService] Ignoring duplicate message:', chatMessage);
        }
      } else {
        console.log('[ChatService] Message ignored - not relevant to current user:', this.currentUserId);
      }
    } catch (e) {
      console.error('[ChatService] Error parsing chat message:', e, 'Raw message:', message.body);
    }
  }

  private handleConnectedUsersUpdate(message: any): void {
    try {
      const users: Utilisateur[] = JSON.parse(message.body);
      console.log('[ChatService] Updated connected users list:', users);
      this.connectedUsersSubject.next(users);
    } catch (e) {
      console.error('[ChatService] Error parsing connected users:', e);
    }
  }

  private notifyUserConnected(): void {
    if (!this.stompClient || !this.currentUserId || !this.currentUserEmail) {
      console.error('[ChatService] Cannot notify user connected - missing required data');
      return;
    }

    console.log('[ChatService] Notifying server about user connection');
    this.stompClient.publish({
      destination: '/app/chat.addUser',
      body: JSON.stringify({
        userId: this.currentUserId,
        email: this.currentUserEmail
      })
    });
  }
// src/app/Service/chat.service.ts
downloadFile(filePath: string): Observable<Blob> {
  const headers = new HttpHeaders({
    Authorization: `Bearer ${this.authService.getAccessToken()}`
  });
  return this.http.get(`${this.fileApiUrl}/download/${filePath}`, {
    headers,
    responseType: 'blob'
  });
}
  sendMessage(receiverId: number, content: string): void {
    if (!this.isConnected || !this.currentUserId) {
      console.error('[ChatService] Cannot send message - WebSocket not connected or user not logged in');
      return;
    }

    const message: ChatMessageDTO = {
      senderId: this.currentUserId,
      receiverId,
      content,
      timestamp: new Date().toISOString()
    };

    console.log('[ChatService] Sending message:', message);
    this.stompClient?.publish({
      destination: '/app/chat.send',
      body: JSON.stringify(message)
    });

    const currentMessages = this.messagesSubject.value;
    const isDuplicate = currentMessages.some(m => 
      m.senderId === message.senderId &&
      m.receiverId === message.receiverId &&
      m.content === message.content
    );

    if (!isDuplicate) {
      console.log('[ChatService] Optimistically adding message to state:', message);
      this.messagesSubject.next([...currentMessages, message]);
    } else {
      console.log('[ChatService] Optimistic update skipped - message already exists:', message);
    }
  }

  uploadFile(receiverId: number, file: File): Observable<ChatMessageDTO> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('senderId', this.currentUserId?.toString() || '');
    formData.append('receiverId', receiverId.toString());

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`
    });

    return this.http.post<ChatMessageDTO>(`${this.fileApiUrl}/upload`, formData, { headers });
  }

  getMessages(): Observable<ChatMessageDTO[]> {
    return this.messagesSubject.asObservable();
  }

  getConnectedUsers(): Observable<Utilisateur[]> {
    return this.connectedUsersSubject.asObservable();
  }

  fetchConnectedUsers(): void {
    console.log('[ChatService] Fetching connected users via HTTP');
    this.http.get<Utilisateur[]>(`${this.apiUrl}/connected-users`, {
      headers: { Authorization: `Bearer ${this.authService.getAccessToken()}` }
    })
      .subscribe({
        next: (users) => {
          console.log('[ChatService] Received connected users:', users);
          this.connectedUsersSubject.next(users);
        },
        error: (err) => {
          console.error('[ChatService] Error fetching connected users:', err);
        }
      });
  }

  fetchChatHistory(userId1: number, userId2: number): Observable<ChatMessageDTO[]> {
    console.log('[ChatService] Fetching chat history between', userId1, 'and', userId2);
    return this.http.get<ChatMessageDTO[]>(`${this.apiUrl}/history/${userId1}/${userId2}`, {
      headers: { Authorization: `Bearer ${this.authService.getAccessToken()}` }
    })
      .pipe(
        tap(messages => {
          console.log('[ChatService] Received chat history:', messages.length, 'messages');
          const currentMessages = this.messagesSubject.value;
          const mergedMessages = [...currentMessages];

          messages.forEach(message => {
            if (!mergedMessages.some(m => 
              m.senderId === message.senderId && 
              m.receiverId === message.receiverId && 
              m.content === message.content &&
              m.filePath === message.filePath
            )) {
              mergedMessages.push(message);
            }
          });

          console.log('[ChatService] Merged messages:', mergedMessages.length);
          this.messagesSubject.next(mergedMessages);
        })
      );
  }

  private disconnectWebSocket(): void {
    if (this.stompClient && this.stompClient.connected) {
      console.log('[ChatService] Disconnecting WebSocket');
      this.stompClient.deactivate();
    }
    this.isConnected = false;
  }

  ngOnDestroy(): void {
    console.log('[ChatService] Destroying service');
    this.disconnectWebSocket();
    this.destroy$.next();
    this.destroy$.complete();
  }

}
