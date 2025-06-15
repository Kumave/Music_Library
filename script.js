import {
  collection, addDoc, getDocs, deleteDoc, updateDoc, doc, query, where
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { db } from './firebase-config.js';

const MusicForm = document.getElementById('MusicForm');
const listaMusica = document.getElementById('listaMusica');
const buscarInput = document.getElementById('buscarInput');
const musicaRef = collection(db, 'Musica');

MusicForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const titulo = MusicForm.titulo.value;
  const autor = MusicForm.autor.value;
  const anio = parseInt(MusicForm.anio.value);
  const genero = MusicForm.genero.value;

  await addDoc(musicaRef, { titulo, autor, anio, genero });
  MusicForm.reset();
  mostrarCanciones();
});

async function mostrarCanciones() {
  listaMusica.innerHTML = '';
  const querySnapshot = await getDocs(musicaRef);
  querySnapshot.forEach(docSnap => {
    const cancion = docSnap.data();
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <h3>${cancion.titulo}</h3>
      <p><strong>Artista:</strong> ${cancion.autor}</p>
      <p><strong>Año:</strong> ${cancion.anio}</p>
      <p><strong>Género:</strong> ${cancion.genero}</p>
      <button class="edit" onclick="editarCancion('${docSnap.id}', '${cancion.titulo}', '${cancion.autor}', ${cancion.anio}, '${cancion.genero}')">Editar</button>
      <button class="delete" onclick="eliminarCancion('${docSnap.id}')">Eliminar</button>
    `;
    listaMusica.appendChild(div);
  });
}

async function eliminarCancion(id) {
  await deleteDoc(doc(db, 'Musica', id));
  mostrarCanciones();
}

window.eliminarCancion = eliminarCancion;

window.editarCancion = (id, titulo, autor, anio, genero) => {
  MusicForm.titulo.value = titulo;
  MusicForm.autor.value = autor;
  MusicForm.anio.value = anio;
  MusicForm.genero.value = genero;

  MusicForm.onsubmit = async (e) => {
    e.preventDefault();
    const nuevoTitulo = MusicForm.titulo.value;
    const nuevoAutor = MusicForm.autor.value;
    const nuevoAnio = parseInt(MusicForm.anio.value);
    const nuevoGenero = MusicForm.genero.value;

    await updateDoc(doc(db, 'Musica', id), {
      titulo: nuevoTitulo,
      autor: nuevoAutor,
      anio: nuevoAnio,
      genero: nuevoGenero
    });

    MusicForm.reset();
    MusicForm.onsubmit = guardarCancion;
    mostrarCanciones();
  };
};

function guardarCancion(e) {
  e.preventDefault();
}

async function buscarLibro() {
  const texto = buscarInput.value.trim();
  if (!texto) return mostrarCanciones();

  listaMusica.innerHTML = '';
  const q = query(musicaRef, where('titulo', '==', texto));
  const resultado = await getDocs(q);

  resultado.forEach(docSnap => {
    const cancion = docSnap.data();
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <h3>${cancion.titulo}</h3>
      <p><strong>Artista:</strong> ${cancion.autor}</p>
      <p><strong>Año:</strong> ${cancion.anio}</p>
      <p><strong>Género:</strong> ${cancion.genero}</p>
    `;
    listaMusica.appendChild(div);
  });
}

mostrarCanciones();
