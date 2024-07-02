<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TblOrdenesServicio extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $primaryKey = 'pkTblOrdenServicio';
    protected $table = 'tblOrdenesServicio';
    protected $fillable = 
    [
        'pkTblOrdenServicio',
        'cliente',
        'telefono',
        'correo',
        'direccion',
        'aCuenta',
        'codigo',
        'folioTicket',
        'nota',
        'fkUsuarioRegistro',
        'fechaRegistro',
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
