import React, { Component } from "react";
import axios from "axios";
import SearchBar from "./components/SearchBar";
import CryptoList from "./components/CryptoList";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      followedCryptos: ["DOGE"],
      cryptoData: {},
      error: null,
    };
  }

  componentDidMount() {
    this.fetchData("DOGE");
  }

  fetchCryptoData = async (crypto) => {
    try {
      const response = await axios.get(
        `https://min-api.cryptocompare.com/data/price?fsym=${crypto}&tsyms=USD&api_key=9213cb766fb502ad31d61e2996dc321513611ba5664b4b51c364be7db764e9c9`
      );
      return response.data;
    } catch (error) {
      this.setState({ error: "Error fetching data" });
      return null;
    }
  };

  addCrypto = async (crypto) => {
    const { followedCryptos, cryptoData } = this.state;
    const data = await this.fetchCryptoData(crypto);

    if (data) {
      if (!followedCryptos.includes(crypto)) {
        this.setState({
          followedCryptos: [...followedCryptos, crypto],
          cryptoData: { ...cryptoData, [crypto]: data.USD },
        });
      }
    }
  };

  deleteCrypto = (crypto) => {
    const { followedCryptos, cryptoData } = this.state;
    const updatedCryptos = followedCryptos.filter((item) => item !== crypto);
    const updatedData = { ...cryptoData };
    delete updatedData[crypto];
    this.setState({ followedCryptos: updatedCryptos, cryptoData: updatedData });
  };

  fetchData = async (crypto) => {
    const data = await this.fetchCryptoData(crypto);
    if (data) {
      this.setState({ cryptoData: { DOGE: data.USD } });
    }
  };

  render() {
    const { followedCryptos, cryptoData, error } = this.state;

    return (
      <div className="container mx-auto px-4 py-8">
        <SearchBar addCrypto={this.addCrypto} />
        {error && <p>{error}</p>}
        <CryptoList
          followedCryptos={followedCryptos}
          cryptoData={cryptoData}
          deleteCrypto={this.deleteCrypto}
        />
      </div>
    );
  }
}

export default App;
