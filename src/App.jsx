import "./App.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { Movies } from "./components/Movies";
import { useMovies } from "./hooks/useMovies";
import debounce from "just-debounce-it";

function useSearch() {
  // Inicializamos el estado de la búsqueda
  const [search, updateSearch] = useState("");
  const [error, setError] = useState(null);
  const initialRender = useRef(true);

  // Validamos la búsqueda
  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = search === "";
      return;
    }
    if (search === "") {
      setError("No se puede buscar una película vacía");
      return;
    }

    if (search.match(/^\d+$/)) {
      setError("No se pueden buscar películas con números solamente");
      return;
    }

    if (search.length < 3) {
      setError("La búsqueda debe tener al menos 3 caracteres");
      return;
    }

    setError(null);
  }, [search]);

  return { search, updateSearch, error };
}

function App() {
  const [sort, setSort] = useState(false);
  const { search, updateSearch, error } = useSearch();
  const { movies, getMovies, loading } = useMovies({ search, sort });

  // Evitamos que se hagan múltiples peticiones al mismo tiempo
  const debouncedGetMovies = useCallback(
    debounce((search) => {
      getMovies({ search });
    }, 300),
    []
  );

  // Manejamos el submit del formulario
  const handleSubmit = (event) => {
    event.preventDefault();
    getMovies({ search });
  };

  // Manejamos el cambio de orden
  const handleSort = () => {
    setSort(!sort);
  };

  // Manejamos el cambio del input
  const handleChange = (event) => {
    const newSearch = event.target.value;
    updateSearch(newSearch);
    debouncedGetMovies(newSearch);
  };

  // Renderizamos la aplicación
  return (
    <div className='page'>
      <header className='search-engine'>
        <h1>Buscador de Películas</h1>
        <a className='github-repo' href="https://github.com/cris-sh/movie-search-engine">View on GitHub</a>
        <form className='form' onSubmit={handleSubmit}>
          <input
            value={search}
            onChange={handleChange}
            name='query'
            placeholder='Avengers, Star Wars, Interestelar...'
          />
          <input type='checkbox' onChange={handleSort} checked={sort} />
          <button type='submit'>Buscar</button>
        </form>
        {error && (
          <p style={{ color: "red" }} className='error'>
            {error}
          </p>
        )}
      </header>

      <main>
        {loading && <p>Cargando...</p>}
        <Movies movies={movies} />
      </main>
    </div>
  );
}

export default App;
