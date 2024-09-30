import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ContactsService } from '../../../services/contacts.service';
import { Contact } from '../../../models/contact.model';
import { ContactsStore } from '../../../stores/contacts.store';

@Component({
  selector: 'app-contact-form-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatButtonModule, MatDialogClose, MatInputModule, MatFormFieldModule],
  templateUrl: './contact-form-dialog.component.html',
})
export class ContactFormDialogComponent {
  dialogRef = inject(MatDialogRef<ContactFormDialogComponent>);
  data = inject(MAT_DIALOG_DATA);
  formBuilder = inject(NonNullableFormBuilder)
  contactsStore = inject(ContactsStore)

  form = this.formBuilder.group({
    name: ['', [Validators.required]],
    phone: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]]
  })
  private contactService = inject(ContactsService)

  constructor() {
    if (this.data?.contact) {
      this.form.patchValue({
        ...this.data.contact
      })
    }
  }

  onSave() {
    const contact: Contact = this.form.getRawValue()
    if (this.data?.contact?.id) {
      this.contactsStore.update(this.data.contact.id, contact).subscribe(() => {
        this.dialogRef.close()
      })
    } else {
      this.contactsStore.add(contact).subscribe(() => {
        this.dialogRef.close()
      })
    }
  }

}
