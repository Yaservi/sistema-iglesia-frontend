import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataTableComponent } from '../shared/data-table/data-table.component';
import { ModalFormComponent } from '../shared/modal-form/modal-form.component';
import { TransaccionService } from '../services/transaccion.service';
import { MiembroService } from '../services/miembro.service';
import { Transaccion, TransaccionCreate } from '../models/transaccion.model';
import { Miembro } from '../models/miembro.model';

@Component({
  selector: 'app-transacciones',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DataTableComponent, ModalFormComponent],
  templateUrl: './transacciones.component.html',
  styleUrls: ['./transacciones.component.css']
})
export class TransaccionesComponent implements OnInit {
  transacciones: Transaccion[] = [];
  miembros: Miembro[] = [];
  loading = false;
  loadingMiembros = false;
  modalVisible = false;
  modalTitle = 'Nueva Transacción';
  formSubmitting = false;
  currentTransaccion: Transaccion | null = null;
  transaccionForm: FormGroup;

  columns = [
    { key: 'miembroId', label: 'Miembro', format: (value: number) => this.getMiembroNombre(value) },
    { key: 'tipo', label: 'Tipo' },
    { key: 'monto', label: 'Monto', format: (value: number) => `$${value.toFixed(2)}` },
    { key: 'fecha', label: 'Fecha', format: (value: string) => new Date(value).toLocaleDateString() },
    { key: 'observacion', label: 'Observación' }
  ];

  constructor(
    private transaccionService: TransaccionService,
    private miembroService: MiembroService,
    private fb: FormBuilder
  ) {
    this.transaccionForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadTransacciones();
    this.loadMiembros();
  }

  loadTransacciones(): void {
    console.log('loadTransacciones called, setting loading to true');
    this.loading = true;
    this.transaccionService.getAll().subscribe({
      next: (data) => {
        console.log('Transacciones data received:', data);
        this.transacciones = data;
        console.log('Transacciones array updated, setting loading to false');
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading transacciones', error);
        this.loading = false;
      }
    });
  }

  loadMiembros(): void {
    this.loadingMiembros = true;
    this.miembroService.getAll().subscribe({
      next: (data) => {
        this.miembros = data;
        this.loadingMiembros = false;
      },
      error: (error) => {
        console.error('Error loading miembros', error);
        this.loadingMiembros = false;
      }
    });
  }

  getMiembroNombre(miembroId: number): string {
    const miembro = this.miembros.find(m => m.id === miembroId);
    return miembro ? `${miembro.nombre} ${miembro.apellido}` : 'Desconocido';
  }

  createForm(): FormGroup {
    return this.fb.group({
      miembroId: ['', [Validators.required]],
      tipo: ['', [Validators.required]],
      monto: ['', [Validators.required, Validators.min(0)]],
      fecha: ['', [Validators.required]],
      observacion: ['']
    });
  }

  onEdit(transaccion: Transaccion): void {
    this.currentTransaccion = transaccion;
    this.modalTitle = 'Editar Transacción';
    this.transaccionForm.patchValue({
      miembroId: transaccion.miembroId,
      tipo: transaccion.tipo,
      monto: transaccion.monto,
      fecha: transaccion.fecha.split('T')[0],
      observacion: transaccion.observacion
    });
    this.modalVisible = true;
  }

  onDelete(transaccion: Transaccion): void {
    if (!transaccion || !transaccion.id) {
      console.error('Cannot delete transaccion: Invalid transaccion or missing ID');
      return;
    }

    console.log('Deleting transaccion with ID:', transaccion.id);
    this.transaccionService.delete(transaccion.id).subscribe({
      next: (response) => {
        console.log('Transaccion deleted successfully, response:', response);
        // Refresh the data after a longer delay
        console.log('Setting timeout to refresh data after delete...');
        setTimeout(() => {
          console.log('Delete timeout completed, refreshing data...');
          this.loadTransacciones();
          console.log('Data refresh after delete initiated.');
        }, 1000);
      },
      error: (error) => {
        console.error('Error deleting transaccion', error);
        // You could add user notification here
        // For example: this.showErrorMessage('No se pudo eliminar la transacción. Por favor, inténtelo de nuevo.');
      }
    });
  }

  onCreate(): void {
    this.currentTransaccion = null;
    this.modalTitle = 'Nueva Transacción';
    this.transaccionForm.reset({
      fecha: new Date().toISOString().split('T')[0]
    });
    this.modalVisible = true;
  }

  onCloseModal(): void {
    this.modalVisible = false;
  }

  onSubmitForm(): void {
    if (this.transaccionForm.invalid) {
      return;
    }

    this.formSubmitting = true;
    const formData = this.transaccionForm.value;

    if (this.currentTransaccion) {
      // Update existing transaccion
      // Ensure date is in the correct format (YYYY-MM-DD)
      // Explicitly include all required fields
      const transaccionData = {
        id: this.currentTransaccion.id,
        miembroId: formData.miembroId || this.currentTransaccion.miembroId,
        tipo: formData.tipo || this.currentTransaccion.tipo,
        monto: formData.monto || this.currentTransaccion.monto,
        fecha: formData.fecha ? formData.fecha.split('T')[0] : this.currentTransaccion.fecha.split('T')[0],
        observacion: formData.observacion !== undefined ? formData.observacion : this.currentTransaccion.observacion
      };
      console.log('Updating transaccion with data:', transaccionData);
      this.transaccionService.update(this.currentTransaccion.id, transaccionData).subscribe({
        next: (response) => {
          console.log('Update successful, response:', response);
          // First close the modal
          this.modalVisible = false;
          this.formSubmitting = false;

          // Then refresh the data after a longer delay to ensure the modal is closed
          console.log('Setting timeout to refresh data after update...');
          setTimeout(() => {
            console.log('Update timeout completed, refreshing data...');
            this.loadTransacciones();
            console.log('Data refresh after update initiated.');
          }, 1000);
        },
        error: (error) => {
          console.error('Error updating transaccion', error);
          this.formSubmitting = false;
        }
      });
    } else {
      // Create new transaccion
      // Add id field with value 0 as expected by the API
      // Explicitly include all required fields
      const transaccionData = {
        id: 0,
        miembroId: formData.miembroId,
        tipo: formData.tipo,
        monto: formData.monto,
        fecha: formData.fecha ? formData.fecha.split('T')[0] : '',
        observacion: formData.observacion || ''
      };
      console.log('Creating transaccion with data:', transaccionData);
      this.transaccionService.create(transaccionData).subscribe({
        next: (response) => {
          console.log('Create successful, response:', response);
          // First close the modal
          this.modalVisible = false;
          this.formSubmitting = false;

          // Then refresh the data after a longer delay to ensure the modal is closed
          console.log('Setting timeout to refresh data after create...');
          setTimeout(() => {
            console.log('Create timeout completed, refreshing data...');
            this.loadTransacciones();
            console.log('Data refresh after create initiated.');
          }, 1000);
        },
        error: (error) => {
          console.error('Error creating transaccion', error);
          this.formSubmitting = false;
        }
      });
    }
  }
}
