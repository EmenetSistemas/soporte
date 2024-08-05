<?php

namespace App\Services\Auth;

use App\Repositories\Auth\UsuarioRepository;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class UsuarioService
{
    protected $usuarioRepository;

    public function __construct(
        UsuarioRepository $UsuarioRepository
    )
    {
        $this->usuarioRepository = $UsuarioRepository;
    }

    public function obtenerInformacionUsuarioPorToken ( $token ) {
        return $this->usuarioRepository->obtenerInformacionUsuarioPorToken( $token['token'] );
    }

    public function obtenerInformacionUsuarioPorPk ( $pkUsuario ) {
        return $this->usuarioRepository->obtenerInformacionUsuarioPorPk( $pkUsuario );
    }

    public function obtenerPkPorToken ( $token ) {
        return $this->usuarioRepository->obtenerInformacionUsuarioPorToken( $token )[0]->pkTblUsuario;
    }

    public function obtenerListaUsuarios ($status, $tipo) {
        $listaUsuarios = $this->usuarioRepository->obtenerListaUsuarios($status, $tipo);

        foreach ($listaUsuarios as $usuario) {
            $usuario->fechaAlta = $this->formatearFecha($usuario->fechaAlta);
        }

        return response()->json(
            [
                'data' => [
                    'listaUsuarios' => $listaUsuarios
                ],
                'mensaje' => 'Se obtuvó la lista de usuarios en el status seleccionado con éxito'
            ],
            200
        );
    }

    public function validarContraseniaActual($datosCredenciales){
        $pkUsuario = isset($datosCredenciales['pkUsuario']) ? $datosCredenciales['pkUsuario'] : $this->usuarioRepository->obtenerInformacionUsuarioPorToken($datosCredenciales['token'])[0]->pkTblUsuario;
        
        $validarContrasenia = $this->usuarioRepository->validarContraseniaActual($pkUsuario, $datosCredenciales['contraseniaActual']);
        
        if($validarContrasenia == false){
            return response()->json(
                [
                    'mensaje' => 'Para continuar con la actualización se debe colocar correctamente la contraseña actual',
                    'status' => 204
                ],
                200
            );
        }

        return response()->json(
            [
                'mensaje' => 'Se validó la contraseña'
            ],
            200
        );
    }

    public function modificarUsuario($datosUsuario){
        $pkUsuario = isset($datosUsuario['pkUsuario']) ? $datosUsuario['pkUsuario'] : $this->usuarioRepository->obtenerInformacionUsuarioPorToken($datosUsuario['token'])[0]->pkTblUsuario;

        $validarUsuario = $this->usuarioRepository->validarCorreoExiste($datosUsuario['perfilInformacion']['correo'], $pkUsuario);
        
        if($validarUsuario > 0 ){
            return response()->json(
                [
                    'mensaje' => 'Upss! Al parecer ya existe un Usuario con el mismo correo. Por favor validar la información',
                    'status' => 409
                ],
                200
            );
        }

        $mensaje = 'Se actualizó la información con éxito';

        DB::beginTransaction();
            if (isset($datosUsuario['pkUsuario'])) {
                $mensaje = 'Se actualizó la información con éxito y se cerró toda sesión activa del perfil';

                $this->usuarioRepository->modificarUsuarioPermisos(
                    $datosUsuario['perfilInformacion'],
                    $pkUsuario
                );

                $this->usuarioRepository->cerrarSesionesActivas($pkUsuario);
            } else {
                $this->usuarioRepository->modificarUsuario(
                    $datosUsuario['perfilInformacion'],
                    $pkUsuario, 
                    $datosUsuario['perfilInformacion']['cambioContraseniaPerfil']
                );
            }
        DB::commit();

        return response()->json(
            [
                'mensaje' => $mensaje
            ],
            200
        );
    }

    public function cambiarStatusSesion ($pkUsuario) {
        $activo = $this->usuarioRepository->obtenerInformacionUsuarioPorPk( $pkUsuario )[0]->activo;

        $this->usuarioRepository->cambiarStatusSesion($pkUsuario, $activo == 1 ? 0 : 1);
        $this->usuarioRepository->cerrarSesionesActivas($pkUsuario);

        return response()->json(
            [
                'mensaje' => 'Se cambio status de la sesión en cuestión con éxito'
            ],
            200
        );
    }

    public function formatearFecha($fecha) {
        if ($fecha == null || trim($fecha) == '' || trim($fecha) == '0000-00-00 00:00:00') return null;

        $carbon = Carbon::parse($fecha);
        $ayer = Carbon::yesterday();
        $antier = Carbon::today()->subDays(2);
    
        if ($carbon->isToday()) {
            return 'Hoy ' . $carbon->format('h:i a');
        } elseif ($carbon->isSameDay($ayer)) {
            return 'Ayer ' . $carbon->format('h:i a');
        } elseif ($carbon->isSameDay($antier)) {
            return 'Antier ' . $carbon->format('h:i a');
        } else {
            return $carbon->format('d-m-Y | h:i a');
        }
    }
}