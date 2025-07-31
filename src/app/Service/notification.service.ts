import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Client, Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { AuthService } from './auth.service';
import { take } from 'rxjs/operators';

export interface Notification {
  idNotification: number;
  utilisateur: { idUser: number };
  type: NotificationType;
  message: string;
  isRead: boolean;
  createdAt: string;
  readAt?: string;
  intervention?: { idIntervention: number };
  rendezVous?: { idRendezVous: number };
  alerte?: { idAlerte: number };
}

export enum NotificationType {
  INTERVENTION_ASSIGNED = 'INTERVENTION_ASSIGNED',
  APPOINTMENT_ASSIGNED = 'APPOINTMENT_ASSIGNED',
  APPOINTMENT_REMINDER = 'APPOINTMENT_REMINDER',
  INTERVENTION_PENDING = 'INTERVENTION_PENDING',
  INTERVENTION_COMPLETED = 'INTERVENTION_COMPLETED',
  NEW_ALERT_GENERATED = 'NEW_ALERT_GENERATED',
 
  HIGH_PRIORITY_ALERT = 'HIGH_PRIORITY_ALERT',
 TECHNICIAN_REGISTRATION = 'TECHNICIAN_REGISTRATION'
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'http://192.168.107.129:8087/api';
  private wsUrl = 'http://192.168.107.129:8087/ws/notifications';
  private stompClient: Client | null = null;
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  private unreadCountSubject = new BehaviorSubject<number>(0);
  private currentUserId: number | null = null;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.authService.currentUserId$.subscribe(id => {
      if (id !== this.currentUserId) {
        this.currentUserId = id;
        this.notificationsSubject.next([]);
        this.unreadCountSubject.next(0);
        this.initWebSocketConnection();
      }
    });
  }

  private initWebSocketConnection(): void {
    this.disconnectWebSocket();
    if (!this.currentUserId) return;
    this.stompClient = new Client({
        webSocketFactory: () => new SockJS(this.wsUrl),
        reconnectDelay: 5000,
        onConnect: () => {
            console.log('WebSocket connected for user:', this.currentUserId);
            this.subscribeToNotifications();
            this.fetchInitialData();
        },
        onStompError: (frame) => {
            console.error('WebSocket error:', frame);
        }
    });
    this.stompClient.activate();
}

  private subscribeToNotifications(): void {
    if (!this.stompClient || !this.currentUserId) return;

    this.stompClient.subscribe(
      `/topic/notifications/${this.currentUserId}`, 
      (message) => this.handleNotificationMessage(message)
    );
  }

  private handleNotificationMessage(message: any): void {
    try {
        const notification: Notification = JSON.parse(message.body);
        console.log('Received WebSocket notification:', notification);
        this.addOrUpdateNotification(notification);
    } catch (error) {
        console.error('Error parsing notification:', error);
    }
}

  private addOrUpdateNotification(notification: Notification): void {
    const currentNotifications = this.notificationsSubject.value;
    const index = currentNotifications.findIndex(n => n.idNotification === notification.idNotification);

    if (index >= 0) {
      currentNotifications[index] = notification;
    } else {
      currentNotifications.unshift(notification);
    }

    this.notificationsSubject.next([...currentNotifications]);
    this.updateUnreadCount();
  }

  private fetchInitialData(): void {
    this.fetchUnreadNotifications();
    this.fetchUnreadCount();
  }

  private fetchUnreadNotifications(): void {
    if (!this.currentUserId) return;

    this.http.get<Notification[]>(`${this.apiUrl}/notifications/unread?idUser=${this.currentUserId}`)
      .pipe(take(1))
      .subscribe({
        next: (notifications) => {
          this.notificationsSubject.next(notifications);
        },
        error: (error) => {
          console.error('Error fetching notifications:', error);
        }
      });
  }

  private fetchUnreadCount(): void {
    if (!this.currentUserId) return;

    this.http.get<number>(`${this.apiUrl}/notifications/unread/count?idUser=${this.currentUserId}`)
      .pipe(take(1))
      .subscribe({
        next: (count) => {
          this.unreadCountSubject.next(count);
        },
        error: (error) => {
          console.error('Error fetching unread count:', error);
        }
      });
  }

  private updateUnreadCount(): void {
    const unreadCount = this.notificationsSubject.value.filter(n => !n.isRead).length;
    this.unreadCountSubject.next(unreadCount);
  }

  private disconnectWebSocket(): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.deactivate();
    }
  }

  getNotifications(): Observable<Notification[]> {
    return this.notificationsSubject.asObservable();
  }

  getUnreadCount(): Observable<number> {
    return this.unreadCountSubject.asObservable();
  }

  markAsRead(idNotification: number): void {
    if (!this.currentUserId) {
        console.error('Cannot mark notification as read: currentUserId is missing');
        return;
    }
    if (!idNotification) {
        console.error('Cannot mark notification as read: idNotification is undefined');
        return;
    }
    console.log('Sending POST to mark as read:', `${this.apiUrl}/notifications/read/${idNotification}`);
    this.http.post(`${this.apiUrl}/notifications/read/${idNotification}`, {})
        .pipe(take(1))
        .subscribe({
            next: () => {
                console.log('Successfully marked notification as read:', idNotification);
                this.publishReadEvent(idNotification);
                this.updateNotificationReadStatus(idNotification);
            },
            error: (error) => {
                console.error('Error marking notification as read:', error.status, error.statusText, error.error);
                this.updateNotificationReadStatus(idNotification); // Update UI anyway
            }
        });
}

  private publishReadEvent(idNotification: number): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.publish({
        destination: `/app/notifications/read/${idNotification}`,
        body: JSON.stringify({})
      });
    }
  }

  private updateNotificationReadStatus(idNotification: number): void {
    const notifications = this.notificationsSubject.value.map(n => 
      n.idNotification === idNotification ? { ...n, isRead: true } : n
    );
    this.notificationsSubject.next(notifications);
    this.updateUnreadCount();
  }

  ngOnDestroy(): void {
    this.disconnectWebSocket();
  }
}
