import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormGroup,
} from '@angular/forms';
import { Selected } from '@core/model/selected';
import { NgSelectModule } from '@ng-select/ng-select';
import { distributionCenter, periods, skuResum, skus } from '@views/inventario/data';
import { SkuDto, SkuResum } from '../model/sku';
import { ResultadoListaComponent } from './components/resultado-lista.component';

@Component({
  selector: 'app-consulta-sku',
  imports: [CommonModule, NgSelectModule, FormsModule, ReactiveFormsModule, ResultadoListaComponent],
  templateUrl: './consulta-sku.component.html',
  styleUrl: './consulta-sku.component.scss',
})
export class ConsultaSkuComponent {
  lstDistributionCenter: Selected[] = distributionCenter;
  lstPeriods: Selected[] = periods;

  lstSkus: SkuDto[] = skus;
  resumQuery: SkuResum = skuResum;

  form: UntypedFormGroup = this.formBuilder.group({
    distributionCenter: [0],
    sku: [null],
    period: [0],
  });

  constructor(private formBuilder: FormBuilder) {}
}
