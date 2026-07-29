import React from "react";
import Swal from "sweetalert2";
import { Redirect } from "react-router-dom";
import { authRepository } from "../services/authService";
import { TokenService } from "../services/tokenService";
import logoTelepark from "../images/logo2022.png";

class Login extends React.Component {
  constructor(props) {
    super(props);

    // Defino los estados locales
    this.state = {
      campo: {},
      loading: false,
    };
  }

  // Valido los campos del formulario
  validarFormulario() {
    let campo = this.state.campo;
    let formularioValido = true;

    // user
    if (!campo["user"]) {
      formularioValido = false;
    }

    // Pass
    if (!campo["pass"]) {
      formularioValido = false;
    }

    return formularioValido;
  }

  // Una vez que los campos del formulario han sido llenado correctamente
  // Se envía la petición de autenticación al API
  async enviarFormulario(e) {
    e.preventDefault();

    // Si la validación de los campos del formulario ha sido realizada
    if (this.validarFormulario()) {
      this.setState({ loading: true });

      try {
        const response = await authRepository.login({
          username: this.state.campo.user,
          password: this.state.campo.pass,
        });

        if (response) {
          console.log("===>", response.data.access);
          TokenService.setUser(response.data);
          this.send(response.data);
        }
      } catch (error) {
        this.errorSend();
      } finally {
        this.setState({ loading: false });
      }
    } else {
      this.errorSend();
    }
  }

  // Detectamos cuando un campo del formulario es llenado y por ende cambia de estado
  detectarCambio(field, e) {
    let campo = this.state.campo;
    campo[field] = e.target.value;

    // Cambio de estado de campo
    this.setState({
      campo,
    });
  }

  send(data) {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Acceso Permitido",
      showConfirmButton: false,
      timer: 1500,
    });

    if (data.is_superuser === true) {
      setTimeout(() => {
        this.props.history.push("/list-usuarios");
        }, 1500);
    } else {
      setTimeout(() => {
        this.props.history.push("/add-paciente");
        }, 1500);
    }
  }

  errorSend() {
    Swal.fire({
      position: "center",
      icon: "error",
      title: "No se permite el acceso",
      text: "El nombre de usuario o la contraseña ingresada son incorrectos.",
      confirmButtonText: "OK",
    });

    this.setState({
      campo: {
        user: "",
        pass: "",
      },
    });
  }

  render() {
    if (TokenService.getLocalAccessToken() && TokenService.getRole() === true) return <Redirect to="/list-usuarios" />;
    if (TokenService.getLocalAccessToken() && TokenService.getRole() !== true) return <Redirect to="/add-paciente" />;

    return (
      <div className="col-12 col-md-6 col-lg-4 col-xl-4">
      <form onSubmit={(e) => this.enviarFormulario(e)}>
        <main
          className="border-top-sm row justify-content-center form-paciente shadow container-lg mx-auto"
          style={{ marginTop: "3vh", marginBottom: "3vh" }}
        >
          <div className="justify-content-center" style={{ paddingTop: "5vh", paddingBottom: "8vh" }}>
          <div className="col-12 col-md-12 col-lg-12 col-xl-12" style={{textAlign:"center", marginBottom: "-5vh"}}>
          <img className="logo" src={logoTelepark} style={{width:"180px"}} alt="logo de telepark" />
          </div>
            <h2 className="mt-4 mt-md-2 text-center">Login</h2>
            <hr />
            <div className="container">
              <div className="row">
                <div className="w-100"></div>
                <div className="col-12 col-md-12 col-lg-12 col-xl-12" style={{textAlign:"center", marginTop: "2vh"}}>
                  <label className="col-form-label" style={{float:"left"}}>Usuario</label>
                  <input
                    name="user"
                    type="text"
                    className="form-control"
                    placeholder="Ingrese su usuario"
                    id="user"
                    aria-describedby="user"
                    onChange={this.detectarCambio.bind(this, "user")}
                    value={this.state.campo["user"] || ""}
                  />
                  <label
                    className="col-form-label"
                    style={{ marginTop: "20px", float:"left" }}
                  >
                    Contraseña
                  </label>
                  <input
                    name="password"
                    type="password"
                    className="form-control"
                    placeholder="Ingrese su Contraseña"
                    id="pass"
                    aria-describedby="pass"
                    onChange={this.detectarCambio.bind(this, "pass")}
                    value={this.state.campo["pass"] || ""}
                  />

                  <button
                    type="submit"
                    className="btn btn-azul"
                    style={{ marginTop: "5vh" }}
                    disabled={this.state.loading}
                  >
                    {this.state.loading ? "Ingresando..." : "Iniciar Sesión"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </form>
      </div>
    );
  }
}

// const mapDispatchToProps = (dispatch) => ({
//   login: (data) => dispatch(setAuthUser(data)),
// });

// const mapStateToProps = (state, ownProps) => ({

// })

export default Login;
