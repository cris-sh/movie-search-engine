import { useRef, useState, useMemo, useCallback } from "react";
import { searchMovies } from "../services/movies";

// Creamos un "Custom Hook" para obtener las películas y poder reutilizarlo en cualquier componente
export function useMovies({ search, sort }) {
  // Definimos los estados que vamos a utilizar
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const previousSearch = useRef(search);

  // Definimos la función que se encargará de obtener las películas
  const getMovies = useCallback(async ({ search }) => {
    // Si la búsqueda es la misma que la anterior, no hacemos nada
    if (search === previousSearch.current) return;
    try {
      setLoading(true);
      setError(null);
      previousSearch.current = search;
      const newMovies = await searchMovies({ search });
      setMovies(newMovies);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Ordenamos las películas si es necesario
  const sortedMovies = useMemo(() => {
    // Si sort es true, ordenamos las películas por título
    return sort
      ? [...movies].sort((a, b) => a.title.localeCompare(b.title))
      : movies;
  }, [sort, movies]);

  // Retornamos las películas, la función para obtenerlas y el estado de carga
  return { movies: sortedMovies, getMovies, loading };
}
