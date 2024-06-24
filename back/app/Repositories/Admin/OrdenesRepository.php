<?php

namespace App\Repositories\Admin;

use App\Models\TblDetalleOrdenServicio;
use App\Models\TblOrdenesServicio;

class OrdenesRepository
{
    public function obtenerOrdenesServicio ($status) {
        $query = TblOrdenesServicio::select(
                                       'tblOrdenesServicio.pkTblOrdenServicio as pkTblOrdenServicio',
                                       'tblOrdenesServicio.cliente as cliente',
                                       'tblOrdenesServicio.telefono as telefono',
                                       'tblOrdenesServicio.aCuenta as aCuenta',
                                       'tblOrdenesServicio.status as status'
                                   )
                                   ->selectRaw("CASE WHEN DATE_FORMAT(tblOrdenesServicio.fechaRegistro, '%d-%m-%Y') = '00-00-0000' THEN '-' ELSE DATE_FORMAT(tblOrdenesServicio.fechaRegistro, '%d-%m-%Y') END as fechaRegistro")
                                   ->selectRaw("CASE WHEN DATE_FORMAT(tblOrdenesServicio.fechaConclucion, '%d-%m-%Y') = '00-00-0000' THEN '-' ELSE DATE_FORMAT(tblOrdenesServicio.fechaConclucion, '%d-%m-%Y') END as fechaConclucion")
                                   ->selectRaw("CASE WHEN DATE_FORMAT(tblOrdenesServicio.fechaEntrega, '%d-%m-%Y') = '00-00-0000' THEN '-' ELSE DATE_FORMAT(tblOrdenesServicio.fechaEntrega, '%d-%m-%Y') END as fechaEntrega")
                                   ->selectRaw("CASE WHEN DATE_FORMAT(tblOrdenesServicio.fechaCancelacion, '%d-%m-%Y') = '00-00-0000' THEN '-' ELSE DATE_FORMAT(tblOrdenesServicio.fechaCancelacion, '%d-%m-%Y') END as fechaCancelacion")
                                   ->selectRaw('COUNT(tblDetalleOrdenServicio.pktblDetalleOrdenServicio) as totalEquipos')
                                   ->selectRaw('SUM(tblDetalleOrdenServicio.costoReparacion) as total')
                                   ->leftJoin('tblDetalleOrdenServicio', 'tblDetalleOrdenServicio.fkTblOrdenServicio', 'tblOrdenesServicio.pkTblOrdenServicio')
                                   ->where('tblOrdenesServicio.status', $status)
                                   ->groupBy(
                                       'tblOrdenesServicio.pkTblOrdenServicio',
                                       'tblOrdenesServicio.cliente',
                                       'tblOrdenesServicio.telefono',
                                       'tblOrdenesServicio.aCuenta',
                                       'tblOrdenesServicio.fechaRegistro',
                                       'tblOrdenesServicio.fechaConclucion',
                                       'tblOrdenesServicio.fechaEntrega',
                                       'tblOrdenesServicio.fechaCancelacion',
                                       'tblOrdenesServicio.status'
                                   );

        switch ($status) {
            case 1:
                $query->orderBy('tblOrdenesServicio.fechaRegistro', 'asc');
            break;
            case 2:
                $query->orderBy('tblOrdenesServicio.fechaConclucion', 'desc');
            break;
            case 3:
                $query->orderBy('tblOrdenesServicio.fechaEntrega', 'desc');
            break;
            case 4:
                $query->orderBy('tblOrdenesServicio.fechaCancelacion', 'desc');
            break;
        }
        return $query->get();
    }

    public function obtenerOrdenServicio ($pkOrden) {
        $query = TblOrdenesServicio::select(
                                       'tblordenesservicio.pkTblOrdenServicio as pkTblOrdenServicio',
                                       'tblordenesservicio.cliente as cliente',
                                       'tblordenesservicio.telefono as telefono',
                                       'tblordenesservicio.correo as correo',
                                       'tblordenesservicio.direccion as direccion',
                                       'tblordenesservicio.aCuenta as aCuenta',
                                       'tblordenesservicio.nota as nota',
                                       'usuarioRegistro.nombre as usuarioRegistro',
                                       'tblordenesservicio.fechaRegistro as fechaRegistro',
                                       'usuarioConclucion.nombre as usuarioConclucion',
                                       'tblordenesservicio.fechaConclucion as fechaConclucion',
                                       'usuarioEntrega.nombre as usuarioEntrega',
                                       'tblordenesservicio.fechaEntrega as fechaEntrega',
                                       'usuarioCancelacion.nombre as usuarioCancelacion',
                                       'tblordenesservicio.fechaCancelacion as fechaCancelacion',
                                       'usuarioModificacion.nombre as usuarioModificacion',
                                       'tblordenesservicio.fechaModificacion as fechaModificacion',
                                       'tblordenesservicio.status as status'
                                   )
                                   ->leftJoin('tblUsuarios as usuarioRegistro', 'usuarioRegistro.pkTblUsuario', 'tblordenesservicio.fkUsuarioRegistro')
                                   ->leftJoin('tblUsuarios as usuarioConclucion', 'usuarioConclucion.pkTblUsuario', 'tblordenesservicio.fkUsuarioConclucion')
                                   ->leftJoin('tblUsuarios as usuarioEntrega', 'usuarioEntrega.pkTblUsuario', 'tblordenesservicio.fkUsuarioEntrega')
                                   ->leftJoin('tblUsuarios as usuarioCancelacion', 'usuarioCancelacion.pkTblUsuario', 'tblordenesservicio.fkUsuarioCancelacion')
                                   ->leftJoin('tblUsuarios as usuarioModificacion', 'usuarioModificacion.pkTblUsuario', 'tblordenesservicio.fkUsuarioModificacion')
                                   ->where('tblOrdenesServicio.pkTblOrdenServicio', $pkOrden);
        return $query->get()[0] ?? [];
    }

    public function obtenerDetalleOrdenServicio ($pkOrden) {
        $query = TblDetalleOrdenServicio::where('fkTblOrdenServicio', $pkOrden);

        return $query->get() ?? [];
    }
}