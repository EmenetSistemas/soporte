<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\Auth\UsuarioService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class UsuarioController extends Controller
{
    protected $usuariosService;

    public function __construct(
        UsuarioService $UsuariosService
    )
    {
        $this->usuariosService = $UsuariosService;    
    }

    public function obtenerInformacionUsuarioPorToken( Request $request ){
        try{
            return $this->usuariosService->obtenerInformacionUsuarioPorToken( $request->all() );
        } catch( \Throwable $error ) {
            Log::alert($error);
            return response()->json(
                [
                    'error' => $error,
                    'mensaje' => 'Ocurrió un error interno'
                ], 
                500
            );
        }
    }

    public function obtenerInformacionUsuarioPorPk( $pkUsuario ){
        try{
            return $this->usuariosService->obtenerInformacionUsuarioPorPk( $pkUsuario );
        } catch( \Throwable $error ) {
            Log::alert($error);
            return response()->json(
                [
                    'error' => $error,
                    'mensaje' => 'Ocurrió un error interno'
                ], 
                500
            );
        }
    }

    public function obtenerListaUsuarios($status, $tipo){
        try{
            return $this->usuariosService->obtenerListaUsuarios($status, $tipo);
        } catch( \Throwable $error ) {
            Log::alert($error);
            return response()->json(
                [
                    'error' => $error,
                    'mensaje' => 'Ocurrió un error interno'
                ], 
                500
            );
        }
    }

    public function validarContraseniaActual(Request $request){
        try{
            return $this->usuariosService->validarContraseniaActual( $request->all() );
        }catch( \Throwable $error ) {
            Log::alert($error);
            return response()->json(
                [
                    'error' => $error,
                    'mensaje' => 'Ocurrió un error interno'
                ], 
                500
            );
        }
    }

    public function modificarUsuario(Request $request){
        try{
            return $this->usuariosService->modificarUsuario( $request->all() );
        }catch( \Throwable $error ) {
            Log::alert($error);
            return response()->json(
                [
                    'error' => $error,
                    'mensaje' => 'Ocurrió un error interno'
                ], 
                500
            );
        }
    }

    public function cambiarStatusSesion ($pkUsuario) {
        try{
            return $this->usuariosService->cambiarStatusSesion($pkUsuario);
        }catch( \Throwable $error ) {
            Log::alert($error);
            return response()->json(
                [
                    'error' => $error,
                    'mensaje' => 'Ocurrió un error interno'
                ], 
                500
            );
        }
    }
}