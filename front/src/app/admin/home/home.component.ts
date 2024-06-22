import { Component } from '@angular/core';
import { DataService } from '../services/data/data.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent {
	constructor(
		protected dataService: DataService
	) { }
}