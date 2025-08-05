// src/app/components/chat/user-selection-dialog/user-selection-dialog.component.ts
import { Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'app-user-selection-dialog',
  template: `
    <nb-card>
      <nb-card-header>Select User to Chat With</nb-card-header>
      <nb-card-body>
        <nb-list>
          <nb-list-item *ngFor="let user of users" (click)="selectUser(user)">
            <div class="d-flex align-items-center">
              <nb-user [name]="user.nom + ' ' + user.prenom" [title]="user.role"></nb-user>
            </div>
          </nb-list-item>
        </nb-list>
      </nb-card-body>
      <nb-card-footer>
        <button nbButton status="basic" (click)="cancel()">Cancel</button>
      </nb-card-footer>
    </nb-card>
  `
})
export class UserSelectionDialogComponent {
  users: any[] = [];

  constructor(protected dialogRef: NbDialogRef<UserSelectionDialogComponent>) {}

  selectUser(user: any): void {
    this.dialogRef.close(user);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
