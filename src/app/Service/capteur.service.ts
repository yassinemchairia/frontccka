import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter, switchMap, take, takeUntil } from 'rxjs/operators';
import { Client, IMessage, IFrame } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Capteur } from './capteur.model';
import { Alertes } from './alertes.model';

@Injectable({
  providedIn: 'root'
})
export class CapteurService implements OnDestroy {
  private stompClient: Client;
  private isConnected$ = new BehaviorSubject<boolean>(false);
  private destroy$ = new Subject<void>();
  private readonly RECONNECT_DELAY = 5000;
  private readonly MAX_RECONNECT_ATTEMPTS = 5;
  private reconnectAttempts = 0;

  constructor() {
    this.initializeStompClient();
  }

  private initializeStompClient(): void {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS('http://192.168.107.129:8087/ws/capteurs'),
      reconnectDelay: this.RECONNECT_DELAY,
      debug: (msg: string) => console.log('[STOMP]', msg),
      onConnect: () => this.handleSuccessfulConnection(),
      onStompError: (frame: IFrame) => this.handleConnectionError(frame),
      onWebSocketClose: () => this.handleConnectionClose()
    });

    this.stompClient.activate();
  }

  private handleSuccessfulConnection(): void {
    console.log('STOMP connection established');
    this.reconnectAttempts = 0;
    this.isConnected$.next(true);
    this.requestInitialData();
  }

  private handleConnectionError(frame: IFrame): void {
    console.error('STOMP error:', frame.headers?.message || frame.body);
    this.attemptReconnection();
  }

  private handleConnectionClose(): void {
    console.log('WebSocket disconnected');
    this.isConnected$.next(false);
    this.attemptReconnection();
  }

  private attemptReconnection(): void {
    if (this.reconnectAttempts < this.MAX_RECONNECT_ATTEMPTS) {
      this.reconnectAttempts++;
      console.log(`Reconnection attempt ${this.reconnectAttempts}/${this.MAX_RECONNECT_ATTEMPTS}`);
      setTimeout(() => this.stompClient.activate(), this.RECONNECT_DELAY);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  private requestInitialData(): void {
    this.stompClient.publish({
      destination: '/app/getInitialCapteurs',
      body: JSON.stringify({})
    });
  }

  getCapteurs(): Observable<Capteur[]> {
  return this.isConnected$.pipe(
    filter(connected => connected),
    switchMap(() => new Observable<Capteur[]>(observer => {
      this.requestInitialData();

      const subscription = this.stompClient.subscribe(
        '/topic/capteurs',
        (message: IMessage) => {
          try {
            const data = JSON.parse(message.body);
            // Toujours émettre les données telles qu'elles sont reçues
            observer.next(data);
          } catch (error) {
            console.error('Error parsing message:', error);
          }
        },
        { id: `sub-capteurs-${Date.now()}` }
      );

      return () => subscription.unsubscribe();
    })),
    takeUntil(this.destroy$)
  );
}

  getAlertes(): Observable<Alertes> {
    return this.isConnected$.pipe(
      filter(connected => connected),
      take(1),
      switchMap(() => new Observable<Alertes>(observer => {
        const subscription = this.stompClient.subscribe(
          '/topic/alertes',
          (message: IMessage) => this.handleIncomingMessage(message, observer),
          { id: `sub-alertes-${Date.now()}` }
        );

        return () => subscription.unsubscribe();
      })),
      takeUntil(this.destroy$)
    );
  }

  private handleIncomingMessage<T>(message: IMessage, observer: { next: (value: T) => void }): void {
  try {
    const rawData = JSON.parse(message.body);
    // Convertir les dates string en objets Date
    if (Array.isArray(rawData)) {
      const data = rawData.map(item => ({
        ...item,
        derniereMiseAJour: new Date(item.derniereMiseAJour)
      })) as T;
      observer.next(data);
    } else {
      const data = {
        ...rawData,
        derniereMiseAJour: new Date(rawData.derniereMiseAJour)
      } as T;
      observer.next(data);
    }
  } catch (error) {
    console.error('Error parsing message:', error);
  }
}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    
    if (this.stompClient?.active) {
      this.stompClient.deactivate().then(() => {
        console.log('STOMP client deactivated');
      });
    }
  }
}
