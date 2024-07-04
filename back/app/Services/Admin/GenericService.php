<?php

namespace App\Services\Admin;

use App\Repositories\Admin\GenericRepository;
use Illuminate\Support\Facades\Log;

class GenericService
{
    protected $genericRepository;

    public function __construct(
        GenericRepository $GenericRepository
    ) {
        $this->genericRepository = $GenericRepository;
    }

    public function obtenerEstadisticas()
    {
        $estadisticas = [
            'totalOrdenesPendientes' => $this->genericRepository->obtenerTotalOrdenesStatus(1),
            'totalOrdenesConcluidas' => $this->genericRepository->obtenerTotalOrdenesStatus(2),
            'totalOrdenesEntregadas' => $this->genericRepository->obtenerTotalOrdenesStatus(3),
            'totalOrdenesCanceladas' => $this->genericRepository->obtenerTotalOrdenesStatus(4),

            'totalEquiposPendientes' => $this->genericRepository->obtenerTotalEquiposStatus(1),
            'totalEquiposConcluidos' => $this->genericRepository->obtenerTotalEquiposStatus(2),
            'totalEquiposEntregados' => $this->genericRepository->obtenerTotalEquiposStatus(3),
            'totalEquiposCancelados' => $this->genericRepository->obtenerTotalEquiposStatus(4)
        ];

        $equiposMasTiempo = $this->genericRepository->obtenerOrdenesMasTiempo();

        $noEquiposPendientesEntrega = $this->genericRepository->obtenerNoEquiposPendientesEntrega();

        $result = [];

        foreach ($noEquiposPendientesEntrega as $item) {
            $result[$item["equipo"]] = $item["total"];
        }

        return response()->json(
            [
                'data' => [
                    'estadisticas' => $estadisticas,
                    'equiposMasTiempo' => $equiposMasTiempo,
                    'noEquiposPendientesEntrega' => $result
                ],
                'mensaje' => 'Se registró la orden de servicio con éxito'
            ],
            200
        );
    }
}
