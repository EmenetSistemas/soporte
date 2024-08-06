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

	protected permisos: any = {
		'Administrador': {
			'generarOrden': 1,
			'detalleOrden': 1,
			'entregarOrden': 1,
			'ordenActualizar': 1,
			'ordenActualizarCantidades': 1,
			'ordenConcluir': 1,
			'ordenRetomar': 1,
			'ordenCancelar': 1,
			'ordenEliminar': 1
		},
		'Supervisor': {
			'generarOrden': 1,
			'detalleOrden': 1,
			'entregarOrden': 1,
			'ordenActualizar': 1,
			'ordenActualizarCantidades': 0,
			'ordenConcluir': 1,
			'ordenRetomar': 0,
			'ordenCancelar': 0,
			'ordenEliminar': 0
		},
		'Técnico': {
			'generarOrden': 1,
			'detalleOrden': 1,
			'entregarOrden': 0,
			'ordenActualizar': 0,
			'ordenActualizarCantidades': 0,
			'ordenConcluir': 0,
			'ordenRetomar': 0,
			'ordenCancelar': 0,
			'ordenEliminar': 0
		}
	};

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
		await this.obtenerDetallePerfilPorToken().then(() => {
			this.mensajes.mensajeGenericoToast('Se obtuvó la información con éxito', 'success');
		});
	}

	private crearformMoficacionPerfil(): void {
		this.formMoficacionPerfil = this.fb.group({
			nombre                    : ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú ]*')]],
			aPaterno                  : ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú ]*')]],
			aMaterno                  : ['', [Validators.pattern('[a-zA-Zá-úÁ-Ú ]*')]],
			correo                    : ['', [Validators.required, Validators.email, Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-_@#$%&+{}()?¿!¡\n\r\t]*')]],
			perfil					  : ['', [Validators.required]],
			generarOrden              : [''],
			detalleOrden              : [''],
			entregarOrden             : [''],
			ordenActualizar           : [''],
			ordenActualizarCantidades : [''],
			ordenConcluir             : [''],
			ordenRetomar              : [''],
			ordenCancelar             : [''],
			ordenEliminar             : [''],
			cambioContraseniaPerfil   : [''],
			contraseniaAntigua        : [''],
			contraseniaNueva          : [''],
			confContraseniaNueva      : ['']
		})
	}

	private obtenerDetallePerfilPorToken(): Promise<any> {
		if (this.pkUsuario != 0) {
			return this.apiAuth.obtenerInformacionUsuarioPorPk(this.pkUsuario).toPromise().then(
				respuesta => {
					this.informacionPerfil = respuesta[0];
					this.cargarFormModificacionPerfil();
				},
				error => {
					this.mensajes.mensajeGenerico('error', 'error');
				}
			)
		} else {
			return this.apiAuth.obtenerInformacionUsuarioPorToken(localStorage.getItem('token_soporte')).toPromise().then(
				respuesta => {
					this.informacionPerfil = respuesta[0];
					this.cargarFormModificacionPerfil();
				},
				error => {
					this.mensajes.mensajeGenerico('error', 'error');
				}
			)
		}
	}

	private cargarFormModificacionPerfil(): void {
		this.formMoficacionPerfil.get('nombre')?.setValue(this.informacionPerfil.nombre);
		this.formMoficacionPerfil.get('aPaterno')?.setValue(this.informacionPerfil.aPaterno);
		this.formMoficacionPerfil.get('aMaterno')?.setValue(this.informacionPerfil.aMaterno);
		this.formMoficacionPerfil.get('correo')?.setValue(this.informacionPerfil.correo);
		this.formMoficacionPerfil.get('perfil')?.setValue(this.informacionPerfil.perfil);

		if (this.pkUsuario != 0) {
			this.formMoficacionPerfil.get('generarOrden')?.setValue(this.informacionPerfil.generarOrden);
			this.formMoficacionPerfil.get('detalleOrden')?.setValue(this.informacionPerfil.detalleOrden);
			this.formMoficacionPerfil.get('entregarOrden')?.setValue(this.informacionPerfil.entregarOrden);
			this.formMoficacionPerfil.get('ordenActualizar')?.setValue(this.informacionPerfil.ordenActualizar);
			this.formMoficacionPerfil.get('ordenActualizarCantidades')?.setValue(this.informacionPerfil.ordenActualizarCantidades);
			this.formMoficacionPerfil.get('ordenConcluir')?.setValue(this.informacionPerfil.ordenConcluir);
			this.formMoficacionPerfil.get('ordenRetomar')?.setValue(this.informacionPerfil.ordenRetomar);
			this.formMoficacionPerfil.get('ordenCancelar')?.setValue(this.informacionPerfil.ordenCancelar);
			this.formMoficacionPerfil.get('ordenEliminar')?.setValue(this.informacionPerfil.ordenEliminar);
		} else {
			this.formMoficacionPerfil.get('perfil')?.disable();
			this.formMoficacionPerfil.get('perfil')?.clearValidators();
			this.formMoficacionPerfil.get('perfil')?.updateValueAndValidity();
		}
	}

	protected cambioPermisosPerfil(): void {
		this.formMoficacionPerfil.get('generarOrden')?.setValue(this.permisos[this.formMoficacionPerfil.value.perfil].generarOrden);
		this.formMoficacionPerfil.get('detalleOrden')?.setValue(this.permisos[this.formMoficacionPerfil.value.perfil].detalleOrden);
		this.formMoficacionPerfil.get('entregarOrden')?.setValue(this.permisos[this.formMoficacionPerfil.value.perfil].entregarOrden);
		this.formMoficacionPerfil.get('ordenActualizar')?.setValue(this.permisos[this.formMoficacionPerfil.value.perfil].ordenActualizar);
		this.formMoficacionPerfil.get('ordenActualizarCantidades')?.setValue(this.permisos[this.formMoficacionPerfil.value.perfil].ordenActualizarCantidades);
		this.formMoficacionPerfil.get('ordenConcluir')?.setValue(this.permisos[this.formMoficacionPerfil.value.perfil].ordenConcluir);
		this.formMoficacionPerfil.get('ordenRetomar')?.setValue(this.permisos[this.formMoficacionPerfil.value.perfil].ordenRetomar);
		this.formMoficacionPerfil.get('ordenCancelar')?.setValue(this.permisos[this.formMoficacionPerfil.value.perfil].ordenCancelar);
		this.formMoficacionPerfil.get('ordenEliminar')?.setValue(this.permisos[this.formMoficacionPerfil.value.perfil].ordenEliminar);
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
			this.formMoficacionPerfil.get('contraseniaAntigua')?.setValidators([Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-_@#$%&+{}()?¿!¡\n\r\t]*')]);
			this.formMoficacionPerfil.get('contraseniaAntigua')?.updateValueAndValidity();
			this.formMoficacionPerfil.get('contraseniaNueva')?.setValidators([Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-_@#$%&+{}()?¿!¡\n\r\t]*')]);
			this.formMoficacionPerfil.get('contraseniaNueva')?.updateValueAndValidity();
			this.formMoficacionPerfil.get('confContraseniaNueva')?.setValidators([Validators.required, Validators.pattern('[a-zA-Zá-úÁ-Ú0-9 .,-_@#$%&+{}()?¿!¡\n\r\t]*')]);
			this.formMoficacionPerfil.get('confContraseniaNueva')?.updateValueAndValidity();
		}
	}

	protected cambioCheck(option: string): void {
		this.formMoficacionPerfil.get(option)?.setValue(this.formMoficacionPerfil.value[option] == 1 ? 0 : 1);
		
		if (option == 'ordenActualizar' && this.formMoficacionPerfil.value['ordenActualizar'] == 0) {
			this.formMoficacionPerfil.get('ordenActualizarCantidades')?.setValue(0);
		}
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
			(
				(
					this.pkUsuario != 0 && (
						this.formMoficacionPerfil.value.perfil == this.informacionPerfil.perfil &&
						this.formMoficacionPerfil.value.generarOrden == this.informacionPerfil.generarOrden &&
						this.formMoficacionPerfil.value.detalleOrden == this.informacionPerfil.detalleOrden &&
						this.formMoficacionPerfil.value.entregarOrden == this.informacionPerfil.entregarOrden &&
						this.formMoficacionPerfil.value.ordenActualizar == this.informacionPerfil.ordenActualizar &&
						this.formMoficacionPerfil.value.ordenActualizarCantidades == this.informacionPerfil.ordenActualizarCantidades &&
						this.formMoficacionPerfil.value.ordenConcluir == this.informacionPerfil.ordenConcluir &&
						this.formMoficacionPerfil.value.ordenRetomar == this.informacionPerfil.ordenRetomar &&
						this.formMoficacionPerfil.value.ordenCancelar == this.informacionPerfil.ordenCancelar &&
						this.formMoficacionPerfil.value.ordenEliminar == this.informacionPerfil.ordenEliminar
					)
				) || this.pkUsuario == 0
			) &&
			!this.inputContrasenia
		) {
			this.mensajes.mensajeGenericoToast('No hay cambios por guardar', 'info');
			return;
		}

		if (this.inputContrasenia) {
			this.mensajes.mensajeEsperar();
			const credenciales: any = {
				contraseniaActual: this.formMoficacionPerfil.get('contraseniaAntigua')?.value,
				token: localStorage.getItem('token_soporte')
			};

			if (this.pkUsuario != 0) credenciales.pkUsuario = this.pkUsuario;

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

					const datosUsuario: any = {
						perfilInformacion: this.formMoficacionPerfil.value,
						token: localStorage.getItem('token_soporte')
					};

					if (this.pkUsuario != 0) datosUsuario.pkUsuario = this.pkUsuario;

					this.apiUsuarios.modificarUsuario(datosUsuario).subscribe(
						respuesta => {
							if (respuesta.status == 409) {
								this.mensajes.mensajeGenerico(respuesta.mensaje, 'warning');
								return;
							}

							this.obtenerDetallePerfilPorToken().then(() => {
								this.mensajes.mensajeGenericoToast(respuesta.mensaje, 'success');
							});
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

	protected cambiarStatusSesion(title: string, action: string): void {
		this.mensajes.mensajeConfirmacionCustom(`¿Está seguro de ${action} la sesión en cuestión?`, 'question', `${title} sesión`).then(
			res => {
				if (!res.isConfirmed) return;

				this.mensajes.mensajeEsperar();

				this.apiUsuarios.cambiarStatusSesion(this.pkUsuario).subscribe(
					respuesta => {
						this.obtenerDetallePerfilPorToken().then(() => {
							this.mensajes.mensajeGenericoToast(respuesta.mensaje, 'success');
						});
					}, error => {
						this.mensajes.mensajeGenerico('error', 'error');
					}
				);
			}
		);
	}

	protected cerrarModal(): void {
		if (
			this.formMoficacionPerfil.value.nombre != this.informacionPerfil.nombre ||
			this.formMoficacionPerfil.value.aPaterno != this.informacionPerfil.aPaterno ||
			this.formMoficacionPerfil.value.aMaterno != this.informacionPerfil.aMaterno ||
			this.formMoficacionPerfil.value.correo != this.informacionPerfil.correo ||
			(
				this.pkUsuario != 0 && (
					this.formMoficacionPerfil.value.perfil != this.informacionPerfil.perfil ||
					this.formMoficacionPerfil.value.generarOrden != this.informacionPerfil.generarOrden ||
					this.formMoficacionPerfil.value.detalleOrden != this.informacionPerfil.detalleOrden ||
					this.formMoficacionPerfil.value.entregarOrden != this.informacionPerfil.entregarOrden ||
					this.formMoficacionPerfil.value.ordenActualizar != this.informacionPerfil.ordenActualizar ||
					this.formMoficacionPerfil.value.ordenActualizarCantidades != this.informacionPerfil.ordenActualizarCantidades ||
					this.formMoficacionPerfil.value.ordenConcluir != this.informacionPerfil.ordenConcluir ||
					this.formMoficacionPerfil.value.ordenRetomar != this.informacionPerfil.ordenRetomar ||
					this.formMoficacionPerfil.value.ordenCancelar != this.informacionPerfil.ordenCancelar ||
					this.formMoficacionPerfil.value.ordenEliminar != this.informacionPerfil.ordenEliminar
				)
			) ||
			this.inputContrasenia
		) {
			this.mensajes.mensajeGenerico('Aún tienes cambios pendientes por guardar, antes de cerrar el modal se recomienda guardar cambios para no perder los mismos', 'warning', 'Cambios pendientes');
			return;
		}

		this.bsModalRef.hide();
	}

	ngOnDestroy(): void {
		this.formMoficacionPerfil.reset();
	}
}