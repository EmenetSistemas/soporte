<?php

namespace App\Repositories\Auth;

use App\Models\TblSesiones;

class UsuarioRepository
{
    public function obtenerInformacionUsuarioPorToken( $token ){
        $usuario = TblSesiones::select('tblUsuarios.*')
                              ->join('tblUsuarios', 'tblUsuarios.pkTblUsuario', 'tblSesiones.fkTblUsuario')
							  ->where('tblSesiones.token', $token);

        return $usuario->get();
    }
}