import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { obrasocialRepository } from '../services/obrasocial.service';
import { osRepository } from '../services/os.service';
import utils from '../utils/utils';
import ObraSocialForm from './list-obrasocial/obra-social-form.component';
import { PlusIcon, PencilIcon, TrashIcon } from './icons/icons-shared';
import styles from '../styles/list-obrasocial.module.css';

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
      const response = await osRepository.create(data).catch(() => undefined);
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
      const response = await osRepository.update(id, data).catch(() => undefined);
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
    const response = await osRepository.update(id, data).catch(() => undefined);
    if (response) {
      getOs();
      setShow(false);
    }
  };

  return (
    <main className="container panel-gris">
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
        <div className={'col-12 col-md-6 col-lg-6 col-xl-6 ' + styles.textRight}>
          <button type="button" className="btn btn-azul" onClick={() => agregar()}>
            <PlusIcon />
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
            <tbody className={styles.tableBodyMiddle}>
              {osociales &&
                osociales
                  .filter((osocial) => osocial.borrado === 0)
                  .map((osocial) => (
                    <tr key={osocial.idos}>
                      <td>{osocial.idobrasocial.nombre}</td>
                      <td>{utils.convertirTipo(osocial.idobrasocial.esestatal)}</td>
                      <td>
                        <button
                          type="button"
                          className={'btn btn-verde ' + styles.rowActionButton}
                          onClick={() => editar(osocial.idobrasocial.idobrasocial, osocial.idos)}
                        >
                          <PencilIcon />
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
                          <TrashIcon />
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
