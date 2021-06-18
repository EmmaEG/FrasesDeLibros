import React, { useState, useEffect } from 'react';
import { db } from '../firebase';

const PhrasesForm = (props) => {
  const initValues = {
    title: '',
    author: '',
    description: '',
  };

  const [values, setValues] = useState(initValues);

  const handleInputChange = (e) => {
    // console.log(e.target.value);
    const { name, value } = e.target; // quiero el nombre del input y el valor que estoy tipeando
    // console.log(name, value);
    setValues({ ...values, [name]: value });
    // ...values (copia los valores actuales, [name]:value en el input que esten tipeando coloca el valor new)
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(values);
    props.addOrEdit(values);
    setValues({ ...initValues }); // reinicio los datos del form
  };

  const getPhraseById = async (id) => {
    try {
      const doc = await db.collection('phrases').doc(id).get();
      setValues({ ...doc.data() }); // lleno el form
    } catch (error) {
      console.error(error);
    }
  };

  // compruebo el estado de la app
  useEffect(() => {
    if (props.currentId === '') {
      setValues({ ...initValues });
    } else {
      getPhraseById(props.currentId);
    }
  }, [props.currentId]);

  return (
    <form onSubmit={handleSubmit} className='card card-body'>
      <div>
        <h1 className='text-center'>Guardar Frases</h1>
        <hr className='mb-5' />
      </div>
      <div className='form-group mb-4'>
        <label>
          <h4>Nombre del libro</h4>
        </label>
        <input
          type='text'
          className='form-control'
          placeholder='Ej: El Alquimista'
          name='title'
          onChange={handleInputChange}
          value={values.title}
        />
      </div>
      <div className='form-group mb-4'>
        <label>
          <h4>Nombre del Autor</h4>
        </label>
        <input
          type='text'
          className='form-control'
          placeholder='Ej: Paulo Coelho'
          name='author'
          onChange={handleInputChange}
          value={values.author}
        />
      </div>
      <div className='form-group mb-4'>
        <label>
          <h4>Tu frase para recordar</h4>
        </label>
        <textarea
          rows='5'
          className='form-control'
          placeholder='Escribe una frase'
          name='description'
          onChange={handleInputChange}
          value={values.description}
        ></textarea>
      </div>

      <button className='btn btn-info btn-block'>
        {props.currentId === '' ? 'Guardar' : 'Actualizar'}
      </button>
    </form>
  );
};

export default PhrasesForm;
