import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { toast } from 'react-toastify';

import PhrasesForm from './PhrasesForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';

const Phrases = () => {
  //definimos el estado inicial de la app un arreglo vacío
  const [phrases, setPhrases] = useState([]);

  const [currentId, setCurrentId] = useState('');

  const addOrEdit = async (phraseObject) => {
    try {
      if (currentId === '') {
        // console.log(phraseObject);
        await db.collection('phrases').doc().set(phraseObject);
        toast('Frase agregada correctamente', {
          type: 'success',
          autoClose: 2000,
        });
      } else {
        await db.collection('phrases').doc(currentId).update(phraseObject);
        toast('Frase actualizada correctamente', {
          type: 'info',
          autoClose: 2000,
        });
        setCurrentId(''); // lo vuelvo a poner en vacío y no haga peticiones
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onDeletePhrase = async (id) => {
    try {
      // console.log(id);
      if (window.confirm('Are you sure you want to delete this phrase?')) {
        await db.collection('phrases').doc(id).delete();
        toast('Frase eliminada', {
          type: 'error',
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  // peticion a firebase
  // onSnapshot lo usamos en vez de get(), es un observable
  const getPhrases = () => {
    db.collection('phrases').onSnapshot((querySnapshot) => {
      const docs = [];
      querySnapshot.forEach((doc) => {
        // console.log(doc.data());
        // console.log(doc.id);
        docs.push({ ...doc.data(), id: doc.id }); //le agrego el id a los obj que trae data y tengo un nuevo obj
      });
      // console.log(docs);
      setPhrases(docs);
    });
  };

  useEffect(() => {
    // console.log('getting data... ');
    getPhrases();
  }, []);
  // como segundo param recibe un arreglo con los datos que cambian

  return (
    <div>
      <PhrasesForm {...{ addOrEdit, currentId, phrases }} />
      <div className='col'>
        {phrases.map((phrase) => (
          <div className='card mt-3' key={phrase.id}>
            <div className='card-body'>
              <div className='d-flex justify-content-between'>
                <h4>{phrase.title}</h4>
                <div>
                  <i
                    type='button'
                    className='btn btn-warning'
                    onClick={() => {
                      setCurrentId(phrase.id);
                    }}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </i>

                  <i
                    type='button'
                    className='btn btn-danger m-1'
                    onClick={() => {
                      onDeletePhrase(phrase.id);
                    }}
                  >
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </i>
                </div>
              </div>
              <p>{phrase.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Phrases;

/*
      <PhrasesForm addOrEdit={addTask} />
      de este modo le paso al componente hijo la función addTask que ejecuto desde el hijo en el submit


    await db.collection('phrases').doc().set(phraseObject);
          generame una coleccion phrases, con un doc único, o sea un id único, y rellenala con el objeto 
          del parámetro, que son los valores que capturo del form

    useEffect, es para manejar el estado de los componentes, xq necesitamos que cuando cargue la petición 
    se actaulice el componente, cuando hay un cambio de estado lo que está dentro del metodo se vuelve a 
    ejecutar
 */
