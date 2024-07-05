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
                    'mensaje' => 'Ocurrió un error al consultar' 
                ], 
                500
            );
        }
    }
}