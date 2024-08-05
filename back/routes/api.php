<?php

use Illuminate\Support\Facades\Route;

// auth sistema
Route::post('/auth/login', 'App\Http\Controllers\Auth\LoginController@login');
Route::post('/auth', 'App\Http\Controllers\Auth\LoginController@auth');
Route::post('/logout', 'App\Http\Controllers\Auth\LoginController@logout');

Route::post('/usuarios/obtenerInformacionUsuarioPorToken', 'App\Http\Controllers\Auth\UsuarioController@obtenerInformacionUsuarioPorToken');
Route::get('/usuarios/obtenerInformacionUsuarioPorPk/{pkUsuario}', 'App\Http\Controllers\Auth\UsuarioController@obtenerInformacionUsuarioPorPk');

// estadisticas sistema
Route::get('/estadisticas/obtenerEstadisticas', 'App\Http\Controllers\Admin\GenericController@obtenerEstadisticas');

// funciones sistema
Route::post('/ordenes/registrarOrdenServicio', 'App\Http\Controllers\Admin\OrdenesController@registrarOrdenServicio');
Route::get('/ordenes/obtenerOrdenesServicio/{status}', 'App\Http\Controllers\Admin\OrdenesController@obtenerOrdenesServicio');
Route::get('/ordenes/obtenerDetalleOrdenServicio/{status}', 'App\Http\Controllers\Admin\OrdenesController@obtenerDetalleOrdenServicio');
Route::post('/ordenes/actualizarOrdenServicio', 'App\Http\Controllers\Admin\OrdenesController@actualizarOrdenServicio');
Route::post('/ordenes/cambioStatusServicio', 'App\Http\Controllers\Admin\OrdenesController@cambioStatusServicio');
Route::post('/ordenes/cancelarOrdenServicio', 'App\Http\Controllers\Admin\OrdenesController@cancelarOrdenServicio');
Route::get('/ordenes/retomarOrdenServicio/{pkOrden}', 'App\Http\Controllers\Admin\OrdenesController@retomarOrdenServicio');
Route::post('/ordenes/concluirOrdenServicio', 'App\Http\Controllers\Admin\OrdenesController@concluirOrdenServicio');
Route::post('/ordenes/eliminarEquipoOrden', 'App\Http\Controllers\Admin\OrdenesController@eliminarEquipoOrden');
Route::post('/ordenes/entregarEquiposOrden', 'App\Http\Controllers\Admin\OrdenesController@entregarEquiposOrden');
Route::post('/ordenes/registrarSolicitudOrden', 'App\Http\Controllers\Admin\OrdenesController@registrarSolicitudOrden');
Route::post('/ordenes/obtenerSolicitudesOrdenes', 'App\Http\Controllers\Admin\OrdenesController@obtenerSolicitudesOrdenes');
Route::post('/ordenes/obtenerMisSolicitudesOrdenes', 'App\Http\Controllers\Admin\OrdenesController@obtenerSolicitudesOrdenes');
Route::get('/ordenes/aprobarSolicitudOrden/{pkSolicitud}', 'App\Http\Controllers\Admin\OrdenesController@aprobarSolicitudOrden');
Route::get('/ordenes/eliminarSolicitudOrden/{pkSolicitud}', 'App\Http\Controllers\Admin\OrdenesController@eliminarSolicitudOrden');

Route::get('/usuarios/obtenerListaUsuarios/{status}/{tipo}', 'App\Http\Controllers\Auth\UsuarioController@obtenerListaUsuarios');
Route::post('/usuarios/validarContraseniaActual', 'App\Http\Controllers\Auth\UsuarioController@validarContraseniaActual');
Route::post('/usuarios/modificarUsuario', 'App\Http\Controllers\Auth\UsuarioController@modificarUsuario');
Route::get('/usuarios/cambiarStatusSesion/{pkUsuario}', 'App\Http\Controllers\Auth\UsuarioController@cambiarStatusSesion');

// utileria sistema
Route::get('/pdfs/generarPdfOrdenServicio/{pkOrden}', 'App\Http\Controllers\Admin\PDFs\PdfController@generarPdfOrdenServicio');