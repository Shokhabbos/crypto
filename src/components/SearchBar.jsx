import React, { useState } from "react";

const SearchBar = ({ addCrypto }) => {
  const [inputValue, setInputValue] = useState("");

  const handleSearch = () => {
    if (inputValue.trim() !== "") {
      addCrypto(inputValue.toUpperCase());
    }
    setInputValue("");
  };

  return (
    <div className="mb-4  w-[500px] block mx-auto  ">
      <input
        className="border border-gray-300 px-3 py-2 mr-2 w-[400px]"
        type="text"
        placeholder="Enter cryptocurrency"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleSearch}
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
