import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg'
import './App.css'
import Headers from './components/Header'
import Banner from './components/Banner'
import MovieList from './components/MovieList';
import MovieSearch from './components/MovieSearch';
function App() {
  //movie: Đây là biến trạng thái (state variable). Nó sẽ lưu trữ dữ liệu cho danh sách các bộ phim phổ biến. 
  //Ban đầu, nó là một mảng rỗng [] như được định nghĩa bởi useState([]).
  //setMovie: Đây là hàm thiết lập (setter function). Bạn gọi hàm này để cập nhật trạng thái movie. Khi bạn gọi setMovie với dữ liệu mới, 
  // React sẽ biết để re-render component với giá trị movie đã được cập nhật.
  const [movie, setMovie] = useState([])
  //movieRated: Biến trạng thái này sẽ lưu trữ danh sách các bộ phim được đánh giá cao nhất.
  //setmovieRated: Đây là hàm thiết lập để cập nhật trạng thái movieRated.
  const [movieRated, setmovieRated] = useState([])
  //movieSearch: Biến trạng thái này được dùng để lưu trữ kết quả của việc tìm kiếm phim.
  //setMovieSearch: Đây là hàm thiết lập để cập nhật trạng thái movieSearch.
  const [movieSearch, setMovieSearch] = useState([])
  //setMovieSearch([]): Khi một tìm kiếm mới bắt đầu, dòng này sẽ xóa sạch (reset) mảng movieSearch (kết quả tìm kiếm trước đó). 
  // Điều này đảm bảo rằng khi người dùng gõ tìm kiếm mới, họ không thấy kết quả từ lần tìm kiếm trước.
  const handleSearch = async (searchVal) => {
    setMovieSearch([])
    try {
      //const url = ...: Dòng này tạo ra URL API cho yêu cầu tìm kiếm. Nó sử dụng giá trị searchVal (chuỗi người dùng nhập vào để tìm kiếm),
      //  đặt include_adult=false (không bao gồm phim người lớn), language=vi (kết quả bằng tiếng Việt), và page=1.
      const url = `https://api.themoviedb.org/3/search/movie?query=${searchVal}&include_adult=false&language=vi&page=1`;
      // Đối tượng này định nghĩa các tùy chọn cho yêu cầu HTTP fetch.
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          //Bearer ${import.meta.env.VITE_API_KEY}` : Đây là phần quan trọng để xác thực với API của The Movie Database (TMDB).
          //  Nó sử dụng khóa API của bạn (được lưu trữ trong biến môi trường VITE_API_KEY) để chứng minh bạn có quyền truy cập dữ liệu.
          Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`
        }
      };
      //Dòng này thực hiện một yêu cầu HTTP GET đến URL API đã tạo. await có nghĩa là mã sẽ đợi cho đến khi yêu cầu này hoàn thành và nhận được phản hồi.
      const searchMovie = await fetch(url, options)
      // Sau khi nhận được phản hồi, dòng này chuyển đổi phản hồi từ định dạng JSON sang một đối tượng JavaScript. 
      // await ở đây cũng đảm bảo rằng việc chuyển đổi này hoàn tất trước khi mã tiếp tục.
      const data = await searchMovie.json();
      // Khi dữ liệu đã được phân tích cú pháp, dòng này cập nhật trạng thái movieSearch 
      // với mảng các kết quả phim được tìm thấy (thường nằm trong thuộc tính results của phản hồi API). 
      // Việc cập nhật trạng thái này sẽ khiến component App re-render và hiển thị các kết quả tìm kiếm.
      setMovieSearch(data.results)
    } catch (error) {
      console.log(error)
    }
  }
  //là một React Hook cho phép bạn thực hiện các side effects (tác dụng phụ) trong các functional component. 
  // Trong trường hợp này, side effect là việc gọi API để lấy dữ liệu phim ban đầu.
  useEffect(() => {
    const fechMovie = async () => {
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`
        }
      };

      // URL API để lấy danh sách các phim phổ biến.
      const url1 = 'https://api.themoviedb.org/3/movie/popular?language=vi&page=1';
      //: URL API để lấy danh sách các phim được đánh giá cao nhất.
      const url2 = 'https://api.themoviedb.org/3/movie/top_rated?language=vi&page=1';

      //Đây là một kỹ thuật rất hiệu quả để gửi nhiều yêu cầu HTTP song song. Promise.all nhận một mảng các Promise (trong trường hợp này là các cuộc gọi fetch) 
      // và đợi cho đến khi tất cả chúng đều hoàn thành. 
      // Sau đó, nó trả về một mảng chứa kết quả của từng Promise theo thứ tự.
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
