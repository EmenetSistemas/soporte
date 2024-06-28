<?php

namespace App\Services\Admin;

use App\Repositories\Admin\OrdenesRepository;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Mockery\Undefined;

class OrdenesService
{
    protected $ordenesRepository;

    public function __construct(
        OrdenesRepository $OrdenesRepository
    ) {
        $this->ordenesRepository = $OrdenesRepository;
    }

    public function registrarOrdenServicio ($orden) {
        DB::beginTransaction();
            $pkOrden = $this->ordenesRepository->registrarOrdenServicio($orden);
            foreach ($orden['equipos'] as $equipo) {
                $this->ordenesRepository->registrarDetalleOrdenServicio($pkOrden, $equipo['itemType'], $equipo['data']);
            }
        DB::commit();

        return response()->json(
            [
                'data' => [
                    'pkOrden' => $pkOrden
                ],
                'mensaje' => 'Se registró la orden de servicio con éxito'
            ],
            200
        );
    }

    public function obtenerOrdenesServicio ($status) {
        $ordenesStatus = $this->ordenesRepository->obtenerOrdenesServicio($status);

        return response()->json(
            [
                'data' => [
                    'ordenesStatus' => $ordenesStatus
                ],
                'mensaje' => 'Se obtuvieron las ordenes del status seleccionado con éxito'
            ],
            200
        );
    }

    public function obtenerDetalleOrdenServicio ($pkOrden) {
        $orden = $this->ordenesRepository->obtenerOrdenServicio($pkOrden);

        $orden->fechaRegistro     = $this->formatearFecha($orden->fechaRegistro);
        $orden->fechaConclucion   = $this->formatearFecha($orden->fechaConclucion);
        $orden->fechaEntrega      = $this->formatearFecha($orden->fechaEntrega);
        $orden->fechaCancelacion  = $this->formatearFecha($orden->fechaCancelacion);
        $orden->fechaModificacion = $this->formatearFecha($orden->fechaModificacion);

        $detalleOrden = $this->ordenesRepository->obtenerDetalleOrdenServicio($pkOrden);

        foreach ($detalleOrden as $equipo) {
            $equipo->fechaConclucion   = $this->formatearFecha($equipo->fechaConclucion);
            $equipo->fechaEntrega      = $this->formatearFecha($equipo->fechaEntrega);
            $equipo->fechaCancelacion  = $this->formatearFecha($equipo->fechaCancelacion);
            $equipo->fechaModificacion = $this->formatearFecha($equipo->fechaModificacion);
        }

        return response()->json(
            [
                'data' => [
                    'orden' => $orden,
                    'detalleOrden' => $detalleOrden
                ],
                'mensaje' => 'Se consultó el detalle de la orden de servicio con éxito'
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

    public function actualizarOrdenServicio ($orden) {
        DB::beginTransaction();
            $this->ordenesRepository->actualizarOrdenServicio($orden);
            foreach ($orden['equipos'] as $equipo) {
                if (isset($equipo['data']['pkTblDetalleOrdenServicio'])) {
                    $this->ordenesRepository->actualizarDetalleOrdenServicio($equipo['data']);
                } else {
                    $this->ordenesRepository->registrarDetalleOrdenServicio($orden['pkTblOrdenServicio'], $equipo['itemType'], $equipo['data']);
                }
            }
        DB::commit();

        return response()->json(
            [
                'mensaje' => 'Se actualizó la orden de servicio con éxito'
            ],
            200
        );
    }

    public function cambioStatusServicio ($dataCambio) {
        DB::beginTransaction();
            $pkOrden = $this->ordenesRepository->cambioStatusServicio($dataCambio);

            if ($dataCambio['status'] == 1) {
                $this->ordenesRepository->retomarOrdenServicio($pkOrden);
            }
        DB::commit();

        return response()->json(
            [
                'mensaje' => 'Se actualizó el status del servicio con éxito'
            ],
            200
        );
    }

    public function cancelarOrdenServicio ($dataCancelacion) {
        DB::beginTransaction();
            $this->ordenesRepository->cancelarOrdenServicio($dataCancelacion['pkTblOrdenServicio']);
            $this->ordenesRepository->cancelarEquiposOrden($dataCancelacion['pkTblOrdenServicio']);
        DB::commit();

        return response()->json(
            [
                'mensaje' => 'Se canceló la orden de servicio con éxito'
            ],
            200
        );
    }

    public function retomarOrdenServicio ($pkOrden) {
        DB::beginTransaction();
            $this->ordenesRepository->retomarOrdenServicio($pkOrden);
            $this->ordenesRepository->retomarEquiposOrden($pkOrden);
        DB::commit();

        return response()->json(
            [
                'mensaje' => 'Se cambio el status de la orden y los equipos a "pendiente" con éxito'
            ],
            200
        );
    }
}