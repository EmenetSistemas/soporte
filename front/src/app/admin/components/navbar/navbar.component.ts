import { Component } from '@angular/core';
import { DataService } from '../../services/data/data.service';

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
	protected informacionUsuario: any = [];

	constructor (
		private dataService: DataService
	) {}

	protected prueba(): void {
		this.dataService.claseSidebar = this.dataService.claseSidebar == '' ? 'toggle-sidebar' : '';
	}

	protected logout(): void {

	}
}