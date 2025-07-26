import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Intervention1DTO } from '../../Service/alert.service';

@Component({
  selector: 'app-intervention-details-modal',
  templateUrl: './intervention-details-modal.component.html',
  styleUrls: ['./intervention-details-modal.component.scss'],
})
export class InterventionDetailsModalComponent {
  constructor(
    public dialogRef: MatDialogRef<InterventionDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Intervention1DTO
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}