import { Component } from '@angular/core';
import { INSTITUTION } from '../../../core/institution';

@Component({
  selector: 'app-acerca',
  imports: [],
  templateUrl: './acerca.html',
  styleUrl: './acerca.scss',
})
export class Acerca {
  protected readonly institution = INSTITUTION;
}
