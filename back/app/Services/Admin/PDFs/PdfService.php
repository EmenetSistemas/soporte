<?php

namespace App\Services\Admin\PDFs;

use App\Repositories\Admin\OrdenesRepository;
use Carbon\Carbon;

class PdfService
{
    protected $ordenesRepository;

    public function __construct(
        OrdenesRepository $OrdenesRepository
    ) {
        $this->ordenesRepository = $OrdenesRepository;
    }

    public function generarPdfOrdenServicio ($pkOrden) {
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
        return [
            'orden' => $orden,
            'detalleOrden' => $detalleOrden
        ];
    }

    function formatearFecha($fecha) {
        if ($fecha == null || trim($fecha) == '' || trim($fecha) == '0000-00-00 00:00:00') return null;

        return Carbon::parse($fecha)->format('d-m-Y');
    }
}