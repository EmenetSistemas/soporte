<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Orden de servicio {{($dataOrden['orden']->status == 1) ? 'pendiente' : (($dataOrden['orden']->status == 2) ? 'concluida' : (($dataOrden['orden']->status == 3) ? 'entregada' : 'cancelada'))}} #{{$dataOrden['orden']->pkTblOrdenServicio}}</title>

    <link rel="icon" type="image/png" href="http://shop.m-net.mx/assets/img/logo_emenet.png">

    <style>
        @import url("https://fonts.googleapis.com/css2?family=Poppins&display=swap");

        *,
        h3 {
            font-family: "Poppins", sans-serif !important;
        }

        section {
            font-size: 13px !important;
        }

        tr,
        td {
            margin-top: 3px !important;
            margin-bottom: 3px !important;
            padding-top: 3px !important;
            padding-bottom: 3px !important;
        }

        .tabla1 {
            float: right;
            margin-right: 10px;
            margin-top: -70px;
        }

        #tablaOrden {
            width: 100%;
        }

        h2 {
            text-align: center;
        }

        img {
            margin-top: -85px;
            margin-left: 10px;
        }

        table {
            width: 100%;
        }

        table tbody tr:nth-of-type(odd)>* {
            background-color: white !important;
        }

        table tbody tr:nth-of-type(even)>* {
            background-color: #E7E7E7 !important;
        }

        th {
            background: #00A5F4;
            color: white;
        }

        td {
            color: #5B5B5B;
            padding: 12px;
        }

        hr {
            margin-top: 2%;
            margin-bottom: 2%;
        }

        .footer {
            margin-left: 0px;
            margin-right: 0px;
            padding-bottom: 1px;
            text-align: center;
            color: #5B5B5B;
            border: 2px solid #00A5F4;
            background: none;
        }

        .black {
            color: black;
        }

        .condiciones {
            margin-left:30px;
            margin-right:30px;
            text-align:justify;
            margin-top: -15px;
            margin-bottom: 10px;
        }
    </style>
</head>

<body>
    <h3 align="center">Orden de Servicio y Mantenimiento</h3>
    <section>
        <img src="https://logos.speedtestcustom.com/prod/123539-1718322151237.png" alt="Logo" width="100px" style="margin-top: -70px;">

        <div class="col-1 tabla1">
            <table id="tablaOrden">
                <thead>
                    <tr>
                        <th @if($dataOrden['orden']->status == 4) style="background-color: #FF6666 !important;" @else style="background:#00A5F4; !important" @endif color="#3364DC" align="center"><b>Folio</b></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td align="center"><b style="color: #5B5B5B;">{{$dataOrden['orden']->pkTblOrdenServicio}}</b></td>
                    </tr>
                    <tr style="background:#00A5F4;">
                        <td align="center"><b style="color: #3364DC;">Código</b></td>
                    </tr>
                    <tr>
                        <td align="center"><b style="color: #5B5B5B;">{{$dataOrden['orden']->codigo}}</b></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <table style="margin-top:-2%;">
            <tbody>
                <tr>
                    <td class="black" style="width: 130px !important;">Nombre del Cliente:</td>
                    <td colspan="3">{{$dataOrden['orden']->cliente}}</td>
                </tr>
                <tr>
                    <td class="black">Dirección:</td>
                    <td colspan="3">{{$dataOrden['orden']->direccion ?? 'Sin información'}}</td>
                </tr>
                <tr>
                    <td class="black">Teléfono:</td>
                    <td>{{$dataOrden['orden']->telefono == '' || $dataOrden['orden']->telefono == null ? 'Sin información' : $dataOrden['orden']->telefono}}</td>
                    <td class="black">Correo:</td>
                    <td>{{$dataOrden['orden']->correo == '' || $dataOrden['orden']->correo == null ? 'Sin información' : $dataOrden['orden']->correo}}</td>
                </tr>
            </tbody>
        </table>

        <hr style="margin-bottom: -5px !important;">
        @php
            $dataOrden['orden']->total = 0;
        @endphp
        @foreach($dataOrden['detalleOrden'] as $equipo)
            <table style="margin-top: 15px !important; page-break-inside: avoid;">
                <thead>
                    <tr>
                        <th @if($equipo->status == 4) style="background-color: #FF6666 !important;" @endif colspan="2">{{$equipo->nombre}} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; $ {{ number_format((float)$equipo->costoReparacion, 0, ',', ',') }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="black" style="width: 130px !important;">Falla</td>
                        <td>{{$equipo->descripcionFalla == '' || $equipo->descripcionFalla == null ? 'Sin información' : $equipo->descripcionFalla}}</td>
                    </tr>
                    <tr class="black">
                        <td class="black">Observaciones</td>
                        <td>{{$equipo->observaciones == '' || $equipo->observaciones == null ? 'Sin información' : $equipo->observaciones}}</td>
                    </tr>
                    <tr>
                        <td class="black">Diagnostico</td>
                        <td>{{$equipo->diagnosticoFinal == '' || $equipo->diagnosticoFinal == null ? 'Sin información' : $equipo->diagnosticoFinal}}</td>
                    </tr>
                    @php
                        $dataOrden['orden']->total += (float)$equipo->costoReparacion;
                        $items = [];
                        if ($equipo->base == 1) $items[] = 'Base';
                        if ($equipo->bisagras == 1) $items[] = 'Bisagras';
                        if ($equipo->botonEncendido == 1) $items[] = 'Botón Encendido';
                        if ($equipo->botones == 1) $items[] = 'Botones';
                        if ($equipo->cableCorriente == 1) $items[] = 'Cable de Corriente';
                        if ($equipo->carcasa == 1) $items[] = 'Carcasa';
                        if ($equipo->cartuchos == 1) $items[] = 'Cartuchos';
                        if ($equipo->centroDeCarga == 1) $items[] = 'Centro de Carga';
                        if ($equipo->charolaHojas == 1) $items[] = 'Charola de Hojas';
                        if ($equipo->displayPort == 1) $items[] = 'Puerto Display Port';
                        if ($equipo->escaner == 1) $items[] = 'Escaner';
                        if ($equipo->padDeBotones == 1) $items[] = 'Pad de botones';
                        if ($equipo->pantalla == 1) $items[] = 'Pantalla';
                        if ($equipo->puertoDvi == 1) $items[] = 'Puerto DVI';
                        if ($equipo->puertoHdmi == 1) $items[] = 'Puerto HDMI';
                        if ($equipo->puertoUsb == 1) $items[] = 'Puerto USB';
                        if ($equipo->puertoVga == 1) $items[] = 'Puerto VGA';
                        if ($equipo->teclado == 1) $items[] = 'Teclado';
                        if ($equipo->tornillos == 1) $items[] = 'Tornillos';
                        if ($equipo->unidadDeCd == 1) $items[] = 'Unidad de CD';
                        $itemsList = implode(', ', $items);
                    @endphp
                    @if (!empty($itemsList))
                        <tr>
                            <td colspan="2" align="center" class="black">{{ $itemsList }}</td>
                        </tr>
                    @endif
                    <tr>
                        <td class="black">Detalles</td>
                        <td>{{$equipo->detalles == '' || $equipo->detalles == null ? 'Sin información' : $equipo->detalles}}</td>
                    </tr>
                </tbody>
            </table>
        @endforeach

        <div style="page-break-inside: avoid;">
            <hr>

            <table>
                <thead>
                    <tr>
                        <th>Fecha de recepción</th>
                        <th>Fecha de entrega</th>
                        <th>Total</th>
                        <th>A Cuenta</th>
                        <th>Resta</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td align="center">{{$dataOrden['orden']->fechaRegistro}}</td>
                        <td align="center">{{$dataOrden['orden']->fechaEntrega ?? 'Pendiente'}}</td>
                        <td align="center">$ {{ number_format((float)$dataOrden['orden']->total, 0, ',', ',') }}</td>
                        <td align="center">$ {{ number_format((float)$dataOrden['orden']->aCuenta, 0, ',', ',') }}</td>
                        <td align="center">{{(float)$dataOrden['orden']->total - (float)$dataOrden['orden']->aCuenta == 0 ? 'Pagado' : '$ '.number_format((float)($dataOrden['orden']->total - (float)$dataOrden['orden']->aCuenta), 0, ',', ',')}}</td>
                    </tr>
                </tbody>
            </table>
    
            <hr>
    
            <div class="condiciones">
                <p><b>CONDICIONES:</b> Después de 30 días <b>Emenet Comunicaciones</b> no se hace responsable por ningún equipo. Equipo que venga alterado en software o hardware no aplica garantía.<br>
                    La garantía aplica solo sobre la misma falta por la que ingreso a reparación el equipo, de lo contrario genera otro costo.</p>
            </div>
    
            <div class="footer">
                <p>Andador Carlos Hank &nbsp; <b>No.</b> 304 &nbsp;<b> - </b>&nbsp; Santiago Tianguistenco, Centro<br><b>CP.</b> 522600 &nbsp;&nbsp; <b>TEL.</b> 722 916 9999 <b>EXT.</b> 3 &nbsp;&nbsp; <b>TEL:</b> (713) 133 4557</p>
                <p><b>www.m-net.mx</b></p>
            </div>
        </div>
    </section>
</body>

</html>