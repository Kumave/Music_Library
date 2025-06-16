document.addEventListener('DOMContentLoaded', () => {
  const audio = document.getElementById('audioMusica');
  document.body.addEventListener('click', () => {
    if (audio.paused) {
      audio.play().catch(e => console.log('No se pudo reproducir aún:', e));
    }
  }, { once: true });
});
const toggleBtn = document.getElementById('toggleMusica');
const audio = document.getElementById('audioMusica');

toggleBtn.addEventListener('click', () => {
  if (audio.paused) {
    audio.play();
    toggleBtn.textContent = '──★ ˙🍓 Silenciar música ̟ !!';
  } else {
    audio.pause();
    toggleBtn.textContent = '──★ ˙🍓 ̟Reproducir música !!';
  }
});

import {
  collection, addDoc, getDocs, deleteDoc, updateDoc,
  doc, query, where
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
  const tags = MusicForm.tags.value.split(',').map(tag => tag.trim());

  await addDoc(musicaRef, { titulo, autor, anio, genero, tags });
  MusicForm.reset();
  mostrarMusica();
});

async function mostrarMusica() {
  listaMusica.innerHTML = '';
  const querySnapshot = await getDocs(musicaRef);

  querySnapshot.forEach((docSnap) => {
    const cancion = docSnap.data();
    const div = document.createElement('div');
    div.className = 'card';

    const tags = cancion.tags?.join(', ') || 'Sin etiquetas';

    div.innerHTML = `
      <h3>${cancion.titulo}</h3>
      <p> ${cancion.autor}</p>
      <p> ${cancion.anio}</p>
      <p> ${cancion.genero}</p>
      <p> ${tags}</p>
      <button class="edit" onclick="editarMusica('${docSnap.id}', '${cancion.titulo}', '${cancion.autor}', ${cancion.anio}, '${cancion.genero}', '${tags}')">Editar</button>
      <button class="delete" onclick="eliminarMusica('${docSnap.id}')">Eliminar</button>
    `;

    listaMusica.appendChild(div);
  });
}


async function eliminarMusica(id) {
  await deleteDoc(doc(db, 'Musica', id));
  mostrarMusica();
}

window.eliminarMusica = eliminarMusica;

window.editarMusica = (id, titulo, autor, anio, genero, tags) => {
  MusicForm.titulo.value = titulo;
  MusicForm.autor.value = autor;
  MusicForm.anio.value = anio;
  MusicForm.genero.value = genero;
  MusicForm.tags.value = tags;

  MusicForm.onsubmit = async (e) => {
    e.preventDefault();
    const nuevoTitulo = MusicForm.titulo.value;
    const nuevoAutor = MusicForm.autor.value;
    const nuevoAnio = parseInt(MusicForm.anio.value);
    const nuevoGenero = MusicForm.genero.value;
    const nuevasTags = MusicForm.tags.value.split(',').map(tag => tag.trim());

    await updateDoc(doc(db, 'Musica', id), {
      titulo: nuevoTitulo,
      autor: nuevoAutor,
      anio: nuevoAnio,
      genero: nuevoGenero,
      tags: nuevasTags
    });

    MusicForm.reset();
    MusicForm.onsubmit = guardarMusica;
    mostrarMusica();
  };
};

function guardarMusica(e) {
  e.preventDefault();
}

async function buscarMusica() {
  const texto = buscarInput.value.trim();
  if (!texto) return mostrarMusica();

  listaMusica.innerHTML = '';
  const q = query(musicaRef, where('titulo', '==', texto));
  const resultado = await getDocs(q);

  resultado.forEach(docSnap => {
    const cancion = docSnap.data();
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <h3>${cancion.titulo}</h3>
      <p>${cancion.autor}</p>
      <p>${cancion.anio}</p>
      <p>${cancion.genero}</p>
      <p>${cancion.tags.join(', ')}</p>
    `;
    listaMusica.appendChild(div);
  });
}

mostrarMusica();
