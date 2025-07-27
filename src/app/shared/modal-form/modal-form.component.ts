import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-form.component.html',
  styleUrls: ['./modal-form.component.css']
})
export class ModalFormComponent {
  @Input() title: string = 'Formulario';
  @Input() visible: boolean = false;
  @Input() loading: boolean = false;

  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }

  onSubmit(): void {
    this.submit.emit();
  }

  // Prevent clicks inside the modal from closing it
  onModalClick(event: Event): void {
    event.stopPropagation();
  }
}
