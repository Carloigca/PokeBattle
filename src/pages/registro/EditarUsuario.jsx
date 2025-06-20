import { editarusuario } from "../../api/api";
import { useState } from "react";
import '../../assets/styles/forms.css'
import { jwtDecode } from 'jwt-decode';



export const EditarUsuario = () => {
  const [Nombre, setNombre] = useState('');
  const [Password, setPassword] = useState('');
  const [PassConfirm, setPassConfirm] = useState('');

  const cumpleMayuscula = /[A-Z]/.test(Password);
  const cumpleMinuscula = /[a-z]/.test(Password);
  const cumpleNum = /[0-9]/.test(Password);
  const cumpleCharEsp = /[^A-Za-z0-9]/.test(Password);
  const[datosback,setDatosBack] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();// evita que se recargue la página
    const token = localStorage.getItem('Token');
    let datos = null;
    let id_user = null;    
    let nuevosDatos = null;
    if (token) {
      datos = jwtDecode(token);
    }
    if (datos) {
      id_user = datos.usuario;
    }
    nuevosDatos = {
      nombre: Nombre,
      password: Password,
    };

    try {
      const response = await editarusuario(id_user, nuevosDatos, token);
      setDatosBack(response.data);
      console.log(datosback)
    } catch (err) {
      if (err.response && err.response.data) {
        setDatosBack(err.response.data);  // Caso error: setea el error que viene del backend
      } else {
        setDatosBack('Error desconocido');  // Por si no viene nada
      }
    }
  }


  return (
    <div>
      <div>
          <form onSubmit={handleSubmit}>
          <label>Nuevo nombre del Usuario:</label>
          <input type="text" value={Nombre} onChange={(e) => setNombre(e.target.value)} minLength={1} maxLength={30} /> <br />
          {Nombre.length < 1 && <p className="formularios">Campo no puede estar vacio</p>}
          {Nombre.length > 30 && <p className="formularios">Campo no puede tener mas de 30 chars</p>}

          <label>Nueva Password:</label>
          <input type="password" value={Password} onChange={(e) => setPassword(e.target.value)} minLength={8} required /><br />
          {Password.length < 8 && <p className="formularios">Password debe contener min 8 caraceres</p>}
          {!cumpleMayuscula && <p className="formularios">Debe contener al menos una Mayúscula</p>}
          {!cumpleMinuscula && <p className="formularios">Debe contener al menos una minúscula</p>}
          {!cumpleNum && <p className="formularios">Debe contener un número</p>}
          {!cumpleCharEsp && <p className="formularios">Debe contener un caracter especial!</p>}

          <label>Confirmar nueva Password:  </label>
          <input type="password" value={PassConfirm} onChange={(e) => setPassConfirm(e.target.value)} minLength={8} required /><br />
          {PassConfirm != Password && <p className="formularios">Contraseñas no coinciden</p>}
          <button type="submit" className="botonEnviar"> Actualzar Datos</button>
        </form>    
      </div>
      <div className="resultadosback">
      {datosback?.estado && <p className="formularios"> Estado --  {datosback.estado} </p>}
      {datosback?.error && <p className="formularios"> Error -- {datosback.error} </p> }
      </div>
    </div>            
  )
}
