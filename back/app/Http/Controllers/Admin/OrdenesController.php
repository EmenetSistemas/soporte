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

    public function registrarOrdenServicio (Request $orden) {
        try{
            return $this->ordenesService->registrarOrdenServicio($orden->all());
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

    public function actualizarOrdenServicio (Request $orden) {
        try{
            return $this->ordenesService->actualizarOrdenServicio($orden->all());
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

    public function cambioStatusServicio (Request $request) {
        try{
            return $this->ordenesService->cambioStatusServicio($request->all());
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

    public function cancelarOrdenServicio (Request $request) {
        try{
            return $this->ordenesService->cancelarOrdenServicio($request->all());
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

    public function retomarOrdenServicio ($pkOrden) {
        try{
            return $this->ordenesService->retomarOrdenServicio($pkOrden);
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

    public function concluirOrdenServicio (Request $request) {
        try{
            return $this->ordenesService->concluirOrdenServicio($request->all());
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

    public function eliminarEquipoOrden (Request $request) {
        try{
            return $this->ordenesService->eliminarEquipoOrden($request->all());
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

    public function entregarEquiposOrden (Request $request) {
        try{
            return $this->ordenesService->entregarEquiposOrden($request->all());
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

    public function registrarSolicitudOrden (Request $request) {
        try{
            return $this->ordenesService->registrarSolicitudOrden($request->all());
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

    public function obtenerSolicitudesOrdenes (Request $request) {
        try{
            return $this->ordenesService->obtenerSolicitudesOrdenes($request->all()['status'], $request->all()['token'] ?? null);
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

    public function aprobarSolicitudOrden ($pkSolicitud) {
        try{
            return $this->ordenesService->aprobarSolicitudOrden($pkSolicitud);
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

    public function eliminarSolicitudOrden ($pkSolicitud) {
        try{
            return $this->ordenesService->eliminarSolicitudOrden($pkSolicitud);
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