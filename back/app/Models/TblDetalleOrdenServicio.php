<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TblDetalleOrdenServicio extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $primaryKey = 'pkTblDetalleOrdenServicio';
    protected $table = 'tblDetalleOrdenServicio';
    protected $fillable = 
    [
        'pkTblDetalleOrdenServicio',
        'fkTblOrdenServicio',
        'tipoEquipo',
        'nombre',
        'noSerie',
        'password',
        'descripcionFalla',
        'observaciones',
        'base',
        'bisagras',
        'botonEncendido',
        'botones',
        'cableCorriente',
        'carcasa',
        'cartuchos',
        'centroDeCarga',
        'charolaHojas',
        'displayPort',
        'escaner',
        'padDeBotones',
        'pantalla',
        'puertoDvi',
        'puertoHdmi',
        'puertoUsb',
        'puertoVga',
        'teclado',
        'tornillos',
        'unidadDeCd',
        'detalles',
        'costoReparacion',
        'diagnosticoFinal',
        'fkUsuarioConclucion',
        'fechaConclucion',
        'fkUsuarioEntrega',
        'fechaEntrega',
        'fkUsuarioCancelacion',
        'fechaCancelacion',
        'fkUsuarioModificacion',
        'fechaModificacion',
        'status'
    ];
}