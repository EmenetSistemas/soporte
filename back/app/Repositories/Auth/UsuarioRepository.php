<?php

namespace App\Repositories\Auth;

use App\Models\TblSesiones;
use App\Models\TblUsuarios;

class UsuarioRepository
{
    public function obtenerInformacionUsuarioPorToken ( $token ) {
        $usuario = TblSesiones::select('tblUsuarios.*')
                              ->join('tblUsuarios', 'tblUsuarios.pkTblUsuario', 'tblSesiones.fkTblUsuario')
							  ->where('tblSesiones.token', $token);

        return $usuario->get();
    }

    public function obtenerInformacionUsuarioPorPk ( $pkUsuario ) {
        $usuario = TblUsuarios::where('tblUsuarios.pkTblUsuario', $pkUsuario);

        return $usuario->get();
    }

    public function obtenerListaUsuarios ($status = null, $type) {
        $query = TblUsuarios::select(
                                'tblUsuarios.pkTblUsuario',
                                'tblUsuarios.nombre',
                                'tblUsuarios.aPaterno',
                                'tblUsuarios.aMaterno',
                                'tblUsuarios.correo',
                                'tblUsuarios.password',
                                'tblUsuarios.fechaAlta'
                            )
                            ->selectRaw('CONCAT(tblUsuarios.nombre, " ",tblUsuarios.aPaterno) as nombreCompleto')
                            ->selectRaw('
                                CASE
                                    WHEN activo = 1 THEN "Activo"
                                    WHEN activo = 0 THEN "Inactivo"
                                END as status
                            ')
                            ->selectRaw('
                                CASE
                                    WHEN (select count(tblSesiones.fkTblUsuario) from tblSesiones where tblSesiones.fkTblUsuario = tblUsuarios.pkTblUsuario) > 0 THEN true
                                    ELSE false
                                END as linea
                            ')
                            ->distinct();

        if ($status != null) $query->where('tblUsuarios.activo', $status);

        if ($type == 'simple') $query->where([
                                                ['tblUsuarios.perfil', '!=', 'Administrador'],
                                                ['tblUsuarios.perfil', '!=', 'Superadministrador']
                                            ]);

        return $query->get();
    }

    public function validarCorreoExiste ($correo, $idUsuario) {
        $validarCorreo = TblUsuarios::where([
                                            ['correo',$correo],
                                            ['pkTblUsuario','!=', $idUsuario]
                                        ]);
        return $validarCorreo->count();
    }

    public function modificarUsuario ($datosUsuario, $idUsuario, $cambioPass) {
        $actualizar = [
            'nombre'   => $this->trimValidator($datosUsuario['nombre']),
            'aPaterno' => $this->trimValidator($datosUsuario['aPaterno']),
            'aMaterno' => $this->trimValidator($datosUsuario['aMaterno']),
            'correo'   => $this->trimValidator($datosUsuario['correo'])
        ];

        if($cambioPass){
            $actualizar['password'] = bcrypt($this->trimValidator($datosUsuario['contraseniaNueva']));
        }
        
        TblUsuarios::where('pkTblUsuario', $idUsuario)
                   ->update($actualizar);
    }

    public function modificarUsuarioPermisos ($datosUsuario, $idUsuario) {
        $actualizar = [
            'nombre'          => $this->trimValidator($datosUsuario['nombre']),
            'aPaterno'        => $this->trimValidator($datosUsuario['aPaterno']),
            'aMaterno'        => $this->trimValidator($datosUsuario['aMaterno']),
            'correo'          => $this->trimValidator($datosUsuario['correo']),
            'generarOrden'    => $datosUsuario['generarOrden'],
            'detalleOrden'    => $datosUsuario['detalleOrden'],
            'entregarOrden'   => $datosUsuario['entregarOrden'],
            'ordenActualizar' => $datosUsuario['ordenActualizar'],
            'ordenConcluir'   => $datosUsuario['ordenConcluir'],
            'ordenRetomar'    => $datosUsuario['ordenRetomar'],
            'ordenCancelar'   => $datosUsuario['ordenCancelar'],
            'ordenEliminar'   => $datosUsuario['ordenEliminar']
        ];
        
        TblUsuarios::where('pkTblUsuario', $idUsuario)
                   ->update($actualizar);
    }

    public function validarContraseniaActual ($idUsuario, $password) {
        $temporal = TblUsuarios::select(
                                    'password'
                                )
                                ->where('pkTblUsuario', $idUsuario)
                                ->first();

        return password_verify($password, $temporal->password);
    }

    public function cerrarSesionesActivas ($pkUsuario) {
        TblSesiones::where('fkTblUsuario', $pkUsuario)
                   ->delete();
    }

    public function cambiarStatusSesion ($pkUsuario, $activo) {
        TblUsuarios::where('pkTblUsuario', $pkUsuario)
                   ->update([
                      'activo' => $activo
                   ]);
    }

    public function trimValidator ( $value ) {
		return $value != null && trim($value) != '' ? trim($value) : null;
	}
}