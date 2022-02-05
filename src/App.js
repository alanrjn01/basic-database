import logo from "./logo.svg";
import "./App.css";
import React, { useState, useEffect } from "react";
import db from "./firebaseconfig";
//importamos la base de datos
import { collection, getDocs,addDoc,doc } from "firebase/firestore";

function App() {
  const [nombre, setNombre] = useState("");
  //creo estado para el nombre
  const [celular, setCelular] = useState("");
  //creo estado para el numero de celular
  const [usuario, setUsuario] = useState([]);
  //creo estado para el array de usuarios
  const [error,setError] = useState("")
  //creo estado para los errores

  const setUsuarios = async (e)=>{
    e.preventDefault()
    //evitamos que el formulario se actualice
    if(!nombre.trim()){
      //nombre.trim comprueba si la variable tiene un string
      setError("El campo nombre está vacío")
      //seteo el mensaje de error
    }
    if(!celular.trim()){
      //nombre.trim comprueba si la variable tiene un string
      setError("El campo de celular está vacío")
      //seteo el mensaje de error
    }
    const usuarioObjeto={
      nombre: nombre,
      celular: celular
    }
    //creo un objeto llamado 'usuarioObjeto' que contiene los campos que se van a crear para la base de datos con sus respectivos datos de estado
    if(nombre.trim() && celular.trim()){
      try{
        const user= await addDoc(collection(db,"agenda"),usuarioObjeto)
        //con await invoco a addDoc para crear un documento, le paso el parámetro collection indicando la base de datos y el nombre de colección, en este caso creará la colección "agenda", y como segundo parámetro a addDoc le indico el objeto que añadirá como documento
        console.log("tarea")
        alert("contacto añadido");
      }catch(e){
        console.log(e)
      }
    }
    
    setNombre("")
    setCelular("")


  }


  return (
    <div className="container">
      <div className="row"></div>
      <div className="col">
        <h2>Formulario de usuarios</h2>
        <form onSubmit={setUsuarios} className="form-group">
          <input
          value={nombre}
            onChange={(e) => {
              setNombre(e.target.value);
            }}
            className="form-control"
            type="text"
            placeholder="introduce el nombre"
          ></input>
          <input
          value={celular}
            onChange={(e) => {
              setCelular(e.target.value);
            }}
            className="form-control mt-3"
            type="text"
            placeholder="introduce el número de celular"
          ></input>
          <input
            type="submit"
            value="Registrar"
            className="btn btn-dark btn-block mt-3"
          ></input>
        </form>
        {/* si error devuelve true se ejecuta el primer paréntesis de lo contrario se ejecuta el segundo */}
        {
          error ?
          (
            <div>
              <p style={{color:'red'}}>{error}</p>
            </div>
          )
          :
          (
            <span></span>
          )
        }
      </div>
      <div className="col">
        <h2>Lista de tu Agenda</h2>
      </div>
    </div>
  );
}

export default App;
