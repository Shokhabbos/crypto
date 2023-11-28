import React, { Component } from "react";
import axios from "axios";
import { CryptoList, SearchBar } from "./components";
import { API_URL, API_KEY } from "./constants";

class App extends Component {
  state = {
    followedCryptos: ["DOGE"],
    cryptoData: {},
    error: null,
  };

  componentDidMount() {
    this.fetchData("DOGE");
    this.updateInterval = setInterval(this.updateCryptoData, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.updateInterval);
  }

  fetchCryptoData = async (crypto) => {
    try {
      const response = await axios.get(
        `${API_URL}?fsym=${crypto}&tsyms=USD&api_key=${API_KEY}`
      );
      return response.data;
    } catch (error) {
      this.setState({ error: "Error fetching data" });
      return null;
    }
  };

  updateCryptoData = async () => {
    const { followedCryptos, cryptoData } = this.state;

    const cryptoDataPromises = followedCryptos.map((crypto) =>
      this.fetchCryptoData(crypto)
    );
    const cryptoDataArray = await Promise.all(cryptoDataPromises);
    const updatedCryptoData = cryptoDataArray.reduce((acc, curr, index) => {
      acc[followedCryptos[index]] = curr.USD;
      return acc;
    }, {});

    this.setState({ cryptoData: updatedCryptoData });
  };

  addCrypto = async (crypto) => {
    const { followedCryptos, cryptoData } = this.state;

    if (followedCryptos.includes(crypto)) {
      const valueInUSD = cryptoData[crypto]
        ? `$${cryptoData[crypto]}`
        : "Data Unavailable";
      const message = `${crypto} is already being followed. Value: ${valueInUSD}`;
      alert(message);
      return;
    }

    const data = await this.fetchCryptoData(crypto);

    if (data) {
      const updatedCryptoData = { ...cryptoData, [crypto]: data.USD };
      const updatedFollowedCryptos = [...followedCryptos, crypto];

      this.setState(
        {
          followedCryptos: updatedFollowedCryptos,
          cryptoData: updatedCryptoData,
        },
        () => {
          if (followedCryptos.length === 0) {
            this.updateInterval = setInterval(this.updateCryptoData, 5000);
          }
        }
      );
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
