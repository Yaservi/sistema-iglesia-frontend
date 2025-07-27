import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataTableComponent } from '../shared/data-table/data-table.component';
import { ModalFormComponent } from '../shared/modal-form/modal-form.component';
import { MinisterioService } from '../services/ministerio.service';
import { Ministerio, MinisterioCreate } from '../models/ministerio.model';

@Component({
  selector: 'app-ministerios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DataTableComponent, ModalFormComponent],
  templateUrl: './ministerios.component.html',
  styleUrls: ['./ministerios.component.css']
})
export class MinisteriosComponent implements OnInit {
  ministerios: Ministerio[] = [];
  loading = false;
  modalVisible = false;
  modalTitle = 'Nuevo Ministerio';
  formSubmitting = false;
  currentMinisterio: Ministerio | null = null;
  ministerioForm: FormGroup;

  columns = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'descripcion', label: 'Descripción' }
  ];

  constructor(
    private ministerioService: MinisterioService,
    private fb: FormBuilder
  ) {
    this.ministerioForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadMinisterios();
  }

  loadMinisterios(): void {
    console.log('loadMinisterios called, setting loading to true');
    this.loading = true;
    this.ministerioService.getAll().subscribe({
      next: (data) => {
        console.log('Ministerios data received:', data);
        this.ministerios = data;
        console.log('Ministerios array updated, setting loading to false');
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading ministerios', error);
        this.loading = false;
      }
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      nombre: ['', [Validators.required]],
      descripcion: ['', [Validators.required]]
    });
  }

  onEdit(ministerio: Ministerio): void {
    this.currentMinisterio = ministerio;
    this.modalTitle = 'Editar Ministerio';
    this.ministerioForm.patchValue({
      nombre: ministerio.nombre,
      descripcion: ministerio.descripcion
    });
    this.modalVisible = true;
  }

  onDelete(ministerio: Ministerio): void {
    if (!ministerio || !ministerio.id) {
      console.error('Cannot delete ministerio: Invalid ministerio or missing ID');
      return;
    }

    console.log('Deleting ministerio with ID:', ministerio.id);
    this.ministerioService.delete(ministerio.id).subscribe({
      next: (response) => {
        console.log('Ministerio deleted successfully, response:', response);
        // Refresh the data after a longer delay
        console.log('Setting timeout to refresh data after delete...');
        setTimeout(() => {
          console.log('Delete timeout completed, refreshing data...');
          this.loadMinisterios();
          console.log('Data refresh after delete initiated.');
        }, 1000);
      },
      error: (error) => {
        console.error('Error deleting ministerio', error);
        // You could add user notification here
        // For example: this.showErrorMessage('No se pudo eliminar el ministerio. Por favor, inténtelo de nuevo.');
      }
    });
  }

  onCreate(): void {
    this.currentMinisterio = null;
    this.modalTitle = 'Nuevo Ministerio';
    this.ministerioForm.reset();
    this.modalVisible = true;
  }

  onCloseModal(): void {
    this.modalVisible = false;
  }

  onSubmitForm(): void {
    if (this.ministerioForm.invalid) {
      return;
    }

    this.formSubmitting = true;
    const formData = this.ministerioForm.value;

    if (this.currentMinisterio) {
      // Update existing ministerio
      // Explicitly include all required fields
      const ministerioData = {
        id: this.currentMinisterio.id,
        nombre: formData.nombre || this.currentMinisterio.nombre,
        descripcion: formData.descripcion || this.currentMinisterio.descripcion
      };
      console.log('Updating ministerio with data:', ministerioData);
      this.ministerioService.update(this.currentMinisterio.id, ministerioData).subscribe({
        next: (response) => {
          console.log('Update successful, response:', response);
          // First close the modal
          this.modalVisible = false;
          this.formSubmitting = false;

          // Then refresh the data after a longer delay to ensure the modal is closed
          console.log('Setting timeout to refresh data after update...');
          setTimeout(() => {
            console.log('Update timeout completed, refreshing data...');
            this.loadMinisterios();
            console.log('Data refresh after update initiated.');
          }, 1000);
        },
        error: (error) => {
          console.error('Error updating ministerio', error);
          this.formSubmitting = false;
        }
      });
    } else {
      // Create new ministerio
      // Add id field with value 0 as expected by the API
      // Explicitly include all required fields
      const ministerioData = {
        id: 0,
        nombre: formData.nombre,
        descripcion: formData.descripcion
      };
      console.log('Creating ministerio with data:', ministerioData);
      this.ministerioService.create(ministerioData).subscribe({
        next: (response) => {
          console.log('Create successful, response:', response);
          // First close the modal
          this.modalVisible = false;
          this.formSubmitting = false;

          // Then refresh the data after a longer delay to ensure the modal is closed
          console.log('Setting timeout to refresh data after create...');
          setTimeout(() => {
            console.log('Create timeout completed, refreshing data...');
            this.loadMinisterios();
            console.log('Data refresh after create initiated.');
          }, 1000);
        },
        error: (error) => {
          console.error('Error creating ministerio', error);
          this.formSubmitting = false;
        }
      });
    }
  }
}
