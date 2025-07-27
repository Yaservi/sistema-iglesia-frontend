import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataTableComponent } from '../shared/data-table/data-table.component';
import { ModalFormComponent } from '../shared/modal-form/modal-form.component';
import { BautizoService } from '../services/bautizo.service';
import { MiembroService } from '../services/miembro.service';
import { Bautizo, BautizoCreate } from '../models/bautizo.model';
import { Miembro } from '../models/miembro.model';

@Component({
  selector: 'app-bautizos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DataTableComponent, ModalFormComponent],
  templateUrl: './bautizos.component.html',
  styleUrls: ['./bautizos.component.css']
})
export class BautizosComponent implements OnInit {
  bautizos: Bautizo[] = [];
  miembros: Miembro[] = [];
  loading = false;
  loadingMiembros = false;
  modalVisible = false;
  modalTitle = 'Nuevo Bautizo';
  formSubmitting = false;
  currentBautizo: Bautizo | null = null;
  bautizoForm: FormGroup;

  columns = [
    { key: 'miembroId', label: 'Miembro', format: (value: number) => this.getMiembroNombre(value) },
    { key: 'fecha', label: 'Fecha', format: (value: string) => new Date(value).toLocaleDateString() },
    { key: 'lugar', label: 'Lugar' },
    { key: 'pastorOficiante', label: 'Pastor Oficiante' }
  ];

  constructor(
    private bautizoService: BautizoService,
    private miembroService: MiembroService,
    private fb: FormBuilder
  ) {
    this.bautizoForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadBautizos();
    this.loadMiembros();
  }

  loadBautizos(): void {
    console.log('loadBautizos called, setting loading to true');
    this.loading = true;
    this.bautizoService.getAll().subscribe({
      next: (data) => {
        console.log('Bautizos data received:', data);
        this.bautizos = data;
        console.log('Bautizos array updated, setting loading to false');
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading bautizos', error);
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
      fecha: ['', [Validators.required]],
      lugar: ['', [Validators.required]],
      pastorOficiante: ['', [Validators.required]]
    });
  }

  onEdit(bautizo: Bautizo): void {
    this.currentBautizo = bautizo;
    this.modalTitle = 'Editar Bautizo';
    this.bautizoForm.patchValue({
      miembroId: bautizo.miembroId,
      fecha: bautizo.fecha.split('T')[0],
      lugar: bautizo.lugar,
      pastorOficiante: bautizo.pastorOficiante
    });
    this.modalVisible = true;
  }

  onDelete(bautizo: Bautizo): void {
    if (!bautizo || !bautizo.id) {
      console.error('Cannot delete bautizo: Invalid bautizo or missing ID');
      return;
    }

    console.log('Deleting bautizo with ID:', bautizo.id);
    this.bautizoService.delete(bautizo.id).subscribe({
      next: (response) => {
        console.log('Bautizo deleted successfully, response:', response);
        // Refresh the data after a longer delay
        console.log('Setting timeout to refresh data after delete...');
        setTimeout(() => {
          console.log('Delete timeout completed, refreshing data...');
          this.loadBautizos();
          console.log('Data refresh after delete initiated.');
        }, 1000);
      },
      error: (error) => {
        console.error('Error deleting bautizo', error);
        // You could add user notification here
        // For example: this.showErrorMessage('No se pudo eliminar el bautizo. Por favor, inténtelo de nuevo.');
      }
    });
  }

  onCreate(): void {
    this.currentBautizo = null;
    this.modalTitle = 'Nuevo Bautizo';
    this.bautizoForm.reset({
      fecha: new Date().toISOString().split('T')[0]
    });
    this.modalVisible = true;
  }

  onCloseModal(): void {
    this.modalVisible = false;
  }

  onSubmitForm(): void {
    if (this.bautizoForm.invalid) {
      return;
    }

    this.formSubmitting = true;
    const formData = this.bautizoForm.value;

    if (this.currentBautizo) {
      // Update existing bautizo
      // Ensure date is in the correct format (ISO format)
      // Explicitly include all required fields
      const bautizoData = {
        id: this.currentBautizo.id,
        miembroId: formData.miembroId || this.currentBautizo.miembroId,
        fecha: formData.fecha ? new Date(formData.fecha).toISOString() : this.currentBautizo.fecha,
        lugar: formData.lugar || this.currentBautizo.lugar,
        pastorOficiante: formData.pastorOficiante || this.currentBautizo.pastorOficiante
      };
      console.log('Updating bautizo with data:', bautizoData);
      this.bautizoService.update(this.currentBautizo.id, bautizoData).subscribe({
        next: (response) => {
          console.log('Update successful, response:', response);
          // First close the modal
          this.modalVisible = false;
          this.formSubmitting = false;

          // Then refresh the data after a longer delay to ensure the modal is closed
          console.log('Setting timeout to refresh data after update...');
          setTimeout(() => {
            console.log('Update timeout completed, refreshing data...');
            this.loadBautizos();
            console.log('Data refresh after update initiated.');
          }, 1000);
        },
        error: (error) => {
          console.error('Error updating bautizo', error);
          this.formSubmitting = false;
        }
      });
    } else {
      // Create new bautizo
      // Add id field with value 0 as expected by the API
      // Explicitly include all required fields
      const bautizoData = {
        id: 0,
        miembroId: formData.miembroId,
        fecha: formData.fecha ? new Date(formData.fecha).toISOString() : '',
        lugar: formData.lugar,
        pastorOficiante: formData.pastorOficiante
      };
      console.log('Creating bautizo with data:', bautizoData);
      this.bautizoService.create(bautizoData).subscribe({
        next: (response) => {
          console.log('Create successful, response:', response);
          // First close the modal
          this.modalVisible = false;
          this.formSubmitting = false;

          // Then refresh the data after a longer delay to ensure the modal is closed
          console.log('Setting timeout to refresh data after create...');
          setTimeout(() => {
            console.log('Create timeout completed, refreshing data...');
            this.loadBautizos();
            console.log('Data refresh after create initiated.');
          }, 1000);
        },
        error: (error) => {
          console.error('Error creating bautizo', error);
          this.formSubmitting = false;
        }
      });
    }
  }
}
