<?php

namespace App\Repositories\Admin;

use App\Models\TblDetalleOrdenServicio;
use App\Models\TblOrdenesServicio;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class GenericRepository
{
    public function obtenerTotalOrdenesStatus($status) {
        $query = TblOrdenesServicio::where('status', $status);

        return $query->count();
    }

    public function obtenerTotalEquiposStatus($status) {
        $query = TblOrdenesServicio::leftJoin('tblDetalleOrdenServicio', 'tblDetalleOrdenServicio.fkTblOrdenServicio', 'tblOrdenesServicio.pkTblOrdenServicio')
                                   ->where('tblOrdenesServicio.status', $status);

        return $query->count();
    }

    public function obtenerOrdenesMasTiempo() {
        $query = TblOrdenesServicio::select(
                                       'tblOrdenesServicio.pkTblOrdenServicio as pkTblOrdenServicio',
                                       'tblOrdenesServicio.cliente as cliente',
                                       'tblOrdenesServicio.telefono as telefono',
                                   )
                                   ->selectRaw("
                                       CASE
                                           WHEN tblOrdenesServicio.status = 1 THEN 'Pendiente'
                                           WHEN tblOrdenesServicio.status = 2 THEN 'Concluida'
                                       END as status
                                   ")
                                   ->selectRaw("
                                       CASE
                                           WHEN tblOrdenesServicio.status = 1 THEN DATEDIFF(NOW(), tblOrdenesServicio.fechaRegistro)
                                           WHEN tblOrdenesServicio.status = 2 THEN DATEDIFF(NOW(), tblOrdenesServicio.fechaConclucion)
                                       END as dias
                                   ")
                                   ->selectRaw('COUNT(tblDetalleOrdenServicio.pktblDetalleOrdenServicio) as totalEquipos')
                                   ->leftJoin('tblDetalleOrdenServicio', 'tblDetalleOrdenServicio.fkTblOrdenServicio', 'tblOrdenesServicio.pkTblOrdenServicio')
                                   ->whereIn('tblOrdenesServicio.status', [1,2])
                                   ->groupBy(
                                       'tblOrdenesServicio.pkTblOrdenServicio',
                                       'tblOrdenesServicio.cliente',
                                       'tblOrdenesServicio.telefono',
                                       'tblOrdenesServicio.status',
                                       'dias'
                                   )
                                   ->orderBy('tblOrdenesServicio.status', 'asc')
                                   ->orderBy('dias', 'desc')
                                   ->orderBy('cliente', 'asc')
                                   ->limit(10);
    
        return $query->get();
    }
    
    public function obtenerNoEquiposPendientesEntrega () {
        $query = TblDetalleOrdenServicio::select('tipoEquipo as equipo')
                                        ->selectRaw('count(tipoEquipo) as total')
                                        ->whereIn('.status', [1,2])
                                        ->groupBy('tipoEquipo');

        return $query->get();
    }
}