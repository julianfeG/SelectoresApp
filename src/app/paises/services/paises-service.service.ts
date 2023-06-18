import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pais, PaisSmall } from '../interfaces/paises.interface';
import { Observable, combineLatest, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaisesServiceService {

  private _baseUrl: string = 'https://restcountries.com/v3.1'
  private _regiones: string[] = ['Africa', 'America', 'Asia', 'Europe', 'Oceania'];

  get regiones(): string[] {
    return [...this._regiones];
  }

  constructor( private http: HttpClient) { }

  getPaisesPorRegion(region: string): Observable<PaisSmall[]> {
    const url: string = `${this._baseUrl}/region/${region}?fields=name,cca2`;
    return this.http.get<PaisSmall[]>(url);
  }

  getPaisPorCodigo (codigo: string): Observable<any> {

    if (!codigo) {
      return of(null);
    }

    const url: string = `${this._baseUrl}/alpha/${codigo}`;
    return this.http.get<any>(url);
  }

  getPaisPorCodigoSmall (codigo: string): Observable<PaisSmall> {
    const url: string = `${this._baseUrl}/alpha/${codigo}?fields=name,cca2`;
    return this.http.get<PaisSmall>(url);
  }

  getPaisesPorCodigos(borders: string[]): Observable<PaisSmall[]> {
    if (!borders) {
      return of([]);
    }
    console.log(borders);

    const peticiones: Observable<PaisSmall>[] = [];

    borders.forEach( codigo => {
      const peticion =this.getPaisPorCodigoSmall(codigo);
      peticiones.push(peticion);
    })
    

    return combineLatest( peticiones );

  }


}
