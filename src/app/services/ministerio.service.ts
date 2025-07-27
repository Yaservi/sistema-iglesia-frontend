import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericDataService } from './generic-data.service';
import { Ministerio, MinisterioCreate } from '../models/ministerio.model';

@Injectable({
  providedIn: 'root'
})
export class MinisterioService extends GenericDataService<Ministerio, MinisterioCreate> {
  constructor(http: HttpClient) {
    super(http, '/api/Ministerio');
  }
}
