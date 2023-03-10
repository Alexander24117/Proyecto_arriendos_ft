import { Component, OnInit } from "@angular/core";
import { GeneralesService } from "app/services/generales.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Loading, Confirm, Report, Notify } from "notiflix";
import { Router } from "@angular/router";
import swal from "sweetalert2";

@Component({
  selector: "app-registrarpdv",
  templateUrl: "./registrarpdv.component.html",
  styleUrls: ["./registrarpdv.component.css"],
})
export class RegistrarpdvComponent implements OnInit {
  panelOpenState = false;
  tipopersona: boolean = null;
  metodo_pago: boolean = null;
  departamentos: any;
  municipios: any;
  municipiosfiltro: any;
  tipopunto: any;
  zonas: any;
  microzonas: any;
  microzonasfiltro: any;
  filtermicrozonas: boolean = false;
  filtermuni: boolean = false;
  formulariotercero: FormGroup;
  formulariopdv: FormGroup;
  formulariocontrato: FormGroup;
  listprop: any[] = [];
  listAut: any[] = [];
  listConceptos: any[] = [];
  listservicios: any[] = [];
  serviciosfilter: any[];
  clientes: any;
  clientesfilter: any;
  autorizados: any;
  autorizadosFilter: any;
  conceptos: any;
  conceptosFilter: any;
  propietariostabla: any = [];
  autorizadosTabla: any = [];
  conceptosTabla: any = [];
  serviciostabla: any = [];
  bancos: any;
  tipocuentas: any;
  pdv: any = [];
  serviciospublicos: any = [];
  pago_efectivo: boolean = false;
  pago_transferencia: boolean = false;
  id_pago: any;
  incremento_anual = null;
  consulta_pdv: any = 32;
  actualizar: boolean = false;
  id_contrato = null;

  constructor(
    public servicio: GeneralesService,
    public formularioter: FormBuilder,
    private rutas: Router
  ) {
    this.formulariotercero = this.formularioter.group({
      tipo_documento: [null, Validators.required],
      numero_documento: [null, Validators.required],
      nombres: [null],
      apellidos: [null],
      genero: [null],
      digito_verificacion: [null],
      razon_social: [null],
      id_municipio: [null, Validators.required],
      direccion: [null, Validators.required],
      numero_contacto: [null, Validators.required],
      numero_contacto2: [null],
      email: [null, Validators.required],
      fecha_nacimiento: [null],
      departamento: [null, Validators.required],
      fecha_creacion: [null],
    });

    this.formulariopdv = this.formularioter.group({
      nombre_comercial: [null, Validators.required],
      id_municipio: [null],
      microzona: [null],
      direccion: [null],
      area_local: [null],
      latitud: [null],
      longitud: [null],
      codigo_glpi: [null],
      numero_ficha_catastral: [null],
      observacion: [null],
      linea_vista: [null],
      sanitario: [null],
      lavamanos: [null],
      poceta: [null],
      codigo_sitio_venta: [null, Validators.required],
      codigo_oficina: [null, Validators.required],
      tipo_punto: [null],
      propietario: [null],
      departamento: [null, Validators.required],
    });

    this.formulariocontrato = this.formularioter.group({
      id_clienteresponsable: [null, Validators.required],
      iva: [null],
      rete_iva: [null],
      rete_fuente: [null],
      id_clienteautorizado: [null, Validators.required],
      entidad_bancaria: [null],
      id_tipo_cuenta: [null],
      numero_cuenta: [null],
      id_punto_venta: [null, Validators.required],
      fecha_inicio_contrato: [null, Validators.required],
      fecha_fin_contrato: [null, Validators.required],
      valor_canon: [null, Validators.required],
      valor_adminstracion: [null],
      incremento_anual: [null],
      incremento_adicional: [null],
      poliza: [false],
      definicion: [null],
      // conceptos: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    Loading.pulse("Cargando");
    this.traermunicipios();
    this.traerdepartamentos();
    this.traerzonas();
    this.traermicrozonas();
    this.traerclientes();
    this.traerbancos();
    this.traertipocuentas();
    this.traerpdv();
    this.traerserviciospublicos();
    // this.traerautorizado();
    this.traertipopunto();
    this.traerconceptos();
    Loading.remove();
  }

  traertipopunto() {
    try {
      this.servicio.traertipodepunto().subscribe((res: any) => {
        this.tipopunto = res;
      });
    } catch (error) {
      console.error(error.message, this.tipopunto);
    }
  }
  traerserviciospublicos() {
    try {
      //console.log("aqui");
      this.servicio.traerserviciospublicos().subscribe((res: any) => {
        this.serviciospublicos = res;
        //console.log(res);
        //console.log(this.serviciospublicos, "servicios");
      });
    } catch (err) {
      //console.log(err.message, this.serviciospublicos);
    }
  }
  traerpdv() {
    this.servicio.traerPuntosDeVentaSinContrato().subscribe(
      (res: any) => {
        this.pdv = res;
        console.log(res);
      },
      (err) => {
        //console.log(err.message);
      }
    );
  }

  traeContrato() {

    this.actualizar = true;
    let id = this.consulta_pdv;

    this.servicio.traerPuntosDeVenta().subscribe(
      (resPdv:any) => {
        this.pdv = resPdv;
      },
      (err) => {
        //console.log(err.message);
      }
    );

    this.servicio.traerContrato(id).subscribe(
      (res: any) => {
        // this.pdv = res;
        console.log(res);
        this.id_contrato = res.contrato.id_contrato;

        this.formulariocontrato.patchValue({
          valor_adminstracion: res.contrato.valor_adminstracion,
        });
        this.formulariocontrato.patchValue({
          valor_canon: res.contrato.valor_canon,
        });
        this.formulariocontrato.patchValue({
          fecha_inicio_contrato: res.contrato.fecha_inicio_contrato,
        });
        this.formulariocontrato.patchValue({
          fecha_fin_contrato: res.contrato.fecha_fin_contrato,
        });
        this.formulariocontrato.patchValue({
          definicion: res.contrato.definicion,
        });
        this.formulariocontrato.patchValue({
          id_clienteautorizado:
            res.contrato.id_autorizado_autorizado.id_cliente,
        });
        if (res.contrato.id_autorizado_autorizado.metodo_pago == 1) {
          this.pago_transferencia = true;
          // this.pago_efectivo = false;
        } else res.contrato.id_autorizado_autorizado.metodo_pago == 2;
        {
          this.pago_efectivo = true;
          // this.pago_transferencia = false;
        }
        this.formulariocontrato.patchValue({
          entidad_bancaria:
            res.contrato.id_autorizado_autorizado.entidad_bancaria,
        });
        this.formulariocontrato.patchValue({
          id_tipo_cuenta: res.contrato.id_autorizado_autorizado.id_tipo_cuenta,
        });
        this.formulariocontrato.patchValue({
          numero_cuenta: res.contrato.id_autorizado_autorizado.numero_cuenta,
        });
        this.formulariocontrato.patchValue({
          incremento_adicional: res.contrato.incremento_adicional,
        });
        this.formulariocontrato.patchValue({ poliza: res.contrato.poliza });
        this.formulariocontrato.patchValue({
          incremento_anual: res.contrato.incremento_anual,
        });
        this.formulariocontrato.patchValue({
          id_clienteresponsable:
            res.contrato.id_responsable_responsable.id_cliente,
        });
        if (res.contrato.id_responsable_responsable.iva != null) {
          this.formulariocontrato.patchValue({ iva: true });
        }
        if (res.contrato.id_responsable_responsable.rete_iva != null) {
          this.formulariocontrato.patchValue({ rete_iva: true });
        }
        if (res.contrato.id_responsable_responsable.rete_fuente != null) {
          this.formulariocontrato.patchValue({ rete_fuente: true });
        }
        this.formulariocontrato.patchValue({
          id_punto_venta: res.contrato.id_punto_venta,
        });

        res.contratoServicio.forEach((element) => {
          this.serviciosfilter = this.serviciospublicos.filter(
            (i) => i.id_tipo_servicio == element.id_tipo_servicio
            
          );
          
          this.serviciostabla = [];
          this.listservicios = [];

          this.serviciostabla.push({
            nombre: this.serviciosfilter[0].tipo_servicio,
            valor: element.porcentaje,
            porcentaje: element.porcentaje,
          });

          this.listservicios.push({
            id_tipo_servicio: this.serviciosfilter[0].id_tipo_servicio,
            valor: element.porcentaje,
            porcentaje: element.porcentaje
          })
        });

        this.listConceptos = [];
        this.conceptosTabla = [];

        res.contratoConcepto.forEach((element) => {
          this.conceptosFilter = this.conceptos.filter(
            (i) => i.id_concepto == element.id_concepto
          );

          this.listConceptos.push({
            id_concepto: this.conceptosFilter[0].id_concepto,
          });

          this.conceptosTabla.push({
            id_concepto: this.conceptosFilter[0].id_concepto,
            codigo_concepto: this.conceptosFilter[0].codigo_concepto,
            nombre_concepto: this.conceptosFilter[0].nombre_concepto,
          });                
        });
      },
      (err) => {
        swal.fire("Punto de venta no encontrado", "", "error");
        console.log(err.message);
      }
    );
  }

  traerbancos() {
    this.servicio.traerbancos().subscribe(
      (res: any) => {
        this.bancos = res;
      },
      (err) => {
        //console.log(err.message);
      }
    );
  }

  traertipocuentas() {
    this.servicio.traertipocuentas().subscribe(
      (res: any) => {
        this.tipocuentas = res;
      },
      (err) => {
        //console.log(err.message);
      }
    );
  }

  validartipopersona(value) {
    if (value == "Nit") {
      this.tipopersona = false;
      this.formulariocontrato
        .get("digito_verificaciona")
        .removeValidators(Validators.required);
      this.formulariocontrato
        .get("razon_social")
        .removeValidators(Validators.required);
      this.formulariocontrato
        .get("fecha_creacion")
        .removeValidators(Validators.required);

      this.formulariocontrato.get("razon_social").updateValueAndValidity();
      this.formulariocontrato
        .get("digito_verificaciona")
        .updateValueAndValidity();
      this.formulariocontrato.get("fecha_creacion").updateValueAndValidity();
    } else {
      this.tipopersona = true;
      this.formulariocontrato
        .get("nombres")
        .removeValidators(Validators.required);
      this.formulariocontrato
        .get("apellidos")
        .removeValidators(Validators.required);
      this.formulariocontrato
        .get("genero")
        .removeValidators(Validators.required);
      this.formulariocontrato
        .get("fecha_nacimiento")
        .removeValidators(Validators.required);

      this.formulariocontrato.get("nombres").updateValueAndValidity();
      this.formulariocontrato.get("apellidosa").updateValueAndValidity();
      this.formulariocontrato.get("genero").updateValueAndValidity();
      this.formulariocontrato.get("fecha_nacimiento").updateValueAndValidity();
    }
  }
  validarmetodopago(value) {
    if (value == "Transferencia bancaria") {
      this.metodo_pago = true;
    } else {
      this.metodo_pago = false;
    }
  }
  traerclientes() {
    this.servicio.traerclientes().subscribe(
      (res) => {
        this.clientes = res;
        //console.log(this.clientes);
      },
      (err) => {
        //console.log(err.message);
      }
    );
  }

  traerconceptos() {
    this.servicio.traerConceptos().subscribe(
      (res) => {
        this.conceptos = res;
        //console.log(res, "conceptos");
      },
      (err) => {
        //console.log(err.message);
      }
    );
  }

  traermunicipios() {
    this.servicio.traerciudades().subscribe(
      (res) => {
        this.municipios = res;
      },
      (err) => {
        //console.log(err);
      }
    );
  }

  traerdepartamentos() {
    this.servicio.traerdepartamentos().subscribe(
      (res) => {
        this.departamentos = res;
      },
      (err) => {
        //console.log(err);
      }
    );
  }

  async traerzonas() {
    this.servicio.traerzonas().subscribe(
      (res) => {
        this.zonas = res;
      },
      (err) => {
        //console.log(err);
      }
    );
  }

  traermicrozonas() {
    this.servicio.traermicrozonas().subscribe(
      (res) => {
        this.microzonas = res;
      },
      (err) => {
        //console.log(err);
      }
    );
  }

  filtrarmicrozonas(value) {
    this.filtermicrozonas = true;
    this.microzonasfiltro = this.microzonas.filter((i) => i.id_zona == value);
  }

  filtrardepar(value) {
    this.filtermuni = true;
    this.municipiosfiltro = this.municipios.filter(
      (i) => i.id_departamento == value
    );
  }

  addservicio(value) {
    Confirm.prompt(
      "Sistema De Gestion De Arriendos",
      "Cual es el valor a pagar?",
      " ",
      "OK",
      "Cancel",
      (porcen) => {
        this.listservicios.push({
          id_tipo_servicio: value,
          valor: porcen.trim(),
          porcentaje: porcen.trim()
        });

        this.serviciosfilter = this.serviciospublicos.filter(
          (i) => i.id_tipo_servicio == value
        );
        //console.log(this.serviciosfilter);
        //console.log(this.listservicios);

        this.serviciostabla.push({
          nombre: this.serviciosfilter[0].tipo_servicio,
          valor: porcen.trim(),
          porcentaje: porcen.trim()
        });
      },
      () => {},
      {}
    );
  }

  delserviciopublico(i) {
    this.serviciostabla.splice(i, 1);
    this.listservicios.splice(i, 1);
  }

  registroserviciocontrato(idcontrato) {

    if ( this.listservicios.length < 1) {
      swal.fire("Guardado con Exito!", "", "success");
      this.consulta_pdv = null;
      this.id_contrato = null;
      Loading.remove();
      this.limpiarContrato();
    }
    
    for (let i = 0; i < this.listservicios.length; i++) {
      const e = this.listservicios[i];
      console.log(e,i);

      e.id_contrato = idcontrato;
      //console.log(e);

      this.servicio.registroserviciocontrato(e).subscribe(
        (res: any) => {
          if (i == (this.listservicios.length - 1)) {
            swal.fire("Guardado con Exito!", "", "success");
            this.consulta_pdv = null;
            this.id_contrato = null;
            Loading.remove();
            this.limpiarContrato();
          }
        },
        (err) => {
          swal.fire("No se pudo realizar el proceso con exito", "", "error");
        }
      );
    }
    
  }

  cambiarModoPago(modo) {
    switch (modo) {
      case "efectivo":
        this.pago_efectivo = true;
        this.pago_transferencia = false;
        this.id_pago = 2;
        this.formulariocontrato
          .get("entidad_bancaria")
          .removeValidators(Validators.required);
        this.formulariocontrato
          .get("numero_cuenta")
          .removeValidators(Validators.required);
        this.formulariocontrato
          .get("id_tipo_cuenta")
          .removeValidators(Validators.required);

        this.formulariocontrato
          .get("entidad_bancaria")
          .updateValueAndValidity();
        this.formulariocontrato.get("numero_cuenta").updateValueAndValidity();
        this.formulariocontrato.get("id_tipo_cuenta").updateValueAndValidity();

        break;
      case "transferencia":
        this.pago_efectivo = false;
        this.pago_transferencia = true;
        this.id_pago = 1;
        this.formulariocontrato
          .get("entidad_bancaria")
          .addValidators(Validators.required);
        this.formulariocontrato
          .get("numero_cuenta")
          .addValidators(Validators.required);
        this.formulariocontrato
          .get("id_tipo_cuenta")
          .addValidators(Validators.required);
        this.formulariocontrato.updateValueAndValidity();
        //console.log(this.formulariocontrato.get("entidad_bancaria").validator);
        //console.log(this.formulariocontrato.get("numero_cuenta").validator);
        //console.log(this.formulariocontrato.get("id_tipo_cuenta").validator);
        break;

      default:
        break;
    }
  }
  checkIpc(value) {
    switch (value) {
      case true:
        this.incremento_anual = 1;
        return 1;
      case false:
        this.incremento_anual = null;
        return null;
      default:
        break;
    }
  }

  registrocontrato(): void {
    // Loading.pulse("Cargando");

    if (this.formulariocontrato.valid) {
      let responsable = {
        id_cliente: this.formulariocontrato.value.id_clienteresponsable,
        estado: "1",
        iva: this.formulariocontrato.value.iva ? 48 : null,
        rete_iva: this.formulariocontrato.value.rete_iva ? 9 : null,
        rete_fuente: this.formulariocontrato.value.rete_fuente ? 7 : null,
      };

      // //console.log(this.id_pago + "aqui metodo pago");
      let autorizado = {
        id_cliente: this.formulariocontrato.value.id_clienteautorizado,
        metodo_pago: this.id_pago,
        entidad_bancaria: this.formulariocontrato.value.entidad_bancaria,
        numero_cuenta: this.formulariocontrato.value.numero_cuenta,
        id_tipo_cuenta: this.formulariocontrato.value.id_tipo_cuenta,
      };

      let contrato = {
        id_punto_venta: this.formulariocontrato.value.id_punto_venta,
        id_usuario: 1,
        valor_canon: this.formulariocontrato.value.valor_canon,
        incremento_anual: this.checkIpc(
          this.formulariocontrato.value.incremento_anual
        ),
        incremento_adicional:
          this.formulariocontrato.value.incremento_adicional,
        fecha_inicio_contrato:
          this.formulariocontrato.value.fecha_inicio_contrato,
        fecha_fin_contrato: this.formulariocontrato.value.fecha_fin_contrato,
        tipo_contrato: 1,
        valor_adminstracion: this.formulariocontrato.value.valor_adminstracion,
        definicion: this.formulariocontrato.value.definicion,
        poliza: this.formulariocontrato.value.poliza,
        id_responsable: 0,
        id_autorizado: 0,
      };
      swal
        .fire({
          title: "Seguro de guardar los cambios?",
          showDenyButton: true,
          confirmButtonText: "Guardar",
          denyButtonText: `Cancelar`,
        })
        .then((result) => {
          if (result.isConfirmed) {
            if (!this.validarTercero(responsable.id_cliente)) {
              //Falta hacer la validacion en el backend para que no se repita el tercero y el autorizado
              //si no son los mismo se debe crear un nuevo tercero y/o autorizado
              //y actualizar el contrato con los nuevos id
            }
            this.servicio.registrarresponsable(responsable).subscribe(
              (res: any) => {
                let idresponsable = res.id_responsable;

                this.servicio.registrarautorizado(autorizado).subscribe(
                  (res: any) => {
                    let idautorizado = res.id_autorizado;

                    contrato.id_responsable = idresponsable;
                    contrato.id_autorizado = idautorizado;

                    let datos = new FormData();
                    let conceptosLista: any = [];
                    this.listConceptos.forEach((concepto) => {
                      conceptosLista.push(concepto.id_concepto);
                    });

                    datos.set("contrato", JSON.stringify(contrato).replace("{",'{"id_contrato":'+this.id_contrato+","));
                    datos.set("conceptos", conceptosLista);

                    if(this.id_contrato != null){

                      this.servicio.actuliarcontrato(datos).subscribe(
                        (res: any) => {
                          if (res.estado == "1") {
                            this.registroserviciocontrato(res.id);
                          }
                        },
                        (err) => {
                          swal.fire("No se pudo actualizar el contrato", "", "error");
                        }
                      );
                    }
                    else{
                      this.servicio.registrarcontrato(datos).subscribe(
                        (res: any) => {
                          if (res.estado == "1") {
                            this.registroserviciocontrato(res.id);
                          }
                        },
                        (err) => {
                          swal.fire("No se pudo registrar el contrato", "", "error");
                        }
                      );
                    }

                    
                  },
                  (err) => {
                    //console.log(err.message);
                  }
                );
              },
              (err) => {
                //console.log(err.message);
              }
            );
            //console.log(this.formulariocontrato.value);
          }
        });
    } else {
      //console.log(this.formulariocontrato);
      swal.fire("Falta informaci??n del contrato", "", "question");
    }
  }
  validarTercero(terceroActual: any) {
    const { id_cliente } = terceroActual;
    const tercero = this.servicio.traerResponsableByClienteId(id_cliente);
    if (tercero) {
      return true;
    } else {
      return false;
    }
  }

  registrartercero() {
    if (this.formulariotercero.valid) {
      let formtercer = {
        nombres: this.formulariotercero.value.nombres,
        apellidos: this.formulariotercero.value.apellidos,
        genero: this.formulariotercero.value.genero,
        numero_documento: this.formulariotercero.value.numero_documento,
        direccion: this.formulariotercero.value.direccion,
        numero_contacto: this.formulariotercero.value.numero_contacto,
        numero_contacto2: this.formulariotercero.value.numero_contacto2,
        fecha_nacimiento: this.formulariotercero.value.fecha_nacimiento,
        email: this.formulariotercero.value.email,
        id_municipio: Number.parseInt(
          this.formulariotercero.value.id_municipio
        ),
        tipo_documento: this.formulariotercero.value.tipo_documento,
        razon_social: this.formulariotercero.value.razon_social,
        digito_verificacion: this.formulariotercero.value.digito_verificacion,
      };

      swal
        .fire({
          title: "Seguro de guardar los cambios?",
          showDenyButton: true,
          confirmButtonText: "Guardar",
          denyButtonText: `Cancelar`,
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.servicio.enviarregistrotercero(formtercer).subscribe(
              (res) => {
                swal
                  .fire("Guardados con Exito!", "", "success")
                  .then((isConfirm) => {
                    this.formulariotercero.reset();
                    this.formulariotercero.markAsUntouched();
                  });
                //console.log(formtercer);
                //console.log(res);
                this.traerclientes();
              },
              (err) => {
                swal.fire("Error al registrar", err.error.menssage, "error");
              }
            );
          }
        });
    } else {
      swal.fire("Falta informaci??n en los datos del tercero", "", "question");

      // swal.fire("Datos Registrados");
    }
  }

  addpropietario(value) {
    this.listprop.push({
      id_propietario: value,
    });

    this.clientesfilter = this.clientes.filter((i) => i.id_cliente == value);

    this.propietariostabla.push({
      tipoid: this.clientesfilter[0].tipo_documento,
      identificacion: this.clientesfilter[0].numero_documento,
      nombres: this.clientesfilter[0].nombres,
      apellidos: this.clientesfilter[0].apellidos,
      razon: this.clientesfilter[0].razon_social,
    });
  }

  delitem(i) {
    this.propietariostabla.splice(i, 1);
    this.listprop.splice(i, 1);
  }

  registropdv() {
    if (this.formulariopdv.valid) {
      swal
        .fire({
          title: "Seguro de guardar los cambios?",
          showDenyButton: true,
          confirmButtonText: "Guardar",
          denyButtonText: `Cancelar`,
        })
        .then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            swal.fire("Guardado con Exito!", "", "success");
            //console.log(this.formulariopdv.value);
            this.servicio.enviarregistropdv(this.formulariopdv.value).subscribe(
              (res: any) => {
                if (res.estado == "1") {
                  this.resgistropropietarios(res.id);
                  this.traerpdv();
                  swal
                    .fire(
                      `Se registro el Punto de venta ${this.formulariopdv.value.nombre_comercial}`
                    )
                    .then((isConfirm) => {
                      this.formulariopdv.reset();
                      this.formulariopdv.markAsUntouched();
                    });
                } else {
                  //console.log(res);
                }
              },
              (err) => {
                swal.fire("Error al registrar", err.error.menssage, "error");
              }
            );
            this.traerpdv;
          }
        });
    } else {
      swal.fire("Falta informaci??n del punto de venta", "", "question");
    }
  }

  resgistropropietarios(id) {
    for (let i = 0; i < this.listprop.length; i++) {
      const e = this.listprop[i];
      e.id_punto_venta = id;

      this.servicio.enviarproppdv(e).subscribe(
        (res) => {
          //console.log(res);
        },
        (err) => {
          //console.log(err.message);
        }
      );
    }
  }
  addConceptos(value) {
    this.listConceptos.push({
      id_concepto: value,
    });

    this.conceptosFilter = this.conceptos.filter((i) => i.id_concepto == value);

    this.conceptosTabla.push({
      id_concepto: this.conceptosFilter[0].id_concepto,
      codigo_concepto: this.conceptosFilter[0].codigo_concepto,
      nombre_concepto: this.conceptosFilter[0].nombre_concepto,
    });
  }

  deliCon(i: number) {
    this.conceptosTabla.splice(i, 1);
    this.listConceptos.splice(i, 1);
  }

  limpiarConceptos(): void {
    console.log(this.conceptosTabla, "conceptos");
    console.log(this.listConceptos, "listconceptos");

    this.conceptosTabla.splice(0, this.conceptosTabla.length);
    this.listConceptos.splice(0, this.listConceptos.length);
  }
  limpiarServicios(): void {
    this.serviciostabla = [];
    this.listservicios = [];
    this.serviciosfilter = [];
  }

  limpiarContrato(): void {
    this.formulariocontrato.reset();
    this.traerpdv();
    this.limpiarConceptos();
    this.limpiarServicios();
    this.consulta_pdv = null;

  }

}
