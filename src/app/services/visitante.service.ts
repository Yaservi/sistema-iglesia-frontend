import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericDataService } from './generic-data.service';
import { Visitante, VisitanteCreate } from '../models/visitante.model';

@Injectable({
  providedIn: 'root'
})
export class VisitanteService extends GenericDataService<Visitante, VisitanteCreate> {
  constructor(http: HttpClient) {
    super(http, '/api/Visitante');
  }
}
