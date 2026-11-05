import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { INSTITUTION } from '../../../core/institution';

@Component({
  selector: 'app-inicio',
  imports: [RouterLink],
  templateUrl: './inicio.html',
  styleUrl: './inicio.scss',
})
export class Inicio {
  protected readonly institution = INSTITUTION;
}
