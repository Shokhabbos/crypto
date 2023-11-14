import React, { Component } from "react";

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: "",
    };
  }

  handleSearch = () => {
    const { addCrypto } = this.props;
    const { inputValue } = this.state;

    if (inputValue.trim() !== "") {
      addCrypto(inputValue.toUpperCase());
    }
    this.setState({ inputValue: "" });
  };

  render() {
    const { inputValue } = this.state;

    return (
      <div className="mb-4 w-[500px] block mx-auto">
        <input
          className="border border-gray-300 px-3 py-2 mr-2 w-[400px]"
          type="text"
          placeholder="Enter cryptocurrency"
          value={inputValue}
          onChange={(e) => this.setState({ inputValue: e.target.value })}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={this.handleSearch}
        >
          Search
        </button>
      </div>
    );
  }
}

export default SearchBar;
