import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericDataService } from './generic-data.service';
import { Bautizo, BautizoCreate } from '../models/bautizo.model';

@Injectable({
  providedIn: 'root'
})
export class BautizoService extends GenericDataService<Bautizo, BautizoCreate> {
  constructor(http: HttpClient) {
    super(http, '/api/Bautizo');
  }
}
