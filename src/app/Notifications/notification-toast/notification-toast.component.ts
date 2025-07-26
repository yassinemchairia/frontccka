import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService, Notification, NotificationType } from '../../Service/notification.service';
import { NbToastrService, NbGlobalPosition, NbGlobalPhysicalPosition } from '@nebular/theme';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ngx-notification-toast',
  template: '',
})
export class NotificationToastComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  private displayedNotificationIds = new Set<number>();

  constructor(
    private notificationService: NotificationService,
    private toastrService: NbToastrService
  ) {}

  ngOnInit(): void {
    this.notificationService.getNotifications()
      .pipe(takeUntil(this.destroy$))
      .subscribe(notifications => {
        const unreadNotifications = notifications.filter(n => !n.isRead && !this.displayedNotificationIds.has(n.idNotification));
        
        unreadNotifications.forEach(notification => {
          this.displayedNotificationIds.add(notification.idNotification);
          this.showToast(notification);
        });
      });
  }

 private showToast(notification: Notification): void {
  const toastRef = this.toastrService.show(
    `${notification.message} 
    `,
    this.getNotificationTitle(notification.type),
    {
      position: this.position,
      status: this.getNotificationStatus(notification.type),
      duration: 10000,
      icon: this.getNotificationIcon(notification.type),
      destroyByClick: true,
      hasIcon: true,
    }
  );

  // Gestion du clic via le document
  setTimeout(() => {
    const buttons = document.querySelectorAll('.mark-read-button');
    buttons.forEach(button => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        this.notificationService.markAsRead(notification.idNotification);
        this.displayedNotificationIds.delete(notification.idNotification);
        toastRef.close();
      });
    });
  }, 100);

  toastRef.onClose().subscribe(() => {
    this.displayedNotificationIds.delete(notification.idNotification);
  });
}

  private getNotificationTitle(type: NotificationType): string {
    const typeTitles = {
      [NotificationType.INTERVENTION_ASSIGNED]: 'Intervention assignée',
      [NotificationType.APPOINTMENT_ASSIGNED]: 'Rendez-vous assigné',
      [NotificationType.APPOINTMENT_REMINDER]: 'Rappel de rendez-vous',
      [NotificationType.INTERVENTION_PENDING]: 'Intervention en attente',
      [NotificationType.INTERVENTION_COMPLETED]: 'Intervention terminée',
      [NotificationType.NEW_ALERT_GENERATED]: 'Nouvelle alerte',
      [NotificationType.HIGH_PRIORITY_ALERT]: 'Alerte haute priorité',
      [NotificationType.TECHNICIAN_REGISTRATION]: 'Nouveau technicien'
    };
    return typeTitles[type] || 'Notification';
  }

  private getNotificationStatus(type: NotificationType): string {
    switch (type) {
      case NotificationType.INTERVENTION_ASSIGNED: return 'info';
      case NotificationType.APPOINTMENT_ASSIGNED: return 'danger';
      case NotificationType.APPOINTMENT_REMINDER: return 'warning';
      case NotificationType.INTERVENTION_PENDING: return 'primary';
      case NotificationType.INTERVENTION_COMPLETED: return 'success';
      case NotificationType.NEW_ALERT_GENERATED: return 'danger';
      case NotificationType.HIGH_PRIORITY_ALERT: return 'danger';
      case NotificationType.TECHNICIAN_REGISTRATION: return 'info';
      default: return 'basic';
    }
  }

  private getNotificationIcon(type: NotificationType): string {
    switch (type) {
      case NotificationType.INTERVENTION_ASSIGNED: return 'briefcase-outline';
      case NotificationType.APPOINTMENT_ASSIGNED: return 'calendar-outline';
      case NotificationType.APPOINTMENT_REMINDER: return 'alert-circle-outline';
      case NotificationType.INTERVENTION_PENDING: return 'clock-outline';
      case NotificationType.INTERVENTION_COMPLETED: return 'checkmark-circle-outline';
      case NotificationType.NEW_ALERT_GENERATED: return 'alert-triangle-outline';
      case NotificationType.HIGH_PRIORITY_ALERT: return 'flash-outline';
      case NotificationType.TECHNICIAN_REGISTRATION: return 'person-add-outline';
      default: return 'bell-outline';
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}