<?php

use Illuminate\Support\Facades\Route;

Route::post('/ordenes/registrarOrdenServicio', 'App\Http\Controllers\Admin\OrdenesController@registrarOrdenServicio');
Route::get('/ordenes/obtenerOrdenesServicio/{status}', 'App\Http\Controllers\Admin\OrdenesController@obtenerOrdenesServicio');
Route::get('/ordenes/obtenerDetalleOrdenServicio/{status}', 'App\Http\Controllers\Admin\OrdenesController@obtenerDetalleOrdenServicio');