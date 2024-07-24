<?php

namespace App\Repositories\Auth;

use App\Models\TblSesiones;
use App\Models\TblUsuarios;

class UsuarioRepository
{
    public function obtenerInformacionUsuarioPorToken( $token ){
        $usuario = TblSesiones::select('tblUsuarios.*')
                              ->join('tblUsuarios', 'tblUsuarios.pkTblUsuario', 'tblSesiones.fkTblUsuario')
							  ->where('tblSesiones.token', $token);

        return $usuario->get();
    }

    public function obtenerListaUsuarios ($status = null) {
        $query = TblUsuarios::select(
                                'pkTblUsuario',
                                'nombre',
                                'aPaterno',
                                'aMaterno',
                                'correo',
                                'password',
                                'fechaAlta'
                            )
                            ->selectRaw('CONCAT(nombre, " ",aPaterno) as nombreCompleto')
                            ->selectRaw('
                                CASE
                                    WHEN activo = 1 THEN "Activo"
                                    WHEN activo = 0 THEN "Inactivo"
                                END as status
                            ');

        if ($status != null) $query->where('activo', $status);
        return $query->get();
    }
}