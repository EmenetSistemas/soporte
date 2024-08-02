<?php

namespace App\Services\Auth;

use App\Repositories\Auth\LoginRepository;
use Illuminate\Support\Facades\DB;

class LoginService
{
    protected $loginRepository;

    public function __construct(
        LoginRepository $LoginRepository
    ) {
        $this->loginRepository = $LoginRepository;
    }

    public function login( $credenciales ){
        $pkUsuario = $this->loginRepository->validarExistenciaUsuario( $credenciales['correo'], $credenciales['password'] );
        if(is_null($pkUsuario)){
            return response()->json(
                [
                    'mensaje' => 'Upss! Al parecer las credenciales no son correctas para poder ingresar',
                    'title' => 'Credenciales incorrectas',
                    'status' => 204
                ],
                200
            );
        }
        
        $usuarioActivo = $this->loginRepository->validarUsuarioActivo( $pkUsuario );

        if(is_null($usuarioActivo)){
            return response()->json(
                [
                    'mensaje' => 'Upss! Al parecer tu cuenta esta actualmente supendida, favor de comunicarse con el DTIC de Emenet Comunicaciones',
                    'title' => 'Cuenta suspendida',
                    'status' => 409
                ],
                200
            );
        }

        DB::beginTransaction();
            $token = $this->loginRepository->crearSesionYAsignarToken( $pkUsuario );
        DB::commit();

        return response()->json(
            [
                'data' => [
                    'token'     => $token,
                    'permisos'  => [
                        "perfil"                    => $usuarioActivo->perfil,
                        "generarOrden"              => $usuarioActivo->generarOrden,
                        "entregarOrden"             => $usuarioActivo->entregarOrden,
                        "detalleOrden"              => $usuarioActivo->detalleOrden,
                        "ordenActualizarCantidades" => $usuarioActivo->ordenActualizarCantidades,
                        "ordenActualizar"           => $usuarioActivo->ordenActualizar,
                        "ordenConcluir"             => $usuarioActivo->ordenConcluir,
                        "ordenCancelar"             => $usuarioActivo->ordenCancelar,
                        "ordenRetomar"              => $usuarioActivo->ordenRetomar,
                        "ordenEliminar"             => $usuarioActivo->ordenEliminar
                    ]
                ],
                'mensaje' => 'Bienvenido a SCOSM',
                'status' => 200
            ],
            200
        );
    }

    public function auth( $token ){
        return $this->loginRepository->auth($token['token']);
    }

    public function logout( $token ){
        $this->loginRepository->logout($token['token']);
        
        return response()->json(
            [
                'mensaje' => 'Hasta pronto...!'
            ],
            200
        );
    }
}