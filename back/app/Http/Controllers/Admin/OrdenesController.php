<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Admin\OrdenesService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class OrdenesController extends Controller
{
    protected $ordenesService;

    public function __construct(
        OrdenesService $OrdenesService
    ) {
        $this->ordenesService = $OrdenesService;
    }

    public function obtenerOrdenesServicio ($status) {
        try{
            return $this->ordenesService->obtenerOrdenesServicio($status);
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

    public function obtenerDetalleOrdenServicio ($pkOrden) {
        try{
            return $this->ordenesService->obtenerDetalleOrdenServicio($pkOrden);
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