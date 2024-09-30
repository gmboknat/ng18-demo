import { Contact } from '../models/contact.model';
import {
  patchState,
  signalStore,
  withMethods,
  withState,
} from '@ngrx/signals';
import { tapResponse } from '@ngrx/operators';
import { ContactsService } from '../services/contacts.service';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';

interface ContactsState {
  contacts: Contact[];
  loading: boolean;
}

const initialState: ContactsState = {
  contacts: [],
  loading: false,
};

export const ContactsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, contactsService = inject(ContactsService)) => ({
    getAll: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true })),
        switchMap(() => {
          return contactsService.getAll().pipe(
            tapResponse({
              next: (contacts) =>
                patchState(store, { contacts, loading: false }),
              error: (err) => {
                patchState(store, { loading: false });
                console.error(err);
              },
            })
          );
        })
      )
    ),

    add: (contact: Contact) => {
      patchState(store, { loading: true })
      return contactsService.add(contact).pipe(
        tapResponse({
          next: (res) =>
            patchState(store, { contacts: [...store.contacts(), res], loading: false }),
          error: (err) => {
            patchState(store, { loading: false });
            console.error(err);
          },
        })
      );
    },

    update: (id: string, contact: Contact) => {
      patchState(store, { loading: true })
      return contactsService.update(id, contact).pipe(
        tapResponse({
          next: (res: Contact) => {
            const contacts = [...store.contacts()]
            const index = contacts.findIndex(c => c.id === id)
            contacts[index] = res;
            patchState(store, { contacts, loading: false })
          },
          error: (err) => {
            patchState(store, { loading: false });
            console.error(err);
          },
        })
      );
    },

    delete: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { loading: true })),
        switchMap((id) => {
          return contactsService.delete(id).pipe(
            tapResponse({
              next: () => {
                const contacts = [...store.contacts()].filter(c => c.id !== id)
                patchState(store, { contacts, loading: false })
              },
              error: (err) => {
                patchState(store, { loading: false });
                console.error(err);
              },
            })
          );
        })
      )
    ),
  }))
);
