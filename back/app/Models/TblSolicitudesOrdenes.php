<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TblSolicitudesOrdenes extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $primaryKey = 'pkTblSolicitudOrden';
    protected $table = 'tblSolicitudesOrdenes';
    protected $fillable =
    [
        'pkTblSolicitudOrden',
        'fkTblOrdenServicio',
        'tipoSolicitud',
        'actividad',
        'data',
        'motivo',
        'fkUsuarioSolicitud',
        'fechaSolicitud',
        'status'
    ];
}