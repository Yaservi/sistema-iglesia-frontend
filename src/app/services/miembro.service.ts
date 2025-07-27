import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericDataService } from './generic-data.service';
import { Miembro, MiembroCreate } from '../models/miembro.model';

@Injectable({
  providedIn: 'root'
})
export class MiembroService extends GenericDataService<Miembro, MiembroCreate> {
  constructor(http: HttpClient) {
    super(http, '/api/Miembro');
  }
}
