import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PaintingModel} from '../../../models/painting.model';
import {Subscription} from 'rxjs';
import {StyleModel} from '../../../models/style.model';
import {TechniqueModel} from '../../../models/technique.model';
import {UndergroundModel} from '../../../models/underground.model';
import {CollectionModel} from '../../../models/collection.model';
import {PaintingService} from '../../../services/painting.service';

@Component({
  selector: 'app-new-painting',
  templateUrl: './new-painting.component.html',
  styleUrls: ['./new-painting.component.scss']
})
export class NewPaintingComponent implements OnInit {

  paintingForm: FormGroup;
  saved = false;
  newPaintingViewEnabled = false;
  public dataChanged = false;

  @Output()
  onAdded: EventEmitter<boolean> = new EventEmitter<boolean>();

  public painting: PaintingModel = null;

  public styles: StyleModel[] = [];
  private stylesSubscription: Subscription;

  public techniques: TechniqueModel[] = [];
  private techniquesSubscription: Subscription;

  public undergrounds: UndergroundModel[] = [];
  private undergroundsSubscription: Subscription;

  public collections: CollectionModel[] = [];
  private collectionsSubscription: Subscription;

  constructor(private paintingService: PaintingService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.stylesSubscription = this.paintingService.styles$.subscribe(styles => {
      this.styles = styles;
    });

    this.techniquesSubscription = this.paintingService.techniques$.subscribe(techniques => {
      this.techniques = techniques;
    });

    this.undergroundsSubscription = this.paintingService.undergrounds$.subscribe(undergrounds => {
      this.undergrounds = undergrounds;
    });

    this.collectionsSubscription = this.paintingService.collections$.subscribe(collections => {
      this.collections = collections;
    });

    this.paintingForm = this.formBuilder.group({
      name: [this.painting !== null ? this.painting.name : '', [Validators.required]],
      style_id: [this.painting !== null ? this.painting.style_id : '', [Validators.required]],
      height: [this.painting !== null ? this.painting.height : '', [Validators.required]],
      width: [this.painting !== null ? this.painting.width : '', [Validators.required]],
      technique_id: [this.painting !== null ? this.painting.technique_id : '', [Validators.required]],
      underground_id: [this.painting !== null ? this.painting.underground_id : '', [Validators.required]],
      price: [this.painting !== null ? this.painting.price : '', [Validators.required]],
      description: [this.painting !== null ? this.painting.description : '', []],
      year: [this.painting !== null ? this.painting.year : '', [Validators.required]],
      collection_id: [this.painting !== null ? this.painting.collection_id : '', [Validators.required]]
    });

    this.paintingForm.valueChanges.subscribe(data => {
      this.dataChanged = true;
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.paintingForm.controls; }

  cancel(): void {
    this.onAdded.emit(false);
  }

  add(): void {
    this.saved = true;

    if (this.paintingForm.invalid) {
      console.log('form is invalid');
      return;
    }

    this.paintingService.addPainting(this.paintingForm.value);
    this.onAdded.emit(true);
  }
}
