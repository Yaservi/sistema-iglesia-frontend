import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataTableComponent } from '../shared/data-table/data-table.component';
import { ModalFormComponent } from '../shared/modal-form/modal-form.component';
import { MiembroService } from '../services/miembro.service';
import { Miembro, MiembroCreate } from '../models/miembro.model';

@Component({
  selector: 'app-miembros',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DataTableComponent, ModalFormComponent],
  templateUrl: './miembros.component.html',
  styleUrls: ['./miembros.component.css']
})
export class MiembrosComponent implements OnInit {
  miembros: Miembro[] = [];
  loading = false;
  modalVisible = false;
  modalTitle = 'Nuevo Miembro';
  formSubmitting = false;
  currentMiembro: Miembro | null = null;
  miembroForm: FormGroup;

  columns = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'apellido', label: 'Apellido' },
    { key: 'cedula', label: 'Cédula' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'correo', label: 'Correo' },
    { key: 'activo', label: 'Activo', format: (value: boolean) => value ? 'Sí' : 'No' }
  ];

  constructor(
    private miembroService: MiembroService,
    private fb: FormBuilder
  ) {
    this.miembroForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadMiembros();
  }

  loadMiembros(): void {
    console.log('loadMiembros called, setting loading to true');
    this.loading = true;
    this.miembroService.getAll().subscribe({
      next: (data) => {
        console.log('Miembros data received:', data);
        this.miembros = data;
        console.log('Miembros array updated, setting loading to false');
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading miembros', error);
        this.loading = false;
      }
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      cedula: ['', [Validators.required, Validators.pattern(/^\d{3}-\d{7}-\d{1}$/)]],
      fechaNacimiento: ['', [Validators.required]],
      fechaIngreso: ['', [Validators.required]],
      sexo: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      activo: [true]
    });
  }

  onEdit(miembro: Miembro): void {
    this.currentMiembro = miembro;
    this.modalTitle = 'Editar Miembro';
    this.miembroForm.patchValue({
      nombre: miembro.nombre,
      apellido: miembro.apellido,
      cedula: miembro.cedula,
      fechaNacimiento: miembro.fechaNacimiento.split('T')[0],
      fechaIngreso: miembro.fechaIngreso.split('T')[0],
      sexo: miembro.sexo,
      direccion: miembro.direccion,
      telefono: miembro.telefono,
      correo: miembro.correo,
      activo: miembro.activo
    });
    this.modalVisible = true;
  }

  onDelete(miembro: Miembro): void {
    if (!miembro || !miembro.id) {
      console.error('Cannot delete miembro: Invalid miembro or missing ID');
      return;
    }

    console.log('Deleting miembro with ID:', miembro.id);
    this.miembroService.delete(miembro.id).subscribe({
      next: (response) => {
        console.log('Miembro deleted successfully, response:', response);
        // Refresh the data after a longer delay
        console.log('Setting timeout to refresh data after delete...');
        setTimeout(() => {
          console.log('Delete timeout completed, refreshing data...');
          this.loadMiembros();
          console.log('Data refresh after delete initiated.');
        }, 1000);
      },
      error: (error) => {
        console.error('Error deleting miembro', error);
        // You could add user notification here
        // For example: this.showErrorMessage('No se pudo eliminar el miembro. Por favor, inténtelo de nuevo.');
      }
    });
  }

  onCreate(): void {
    this.currentMiembro = null;
    this.modalTitle = 'Nuevo Miembro';
    this.miembroForm.reset({
      activo: true,
      fechaNacimiento: new Date().toISOString().split('T')[0],
      fechaIngreso: new Date().toISOString().split('T')[0]
    });
    this.modalVisible = true;
  }

  onCloseModal(): void {
    this.modalVisible = false;
  }

  onSubmitForm(): void {
    if (this.miembroForm.invalid) {
      return;
    }

    this.formSubmitting = true;
    const formData = this.miembroForm.value;

    if (this.currentMiembro) {
      // Update existing miembro
      // Ensure dates are in the correct format (YYYY-MM-DD)
      // Explicitly include all required fields
      const miembroData = {
        id: this.currentMiembro.id,
        nombre: formData.nombre || this.currentMiembro.nombre,
        apellido: formData.apellido || this.currentMiembro.apellido,
        cedula: formData.cedula || this.currentMiembro.cedula,
        fechaNacimiento: formData.fechaNacimiento ? formData.fechaNacimiento.split('T')[0] : this.currentMiembro.fechaNacimiento.split('T')[0],
        fechaIngreso: formData.fechaIngreso ? formData.fechaIngreso.split('T')[0] : this.currentMiembro.fechaIngreso.split('T')[0],
        sexo: formData.sexo || this.currentMiembro.sexo,
        direccion: formData.direccion || this.currentMiembro.direccion,
        telefono: formData.telefono || this.currentMiembro.telefono,
        correo: formData.correo || this.currentMiembro.correo,
        activo: formData.activo !== undefined ? formData.activo : this.currentMiembro.activo
      };
      console.log('Updating miembro with data:', miembroData);
      this.miembroService.update(this.currentMiembro.id, miembroData).subscribe({
        next: (response) => {
          console.log('Update successful, response:', response);
          // First close the modal
          this.modalVisible = false;
          this.formSubmitting = false;

          // Then refresh the data after a longer delay to ensure the modal is closed
          console.log('Setting timeout to refresh data after update...');
          setTimeout(() => {
            console.log('Update timeout completed, refreshing data...');
            this.loadMiembros();
            console.log('Data refresh after update initiated.');
          }, 1000);
        },
        error: (error) => {
          console.error('Error updating miembro', error);
          this.formSubmitting = false;
        }
      });
    } else {
      // Create new miembro
      // Add id field with value 0 as expected by the API
      // Ensure all required fields are included and dates are in the correct format (YYYY-MM-DD)
      const miembroData = {
        id: 0,
        nombre: formData.nombre,
        apellido: formData.apellido,
        cedula: formData.cedula,
        fechaNacimiento: formData.fechaNacimiento ? formData.fechaNacimiento.split('T')[0] : '',
        fechaIngreso: formData.fechaIngreso ? formData.fechaIngreso.split('T')[0] : '',
        sexo: formData.sexo,
        direccion: formData.direccion,
        telefono: formData.telefono,
        correo: formData.correo,
        activo: formData.activo !== undefined ? formData.activo : true
      };
      console.log('Creating miembro with data:', miembroData);
      this.miembroService.create(miembroData).subscribe({
        next: (response) => {
          console.log('Create successful, response:', response);
          // First close the modal
          this.modalVisible = false;
          this.formSubmitting = false;

          // Then refresh the data after a longer delay to ensure the modal is closed
          console.log('Setting timeout to refresh data after create...');
          setTimeout(() => {
            console.log('Create timeout completed, refreshing data...');
            this.loadMiembros();
            console.log('Data refresh after create initiated.');
          }, 1000);
        },
        error: (error) => {
          console.error('Error creating miembro', error);
          this.formSubmitting = false;
        }
      });
    }
  }
}
