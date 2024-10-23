import { Component, inject, signal } from '@angular/core';
import { TypeaheadService } from './typeahead.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, mergeAll, switchMap, tap } from 'rxjs';
import { Book } from './book';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  templateUrl: './typeahead.component.html',
  standalone: true,
  imports: [ReactiveFormsModule]
})
export class TypeaheadComponent {

  private ts = inject(TypeaheadService);

  searchControl = new FormControl('', { nonNullable: true });

  //results = signal<Book[]>([]);
  loading = signal(false);

  searchInput$ = this.searchControl.valueChanges;

  results = toSignal(this.searchInput$.pipe(
    debounceTime(600),
    distinctUntilChanged(),
    tap(()=>this.loading.set(true)),
    switchMap(term => this.ts.search(term)),
    tap(()=>this.loading.set(false)),
  ), {initialValue: []})

  constructor() {
    const searchInput$ = this.searchControl.valueChanges;

    /**
     * Baue eine TypeAhead-Suche, die während der Eingabe eine Suche gegen unsere Buch-API ausführt.
     *
     * Die Eingabewerte aus dem Formular werden durch das Observable searchInput$ bekanntgegeben.
     * Zur Suche soll der Service `TypeaheadService` verwendet werden, er hat die Methode `this.ts.search(term: string)`.
     * Die aktuellen Ergebnisse sollen im Signal `this.results` gespeichert werden.
     * Der Lade-Indikator wird angezeigt, wenn das Signal `loading` den Wert `true` hat.
     *
     * Extra: Refaktorisiere den Code und nutze die AsyncPipe oder die Funktion `toSignal()` von Angular, um die Subscription aufzubauen.
     */

    /******************************/
    /*searchInput$.pipe(
      map(term => this.ts.search(term)),
      mergeAll()
    ).subscribe(books => this.results.set(books))
*/
    /*
        searchInput$.pipe(
          debounceTime(600),
          distinctUntilChanged(),

          tap((x) => x ? console.log(x) : null
            // good for debug
            // does not modify the return of map. safe to use for small events inside pipe
          ),

          tap(()=>this.loading.set(true)),
          switchMap(term => this.ts.search(term)),
          tap(()=>this.loading.set(false)),

        ).subscribe(books => this.results.set(books))
        */
    /******************************/

  }

  formatAuthors(authors: string[]) {
    return Array.isArray(authors) ? authors.join(', ') : '';
  }

}
