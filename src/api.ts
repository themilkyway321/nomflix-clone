const API_KEY ="b81bbef0500b1a12a3877859ea910f45";
const BASE_PATH ="https://api.themoviedb.org/3";

interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
};

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
    };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export function getMovies(){
  return fetch (`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then((response)=>response.json());
}


// curl --request GET \
//      --url 'https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1&region=kr' \
//      --header 'accept: application/json'