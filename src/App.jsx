import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg'
import './App.css'
import Headers from './components/Header'
import Banner from './components/Banner'
import MovieList from './components/MovieList';
import MovieSearch from './components/MovieSearch';
function App() {
  const [movie, setMovie] = useState([])
  const [movieRated, setmovieRated] = useState([])
  const [movieSearch, setMovieSearch] = useState([])

  const handleSearch = async (searchVal) => {
    setMovieSearch([])
    try {
      const url = `https://api.themoviedb.org/3/search/movie?query=${searchVal}&include_adult=false&language=vi&page=1`;
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`
        }
      };

      const searchMovie = await fetch(url, options)
      const data = await searchMovie.json();
      setMovieSearch(data.results)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    const fechMovie = async () => {
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`
        }
      };
      const url1 = 'https://api.themoviedb.org/3/movie/popular?language=vi&page=1';
      const url2 = 'https://api.themoviedb.org/3/movie/top_rated?language=vi&page=1';

      const [res1, res2] = await Promise.all([
        fetch(url1, options),
        fetch(url2, options),
      ])

      const data1 = await res1.json()
      const data2 = await res2.json()

      setMovie(data1.results)
      setmovieRated(data2.results)
      // const reponse = await fetch(url1,options)
      // // chuyển sang dạng json lưu vô data
      // const data = await reponse.json();
      // console.log(data)
      // setMovie(data.results)
    }

    fechMovie()
  }, [])
  return (
    <>
      <div className="bg-black pb-10">
        <Headers onSearch={handleSearch} />
        <Banner />
        {movieSearch.length > 0 ? <MovieSearch title={"kết quả tìm kiếm"} data={movieSearch}> </MovieSearch> : (
          <>
            {/* props cha */}
            <MovieList title={"phim hot"} data={movie} />
            <MovieList title={"phim đề cử"} data={movieRated} />
          </>
        )}
      </div>
    </>
  )
}

export default App
