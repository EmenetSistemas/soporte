import { Component } from '@angular/core';
import * as moment from 'moment';

@Component({ template: '' })

export default class FGenerico {
    public soloLetras(event: KeyboardEvent) {
        const pattern = /[a-zA-Zá-úÁ-Ú ]/;
        const inputChar = String.fromCharCode(event.charCode);

        if (!pattern.test(inputChar)) {
            event.preventDefault();
        }
    }

    public soloTexto(event: Event) {
        const pattern = /[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+*[{}()?¿!¡\n]/;
        const inputElement = event.target as HTMLInputElement;
        const inputValue = inputElement.value;
    
        if (!pattern.test(inputValue)) {
            inputElement.value = inputValue.slice(0, -1);
        }
    }    

    public soloNumeros(event: KeyboardEvent) {
        const pattern = /[0-9 .]/;
        const inputChar = String.fromCharCode(event.charCode);

        if (!pattern.test(inputChar)) {
            event.preventDefault();
        }
    }

    public is_empty(cadena: string) {
        return cadena == null || cadena == undefined || cadena.trim() == '';
    }

    protected getNowString(): any {
        const hoy = Date.now();

        return moment(hoy).format("YYYY-MM-DD hh:mm A");
    }

    protected obtenerFormatoNumero(telefono: string): string {
        return telefono.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
    }

    public phoneFormat(event: any): void {
        const inputElement = event.target;
        let inputValue = inputElement.value.replace(/\D/g, '');
      
        inputValue = inputValue.startsWith('5') || inputValue.startsWith('6') ?
                     inputValue.replace(/(\d{2})(\d{4})(\d{0,4})/, '$1 $2 $3').trim() :
                     inputValue.replace(/(\d{3})(\d{3})(\d{0,4})/, '$1 $2 $3').trim();
      
        inputElement.value = inputValue;
      }

    public obtenerSaludo () : string {
        const horaActual = new Date().getHours();
    
        if (horaActual >= 5 && horaActual < 12) {
            return 'buenos días';
        } else if (horaActual >= 12 && horaActual < 18) {
            return 'buenas tardes';
        } else {
            return 'buenas noches';
        }
    }

    public formatString (str : any) : string {
        str = str.toString() ?? '';
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^\w\s]/gi, '').replace(/ñ/g, 'n');
    }

    public numberFormat(event: any): void {
        const inputElement = event.target;
        const inputValue = inputElement.value.replace(/,/g, '');
    
        if (isNaN(inputValue)) {
            inputElement.value = '0';
            return;
        }
    
        const formattedValue = parseFloat(inputValue) > 0 ? parseFloat(inputValue) : 0;
        inputElement.value = formattedValue.toLocaleString();
    }

    public moneyFormat(event: any): void {
        const inputElement = event.target;
        const inputValue = inputElement.value.replace(/[,$]/g, '');
    
        if (isNaN(inputValue)) {
            inputElement.value = '$ 0';
            return;
        }
    
        const formattedValue = parseFloat(inputValue) > 0 ? parseFloat(inputValue) : '0';
        inputElement.value = '$ '+formattedValue.toLocaleString();
    }
}