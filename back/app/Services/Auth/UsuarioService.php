<?php

namespace App\Services\Auth;

use App\Repositories\Auth\UsuarioRepository;

class UsuarioService
{
    protected $usuarioRepository;

    public function __construct(
        UsuarioRepository $UsuarioRepository
    )
    {
        $this->usuarioRepository = $UsuarioRepository;
    }

    public function obtenerInformacionUsuarioPorToken( $token ){
        return $this->usuarioRepository->obtenerInformacionUsuarioPorToken( $token['token'] );
    }
}