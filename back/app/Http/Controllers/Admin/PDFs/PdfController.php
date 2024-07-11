<?php

namespace App\Http\Controllers\Admin\PDFs;

use App\Http\Controllers\Controller;
use App\Services\Admin\PDFs\PdfService;
use Dompdf\Dompdf;
use Dompdf\Options;
use Illuminate\Support\Facades\Log;

class PdfController extends Controller
{
    protected $pdfService;

    public function __construct(PdfService $pdfService)
    {
        $this->pdfService = $pdfService;
    }

    public function generarPdfOrdenServicio($pkOrden)
    {
        try {
            $dataOrden = $this->pdfService->generarPdfOrdenServicio($pkOrden);

            $options = new Options();
            $options->set('isRemoteEnabled', true);
            $dompdf = new Dompdf($options);

            $html = view('pdfOrdenServicio', compact('dataOrden'))->render();
            $dompdf->loadHtml($html);
            $dompdf->render();
            $pdfContent = $dompdf->output();
            $base64Pdf = base64_encode($pdfContent);

            return response()->json([
                'telefono' => $dataOrden['orden']->telefono,
                'pdf' => $base64Pdf
            ]);

        } catch (\Throwable $error) {
            Log::error('Error al generar el PDF: ' . $error->getMessage());
            return response()->json([
                'error' => $error->getMessage(),
                'mensaje' => 'Ocurrió un error inesperado al generar el PDF'
            ], 500);
        }
    }
}