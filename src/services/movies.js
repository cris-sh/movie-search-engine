export const searchMovies = async ({ search }) => {
  // Si la busqueda esta vacia, retornamos null
  if (search === "" || !search) return null;

  try {
    // Hacemos la peticion a la API de OMDB
    const response = await fetch(
      `http://www.omdbapi.com/?apikey=f780c30f&s=${search}`
    );
    const json = await response.json();

    const movies = json.Search;

    // Mapeamos los datos que necesitamos
    return movies?.map((movie) => ({
      id: movie.imdbID,
      title: movie.Title,
      year: movie.Year,
      poster: movie.Poster,
    }));
  } catch {
    // Si hay un error, lanzamos una excepcion
    throw new Error("Error searching movies");
  }
};
