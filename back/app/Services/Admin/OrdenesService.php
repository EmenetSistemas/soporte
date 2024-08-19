<?php

namespace App\Services\Admin;

use App\Repositories\Admin\OrdenesRepository;
use App\Repositories\Auth\UsuarioRepository;
use App\Services\Auth\UsuarioService;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Mockery\Undefined;

class OrdenesService
{
    protected $ordenesRepository;
    protected $usuarioRepository;
    protected $usuarioService;

    public function __construct(
        OrdenesRepository $OrdenesRepository,
        UsuarioRepository $UsuarioRepository,
        UsuarioService $UsuarioService
    ) {
        $this->ordenesRepository = $OrdenesRepository;
        $this->usuarioRepository = $UsuarioRepository;
        $this->usuarioService = $UsuarioService;
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
        if ($pkOrden == 0) return response()->json(
            [
                'data' => [
                    'orden' => [],
                    'detalleOrden' => []
                ],
                'mensaje' => 'Se consultó el detalle de la orden de servicio con éxito'
            ],
            200
        );

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
            $solicitante = $orden['pkSolicitante'] ?? $this->usuarioService->obtenerPkPorToken($orden['token']);

            foreach ($orden['equipos'] as $equipo) {
                if (isset($equipo['data']['pkTblDetalleOrdenServicio'])) {
                    $this->ordenesRepository->actualizarDetalleOrdenServicio($equipo['data'], $solicitante);
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

            if ($dataCambio['status'] != 1) {
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
                    $dataCambio['pkTblOrdenServicio'] = $pkOrden;
                    $this->ordenesRepository->concluirOrdenServicio($dataCambio);

                    DB::commit();
                    return response()->json(
                        [
                            'status' => 300,
                            'mensaje' => 'Se actualizó el status del servicio con éxito y al no quedar servicios pendientes se cocluyó la orden de servicio con éxito'
                        ],
                        200
                    );
                }
        
                if ($this->ordenesRepository->validaStatusOrden($pkOrden, 4) > 0) {
                    $dataCambio['pkTblOrdenServicio'] = $pkOrden;
                    $this->ordenesRepository->cancelarOrdenServicio($dataCambio);
        
                    DB::commit();
                    return response()->json(
                        [
                            'status' => 300,
                            'mensaje' => 'Se actualizó el status del servicio con éxito y al no quedar servicios pendientes se canceló la orden de servicio con éxito'
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
            $this->ordenesRepository->cancelarOrdenServicio($dataCancelacion);
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
        if ($this->ordenesRepository->validarEquipoEliminar($dataEliminacion) == 1) {
            return response()->json(
                [
                    'mensaje' => 'No se puede eliminar el equipo de orden de servicio ya que no puede quedar una orden sin equipos'
                ],
                200
            );
        }

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
            $dataEliminacion['pkTblOrdenServicio'] = $pkOrden;
            $this->ordenesRepository->concluirOrdenServicio($dataEliminacion);
            return response()->json(
                [
                    'status' => 300,
                    'mensaje' => 'Se eliminó el equipo de la orden de servicio y al no quedar servicios pendientes se cocluyó la orden de servicio con éxito'
                ],
                200
            );
        }

        if ($this->ordenesRepository->validaStatusOrden($pkOrden, 4) > 0) {
            $dataEliminacion['pkTblOrdenServicio'] = $pkOrden;
            $this->ordenesRepository->cancelarOrdenServicio($dataEliminacion);

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
        $status = $this->ordenesRepository->validarEntregaEquiposOrden($dataEntregar);

        if ($status == null) {
            return response()->json(
                [
                    'status' => 300,
                    'mensaje' => 'Los datos ingresados no concuerdan con ninguna orden de servicio, te solicitamos verificar para poder continuar con la entrega'
                ],
                200
            );
        } else if ($status != 2) {
            return response()->json(
                [
                    'status' => 300,
                    'mensaje' => 'La orden de servicio se debe encontrar en status "concluida" para poder realizar la entrega de los equipos'
                ],
                200
            );
        }

        $solicitudes = $this->ordenesRepository->validarSolicitudesOrden($dataEntregar);

        if ($solicitudes > 0) {
            return response()->json(
                [
                    'status' => 300,
                    'mensaje' => 'La orden de servicio no puede ser entregada ya que existen solicitudes pendientes por aprobar de la misma<br><b>NOTA: comunicar que se aprueben las solicitudes para contniar con la entrega de la orden de servicio</b>'
                ],
                200
            );
        }

        DB::beginTransaction();
            $this->ordenesRepository->entregarOrden($dataEntregar['folio'], $dataEntregar);
            $this->ordenesRepository->entregarEquiposOrden($dataEntregar['folio']);
        DB::commit();

        return response()->json(
            [
                'mensaje' => 'Se cambió el status de la orden de servicio a entregada con éxito'
            ],
            200
        );
    }

    public function registrarSolicitudOrden ($solicitud) {
        Log::alert($solicitud);

        $this->ordenesRepository->registrarSolicitudOrden($solicitud);

        return response()->json(
            [
                'mensaje' => 'Se registró la solicitud con éxito'
            ],
            200
        );
    }

    public function obtenerSolicitudesOrdenes ($status, $tokenUsuario) {
        $solicitudes = $this->ordenesRepository->obtenerSolicitudesOrdenes($status, null, $tokenUsuario);

        $tituloSolicitud = [
            'actualizar'            => 'Actualizar orden',
            'actualizar-cantidades' => 'Actualizar cantidades',
            'concluir'              => 'Concluir orden',
            'concluir-equipo'       => 'Concluir equipo',
            'cancelar'              => 'Cancelar orden',
            'cancelar-equipo'       => 'Cancelar equipo',
            'retomar'               => 'Retomar orden',
            'retomar-equipo'        => 'Retomar equipo',
            'eliminar-equipo'       => 'Eliminar equipo'
        ];

        $statusPosterior = [
            'concluir'        => 'Orden concluida',
            'concluir-equipo' => 'Equipo concluido',
            'entregar'        => 'Orden entregada',
            'entregar-equipo' => 'Equipo entregado',
            'cancelar'        => 'Orden cancelada',
            'cancelar-equipo' => 'Equipo cancelado',
            'retomar'         => 'Orden pendiente',
            'retomar-equipo'  => 'Equipo pendiente',
            'eliminar-equipo' => 'Equipo eliminado'
        ];

        $bg = [
            'concluir'        => 'primary',
            'concluir-equipo' => 'primary',
            'entregar'        => 'success',
            'entregar-equipo' => 'success',
            'cancelar'        => 'danger',
            'cancelar-equipo' => 'danger',
            'retomar'         => 'warning',
            'retomar-equipo'  => 'warning',
            'eliminar-equipo' => 'danger'
        ];

        $icon = [
            'concluir'        => 'bi-clipboard-check',
            'concluir-equipo' => 'bi-clipboard-check',
            'entregar'        => 'bi bi-truck',
            'entregar-equipo' => 'bi bi-truck',
            'cancelar'        => 'bi-clipboard-x',
            'cancelar-equipo' => 'bi-clipboard-x',
            'retomar'         => 'bi-bar-chart-fill',
            'retomar-equipo'  => 'bi-bar-chart-fill',
            'eliminar-equipo' => 'bi-trash2-fill'
        ];
        
        foreach ($solicitudes as $solicitud) {
            $solicitud->fechaSolicitud  = $this->formatearFecha($solicitud->fechaSolicitud);
            $solicitud->tituloSolicitud = $tituloSolicitud[$solicitud->actividad];

            try {
                $solicitud->data = unserialize($solicitud->data);
            } catch ( \Throwable $error ) {
                
            }
            
            if ($solicitud->actividad != 'actualizar' && $solicitud->actividad != 'actualizar-cantidades') {
                $solicitud->statusPosterior = $statusPosterior[$solicitud->actividad];
                $solicitud->fondoPosterior  = $bg[$solicitud->actividad];
                $solicitud->iconoPosterior  = $icon[$solicitud->actividad];

                $actividadActual = $solicitud->statusActual;
                $solicitud->statusActual = $statusPosterior[$actividadActual];

                if (isset($solicitud->data['pkTblDetalleOrdenServicio'])) {
                    try {
                        $solicitud->dataEquipo = $this->ordenesRepository->obtenerDataEquipo($solicitud->data['pkTblDetalleOrdenServicio'])[0];
                        $actividadActual = $solicitud->dataEquipo->status;
                        $solicitud->statusActual = $statusPosterior[$actividadActual];
                    } catch ( \Throwable $error ) {

                    }
                }

                $solicitud->fondoActual  = $bg[$actividadActual];
                $solicitud->iconoActual  = $icon[$actividadActual];
            }
        }

        return response()->json(
            [
                'data' => [
                    'solicitudes' => $solicitudes
                ],
                'mensaje' => 'Se obtuvieron las solicitudes de orden con éxito'
            ],
            200
        );
    }

    public function aprobarSolicitudOrden ($pkSolicitud) {
        $solicitud = $this->ordenesRepository->obtenerSolicitudesOrdenes(0, $pkSolicitud)[0];

        try {
            $dataCambio = json_decode(json_encode(unserialize($solicitud->data)), true);
        } catch ( \Throwable $error ) {
            $dataCambio = $solicitud->data;
        }

        DB::beginTransaction();
            switch ($solicitud->actividad) {
                case 'actualizar':
                case 'actualizar-cantidades':
                    $message = $this->actualizarOrdenServicio($dataCambio);
                break;
                case 'retomar':
                    $message = $this->retomarOrdenServicio($dataCambio);
                break;
                case 'concluir':
                    $message = $this->concluirOrdenServicio($dataCambio);
                break;
                case 'cancelar':
                    $message = $this->cancelarOrdenServicio($dataCambio);
                break;
                case 'eliminar-equipo':
                    $message = $this->eliminarEquipoOrden($dataCambio);
                break;
                default:
                    $message = $this->cambioStatusServicio($dataCambio);
                break;
            }

            $this->ordenesRepository->aprobarSolicitudOrden($pkSolicitud);

            $pattern = '/\{.*\}/';

            preg_match($pattern, $message, $matches);
            
            if (isset($matches[0])) {
                $jsonString = $matches[0];
                
                $jsonArray = json_decode($jsonString, true);
            }
        DB::commit();

        return response()->json(
            [
                'mensaje' => $jsonArray['mensaje'] ?? 'Se aprobó la solicitud con éxito'
            ],
            200
        );
    }

    public function eliminarSolicitudOrden ($pkSolicitud) {
        $this->ordenesRepository->eliminarSolicitudOrden($pkSolicitud);
        
        return response()->json(
            [
                'mensaje' => 'Se eliminó la solicitud con éxito'
            ],
            200
        );
    }
}