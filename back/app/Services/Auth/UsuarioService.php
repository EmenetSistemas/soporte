<?php

namespace App\Services\Auth;

use App\Repositories\Auth\UsuarioRepository;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

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

    public function obtenerListaUsuarios ($status) {
        $listaUsuarios = $this->usuarioRepository->obtenerListaUsuarios($status);

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
        $usuario = $this->usuarioRepository->obtenerInformacionUsuarioPorToken($datosCredenciales['token']);
        $validarContrasenia = $this->usuarioRepository->validarContraseniaActual($usuario[0]->pkTblUsuario, $datosCredenciales['contraseniaActual']);
        
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
        $usuario = $this->usuarioRepository->obtenerInformacionUsuarioPorToken($datosUsuario['token']);
        $validarUsuario = $this->usuarioRepository->validarCorreoExiste($datosUsuario['perfilInformacion']['correo'],$usuario[0]->pkTblUsuario);
        
        if($validarUsuario > 0 ){
            return response()->json(
                [
                    'mensaje' => 'Upss! Al parecer ya existe un Usuario con el mismo correo. Por favor validar la información',
                    'status' => 409
                ],
                200
            );
        }

        DB::beginTransaction();
            $this->usuarioRepository->modificarUsuario(
                $datosUsuario['perfilInformacion'],
                $usuario[0]->pkTblUsuario, 
                $datosUsuario['perfilInformacion']['cambioContraseniaPerfil']
            );
        DB::commit();

        return response()->json(
            [
                'mensaje' => 'Se actualizó la información con éxito'
            ],
            200
        );
    }

    function formatearFecha($fecha) {
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