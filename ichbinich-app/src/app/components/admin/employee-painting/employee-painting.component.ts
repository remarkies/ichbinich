import {Component, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {PaintingModel} from '../../../models/painting.model';
import {PaintingService} from '../../../services/painting.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {StyleModel} from '../../../models/style.model';
import {TechniqueModel} from '../../../models/technique.model';
import {UndergroundModel} from '../../../models/underground.model';
import {CollectionModel} from '../../../models/collection.model';
import {PathModel} from '../../../models/path.model';
import {ImageService} from '../../../services/image.service';
import {DataService} from '../../../services/data.service';

@Component({
  selector: 'app-employee-painting',
  templateUrl: './employee-painting.component.html',
  styleUrls: ['./employee-painting.component.scss']
})
export class EmployeePaintingComponent implements OnInit {
  paintingForm: FormGroup;
  saved = false;
  newImageViewEnabled = false;
  public dataChanged = false;

  public painting: PaintingModel;
  private paintingSubscription: Subscription;

  public styles: StyleModel[] = [];
  private stylesSubscription: Subscription;

  public techniques: TechniqueModel[] = [];
  private techniquesSubscription: Subscription;

  public undergrounds: UndergroundModel[] = [];
  private undergroundsSubscription: Subscription;

  public collections: CollectionModel[] = [];
  private collectionsSubscription: Subscription;

  constructor(private dataService: DataService, private imageService: ImageService, private router: Router, private formBuilder: FormBuilder, private route: ActivatedRoute, private paintingService: PaintingService) {
    this.route.params.subscribe( params => {
      this.paintingService.loadPainting(params.id);
    });
  }

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

    this.paintingSubscription = this.paintingService.painting$.subscribe(painting => {
      this.painting = painting;
      this.dataChanged = false;

      this.paintingForm = this.formBuilder.group({
        id: [painting !== null ? painting.id : 0],
        name: [painting !== null ? painting.name : '', [Validators.required]],
        style_id: [painting !== null ? painting.style_id : '', [Validators.required]],
        height: [painting !== null ? painting.height : '', [Validators.required]],
        width: [painting !== null ? painting.width : '', [Validators.required]],
        technique_id: [painting !== null ? painting.technique_id : '', [Validators.required]],
        underground_id: [painting !== null ? painting.underground_id : '', [Validators.required]],
        price: [painting !== null ? painting.price : '', [Validators.required]],
        description: [painting !== null ? painting.description : '', [Validators.required]],
        year: [painting !== null ? painting.year : '', [Validators.required]],
        collection_id: [painting !== null ? painting.collection_id : '', [Validators.required]]
      });

      this.paintingForm.valueChanges.subscribe(data => {
        this.dataChanged = true;
      });
    });

  }

  // convenience getter for easy access to form fields
  get f() { return this.paintingForm.controls; }

  selectPath(path: PathModel): void {
    const index = this.painting.paths.indexOf(path);
    this.painting.paths[index].selected = !this.painting.paths[index].selected;

    for (const o of this.painting.paths) {
      if (o.path !== this.painting.paths[index].path) {
        o.selected = false;
      }
    }
  }

  deleteImage(path: PathModel): void {
    this.imageService.deleteImage(path.id);
    this.paintingService.loadPainting(this.painting.id);
    this.dataService.loadPaintings();
  }

  openNewImage(): void {
    this.newImageViewEnabled = true;
  }

  save(): void {
    this.saved = true;
    if (this.paintingForm.invalid) {
      return;
    }

    this.paintingService.updatePainting(this.paintingForm.value);
  }

  cancel(): void {
    this.paintingService.loadPainting(this.painting.id);
  }

  onUploaded(uploaded: boolean): void {
    this.newImageViewEnabled = false;

    if (uploaded) {
      this.paintingService.loadPainting(this.painting.id);
    }
  }

  back(): void {
    this.router.navigate(['/user/']);
  }
}
