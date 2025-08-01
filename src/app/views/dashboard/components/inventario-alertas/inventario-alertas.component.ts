import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-inventario-alertas',
  imports: [
    CommonModule
  ],
  templateUrl: './inventario-alertas.component.html',
  styleUrl: './inventario-alertas.component.scss'
})
export class InventarioAlertasComponent {
  inventarios = [
    { cd: 'CD São Paulo', rua: 'Rua A-12', hora: '10:30', status: 'concluído' },
    { cd: 'CD Rio de Janeiro', rua: 'Rua B-05', hora: '09:45', status: 'em andamento' },
    { cd: 'CD Belo Horizonte', rua: 'Rua C-08', hora: '09:15', status: 'concluído' }
  ];

  alertas = [
    { titulo: 'Ocupação Alta', cd: 'CD Belo Horizonte', nivel: 'crítico', cor: '#ef4444' },
    { titulo: 'Inventário Pendente', cd: 'CD São Paulo', nivel: 'atenção', cor: '#eab308' },
    { titulo: 'Manutenção Drone', cd: 'CD Rio de Janeiro', nivel: 'info', cor: '#3b82f6' }
  ];
}
