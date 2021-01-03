import { Injectable } from '@angular/core';
import {ApiService} from './api.service';
import {AuthenticationService} from './authentication.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {PaintingModel} from '../models/painting.model';
import {StyleModel} from '../models/style.model';
import {TechniqueModel} from '../models/technique.model';
import {UndergroundModel} from '../models/underground.model';
import {CollectionModel} from '../models/collection.model';
import {DataService} from './data.service';

@Injectable({
  providedIn: 'root'
})
export class PaintingService {

  public get styles$(): Observable<StyleModel[]> {
    return this._styles.asObservable();
  }
  public get styles(): StyleModel[] {
    return this._styles.value;
  }
  private _styles: BehaviorSubject<StyleModel[]> = new BehaviorSubject<StyleModel[]>([]);

  public get techniques$(): Observable<TechniqueModel[]> {
    return this._techniques.asObservable();
  }
  public get techniques(): TechniqueModel[] {
    return this._techniques.value;
  }
  private _techniques: BehaviorSubject<TechniqueModel[]> = new BehaviorSubject<TechniqueModel[]>([]);

  public get undergrounds$(): Observable<UndergroundModel[]> {
    return this._undergrounds.asObservable();
  }
  public get undergrounds(): UndergroundModel[] {
    return this._undergrounds.value;
  }
  private _undergrounds: BehaviorSubject<UndergroundModel[]> = new BehaviorSubject<UndergroundModel[]>([]);

  public get collections$(): Observable<CollectionModel[]> {
    return this._collections.asObservable();
  }
  public get collections(): CollectionModel[] {
    return this._collections.value;
  }
  private _collections: BehaviorSubject<CollectionModel[]> = new BehaviorSubject<CollectionModel[]>([]);

  public get painting$(): Observable<PaintingModel> {
    return this._painting.asObservable();
  }
  public get painting(): PaintingModel {
    return this._painting.value;
  }
  private _painting: BehaviorSubject<PaintingModel> = new BehaviorSubject<PaintingModel>(null);

  constructor(private apiService: ApiService, private authenticationService: AuthenticationService, private dataService: DataService) {
    this.loadStyles();
    this.loadTechniques();
    this.loadUndergrounds();
    this.loadCollections();
  }

  public loadPainting(id: number): void {
    this.apiService.getPainting(id).subscribe(painting => {
      this._painting.next(painting);
    });
  }

  public loadStyles(): void {
    this.apiService.getStyles().subscribe(styles => {
      this._styles.next(styles);
    });
  }

  public loadTechniques(): void {
    this.apiService.getTechniques().subscribe(techniques => {
      this._techniques.next(techniques);
    });
  }

  public loadUndergrounds(): void {
    this.apiService.getUndergrounds().subscribe(undergrounds => {
      this._undergrounds.next(undergrounds);
    });
  }

  public loadCollections(): void {
    this.apiService.getCollections().subscribe(collections => {
      this._collections.next(collections);
    });
  }

  public updatePainting(painting): void {
    const token = this.authenticationService.currentEmployeeValue.token;

    this.apiService.updatePainting(token, painting).subscribe(() => {
      this.loadPainting(painting.id);
      this.dataService.loadPaintings();
    });
  }
}
