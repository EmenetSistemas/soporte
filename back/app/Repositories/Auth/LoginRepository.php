<?php

namespace App\Repositories\Auth;

use App\Models\TblSesiones;
use App\Models\TblUsuarios;
use Illuminate\Support\Str;

class LoginRepository
{
    public function validarExistenciaUsuario ( $correo, $password ) {
        $temporal = TblUsuarios::select(
                                   'pkTblUsuario',
                                   'password'
                               )
                               ->where('correo', $correo)
                               ->first();

        return $temporal && password_verify($password, $temporal->password) ? $temporal->pkTblUsuario : null;
    }

    public function validarUsuarioActivo( $pkUsuario ){
        $usuario = TblUsuarios::where([
                                 ['pkTblUsuario', $pkUsuario],
                                 ['activo', 1]
                              ]);

        return $usuario->count() > 0;
    }

    public function crearSesionYAsignarToken ( $pkUsuario ){
        $registro = new TblSesiones();
        $registro->fkTblUsuario = $pkUsuario;
        $registro->token        = bcrypt(Str::random(50));
        $registro->save();
        
        return $registro->token;
    }

    public function auth( $token ){
        $sesiones = TblSesiones::where('token', $token)->count();
        return $sesiones > 0 ? 'true' : 'false';
    }

    public function logout( $token ){
        $sesion = TblSesiones::where('token', $token);
        $sesion->delete();
    }
}