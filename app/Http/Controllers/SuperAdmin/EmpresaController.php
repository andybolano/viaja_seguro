<?php namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests;

class EmpresaController extends Controller
{

    private $empresas = [
        ['id' => 1, 'nit'=> '344353451', 'pjuridica'=> '4645635', 'nombre'=> 'Cootrasan', 'logo' => 'http://localhost/midev/viaja_seguro/public/images/empresas/empresa1.png', 'direccion'=> 'lejos', 'telefono'=> '9876896', 'servicios' => [], 'estado' => ['value'=> true, 'lavel'=>'Activa']],
        ['id' => 2, 'nit'=> '224534521', 'pjuridica'=> '3453454', 'nombre'=> 'Coomulcod', 'logo' => 'http://localhost/midev/viaja_seguro/public/images/empresas/empresa2.png', 'direccion'=> 'por ahi', 'telefono'=> '123456', 'estado' => ['value'=> true, 'lavel'=>'Activa'],
            'servicios' => [['codigo' => 1, 'concepto' => 'Manejor de reservas']]
        ],
        ['id' => 3, 'nit'=> '334354353', 'pjuridica'=> '3465775', 'nombre'=> 'TrnasValle', 'logo' => 'http://localhost/midev/viaja_seguro/public/images/empresas/empresa3.png', 'direccion'=> 'quien save', 'telefono'=> '495483', 'servicios' => [], 'estado' => ['value'=> false, 'lavel'=>'Inactiva']],
    ];
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return $this->empresas;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try{
            $data = $request->json()->all();
            $data['codigo'] = '4';
            //guardar modelo
            return response()->json($data, 201);
        } catch (\Exception $exc) {
            return response()->json(array("exception"=>$exc->getMessage()), 400);
        }
    }

    /**
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $codigo
     * @return mixed
     */
    public function saveLogo(Request $request, $codigo)
    {
        try{
            if ($request->hasFile('logo')) {
                $request->file('logo')->move('images/empresas/', "empresa$codigo.png");
                //actualizar ruta en el modelo
                $nombrefile = $_SERVER['PHP_SELF'].'/../images/empresas/'."empresa$codigo.png";
                return response()->json(['nombrefile'=>$nombrefile], 201);
            }else {
                return response()->json([], 400);
            }
        } catch (\Exception $exc) {
            return response()->json(array("exception"=>$exc->getMessage()), 400);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $codigo
     * @return \Illuminate\Http\Response
     */
    public function show($codigo)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $codigo
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $codigo)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $codigo
     * @return \Illuminate\Http\Response
     */
    public function destroy($codigo)
    {
        //
    }
}
