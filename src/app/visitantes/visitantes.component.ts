import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataTableComponent } from '../shared/data-table/data-table.component';
import { ModalFormComponent } from '../shared/modal-form/modal-form.component';
import { VisitanteService } from '../services/visitante.service';
import { EventoService } from '../services/evento.service';
import { Visitante, VisitanteCreate } from '../models/visitante.model';
import { Evento } from '../models/evento.model';

@Component({
  selector: 'app-visitantes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DataTableComponent, ModalFormComponent],
  templateUrl: './visitantes.component.html',
  styleUrls: ['./visitantes.component.css']
})
export class VisitantesComponent implements OnInit {
  visitantes: Visitante[] = [];
  eventos: Evento[] = [];
  loading = false;
  loadingEventos = false;
  modalVisible = false;
  modalTitle = 'Nuevo Visitante';
  formSubmitting = false;
  currentVisitante: Visitante | null = null;
  visitanteForm: FormGroup;

  columns = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'apellido', label: 'Apellido' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'fechaVisita', label: 'Fecha de Visita', format: (value: string) => new Date(value).toLocaleDateString() },
    { key: 'eventoId', label: 'Evento', format: (value: number) => this.getEventoNombre(value) }
  ];

  constructor(
    private visitanteService: VisitanteService,
    private eventoService: EventoService,
    private fb: FormBuilder
  ) {
    this.visitanteForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadVisitantes();
    this.loadEventos();
  }

  loadVisitantes(): void {
    console.log('loadVisitantes called, setting loading to true');
    this.loading = true;
    this.visitanteService.getAll().subscribe({
      next: (data) => {
        console.log('Visitantes data received:', data);
        this.visitantes = data;
        console.log('Visitantes array updated, setting loading to false');
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading visitantes', error);
        this.loading = false;
      }
    });
  }

  loadEventos(): void {
    this.loadingEventos = true;
    this.eventoService.getAll().subscribe({
      next: (data) => {
        this.eventos = data;
        this.loadingEventos = false;
      },
      error: (error) => {
        console.error('Error loading eventos', error);
        this.loadingEventos = false;
      }
    });
  }

  getEventoNombre(eventoId: number): string {
    const evento = this.eventos.find(e => e.id === eventoId);
    return evento ? evento.nombre : 'Desconocido';
  }

  createForm(): FormGroup {
    return this.fb.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      fechaVisita: ['', [Validators.required]],
      eventoId: ['', [Validators.required]]
    });
  }

  onEdit(visitante: Visitante): void {
    this.currentVisitante = visitante;
    this.modalTitle = 'Editar Visitante';
    this.visitanteForm.patchValue({
      nombre: visitante.nombre,
      apellido: visitante.apellido,
      telefono: visitante.telefono,
      fechaVisita: visitante.fechaVisita.split('T')[0],
      eventoId: visitante.eventoId
    });
    this.modalVisible = true;
  }

  onDelete(visitante: Visitante): void {
    if (!visitante || !visitante.id) {
      console.error('Cannot delete visitante: Invalid visitante or missing ID');
      return;
    }

    console.log('Deleting visitante with ID:', visitante.id);
    this.visitanteService.delete(visitante.id).subscribe({
      next: (response) => {
        console.log('Visitante deleted successfully, response:', response);
        // Refresh the data after a longer delay
        console.log('Setting timeout to refresh data after delete...');
        setTimeout(() => {
          console.log('Delete timeout completed, refreshing data...');
          this.loadVisitantes();
          console.log('Data refresh after delete initiated.');
        }, 1000);
      },
      error: (error) => {
        console.error('Error deleting visitante', error);
        // You could add user notification here
        // For example: this.showErrorMessage('No se pudo eliminar el visitante. Por favor, inténtelo de nuevo.');
      }
    });
  }

  onCreate(): void {
    this.currentVisitante = null;
    this.modalTitle = 'Nuevo Visitante';
    this.visitanteForm.reset({
      fechaVisita: new Date().toISOString().split('T')[0]
    });
    this.modalVisible = true;
  }

  onCloseModal(): void {
    this.modalVisible = false;
  }

  onSubmitForm(): void {
    if (this.visitanteForm.invalid) {
      return;
    }

    this.formSubmitting = true;
    const formData = this.visitanteForm.value;

    if (this.currentVisitante) {
      // Update existing visitante
      // Ensure date is in the correct format (YYYY-MM-DD)
      // Explicitly include all required fields
      const visitanteData = {
        id: this.currentVisitante.id,
        nombre: formData.nombre || this.currentVisitante.nombre,
        apellido: formData.apellido || this.currentVisitante.apellido,
        telefono: formData.telefono || this.currentVisitante.telefono,
        fechaVisita: formData.fechaVisita ? formData.fechaVisita.split('T')[0] : this.currentVisitante.fechaVisita.split('T')[0],
        eventoId: formData.eventoId || this.currentVisitante.eventoId
      };
      console.log('Updating visitante with data:', visitanteData);
      this.visitanteService.update(this.currentVisitante.id, visitanteData).subscribe({
        next: (response) => {
          console.log('Update successful, response:', response);
          // First close the modal
          this.modalVisible = false;
          this.formSubmitting = false;

          // Then refresh the data after a longer delay to ensure the modal is closed
          console.log('Setting timeout to refresh data after update...');
          setTimeout(() => {
            console.log('Update timeout completed, refreshing data...');
            this.loadVisitantes();
            console.log('Data refresh after update initiated.');
          }, 1000);
        },
        error: (error) => {
          console.error('Error updating visitante', error);
          this.formSubmitting = false;
        }
      });
    } else {
      // Create new visitante
      // Add id field with value 0 as expected by the API
      // Explicitly include all required fields
      const visitanteData = {
        id: 0,
        nombre: formData.nombre,
        apellido: formData.apellido,
        telefono: formData.telefono,
        fechaVisita: formData.fechaVisita ? formData.fechaVisita.split('T')[0] : '',
        eventoId: formData.eventoId
      };
      console.log('Creating visitante with data:', visitanteData);
      this.visitanteService.create(visitanteData).subscribe({
        next: (response) => {
          console.log('Create successful, response:', response);
          // First close the modal
          this.modalVisible = false;
          this.formSubmitting = false;

          // Then refresh the data after a longer delay to ensure the modal is closed
          console.log('Setting timeout to refresh data after create...');
          setTimeout(() => {
            console.log('Create timeout completed, refreshing data...');
            this.loadVisitantes();
            console.log('Data refresh after create initiated.');
          }, 1000);
        },
        error: (error) => {
          console.error('Error creating visitante', error);
          this.formSubmitting = false;
        }
      });
    }
  }
}
