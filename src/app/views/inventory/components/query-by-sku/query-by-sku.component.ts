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
import { distributionCenter, periods, skuResum, skus } from '@views/inventory/data';
import { SkuDto, SkuResum } from './model/sku';

@Component({
  selector: 'app-query-by-sku',
  imports: [CommonModule, NgSelectModule, FormsModule, ReactiveFormsModule],
  templateUrl: './query-by-sku.component.html',
  styleUrl: './query-by-sku.component.scss',
})
export class QueryBySkuComponent {
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
