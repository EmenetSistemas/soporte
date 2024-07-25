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

    public function validarCorreoExiste($correo, $idUsuario){
        $validarCorreo = TblUsuarios::where([
                                            ['correo',$correo],
                                            ['pkTblUsuario','!=', $idUsuario]
                                        ]);
        return $validarCorreo->count();
    }

    public function modificarUsuario($datosUsuario, $idUsuario, $cambioPass){
        $actualizar = [
            'nombre'   =>  $this->trimValidator($datosUsuario['nombre']),
            'aPaterno' =>  $this->trimValidator($datosUsuario['aPaterno']),
            'aMaterno' =>  $this->trimValidator($datosUsuario['aMaterno']),
            'correo'   =>  $this->trimValidator($datosUsuario['correo'])
        ];

        if($cambioPass){
            $actualizar['password'] = bcrypt($this->trimValidator($datosUsuario['contraseniaNueva']));
        }
        
        TblUsuarios::where('pkTblUsuario', $idUsuario)
                   ->update($actualizar);
    }

    public function validarContraseniaActual($idUsuario, $password){
        $temporal = TblUsuarios::select(
                                    'password'
                                )
                                ->where('pkTblUsuario', $idUsuario)
                                ->first();

        return password_verify($password, $temporal->password);
    }

    public function trimValidator ( $value ) {
		return $value != null && trim($value) != '' ? trim($value) : null;
	}
}