import { Routes } from '@angular/router';
import { ContactsComponent } from './features/contacts/contacts.component';

export const routes: Routes = [
  {
    path: 'contacts',
    component: ContactsComponent
  },
  { path: '',   redirectTo: '/contacts', pathMatch: 'full' }
];
