import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface CentroDistribuicao {
  nome: string;
  status: 'Normal' | 'Crítico';
  statusCor: 'success' | 'warning';
  skusAtivos: number;
  ocupacao: number;
}

@Component({
  selector: 'app-cd-status',
  imports: [
    CommonModule
  ],
  templateUrl: './cd-status.component.html',
  styleUrls: ['./cd-status.component.scss']
})
export class CdStatusComponent {
  cds: CentroDistribuicao[] = [
    {
      nome: 'CD São Paulo',
      status: 'Normal',
      statusCor: 'success',
      skusAtivos: 1250,
      ocupacao: 85
    },
    {
      nome: 'CD Rio de Janeiro',
      status: 'Normal',
      statusCor: 'success',
      skusAtivos: 980,
      ocupacao: 72
    },
    {
      nome: 'CD Belo Horizonte',
      status: 'Crítico',
      statusCor: 'warning',
      skusAtivos: 1430,
      ocupacao: 91
    }
  ];
}
