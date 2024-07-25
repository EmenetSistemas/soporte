import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { UsuariosService } from 'src/app/admin/services/api/usuarios/usuarios.service';
import { UsuariosService as UsuariosServiceAuth } from 'src/app/auth/services/usuarios/usuarios.service';
import { MensajesService } from 'src/app/admin/services/mensajes/mensajes.service';
import FGenerico from 'src/shared/util/funciones-genericas';

@Component({
	selector: 'app-modificar-usuario',
	templateUrl: './modificar-usuario.component.html',
	styleUrls: ['./modificar-usuario.component.css']
})
export class ModificarUsuarioComponent extends FGenerico implements OnInit, OnDestroy {
	@Input() pkUsuario: number = 0;

	protected formMoficacionPerfil!: FormGroup;
	protected inputContrasenia: boolean = false;

	protected informacionPerfil: any;

	constructor(
		private mensajes: MensajesService,
		private fb: FormBuilder,
		private bsModalRef: BsModalRef,
		private apiUsuarios: UsuariosService,
		private apiAuth: UsuariosServiceAuth
	) {
		super();
	}

	async ngOnInit(): Promise<void> {
		this.mensajes.mensajeEsperar();
		this.crearformMoficacionPerfil();
		this.cambioContraseniaPerfil();
		await this.obtenerDetallePerfilPorToken();
	}

	private crearformMoficacionPerfil(): void {
		this.formMoficacionPerfil = this.fb.group({
			nombre: ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú ]*')]],
			aPaterno: ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú ]*')]],
			aMaterno: ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú ]*')]],
			correo: ['', [Validators.required, Validators.email, Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]],
			cambioContraseniaPerfil: [''],
			contraseniaAntigua: [''],
			contraseniaNueva: [''],
			confContraseniaNueva: ['']
		})
	}

	private obtenerDetallePerfilPorToken(): Promise<any> {
		return this.apiAuth.obtenerInformacionUsuarioPorToken(localStorage.getItem('token_soporte')).toPromise().then(
			respuesta => {
				this.informacionPerfil = respuesta[0];
				this.cargarFormModificacionPerfil();
				this.mensajes.mensajeGenericoToast('Se consultó la información con éxito', 'success');
			},
			error => {
				this.mensajes.mensajeGenerico('error', 'error');
			}
		)
	}

	private cargarFormModificacionPerfil(): void {
		this.formMoficacionPerfil.get('nombre')?.setValue(this.informacionPerfil.nombre);
		this.formMoficacionPerfil.get('aPaterno')?.setValue(this.informacionPerfil.aPaterno);
		this.formMoficacionPerfil.get('aMaterno')?.setValue(this.informacionPerfil.aMaterno);
		this.formMoficacionPerfil.get('correo')?.setValue(this.informacionPerfil.correo);
	}

	async modificarPerfil(): Promise<any> {
		if (this.formMoficacionPerfil.invalid) {
			this.mensajes.mensajeGenerico('Aún hay campos vacíos o que no cumplen con la estructura correcta de la Información personal.', 'warning', 'Los campos requeridos están marcados con un *')
			return;
		}

		if (
			this.formMoficacionPerfil.value.nombre == this.informacionPerfil.nombre &&
			this.formMoficacionPerfil.value.aPaterno == this.informacionPerfil.aPaterno &&
			this.formMoficacionPerfil.value.aMaterno == this.informacionPerfil.aMaterno &&
			this.formMoficacionPerfil.value.correo == this.informacionPerfil.correo &&
			!this.inputContrasenia
		) {
			this.mensajes.mensajeGenericoToast('No hay cambios por guardar', 'info');
			return;
		}

		if (this.inputContrasenia) {
			this.mensajes.mensajeEsperar();
			const credenciales = {
				contraseniaActual: this.formMoficacionPerfil.get('contraseniaAntigua')?.value,
				token: localStorage.getItem('token_soporte')
			}
			await this.apiUsuarios.validarContraseniaActual(credenciales).toPromise().then(
				respuesta => {
					if (respuesta.status == 204) {
						this.mensajes.mensajeGenerico(respuesta.mensaje, 'warning');
						return;
					}

					this.confirmarModificacion();
				},
				error => {
					this.mensajes.mensajeGenerico('error', 'error');
				}
			)
			return;
		} else {
			this.confirmarModificacion();
		}
	}

	private confirmarModificacion(): void {
		this.mensajes.mensajeConfirmacionCustom('¿Está seguro de continuar con la actualización?', 'question', 'Actualizar información').then(
			respuestaMensaje => {
				if (respuestaMensaje.isConfirmed) {
					this.mensajes.mensajeEsperar();

					const datosUsuario = {
						perfilInformacion: this.formMoficacionPerfil.value,
						token: localStorage.getItem('token_soporte')
					}
					this.apiUsuarios.modificarUsuario(datosUsuario).subscribe(
						respuesta => {
							if (respuesta.status == 409) {
								this.mensajes.mensajeGenerico(respuesta.mensaje, 'warning');
								return;
							}

							this.mensajes.mensajeGenericoToast(respuesta.mensaje, 'success');
							return;
						},

						error => {
							this.mensajes.mensajeGenerico('error', 'error');
						}
					);
				}
			}
		)
	}

	protected cerrarModal(): void {
		if (
			this.formMoficacionPerfil.value.nombre != this.informacionPerfil.nombre ||
			this.formMoficacionPerfil.value.aPaterno != this.informacionPerfil.aPaterno ||
			this.formMoficacionPerfil.value.aMaterno != this.informacionPerfil.aMaterno ||
			this.formMoficacionPerfil.value.correo != this.informacionPerfil.correo ||
			this.inputContrasenia
		) {
			this.mensajes.mensajeGenerico('Aún tienes cambios pendientes por guardar, antes de cerrar el modal se recomienda guardar cambios para no perder los mismos', 'warning', 'Cambios pendientes');
			return;
		}

		this.bsModalRef.hide();
	}

	protected cambioContraseniaPerfil(): void {
		this.inputContrasenia = this.formMoficacionPerfil.get('cambioContraseniaPerfil')?.value;
		if (this.inputContrasenia == false) {
			this.formMoficacionPerfil.controls['contraseniaAntigua']?.disable();
			this.formMoficacionPerfil.controls['contraseniaNueva']?.disable();
			this.formMoficacionPerfil.controls['confContraseniaNueva']?.disable();
			this.formMoficacionPerfil.get('contraseniaAntigua')?.setValue(null);
			this.formMoficacionPerfil.get('contraseniaNueva')?.setValue(null);
			this.formMoficacionPerfil.get('confContraseniaNueva')?.setValue(null);
			this.formMoficacionPerfil.get('contraseniaAntigua')?.clearValidators();
			this.formMoficacionPerfil.get('contraseniaAntigua')?.updateValueAndValidity();
			this.formMoficacionPerfil.get('contraseniaNueva')?.clearValidators();
			this.formMoficacionPerfil.get('contraseniaNueva')?.updateValueAndValidity();
			this.formMoficacionPerfil.get('confContraseniaNueva')?.clearValidators();
			this.formMoficacionPerfil.get('confContraseniaNueva')?.updateValueAndValidity();
		} else {
			this.formMoficacionPerfil.controls['contraseniaNueva']?.enable();
			this.formMoficacionPerfil.controls['contraseniaAntigua']?.enable();
			this.formMoficacionPerfil.controls['confContraseniaNueva']?.enable();
			this.formMoficacionPerfil.get('contraseniaAntigua')?.setValidators([Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]);
			this.formMoficacionPerfil.get('contraseniaAntigua')?.updateValueAndValidity();
			this.formMoficacionPerfil.get('contraseniaNueva')?.setValidators([Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]);
			this.formMoficacionPerfil.get('contraseniaNueva')?.updateValueAndValidity();
			this.formMoficacionPerfil.get('confContraseniaNueva')?.setValidators([Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-@#$%&+{}()?¿!¡]*')]);
			this.formMoficacionPerfil.get('confContraseniaNueva')?.updateValueAndValidity();
		}
	}

	ngOnDestroy(): void {
		this.formMoficacionPerfil.reset();
	}
}