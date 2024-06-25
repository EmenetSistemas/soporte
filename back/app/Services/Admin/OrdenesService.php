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
}