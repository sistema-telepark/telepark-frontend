import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { connect } from 'react-redux';
import { obrasocialRepository } from '../services/obrasocialService';
import { osRepository } from '../services/osService';
import utils from '../utils/utils';
import ObraSocialForm from './ListObraSocial/ObraSocialForm';

const ListaObraSocial = (props) => {
  const [show, setShow] = useState(false);
  const [showNuevo, setShowNuevo] = useState(false);
  const [campo, setCampo] = useState({ obrasocial: '' });
  const [idEditado, setIdEditado] = useState('');
  const [obrasociales, setObraSociales] = useState([]);
  const [osociales, setOsociales] = useState([]);
  const { idEpElegido, nombreEpElegido } = props;

  useEffect(() => {
    getObrasocial();
    getOs();
  }, []);

  // Funcion que obtiene la lista de obras sociales
  const getObrasocial = async () => {
    const response = await obrasocialRepository.getAll().catch(() => undefined);
    if (response) {
      setObraSociales(response.data);
    }
  };

  // Funcion que obtiene la lista de obras sociales de un paciente
  const getOs = async () => {
    const response = await osRepository.get(idEpElegido).catch(() => undefined);
    if (response) {
      setOsociales(response.data);
    }
  };

  // Funcion que guarda el valor de los campos
  const detectarCambio = (e) => {
    const { name, value } = e.target;
    setCampo({ ...campo, [name]: value });
  };

  // Funcion que habilita el formulario de agregar
  const agregar = () => {
    setShow(false);
    setShowNuevo(true);
    setCampo({ ...campo, obrasocial: '' });
  };

  // Funcion que habilita el formulario de editar
  const editar = (obrasocial, idos) => {
    setShow(true);
    setShowNuevo(false);
    setIdEditado(idos);
    setCampo({ obrasocial: obrasocial });
  };

  // Funcion que cancela las operaciones y oculta los formularios
  const cancelar = () => {
    setShow(false);
    setShowNuevo(false);
    setCampo({ ...campo, obrasocial: '' });
  };

  // Funcion que crea una nueva obra social y la guarda en la base de datos
  const cargarNuevo = async () => {
    const idObrasocial = campo.obrasocial;
    if (idObrasocial !== '') {
      const data = {
        idpersonaep: idEpElegido,
        idobrasocial: idObrasocial,
        borrado: '0',
      };
      const response = await osRepository.create(data).catch((e) => console.log(e));
      if (response) {
        getOs();
        utils.notificacionGuardar();
        setShow(false);
        setCampo({ ...campo, obrasocial: '' });
      }
    }
  };

  // Funcion que actualiza una obra social y la guarda en la base de datos
  const guardar = async () => {
    const idObrasocial = campo.obrasocial;
    const id = idEditado;
    if (idObrasocial !== '') {
      const data = {
        idpersonaep: idEpElegido,
        idobrasocial: idObrasocial,
        borrado: '0',
      };
      const response = await osRepository.update(id, data).catch((e) => console.log(e));
      if (response) {
        getOs();
        utils.notificacionGuardar();
        setShow(false);
        setCampo({ ...campo, obrasocial: '' });
      }
    }
  };

  // Funcion que elimina una obra social
  const eliminar = async (info, id) => {
    const data = {
      idpersonaep: idEpElegido,
      idobrasocial: info.idobrasocial,
      borrado: '1',
    };
    const response = await osRepository.update(id, data).catch((e) => console.log(e));
    if (response) {
      getOs();
      setShow(false);
    }
  };

  return (
    <main className="container form-paciente">
      <div className="row">
        <div className="mb-2 col-12 col-md-12 col-lg-12 col-xl-12">
          <h3 className="mt-4">Obra Social de Persona con EP</h3>
          <hr />
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-12 col-md-6 col-lg-6 col-xl-6">
          <h5>
            <b>Nombre y Apellido:</b> {nombreEpElegido}
          </h5>
        </div>
        <div className="col-12 col-md-6 col-lg-6 col-xl-6" style={{ textAlign: 'right' }}>
          <button type="button" className="btn btn-azul" onClick={() => agregar()}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-plus-lg"
              viewBox="0 0 16 16"
            >
              <path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z" />
            </svg>
            Agregar
          </button>
        </div>
      </div>

      {showNuevo ? (
        <ObraSocialForm
          titulo={'Cargar Obra Social'}
          funcionCambiar={detectarCambio}
          obrasociales={obrasociales}
          funcionConfirmar={cargarNuevo}
          funcionCancelar={cancelar}
          value={campo.obrasocial}
        />
      ) : (
        ''
      )}

      {show ? (
        <ObraSocialForm
          titulo={'Editar Obra Social'}
          funcionCambiar={detectarCambio}
          obrasociales={obrasociales}
          funcionConfirmar={guardar}
          funcionCancelar={cancelar}
          value={campo.obrasocial}
        />
      ) : (
        ''
      )}

      <div className="row">
        <div className="col-12 col-md-12 col-lg-12 col-xl-12">
          <table className="table table-bordered table-hover shadow table-striped">
            <thead>
              <tr>
                <th scope="col">Obra Social</th>
                <th scope="col">Tipo</th>
                <th scope="col">Acción</th>
              </tr>
            </thead>
            <tbody style={{ verticalAlign: 'middle' }}>
              {osociales &&
                osociales
                  .filter((osocial) => osocial.borrado === 0)
                  .map((osocial, index) => (
                    <tr key={index}>
                      <td>{osocial.idobrasocial.nombre}</td>
                      <td>{utils.convertirTipo(osocial.idobrasocial.esestatal)}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-verde"
                          style={{ marginRight: 10 }}
                          onClick={() => editar(osocial.idobrasocial.idobrasocial, osocial.idos)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-pencil-square"
                            viewBox="0 0 16 16"
                          >
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                            <path
                              fillRule="evenodd"
                              d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                            />
                          </svg>
                        </button>

                        <button
                          type="button"
                          className="btn btn-rojo"
                          onClick={() =>
                            utils.notificacionEliminar(
                              { idobrasocial: osocial.idobrasocial.idobrasocial },
                              osocial.idos,
                              eliminar
                            )
                          }
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-trash"
                            viewBox="0 0 16 16"
                          >
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                            <path
                              fillRule="evenodd"
                              d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

const mapStateToProps = (state) => {
  return {
    idEpElegido: state.global.idEpElegido,
    nombreEpElegido: state.global.nombreEpElegido,
  };
};

export default connect(mapStateToProps)(ListaObraSocial);
