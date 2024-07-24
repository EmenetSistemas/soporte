<?php

namespace App\Services\Auth;

use App\Repositories\Auth\UsuarioRepository;
use Carbon\Carbon;

class UsuarioService
{
    protected $usuarioRepository;

    public function __construct(
        UsuarioRepository $UsuarioRepository
    )
    {
        $this->usuarioRepository = $UsuarioRepository;
    }

    public function obtenerInformacionUsuarioPorToken ( $token ) {
        return $this->usuarioRepository->obtenerInformacionUsuarioPorToken( $token['token'] );
    }

    public function obtenerPkPorToken ( $token ) {
        return $this->usuarioRepository->obtenerInformacionUsuarioPorToken( $token )[0]->pkTblUsuario;
    }

    public function obtenerListaUsuarios ($status) {
        $listaUsuarios = $this->usuarioRepository->obtenerListaUsuarios($status);

        foreach ($listaUsuarios as $usuario) {
            $usuario->fechaAlta = $this->formatearFecha($usuario->fechaAlta);
        }

        return response()->json(
            [
                'data' => [
                    'listaUsuarios' => $listaUsuarios
                ],
                'mensaje' => 'Se obtuvó la lista de usuarios en el status seleccionado con éxito'
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
}