import { Component, OnInit, OnDestroy } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';
import { NotificationService } from '../Service/notification.service';
import { AuthService } from '../Service/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { getMenuItemsByRole, Role } from './pages-menu';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <nb-layout>
      <nb-layout-header>
        <h1>CCK Dashboard</h1>
      </nb-layout-header>
      <nb-sidebar>
        <nb-menu [items]="menuItems"></nb-menu>
      </nb-sidebar>
      <nb-layout-column>
        <ngx-notification-toast></ngx-notification-toast>
        <router-outlet></router-outlet>
      </nb-layout-column>
    </nb-layout>
  `
})
export class PagesComponent implements OnInit, OnDestroy {
  menuItems: NbMenuItem[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUserRole$
      .pipe(takeUntil(this.destroy$))
      .subscribe(role => {
        this.menuItems = getMenuItemsByRole(role as Role);
        this.updateDynamicLinks();
        this.updateNotificationCount();
      });
  }

  private updateDynamicLinks(): void {
    this.authService.currentUserId$
      .pipe(takeUntil(this.destroy$))
      .subscribe(userId => {
        this.menuItems.forEach(item => {
          if (item.data?.isDynamicLink && item.data?.basePath) {
            item.link = userId !== null ? `${item.data.basePath}/${userId}` : '/auth/login';
          }
        });
        this.menuItems = [...this.menuItems]; // Trigger change detection
      });
  }

  private updateNotificationCount(): void {
    this.notificationService.getUnreadCount()
      .pipe(takeUntil(this.destroy$))
      .subscribe(count => {
        const notificationItem = this.menuItems.find(item => item.title === 'Notifications');
        if (notificationItem && notificationItem.badge) {
          notificationItem.badge.text = count.toString();
          this.menuItems = [...this.menuItems]; // Trigger change detection
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}