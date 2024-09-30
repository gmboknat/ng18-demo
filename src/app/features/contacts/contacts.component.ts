import { Component, effect, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { ContactFormDialogComponent } from './contact-form-dialog/contact-form-dialog.component';
import { ContactsService } from '../../services/contacts.service';
import { ContactsStore } from '../../stores/contacts.store';
import {MatIconModule} from '@angular/material/icon';
import { Contact } from '../../models/contact.model';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatDialogModule, MatIconModule],
  templateUrl: './contacts.component.html',
})
export class ContactsComponent implements OnInit {
  dialog = inject(MatDialog);
  contactsService = inject(ContactsService)
  contactsStore = inject(ContactsStore)
  displayedColumns: string[] = ['name', 'phone', 'email', 'actions'];
  
  ngOnInit(): void {
    this.contactsStore.getAll()
  }

  onCreateForm() {
    this.dialog.open(ContactFormDialogComponent, {
      width: '320px',
    })
  }

  onEditForm(contact: Contact) {
    this.dialog.open(ContactFormDialogComponent, {
      width: '320px',
      data: {
        contact
      }
    })
  }

  onDelete(id: string) {
    this.contactsStore.delete(id)
  }
}