import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataTableComponent } from '../shared/data-table/data-table.component';
import { ModalFormComponent } from '../shared/modal-form/modal-form.component';
import { EventoService } from '../services/evento.service';
import { Evento, EventoCreate } from '../models/evento.model';

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DataTableComponent, ModalFormComponent],
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {
  eventos: Evento[] = [];
  loading = false;
  modalVisible = false;
  modalTitle = 'Nuevo Evento';
  formSubmitting = false;
  currentEvento: Evento | null = null;
  eventoForm: FormGroup;

  columns = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'tipo', label: 'Tipo' },
    { key: 'fecha', label: 'Fecha', format: (value: string) => new Date(value).toLocaleDateString() },
    { key: 'lugar', label: 'Lugar' }
  ];

  constructor(
    private eventoService: EventoService,
    private fb: FormBuilder
  ) {
    this.eventoForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadEventos();
  }

  loadEventos(): void {
    console.log('loadEventos called, setting loading to true');
    this.loading = true;
    this.eventoService.getAll().subscribe({
      next: (data) => {
        console.log('Eventos data received:', data);
        this.eventos = data;
        console.log('Eventos array updated, setting loading to false');
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading eventos', error);
        this.loading = false;
      }
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      nombre: ['', [Validators.required]],
      tipo: ['', [Validators.required]],
      fecha: ['', [Validators.required]],
      lugar: ['', [Validators.required]]
    });
  }

  onEdit(evento: Evento): void {
    this.currentEvento = evento;
    this.modalTitle = 'Editar Evento';
    this.eventoForm.patchValue({
      nombre: evento.nombre,
      tipo: evento.tipo,
      fecha: evento.fecha.split('T')[0],
      lugar: evento.lugar
    });
    this.modalVisible = true;
  }

  onDelete(evento: Evento): void {
    if (!evento || !evento.id) {
      console.error('Cannot delete evento: Invalid evento or missing ID');
      return;
    }

    console.log('Deleting evento with ID:', evento.id);
    this.eventoService.delete(evento.id).subscribe({
      next: (response) => {
        console.log('Evento deleted successfully, response:', response);
        // Refresh the data after a longer delay
        console.log('Setting timeout to refresh data after delete...');
        setTimeout(() => {
          console.log('Delete timeout completed, refreshing data...');
          this.loadEventos();
          console.log('Data refresh after delete initiated.');
        }, 1000);
      },
      error: (error) => {
        console.error('Error deleting evento', error);
        // You could add user notification here
        // For example: this.showErrorMessage('No se pudo eliminar el evento. Por favor, inténtelo de nuevo.');
      }
    });
  }

  onCreate(): void {
    this.currentEvento = null;
    this.modalTitle = 'Nuevo Evento';
    this.eventoForm.reset({
      fecha: new Date().toISOString().split('T')[0]
    });
    this.modalVisible = true;
  }

  onCloseModal(): void {
    this.modalVisible = false;
  }

  onSubmitForm(): void {
    if (this.eventoForm.invalid) {
      return;
    }

    this.formSubmitting = true;
    const formData = this.eventoForm.value;

    if (this.currentEvento) {
      // Update existing evento
      // Ensure date is in the correct format (ISO format)
      // Explicitly include all required fields
      const eventoData = {
        id: this.currentEvento.id,
        nombre: formData.nombre || this.currentEvento.nombre,
        tipo: formData.tipo || this.currentEvento.tipo,
        fecha: formData.fecha ? new Date(formData.fecha).toISOString() : this.currentEvento.fecha,
        lugar: formData.lugar || this.currentEvento.lugar
      };
      console.log('Updating evento with data:', eventoData);
      this.eventoService.update(this.currentEvento.id, eventoData).subscribe({
        next: (response) => {
          console.log('Update successful, response:', response);
          // First close the modal
          this.modalVisible = false;
          this.formSubmitting = false;

          // Then refresh the data after a longer delay to ensure the modal is closed
          console.log('Setting timeout to refresh data...');
          setTimeout(() => {
            console.log('Timeout completed, refreshing data...');
            this.loadEventos();
            console.log('Data refresh initiated.');
          }, 1000);
        },
        error: (error) => {
          console.error('Error updating evento', error);
          this.formSubmitting = false;
        }
      });
    } else {
      // Create new evento
      // Add id field with value 0 as expected by the API
      // Explicitly include all required fields
      const eventoData = {
        id: 0,
        nombre: formData.nombre,
        tipo: formData.tipo,
        fecha: formData.fecha ? new Date(formData.fecha).toISOString() : '',
        lugar: formData.lugar
      };
      console.log('Creating evento with data:', eventoData);
      this.eventoService.create(eventoData).subscribe({
        next: (response) => {
          console.log('Create successful, response:', response);
          // First close the modal
          this.modalVisible = false;
          this.formSubmitting = false;

          // Then refresh the data after a longer delay to ensure the modal is closed
          console.log('Setting timeout to refresh data after create...');
          setTimeout(() => {
            console.log('Create timeout completed, refreshing data...');
            this.loadEventos();
            console.log('Data refresh after create initiated.');
          }, 1000);
        },
        error: (error) => {
          console.error('Error creating evento', error);
          this.formSubmitting = false;
        }
      });
    }
  }
}
