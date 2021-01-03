import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ImageService} from '../../../services/image.service';
import {PaintingModel} from '../../../models/painting.model';

@Component({
  selector: 'app-new-image',
  templateUrl: './new-image.component.html',
  styleUrls: ['./new-image.component.scss']
})
export class NewImageComponent implements OnInit {

  fileToUpload: File = null;
  errorMessage = '';

  @Input()
  painting: PaintingModel;

  @Output()
  onUploaded: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private imageService: ImageService) { }

  ngOnInit(): void {
  }

  handleFileInput(files: FileList): void {
    this.fileToUpload = files.item(0);
  }

  uploadFile(): void {

    this.imageService.uploadImage(this.fileToUpload, this.painting.id)
      .subscribe((response) => {
        this.errorMessage = '';
        this.onUploaded.emit(true);
      }, err => {
        console.log(err);
      });
  }

  cancel(): void {
    this.onUploaded.emit(false);
  }
}
