import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

interface CardData {
  title: string;
  value: string | number;
  comparison: string;
  svgPath: string;
  bgColor: string;
  svgContent?: SafeHtml;
}

@Component({
  selector: 'app-dashboard-cards',
  imports: [
    CommonModule
  ],
  templateUrl: './dashboard-cards.component.html',
  styleUrls: ['./dashboard-cards.component.scss']
})
export class DashboardCardsComponent {

  cards: CardData[] = [
    {
      title: 'CDs Ativos',
      value: 3,
      comparison: '+12% vs mês anterior',
      svgPath: 'assets/icons/cd.svg',
      bgColor: '#e8f0fe'
    },
    {
      title: 'SKUs Totais',
      value: '3,660',
      comparison: '+12% vs mês anterior',
      svgPath: 'assets/icons/sku.svg',
      bgColor: '#d1fae5'
    },
    {
      title: 'Inventários Hoje',
      value: 12,
      comparison: '+12% vs mês anterior',
      svgPath: 'assets/icons/inventario.svg',
      bgColor: 'white'
    },
    {
      title: 'Posições Mapeadas',
      value: '2,450',
      comparison: '+12% vs mês anterior',
      svgPath: 'assets/icons/posicoes.svg',
      bgColor: 'white'
    }
  ];

  constructor(private sanitizer: DomSanitizer) {    

   }

  sanitizeSVG(svg: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }
}
