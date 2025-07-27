import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericDataService } from './generic-data.service';
import { Evento, EventoCreate } from '../models/evento.model';

@Injectable({
  providedIn: 'root'
})
export class EventoService extends GenericDataService<Evento, EventoCreate> {
  constructor(http: HttpClient) {
    super(http, '/api/Evento');
  }
}
