<?php

use Illuminate\Support\Facades\Route;

Route::post('/ordenes/registrarOrdenServicio', 'App\Http\Controllers\Admin\OrdenesController@registrarOrdenServicio');
Route::get('/ordenes/obtenerOrdenesServicio/{status}', 'App\Http\Controllers\Admin\OrdenesController@obtenerOrdenesServicio');
Route::get('/ordenes/obtenerDetalleOrdenServicio/{status}', 'App\Http\Controllers\Admin\OrdenesController@obtenerDetalleOrdenServicio');
Route::post('/ordenes/actualizarOrdenServicio', 'App\Http\Controllers\Admin\OrdenesController@actualizarOrdenServicio');
Route::post('/ordenes/cambioStatusServicio', 'App\Http\Controllers\Admin\OrdenesController@cambioStatusServicio');
Route::post('/ordenes/cancelarOrdenServicio', 'App\Http\Controllers\Admin\OrdenesController@cancelarOrdenServicio');
Route::get('/ordenes/retomarOrdenServicio/{pkOrden}', 'App\Http\Controllers\Admin\OrdenesController@retomarOrdenServicio');