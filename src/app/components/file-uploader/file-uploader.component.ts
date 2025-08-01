import { Component, Input, type OnInit } from '@angular/core';
import {
  DROPZONE_CONFIG,
  DropzoneConfigInterface,
  DropzoneModule,
} from 'ngx-dropzone-wrapper';

const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  url: 'https://httpbin.org/post',
  autoProcessQueue: false,
  maxFilesize: 50,
  acceptedFiles: 'image/*',
};

@Component({
  selector: 'FileUploader',
  imports: [DropzoneModule],
  template: ` <dropzone
      class="dropzone"
      style="min-height: auto"
      [config]="dropzoneConfig"
      [message]="dropzone"
      (addedFiles)="onUploadSuccess($event)"
      
    ></dropzone>

    @if (uploadedFiles) {
      <div class="row">
        <div *ngFor="let file of uploadedFiles; let i = index" class="col-3 mt-3" id="file-previews">
          <div
            class="card mt-1 mb-0 shadow-none border dz-processing dz-success dz-complete dz-image-preview"
          >
            <div class="p-2">
              <div class="row align-items-center">
                <div class="col-auto">
                <img
                    [src]="previews[i]"
                    class="avatar-sm rounded bg-light"
                  />
                  <!-- <img
                    data-dz-thumbnail=""
                    [src]="file.dataURL"
                    class="avatar-sm rounded bg-light"
                  /> -->
                </div>
                <div class="col ps-0">
                  <a class="text-muted fw-bold">{{
                    file.name
                  }}</a>
                  <p class="mb-0" data-dz-size="">
                    <strong>{{ file.size }}</strong> KB
                  </p>
                </div>
                <div class="col-auto">
                  <button
                    (click)="removeFile(i)"
                    class="btn btn-sm btn-danger"
                  >
                    Deletar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
    }`,
  providers: [
    {
      provide: DROPZONE_CONFIG,
      useValue: DEFAULT_DROPZONE_CONFIG,
    },
  ],
})
export class FileUploaderComponent {
  uploadedFiles: File[] = [];
  previews: string[] = [];

  dropzoneConfig: DropzoneConfigInterface = {
    url: 'https://httpbin.org/post',
    autoProcessQueue: false,
    maxFilesize: 50,
    clickable: true,
    addRemoveLinks: true,
    previewsContainer: false,
  };

  dropzone = `<div class="dz-message needsclick">
                                                       <i class="bx bx-cloud-upload fs-48 text-primary"></i>
                                                      <h3>Arraste suas imagens aqui ou<span class="text-primary"> cliquei para selecionar</span></h3>
                                                  </div>`;

  imageURL: string = '';
  onUploadSuccess(files: any) {
    if (files && files[0]) {
      var filesAmount = files.length;
      for (let i = 0; i < filesAmount; i++) {
        this.uploadedFiles.push(files[i]);

        var reader = new FileReader();

        reader.onload = (event: any) => {
          this.previews.push(event.target.result);
        };

        reader.readAsDataURL(files[i]);
      }
    }
  }

  removeFile(index: number) {
    this.previews.splice(index, 1);
    this.uploadedFiles.splice(index, 1);
  }

  cleanFiles() {
    this.previews = [];
    this.uploadedFiles = [];
  }
}
