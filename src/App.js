import logo from "./logo.svg";
import "./App.css";
import React, { useState, useEffect } from "react";
import db from "./firebaseconfig";
//importamos la base de datos
import {
  collection,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  setDoc,
} from "firebase/firestore";

function App() {
  const [nombre, setNombre] = useState("");
  //creo estado para el nombre
  const [celular, setCelular] = useState("");
  //creo estado para el numero de celular
  const [userAgenda, setUserAgenda] = useState([]);
  //creo estado para el array de usuarios
  const [error, setError] = useState("");
  //creo estado para los errores
  const [actualizarContacto, setActualizarContacto] = useState("");
  //creo estado para actualizar un contacto existente

  useEffect(() => {
    const getUsers = async () => {
      //creo funcion asincrona para obtener usuarios de la base de datos
      const rdb = await getDocs(collection(db, "agenda"));
      //uso una operación await de getDocs: genera un hilo independiente
      const arrayNuevo = [];
      //creo un array nuevo para almacenar la información de los datos extraidos de la base de datos
      rdb.forEach((document) => {
        //recorro los datos extraidos con un for each y le indico un puntero 'document' para iterar
        arrayNuevo.push({
          id: document.id,
          nombre: document.data().nombre,
          celular: document.data().celular,
        });
        //agrego al array nuevo en cada posición: un objeto con los campos correspondientes
      });

      arrayNuevo.sort((a, b) => {
        //ordeno alfabeticamente el array
        const nombreA = a.nombre.toLowerCase();
        //paso el argumento 'a' = nombre en minúscula
        const nombreB = b.nombre.toLowerCase();
        //paso el argumento 'b' = nombre en minúscula

        //COMPARACIÓN:
        if (nombreA < nombreB) {
          return -1;
        }
        if (nombreA > nombreB) {
          return 1;
        }
        return 0;
        //realizo la comparación
      });
      setUserAgenda(arrayNuevo);
      //setteo el 'arrayNuevo' al array de userAgenda
    };
    getUsers();
  }, []);

  const setUsuarios = async (e) => {
    e.preventDefault();
    //evitamos que el formulario se actualice
    let casos = 1;
    if (actualizarContacto.trim()) {
      casos = 2;
    }
    //si actualizarContacto posee una ID para actualizar cambiará la funcionalidad del formulario
    if (!nombre.trim()) {
      //nombre.trim comprueba si la variable tiene un string
      setError("El campo nombre está vacío");
      //seteo el mensaje de error
    }
    if (!celular.trim()) {
      //nombre.trim comprueba si la variable tiene un string
      setError("El campo de celular está vacío");
      //seteo el mensaje de error
    }
    const usuarioObjeto = {
      nombre: nombre,
      celular: celular,
    };
    //creo un objeto llamado 'usuarioObjeto' que contiene los campos que se van a crear para la base de datos con sus respectivos datos de estado

    switch (casos) {
      case 1:
        if (nombre.trim() && celular.trim()) {
          try {
            const user = await addDoc(collection(db, "agenda"), usuarioObjeto);
            //con await invoco a addDoc para crear un documento, le paso el parámetro collection indicando la base de datos y el nombre de colección, en este caso creará la colección "agenda", y como segundo parámetro a addDoc le indico el objeto que añadirá como documento
            console.log("documento(contacto) creado")
            alert("contacto añadido");
          } catch (e) {
            console.log(e);
          }
        }
        refrescarAgenda(e);
        setNombre("");
        setCelular("");
        break;
      case 2:
        //case 2 se ejecuta si se presionó el botón de editar y por ende actualizarContacto posee la ID a actualizar
        const actualizarUsuario = async () => {
          console.log("id actualizada: " + actualizarContacto);
          alert("Contacto actualizado")
          await setDoc(doc(db, "agenda", actualizarContacto), {
            //actualizo el documento ya existente por un objeto con los estados del formulario
            nombre: nombre,
            celular: celular,
          });
        };
        actualizarUsuario()
        //llamo a la funcion asincrona de actualizar contacto, refresco la agenda y pongo los valores vacíos nuevamente
        refrescarAgenda(e);
        setActualizarContacto("");
        setNombre("");
        setCelular("");
        break;
    }
  };

  const refrescarAgenda = async (e) => {
    e.preventDefault();
    const rdb = await getDocs(collection(db, "agenda"));
    const arrayNuevo = [];
    rdb.forEach((document) => {
      arrayNuevo.push({
        id: document.id,
        nombre: document.data().nombre,
        celular: document.data().celular,
      });
    });
    arrayNuevo.sort((a, b) => {
      //ordeno alfabeticamente el array
      const nombreA = a.nombre.toLowerCase();
      //paso el argumento 'a' = nombre en minúscula
      const nombreB = b.nombre.toLowerCase();
      //paso el argumento 'b' = nombre en minúscula

      //COMPARACIÓN:
      if (nombreA < nombreB) {
        return -1;
      }
      if (nombreA > nombreB) {
        return 1;
      }
      return 0;
      //realizo la comparación
    });
    setUserAgenda(arrayNuevo);
    console.log("agenda refrescada")
  };

  const borrarUsuario = async (id) => {
    //recibo por parametro el id a borrar en la funcion asincrona borrarUsuario
    try {
      await deleteDoc(doc(db, "agenda", id));
      //await deleteDoc se le indica por parametro que borrará (collecion o documento, en este caso es documento 'doc') y por dentro de los parametros de doc se indica: la base de datos, el nombre de coleccion y la id a borrar
      alert("contacto eliminado, porfavor presione el botón de refrescar");
      console.log("id borrada: " + id);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="container">
      <div className="row"></div>
      <div className="col">
        <h2 className="mt-2">Ingreso de usuarios</h2>
        <form onSubmit={setUsuarios} className="form-group">
          <span>😀Nombre:</span>
          <input
            style={{ width: "fit-content" }}
            value={nombre}
            onChange={(e) => {
              setNombre(e.target.value);
            }}
            className="form-control mb-3"
            type="text"
            placeholder="introduce el nombre"
          ></input>
          <span>📱Celular:</span>
          <input
            style={{ width: "fit-content" }}
            value={celular}
            onChange={(e) => {
              setCelular(e.target.value);
            }}
            className="form-control"
            type="number"
            placeholder="introduce el número de celular"
          ></input>
          {actualizarContacto ? (
            <input
              type="submit"
              value="Actualizar"
              className="btn btn-success btn-block mt-3"
            ></input>
          ) : (
            <input
              type="submit"
              value="Registrar"
              className="btn btn-dark btn-block mt-3"
            ></input>
          )}
        </form>
        {/* si error devuelve true se ejecuta el primer paréntesis de lo contrario se ejecuta el segundo */}
        {error ? (
          <div>
            <p style={{ color: "red" }}>{error}</p>
          </div>
        ) : (
          <span></span>
        )}
      </div>
      <div className="col">
        <h2>Lista de la Agenda 📕</h2>
        <ul className="list-group">
          {userAgenda.length != 0 ? (
            <div>
              {userAgenda.map((item) => (
                <li
                  style={{ width: "450px" }}
                  className="list-group-item"
                  key={item.id}
                >
                  {" "}
                  🤨{item.nombre} | 📱{item.celular}
                  <img
                    src="https://www.svgrepo.com/show/184197/user-delete.svg"
                    onClick={() => {
                      borrarUsuario(item.id);
                    }}
                    style={{ width: "24px", height: "24px", cursor: "pointer",position:'absolute',right:'75px' }}
                  ></img>
                  <button
                    onClick={() => {
                      setActualizarContacto(item.id);
                      setNombre(item.nombre);
                      setCelular(item.celular);
                    }}
                    className="btn btn-info btn-warning btn-sm"
                    style={{
                      position: "absolute",
                      right: "10px",
                      bottom: "5px",
                    }}
                  >
                    Editar
                  </button>
                </li>
              ))}
            </div>
          ) : (
            <span>No se encontraron usuarios en la agenda</span>
          )}
        </ul>
        <button
          onClick={refrescarAgenda}
          type="button"
          className="btn btn-info btn-block mt-3"
          style={{ color: "white" }}
        >
          Refrescar
        </button>
        <p>
          Al momento de eliminar un usuario en la base de datos, presionar el
          botón "Refrescar"
        </p>
      </div>
    </div>
  );
}

export default App;
