<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Admin\GenericService;
use Illuminate\Support\Facades\Log;

class GenericController extends Controller
{
    protected $genericService;

    public function __construct(
        GenericService $GenericService
    ) {
        $this->genericService = $GenericService;
    }

    public function obtenerEstadisticas () {
        try{
            return $this->genericService->obtenerEstadisticas();
        } catch( \Throwable $error ) {
            Log::alert($error);
            return response()->json(
                [
                    'error' => $error,
                    'mensaje' => 'Ocurrió un error inesperado'
                ],
                500
            );
        }
    }
}