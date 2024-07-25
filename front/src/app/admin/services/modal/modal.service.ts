import { Injectable } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Injectable({
	providedIn: 'root'
})
export class ModalService {
	modalRef: BsModalRef | undefined;

	constructor(private modalService: BsModalService) { }

	abrirModalConComponente(component: any, dataModal: any = null, typeModal: string = 'custom-modal') {
		const modalConfig = {
			ignoreBackdropClick: true,
			keyboard: false,
			animated: true,
			initialState: dataModal,
			class: 'modal-xl modal-dialog-centered ' + typeModal,
			style: {
				'background-color': 'transparent',
				'overflow-y': 'auto'
			}
		};

		if (typeModal === 'lg-modal') {
			modalConfig.class = 'modal-lg modal-dialog-centered';
		}

		if (typeModal === 'sm-modal') {
			modalConfig.class = 'modal-sm modal-dialog-centered';
		}

		this.modalRef = this.modalService.show(component, modalConfig);

		document.body.style.paddingRight = '';
	}

	cerrarModal() {
		if (this.modalRef) {
			this.modalRef.hide();
			this.modalRef = undefined;
		}

		document.body.classList.remove('modal-open');
		document.body.style.paddingRight = '';
		document.body.style.overflow = '';
	}
}