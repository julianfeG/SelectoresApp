import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap, tap }  from 'rxjs/operators'
import { PaisesServiceService } from '../../services/paises-service.service';
import { PaisSmall } from '../../interfaces/paises.interface';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit{

  miFormulario: FormGroup = this.fb.group({
    region: ['', Validators.required],
    pais: ['', Validators.required],
    frontera: ['', Validators.required],
  })

  //LLENAR SELECTORES
  regiones: string[] = [];
  paises: PaisSmall[] = [];
  //fronteras: string[] = [];
  fronteras: PaisSmall[] = [];

  // UI
  cargando: boolean = false;

  constructor(private fb: FormBuilder,
              private paisesService: PaisesServiceService) {}

  ngOnInit(): void {
    this.regiones = this.paisesService.regiones;

    //Cuando cambie la region

    /*this.miFormulario.get('region')?.valueChanges
      .subscribe(region => {
        console.log(region);

        this.paisesService.getPaisesPorRegion(region)
          .subscribe(paises => {
            console.log(paises);
            this.paises = paises;
          });
      });*/

    //Mejor usar un switchmap cuando un observable depende de otro observable
    this.miFormulario.get('region')?.valueChanges
      .pipe(  //Uso pipe para transformar el valor que viene
        tap( ( _ ) => {
          this.miFormulario.get('pais')?.reset('');
          this.cargando = true;
        }), //Disparar efecto secundario con tap
        switchMap(region => this.paisesService.getPaisesPorRegion(region))
      )
      .subscribe(paises => {
        this.paises = paises;
        this.cargando = false;
      });


      //Cuando cambia el pais
      this.miFormulario.get('pais')?.valueChanges
        .pipe(
          tap(() => {
            this.cargando = true;
            this.miFormulario.get('frontera')?.reset('');
          }),
          switchMap(codigo => this.paisesService.getPaisPorCodigo(codigo)),
          switchMap(pais => this.paisesService.getPaisesPorCodigos(pais.borders))
        )
        .subscribe(paises => {
          console.log(paises);
          //this.fronteras = pais[0].borders || [];
          this.fronteras = paises;
          this.cargando = false;
       });
  }

  guardar() {
    console.log(this.miFormulario.value)
  }

}
