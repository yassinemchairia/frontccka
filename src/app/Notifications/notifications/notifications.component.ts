import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { NotificationService, Notification, NotificationType } from '../../Service/notification.service';
import { NbDialogService } from '@nebular/theme';
import { AuthService } from '../../Service/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';



@Component({
  selector: 'ngx-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  filteredNotifications: Notification[] = [];
  notificationTypes = Object.values(NotificationType);
  selectedType: string | null = null;
  currentPage = 1;
  itemsPerPage = 5;
  isLoading = false;
  currentUserId: number | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private notificationService: NotificationService,
    private authService: AuthService,
    private dialogService: NbDialogService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.authService.currentUserId$
      .pipe(takeUntil(this.destroy$))
      .subscribe(id => {
        this.currentUserId = id;
        this.loadNotifications();
      });
  }

  loadNotifications(): void {
    if (!this.currentUserId) {
      this.notifications = [];
      this.filteredNotifications = [];
      this.isLoading = false; // Ensure loading is false if no user
      return;
    }

    this.isLoading = true;
    this.notificationService.getNotifications()
      .pipe(takeUntil(this.destroy$))
      .subscribe(notifications => {
        this.notifications = notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // Sort by newest
        this.applyFilter();
        this.isLoading = false;
        this.cdr.detectChanges();
      }, error => {
        console.error('Erreur lors du chargement des notifications:', error);
        this.isLoading = false;
        // Optionnel: afficher un message d'erreur à l'utilisateur
      });
  }

  get paginatedNotifications(): Notification[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredNotifications.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredNotifications.length / this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  applyFilter(): void {
    this.filteredNotifications = this.selectedType
      ? this.notifications.filter(n => n.type === this.selectedType)
      : [...this.notifications];
    this.currentPage = 1;
  }

  markAsRead(idNotification: number): void {
    console.log('Marking as read, idNotification:', idNotification);
    if (!idNotification) {
        console.error('idNotification is undefined');
        return;
    }
    this.notificationService.markAsRead(idNotification);
}

  onTypeFilterChange(type: string | null): void {
    this.selectedType = type;
    this.applyFilter();
  }

  // Nouvelle méthode pour obtenir l'icône basée sur le type de notification
  getNotificationIcon(type: NotificationType): string {
    switch (type) {
      case NotificationType.INTERVENTION_ASSIGNED:
        return 'info-outline';
      case NotificationType. APPOINTMENT_REMINDER:
        return 'alert-triangle-outline';
      case NotificationType.    APPOINTMENT_ASSIGNED:
        return 'flash-outline';
      case NotificationType.INTERVENTION_PENDING:
        return 'checkmark-circle-outline';
      case NotificationType.INTERVENTION_COMPLETED: // Assuming a default or general type
        return 'bell-outline';
      default:
        return 'message-square-outline';
    }
  }

  // Nouvelle méthode pour obtenir le statut (couleur) de l'icône basée sur le type
  getNotificationStatus(type: NotificationType): string {
    switch (type) {
      case NotificationType.INTERVENTION_ASSIGNED:
        return 'info';
      case NotificationType.APPOINTMENT_REMINDER:
        return 'warning';
      case NotificationType.APPOINTMENT_ASSIGNED:
        return 'danger';
      case NotificationType.INTERVENTION_PENDING:
        return 'success';
      case NotificationType.INTERVENTION_COMPLETED:
        return 'basic';
      default:
        return 'primary';
    }
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}