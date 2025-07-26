import { Component, OnInit, OnDestroy } from '@angular/core';
import { CapteurService } from '../../Service/capteur.service';
import { Capteur } from '../../Service/capteur.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ngx-capteur-monitoring',
  templateUrl: './capteur-monitoring.component.html',
  styleUrls: ['./capteur-monitoring.component.scss']
})
export class CapteurMonitoringComponent implements OnInit, OnDestroy {
  capteurs: Capteur[] = [];
  private subscriptions = new Subscription();

  // Seuils configurables pour chaque type de capteur
  private readonly thresholds = {
    TEMPERATURE: { highCritical: 40, critical: 28, normal: 17, low: 10, min: 0, max: 50 },
    HUMIDITE: { highCritical: 90, critical: 80, normal: 40, low: 30, min: 0, max: 100 },
    ELECTRICITE: { on: 'EN_MARCHE', off: 'ARRET' }
  };
trackById: any;

  constructor(private capteurService: CapteurService) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.capteurService.getCapteurs().subscribe({
        next: (data: Capteur | Capteur[]) => {
          if (Array.isArray(data)) {
            this.capteurs = data;
          } else {
            const capteurData = data as Capteur;
            const index = this.capteurs.findIndex(c => c.idCapt === capteurData.idCapt);
            if (index >= 0) {
              this.capteurs[index] = capteurData;
            } else {
              this.capteurs.push(capteurData);
            }
          }
        },
        error: (err) => console.error('Capteurs error:', err)
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getStatusClass(capteur: Capteur): string {
    if (capteur.valeurActuelle === null || capteur.valeurActuelle === undefined) return 'unknown';

    const thresholds = this.thresholds[capteur.type];
    if (!thresholds) return 'unknown';

    switch (capteur.type) {
      case 'TEMPERATURE':
      case 'HUMIDITE':
        if (capteur.valeurActuelle >= thresholds.highCritical) return 'high-critical';
        if (capteur.valeurActuelle >= thresholds.critical) return 'critical';
        if (capteur.valeurActuelle >= thresholds.normal) return 'normal';
        if (capteur.valeurActuelle >= thresholds.low) return 'bas';
        return 'bas-critique';
      case 'ELECTRICITE':
        return capteur.etatElectricite === thresholds.on ? 'normal' : 'bas-critique';
      default:
        return 'unknown';
    }
  }

  getStatusLabel(capteur: Capteur): string {
    const status = this.getStatusClass(capteur);
    const labels: { [key: string]: string } = {
      normal: 'Normal',
      bas: 'Bas',
      'bas-critique': 'Bas Critique',
      critical: 'Critique',
      'high-critical': 'Urgence',
      unknown: 'Inconnu'
    };

    if (capteur.type === 'ELECTRICITE') {
      return capteur.etatElectricite === this.thresholds.ELECTRICITE.on ? 'Marche' : 'Arrêt';
    }

    return labels[status] || status;
  }

  isRecentlyUpdated(capteur: Capteur): boolean {
    return new Date().getTime() - new Date(capteur.derniereMiseAJour).getTime() < 2000;
  }

  getPercentage(value: number, min: number, max: number): number {
    if (value === null || value === undefined) return 0;
    const clampedValue = Math.max(min, Math.min(max, value));
    return ((clampedValue - min) / (max - min)) * 100;
  }

  getTemperatureValue(value: number): number {
    return this.getPercentage(value, this.thresholds.TEMPERATURE.min, this.thresholds.TEMPERATURE.max);
  }

  getHumidityValue(value: number): number {
    return this.getPercentage(value, this.thresholds.HUMIDITE.min, this.thresholds.HUMIDITE.max);
  }

  getHumidityNeedleAngle(value: number): number {
    if (value === null || value === undefined) return -90;
    const clampedValue = Math.max(this.thresholds.HUMIDITE.min, Math.min(this.thresholds.HUMIDITE.max, value));
    return -90 + (clampedValue / this.thresholds.HUMIDITE.max * 180);
  }

  formatValue(capteur: Capteur): string {
    if (capteur.valeurActuelle === null || capteur.valeurActuelle === undefined) {
      return 'N/A';
    }
    if (capteur.type === 'ELECTRICITE') {
      return this.getStatusLabel(capteur);
    }
    return `${capteur.valeurActuelle.toFixed(1)} ${capteur.uniteMesure}`;
  }
}