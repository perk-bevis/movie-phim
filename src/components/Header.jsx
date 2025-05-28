import PropTypes from "prop-types";
import { useState } from "react";
const Header = ({onSearch}) => {
    const [textSearch,setSearch] = useState('');
    return <div className="p-4 bg-black flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <h1 className="text-[30px] uppercase font-bold text-red-600">Movie</h1>
                <nav className="flex items-center space-x-4">
                    <a href="#" className="text-white">Home</a>
                    <a href="#" className="text-white">about</a>
                    <a href="#" className="text-white">contact</a>
                </nav>
            </div>
            <div className="flex items-center space-x-4">
                <input type="text" placeholder="Search" className="p-3 bg-white text-black placeholder-black rounded" 
                onChange = {(e) => setSearch(e.target.value)}  value={textSearch}/>
                <button className="p-2 bg-red-600 text-white" onClick={() => onSearch(textSearch)}>Search</button>
            </div>
        </div>
}

Header.propTypes = {
  // lấy props là title chuyển sang string
  onSearch: PropTypes.func,
};

export default Header