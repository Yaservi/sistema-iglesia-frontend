import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericDataService } from './generic-data.service';
import { Transaccion, TransaccionCreate } from '../models/transaccion.model';

@Injectable({
  providedIn: 'root'
})
export class TransaccionService extends GenericDataService<Transaccion, TransaccionCreate> {
  constructor(http: HttpClient) {
    super(http, '/api/Transaccion');
  }
}
