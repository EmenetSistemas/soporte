<?php

namespace App\Repositories\Admin;

use App\Models\TblDetalleOrdenServicio;
use App\Models\TblOrdenesServicio;
use Carbon\Carbon;
use Illuminate\Support\Str;

class OrdenesRepository
{
    public function registrarOrdenServicio ($orden) {
        $registro = new TblOrdenesServicio();
        $registro->cliente           = $this->formatString($orden, 'cliente');
        $registro->telefono          = $this->formatString($orden, 'telefono');
        $registro->correo            = $this->formatString($orden, 'correo');
        $registro->direccion         = $this->formatString($orden, 'direccion');
        $registro->aCuenta           = trim(str_replace(['$', ','], '', $orden['aCuenta']));
        $registro->codigo            = Str::random(8);
        $registro->nota              = $this->formatString($orden, 'nota');
        $registro->fkUsuarioRegistro = 1;
        $registro->fechaRegistro     = Carbon::now();
        $registro->status            = 1;
        $registro->save();

        return $registro->pkTblOrdenServicio;
    }

    public function registrarDetalleOrdenServicio ($pkOrden, $tipoEquipo, $equipo) {
        $registro = new TblDetalleOrdenServicio();
        $registro->fkTblOrdenServicio = $pkOrden;
        $registro->tipoEquipo         = $tipoEquipo;
        $registro->nombre             = $this->formatString($equipo, 'equipo');
        $registro->noSerie            = $this->formatString($equipo, 'noSerie');
        $registro->password           = $this->formatString($equipo, 'password');
        $registro->descripcionFalla   = $this->formatString($equipo, 'descripcionFalla');
        $registro->observaciones      = $this->formatString($equipo, 'observaciones');

        $registro->base               = $equipo['base'] ?? null;
        $registro->bisagras           = $equipo['bisagras'] ?? null;
        $registro->botonEncendido     = $equipo['botonEncendido'] ?? null;
        $registro->botones            = $equipo['botones'] ?? null;
        $registro->cableCorriente     = $equipo['cableCorriente'] ?? null;
        $registro->carcasa            = $equipo['carcasa'] ?? null;
        $registro->cartuchos          = $equipo['cartuchos'] ?? null;
        $registro->centroDeCarga      = $equipo['centroDeCarga'] ?? null;
        $registro->charolaHojas       = $equipo['charolaHojas'] ?? null;
        $registro->displayPort        = $equipo['displayPort'] ?? null;
        $registro->escaner            = $equipo['escaner'] ?? null;
        $registro->padDeBotones       = $equipo['padDeBotones'] ?? null;
        $registro->pantalla           = $equipo['pantalla'] ?? null;
        $registro->puertoDvi          = $equipo['puertoDvi'] ?? null;
        $registro->puertoHdmi         = $equipo['puertoHdmi'] ?? null;
        $registro->puertoUsb          = $equipo['puertoUsb'] ?? null;
        $registro->puertoVga          = $equipo['puertoVga'] ?? null;
        $registro->teclado            = $equipo['teclado'] ?? null;
        $registro->tornillos          = $equipo['tornillos'] ?? null;
        $registro->unidadDeCd         = $equipo['unidadDeCd'] ?? null;

        $registro->detalles           = $this->formatString($equipo, 'detalles');
        $registro->costoReparacion    = trim(str_replace(['$', ','], '', $equipo['costoReparacion']));
        $registro->diagnosticoFinal   = $this->formatString($equipo, 'diagnosticoFinal');
        $registro->status             = 1;
        $registro->save();
    }

    public function obtenerOrdenesServicio ($status) {
        $query = TblOrdenesServicio::select(
                                       'tblOrdenesServicio.pkTblOrdenServicio as pkTblOrdenServicio',
                                       'tblOrdenesServicio.cliente as cliente',
                                       'tblOrdenesServicio.telefono as telefono',
                                       'tblOrdenesServicio.aCuenta as aCuenta',
                                       'tblOrdenesServicio.status as status'
                                   )
                                   ->selectRaw("CASE WHEN DATE_FORMAT(tblOrdenesServicio.fechaRegistro, '%d-%m-%Y') = '00-00-0000' THEN '-' ELSE DATE_FORMAT(tblOrdenesServicio.fechaRegistro, '%d-%m-%Y') END as fechaRegistro")
                                   ->selectRaw("CASE WHEN DATE_FORMAT(tblOrdenesServicio.fechaConclucion, '%d-%m-%Y') = '00-00-0000' THEN '-' ELSE DATE_FORMAT(tblOrdenesServicio.fechaConclucion, '%d-%m-%Y') END as fechaConclucion")
                                   ->selectRaw("CASE WHEN DATE_FORMAT(tblOrdenesServicio.fechaEntrega, '%d-%m-%Y') = '00-00-0000' THEN '-' ELSE DATE_FORMAT(tblOrdenesServicio.fechaEntrega, '%d-%m-%Y') END as fechaEntrega")
                                   ->selectRaw("CASE WHEN DATE_FORMAT(tblOrdenesServicio.fechaCancelacion, '%d-%m-%Y') = '00-00-0000' THEN '-' ELSE DATE_FORMAT(tblOrdenesServicio.fechaCancelacion, '%d-%m-%Y') END as fechaCancelacion")
                                   ->selectRaw('COUNT(tblDetalleOrdenServicio.pktblDetalleOrdenServicio) as totalEquipos')
                                   ->selectRaw('SUM(tblDetalleOrdenServicio.costoReparacion) as total')
                                   ->leftJoin('tblDetalleOrdenServicio', 'tblDetalleOrdenServicio.fkTblOrdenServicio', 'tblOrdenesServicio.pkTblOrdenServicio')
                                   ->where('tblOrdenesServicio.status', $status)
                                   ->groupBy(
                                       'tblOrdenesServicio.pkTblOrdenServicio',
                                       'tblOrdenesServicio.cliente',
                                       'tblOrdenesServicio.telefono',
                                       'tblOrdenesServicio.aCuenta',
                                       'tblOrdenesServicio.fechaRegistro',
                                       'tblOrdenesServicio.fechaConclucion',
                                       'tblOrdenesServicio.fechaEntrega',
                                       'tblOrdenesServicio.fechaCancelacion',
                                       'tblOrdenesServicio.status'
                                   );

        switch ($status) {
            case 1:
                $query->orderBy('tblOrdenesServicio.fechaRegistro', 'asc');
            break;
            case 2:
                $query->orderBy('tblOrdenesServicio.fechaConclucion', 'desc');
            break;
            case 3:
                $query->orderBy('tblOrdenesServicio.fechaEntrega', 'desc');
            break;
            case 4:
                $query->orderBy('tblOrdenesServicio.fechaCancelacion', 'desc');
            break;
        }
        return $query->get();
    }

    public function obtenerOrdenServicio ($pkOrden) {
        $query = TblOrdenesServicio::select(
                                       'tblordenesservicio.pkTblOrdenServicio as pkTblOrdenServicio',
                                       'tblordenesservicio.cliente as cliente',
                                       'tblordenesservicio.telefono as telefono',
                                       'tblordenesservicio.correo as correo',
                                       'tblordenesservicio.direccion as direccion',
                                       'tblordenesservicio.aCuenta as aCuenta',
                                       'tblordenesservicio.nota as nota',
                                       'usuarioRegistro.nombre as usuarioRegistro',
                                       'tblordenesservicio.fechaRegistro as fechaRegistro',
                                       'usuarioConclucion.nombre as usuarioConclucion',
                                       'tblordenesservicio.fechaConclucion as fechaConclucion',
                                       'usuarioEntrega.nombre as usuarioEntrega',
                                       'tblordenesservicio.fechaEntrega as fechaEntrega',
                                       'usuarioCancelacion.nombre as usuarioCancelacion',
                                       'tblordenesservicio.fechaCancelacion as fechaCancelacion',
                                       'usuarioModificacion.nombre as usuarioModificacion',
                                       'tblordenesservicio.fechaModificacion as fechaModificacion',
                                       'tblordenesservicio.status as status'
                                   )
                                   ->leftJoin('tblUsuarios as usuarioRegistro', 'usuarioRegistro.pkTblUsuario', 'tblordenesservicio.fkUsuarioRegistro')
                                   ->leftJoin('tblUsuarios as usuarioConclucion', 'usuarioConclucion.pkTblUsuario', 'tblordenesservicio.fkUsuarioConclucion')
                                   ->leftJoin('tblUsuarios as usuarioEntrega', 'usuarioEntrega.pkTblUsuario', 'tblordenesservicio.fkUsuarioEntrega')
                                   ->leftJoin('tblUsuarios as usuarioCancelacion', 'usuarioCancelacion.pkTblUsuario', 'tblordenesservicio.fkUsuarioCancelacion')
                                   ->leftJoin('tblUsuarios as usuarioModificacion', 'usuarioModificacion.pkTblUsuario', 'tblordenesservicio.fkUsuarioModificacion')
                                   ->where('tblOrdenesServicio.pkTblOrdenServicio', $pkOrden);
        return $query->get()[0] ?? [];
    }

    public function obtenerDetalleOrdenServicio ($pkOrden) {
        $query = TblDetalleOrdenServicio::where('fkTblOrdenServicio', $pkOrden);

        return $query->get() ?? [];
    }

    private function formatString ($arr, $index) {
        return isset($arr[$index]) && trim($arr[$index]) != '' ? $arr[$index] : null;
    }
}