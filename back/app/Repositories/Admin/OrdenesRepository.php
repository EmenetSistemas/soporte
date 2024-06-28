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

        $registro->base               = isset($equipo['base']) ? ($equipo['base'] ? 1 : 0) : null;
        $registro->bisagras           = isset($equipo['bisagras']) ? ($equipo['bisagras'] ? 1 : 0) : null;
        $registro->botonEncendido     = isset($equipo['botonEncendido']) ? ($equipo['botonEncendido'] ? 1 : 0) : null;
        $registro->botones            = isset($equipo['botones']) ? ($equipo['botones'] ? 1 : 0) : null;
        $registro->cableCorriente     = isset($equipo['cableCorriente']) ? ($equipo['cableCorriente'] ? 1 : 0) : null;
        $registro->carcasa            = isset($equipo['carcasa']) ? ($equipo['carcasa'] ? 1 : 0) : null;
        $registro->cartuchos          = isset($equipo['cartuchos']) ? ($equipo['cartuchos'] ? 1 : 0) : null;
        $registro->centroDeCarga      = isset($equipo['centroDeCarga']) ? ($equipo['centroDeCarga'] ? 1 : 0) : null;
        $registro->charolaHojas       = isset($equipo['charolaHojas']) ? ($equipo['charolaHojas'] ? 1 : 0) : null;
        $registro->displayPort        = isset($equipo['displayPort']) ? ($equipo['displayPort'] ? 1 : 0) : null;
        $registro->escaner            = isset($equipo['escaner']) ? ($equipo['escaner'] ? 1 : 0) : null;
        $registro->padDeBotones       = isset($equipo['padDeBotones']) ? ($equipo['padDeBotones'] ? 1 : 0) : null;
        $registro->pantalla           = isset($equipo['pantalla']) ? ($equipo['pantalla'] ? 1 : 0) : null;
        $registro->puertoDvi          = isset($equipo['puertoDvi']) ? ($equipo['puertoDvi'] ? 1 : 0) : null;
        $registro->puertoHdmi         = isset($equipo['puertoHdmi']) ? ($equipo['puertoHdmi'] ? 1 : 0) : null;
        $registro->puertoUsb          = isset($equipo['puertoUsb']) ? ($equipo['puertoUsb'] ? 1 : 0) : null;
        $registro->puertoVga          = isset($equipo['puertoVga']) ? ($equipo['puertoVga'] ? 1 : 0) : null;
        $registro->teclado            = isset($equipo['teclado']) ? ($equipo['teclado'] ? 1 : 0) : null;
        $registro->tornillos          = isset($equipo['tornillos']) ? ($equipo['tornillos'] ? 1 : 0) : null;
        $registro->unidadDeCd         = isset($equipo['unidadDeCd']) ? ($equipo['unidadDeCd'] ? 1 : 0) : null;

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
        $query = TblDetalleOrdenServicio::select(
                                            'tblDetalleOrdenServicio.pkTblDetalleOrdenServicio as pkTblDetalleOrdenServicio',
                                            'tblDetalleOrdenServicio.fkTblOrdenServicio as fkTblOrdenServicio',
                                            'tblDetalleOrdenServicio.tipoEquipo as tipoEquipo',
                                            'tblDetalleOrdenServicio.nombre as nombre',
                                            'tblDetalleOrdenServicio.noSerie as noSerie',
                                            'tblDetalleOrdenServicio.password as password',
                                            'tblDetalleOrdenServicio.descripcionFalla as descripcionFalla',
                                            'tblDetalleOrdenServicio.observaciones as observaciones',
                                            'tblDetalleOrdenServicio.base as base',
                                            'tblDetalleOrdenServicio.bisagras as bisagras',
                                            'tblDetalleOrdenServicio.botonEncendido as botonEncendido',
                                            'tblDetalleOrdenServicio.botones as botones',
                                            'tblDetalleOrdenServicio.cableCorriente as cableCorriente',
                                            'tblDetalleOrdenServicio.carcasa as carcasa',
                                            'tblDetalleOrdenServicio.cartuchos as cartuchos',
                                            'tblDetalleOrdenServicio.centroDeCarga as centroDeCarga',
                                            'tblDetalleOrdenServicio.charolaHojas as charolaHojas',
                                            'tblDetalleOrdenServicio.displayPort as displayPort',
                                            'tblDetalleOrdenServicio.escaner as escaner',
                                            'tblDetalleOrdenServicio.padDeBotones as padDeBotones',
                                            'tblDetalleOrdenServicio.pantalla as pantalla',
                                            'tblDetalleOrdenServicio.puertoDvi as puertoDvi',
                                            'tblDetalleOrdenServicio.puertoHdmi as puertoHdmi',
                                            'tblDetalleOrdenServicio.puertoUsb as puertoUsb',
                                            'tblDetalleOrdenServicio.puertoVga as puertoVga',
                                            'tblDetalleOrdenServicio.teclado as teclado',
                                            'tblDetalleOrdenServicio.tornillos as tornillos',
                                            'tblDetalleOrdenServicio.unidadDeCd as unidadDeCd',
                                            'tblDetalleOrdenServicio.detalles as detalles',
                                            'tblDetalleOrdenServicio.costoReparacion as costoReparacion',
                                            'tblDetalleOrdenServicio.diagnosticoFinal as diagnosticoFinal',
                                            'usuarioConclucion.nombre as usuarioConclucion',
                                            'tblDetalleOrdenServicio.fechaConclucion as fechaConclucion',
                                            'usuarioEntrega.nombre as usuarioEntrega',
                                            'tblDetalleOrdenServicio.fechaEntrega as fechaEntrega',
                                            'usuarioCancelacion.nombre as usuarioCancelacion',
                                            'tblDetalleOrdenServicio.fechaCancelacion as fechaCancelacion',
                                            'usuarioModificacion.nombre as usuarioModificacion',
                                            'tblDetalleOrdenServicio.fechaModificacion as fechaModificacion',
                                            'tblDetalleOrdenServicio.status as status'
                                        )
                                        ->leftJoin('tblUsuarios as usuarioConclucion', 'usuarioConclucion.pkTblUsuario', 'tblDetalleOrdenServicio.fkUsuarioConclucion')
                                        ->leftJoin('tblUsuarios as usuarioEntrega', 'usuarioEntrega.pkTblUsuario', 'tblDetalleOrdenServicio.fkUsuarioEntrega')
                                        ->leftJoin('tblUsuarios as usuarioCancelacion', 'usuarioCancelacion.pkTblUsuario', 'tblDetalleOrdenServicio.fkUsuarioCancelacion')
                                        ->leftJoin('tblUsuarios as usuarioModificacion', 'usuarioModificacion.pkTblUsuario', 'tblDetalleOrdenServicio.fkUsuarioModificacion')
                                        ->where('fkTblOrdenServicio', $pkOrden);

        return $query->get() ?? [];
    }

    public function actualizarOrdenServicio ($orden) {
        TblOrdenesServicio::where('pkTblOrdenServicio', $orden['pkTblOrdenServicio'])
                          ->update([
                              'cliente'               => $this->formatString($orden, 'cliente'),
                              'telefono'              => $this->formatString($orden, 'telefono'),
                              'correo'                => $this->formatString($orden, 'correo'),
                              'direccion'             => $this->formatString($orden, 'direccion'),
                              'aCuenta'               => trim(str_replace(['$', ','], '', $orden['aCuenta'])),
                              'nota'                  => $this->formatString($orden, 'nota'),
                              'fkUsuarioModificacion' => 1,
                              'fechaModificacion'     => Carbon::now(),
                          ]);
    }

    public function actualizarDetalleOrdenServicio ($equipo) {
        TblDetalleOrdenServicio::where('pkTblDetalleOrdenServicio', $equipo['pkTblDetalleOrdenServicio'])
                               ->update([
                                   'nombre'                => $this->formatString($equipo, 'equipo'),
                                   'noSerie'               => $this->formatString($equipo, 'noSerie'),
                                   'password'              => $this->formatString($equipo, 'password'),
                                   'descripcionFalla'      => $this->formatString($equipo, 'descripcionFalla'),
                                   'observaciones'         => $this->formatString($equipo, 'observaciones'),

                                   'base'                  => isset($equipo['base']) ? ($equipo['base'] ? 1 : 0) : null,
                                   'bisagras'              => isset($equipo['bisagras']) ? ($equipo['bisagras'] ? 1 : 0) : null,
                                   'botonEncendido'        => isset($equipo['botonEncendido']) ? ($equipo['botonEncendido'] ? 1 : 0) : null,
                                   'botones'               => isset($equipo['botones']) ? ($equipo['botones'] ? 1 : 0) : null,
                                   'cableCorriente'        => isset($equipo['cableCorriente']) ? ($equipo['cableCorriente'] ? 1 : 0) : null,
                                   'carcasa'               => isset($equipo['carcasa']) ? ($equipo['carcasa'] ? 1 : 0) : null,
                                   'cartuchos'             => isset($equipo['cartuchos']) ? ($equipo['cartuchos'] ? 1 : 0) : null,
                                   'centroDeCarga'         => isset($equipo['centroDeCarga']) ? ($equipo['centroDeCarga'] ? 1 : 0) : null,
                                   'charolaHojas'          => isset($equipo['charolaHojas']) ? ($equipo['charolaHojas'] ? 1 : 0) : null,
                                   'displayPort'           => isset($equipo['displayPort']) ? ($equipo['displayPort'] ? 1 : 0) : null,
                                   'escaner'               => isset($equipo['escaner']) ? ($equipo['escaner'] ? 1 : 0) : null,
                                   'padDeBotones'          => isset($equipo['padDeBotones']) ? ($equipo['padDeBotones'] ? 1 : 0) : null,
                                   'pantalla'              => isset($equipo['pantalla']) ? ($equipo['pantalla'] ? 1 : 0) : null,
                                   'puertoDvi'             => isset($equipo['puertoDvi']) ? ($equipo['puertoDvi'] ? 1 : 0) : null,
                                   'puertoHdmi'            => isset($equipo['puertoHdmi']) ? ($equipo['puertoHdmi'] ? 1 : 0) : null,
                                   'puertoUsb'             => isset($equipo['puertoUsb']) ? ($equipo['puertoUsb'] ? 1 : 0) : null,
                                   'puertoVga'             => isset($equipo['puertoVga']) ? ($equipo['puertoVga'] ? 1 : 0) : null,
                                   'teclado'               => isset($equipo['teclado']) ? ($equipo['teclado'] ? 1 : 0) : null,
                                   'tornillos'             => isset($equipo['tornillos']) ? ($equipo['tornillos'] ? 1 : 0) : null,
                                   'unidadDeCd'            => isset($equipo['unidadDeCd']) ? ($equipo['unidadDeCd'] ? 1 : 0) : null,

                                   'detalles'              => $this->formatString($equipo, 'detalles'),
                                   'costoReparacion'       => trim(str_replace(['$', ','], '', $equipo['costoReparacion'])),
                                   'diagnosticoFinal'      => $this->formatString($equipo, 'diagnosticoFinal'),
                                   'fkUsuarioModificacion' => 1,
                                   'fechaModificacion'     => Carbon::now(),
                               ]);
    }

    private function formatString ($arr, $index) {
        return isset($arr[$index]) && trim($arr[$index]) != '' ? $arr[$index] : null;
    }

    public function cambioStatusServicio ($dataCambio) {
        $query = TblDetalleOrdenServicio::where('pkTblDetalleOrdenServicio', $dataCambio['pkTblDetalleOrdenServicio']);

        switch ($dataCambio['status']) {
            case 1:
                $update = [
                    'fkUsuarioConclucion' => null,
                    'fechaConclucion' => null,
                    'fkUsuarioEntrega' => null,
                    'fechaEntrega' => null,
                    'fkUsuarioCancelacion' => null,
                    'fechaCancelacion' => null,
                    'status' => $dataCambio['status']
                ];
            break;
            case 2:
                $update = [
                    'fkUsuarioConclucion' => 1,
                    'fechaConclucion' => Carbon::now(),
                    'status' => $dataCambio['status']
                ];
            break;
            case 3:
                $update = [
                    'fkUsuarioEntrega' => 1,
                    'fechaEntrega' => Carbon::now(),
                    'status' => $dataCambio['status']
                ];
            break;
            case 4:
                $update = [
                    'fkUsuarioConclucion' => null,
                    'fechaConclucion' => null,
                    'fkUsuarioCancelacion' => 1,
                    'fechaCancelacion' => Carbon::now(),
                    'status' => $dataCambio['status']
                ];
            break;
        }

        $query->update($update);

        return $query->get()[0]->fkTblOrdenServicio ?? 0;
    }

    public function cancelarOrdenServicio ($pkOrden) {
        TblOrdenesServicio::where('pkTblOrdenServicio', $pkOrden)
                          ->update([
                              'fkUsuarioCancelacion' => 1,
                              'fechaCancelacion' => Carbon::now(),
                              'status' => 4
                          ]);
    }

    public function cancelarEquiposOrden ($pkOrden) {
        TblDetalleOrdenServicio::where('fkTblOrdenServicio', $pkOrden)
                               ->update([
                                   'fkUsuarioConclucion' => null,
                                   'fechaConclucion' => null,
                                   'fkUsuarioEntrega' => null,
                                   'fechaEntrega' => null,
                                   'status' => 4
                               ]);
    }

    public function retomarOrdenServicio ($pkOrden) {
        TblOrdenesServicio::where('pkTblOrdenServicio', $pkOrden)
                          ->update([
                              'fkUsuarioConclucion' => null,
                              'fechaConclucion' => null,
                              'fkUsuarioEntrega' => null,
                              'fechaEntrega' => null,
                              'fkUsuarioCancelacion' => null,
                              'fechaCancelacion' => null,
                              'status' => 1
                          ]);
    }

    public function retomarEquiposOrden ($pkOrden) {
        TblDetalleOrdenServicio::where('fkTblOrdenServicio', $pkOrden)
                               ->update([
                                   'fkUsuarioConclucion' => null,
                                   'fechaConclucion' => null,
                                   'fkUsuarioEntrega' => null,
                                   'fechaEntrega' => null,
                                   'fkUsuarioCancelacion' => null,
                                   'fechaCancelacion' => null,
                                   'status' => 1
                               ]);
    }

    public function concluirOrdenServicio ($dataConclucion) {
        TblOrdenesServicio::where('pkTblOrdenServicio', $dataConclucion['pkTblOrdenServicio'])
                          ->update([
                              'fkUsuarioConclucion' => 1,
                              'fechaConclucion' => Carbon::now(),
                              'status' => 2
                          ]);
    }

    public function concluirEquiposOrden ($dataConclucion) {
        TblDetalleOrdenServicio::where([
                                   ['fkTblOrdenServicio', $dataConclucion['pkTblOrdenServicio']],
                                   ['status', '!=', 4]
                               ])
                               ->update([
                                   'fkUsuarioConclucion' => 1,
                                   'fechaConclucion' => Carbon::now(),
                                   'status' => 2
                               ]);
    }
}