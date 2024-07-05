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
            $registro = $this->ordenesRepository->registrarOrdenServicio($orden);
            foreach ($orden['equipos'] as $equipo) {
                $this->ordenesRepository->registrarDetalleOrdenServicio($registro['pkOrden'], $equipo['itemType'], $equipo['data']);
            }
        DB::commit();

        return response()->json(
            [
                'data' => $registro,
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
                    $this->ordenesRepository->actualizarDetalleOrdenServicio($equipo['data'], $orden['token']);
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

            if ($dataCambio['status'] == 4) {
                if ($this->ordenesRepository->validaStatusOrden($pkOrden, 1) > 0) {

                    DB::commit();
                    return response()->json(
                        [
                            'mensaje' => 'Se actualizó el status del servicio con éxito'
                        ],
                        200
                    );
                }
        
                if ($this->ordenesRepository->validaStatusOrden($pkOrden, 2) > 0) {
                    $dataConclucion = [
                        'pkTblOrdenServicio' => $pkOrden
                    ];

                    $this->ordenesRepository->concluirOrdenServicio($dataConclucion);

                    DB::commit();
                    return response()->json(
                        [
                            'status' => 300,
                            'mensaje' => 'Se eliminó el equipo de la orden de servicio y al no quedar servicios pendientes se cocluyó la orden de servicio con éxito'
                        ],
                        200
                    );
                }
        
                if ($this->ordenesRepository->validaStatusOrden($pkOrden, 4) > 0) {
                    $this->ordenesRepository->cancelarOrdenServicio($pkOrden, $dataCambio['token']);

                    DB::commit();
                    return response()->json(
                        [
                            'status' => 300,
                            'mensaje' => 'Se eliminó el equipo de la orden de servicio y al no quedar servicios pendientes se canceló la orden de servicio con éxito'
                        ],
                        200
                    );
                }
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
            $this->ordenesRepository->cancelarOrdenServicio($dataCancelacion['pkTblOrdenServicio'], $dataCancelacion['token']);
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
                'mensaje' => 'Se cambió el status de la orden y los equipos a "pendiente" con éxito'
            ],
            200
        );
    }

    public function concluirOrdenServicio ($dataConclucion) {
        DB::beginTransaction();
            $this->ordenesRepository->concluirOrdenServicio($dataConclucion);
            $this->ordenesRepository->concluirEquiposOrden($dataConclucion);
        DB::commit();

        return response()->json(
            [
                'mensaje' => 'Se cambió el status de la orden y los equipos pendientes a "concluido" con éxito'
            ],
            200
        );
    }

    public function eliminarEquipoOrden ($dataEliminacion) {
        $pkOrden = $this->ordenesRepository->eliminarEquipoOrden($dataEliminacion);

        if ($this->ordenesRepository->validaStatusOrden($pkOrden, 1) > 0) {
            return response()->json(
                [
                    'mensaje' => 'Se eliminó el equipo de la orden de servicio con éxito'
                ],
                200
            );
        }

        if ($this->ordenesRepository->validaStatusOrden($pkOrden, 2) > 0) {
            $dataConclucion = [
                'pkTblOrdenServicio' => $pkOrden
            ];
            $this->ordenesRepository->concluirOrdenServicio($dataConclucion);
            return response()->json(
                [
                    'status' => 300,
                    'mensaje' => 'Se eliminó el equipo de la orden de servicio y al no quedar servicios pendientes se cocluyó la orden de servicio con éxito'
                ],
                200
            );
        }

        if ($this->ordenesRepository->validaStatusOrden($pkOrden, 4) > 0) {
            $this->ordenesRepository->cancelarOrdenServicio($pkOrden, $dataEliminacion['token']);
            return response()->json(
                [
                    'status' => 300,
                    'mensaje' => 'Se eliminó el equipo de la orden de servicio y al no quedar servicios pendientes se canceló la orden de servicio con éxito'
                ],
                200
            );
        }
    }

    public function entregarEquiposOrden ($dataEntregar) {
        $pkOrden = $this->ordenesRepository->validarEntregaEquiposOrden($dataEntregar);

        if ($pkOrden == null) {
            return response()->json(
                [
                    'status' => 300,
                    'mensaje' => 'Los datos ingresados no concuerdan con ninguna orden de servicio, te solicitamos verificar para poder continuar con la entrega'
                ],
                200
            );
        }


        DB::beginTransaction();
            $this->ordenesRepository->entregarOrden($pkOrden, $dataEntregar);
            $this->ordenesRepository->entregarEquiposOrden($pkOrden);
        DB::commit();

        return response()->json(
            [
                'mensaje' => 'Se cambió el status de la orden de servicio a entregada con éxito'
            ],
            200
        );
    }
}