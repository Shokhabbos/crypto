import React, { useState, useEffect } from "react";
import { SearchBar, CryptoList } from "./components";
import axios from "axios";

const App = () => {
  const [followedCryptos, setFollowedCryptos] = useState(["DOGE"]);
  const [cryptoData, setCryptoData] = useState({});
  const [error, setError] = useState(null);

  const fetchCryptoData = async (crypto) => {
    try {
      const response = await axios.get(
        `https://min-api.cryptocompare.com/data/price?fsym=${crypto}&tsyms=USD&api_key=9213cb766fb502ad31d61e2996dc321513611ba5664b4b51c364be7db764e9c9`
      );
      return response.data;
    } catch (error) {
      setError("Error fetching data");
      return null;
    }
  };

  const addCrypto = async (crypto) => {
    const data = await fetchCryptoData(crypto);
    if (data) {
      if (!followedCryptos.includes(crypto)) {
        setFollowedCryptos([...followedCryptos, crypto]);
        setCryptoData({ ...cryptoData, [crypto]: data.USD });
      }
    }
  };

  const deleteCrypto = (crypto) => {
    const updatedCryptos = followedCryptos.filter((item) => item !== crypto);
    setFollowedCryptos(updatedCryptos);
    const updatedData = { ...cryptoData };
    delete updatedData[crypto];
    setCryptoData(updatedData);
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchCryptoData("DOGE");
      if (data) {
        setCryptoData({ DOGE: data.USD });
      }
    };
    fetchData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <SearchBar addCrypto={addCrypto} />
      {error && <p>{error}</p>}
      <CryptoList
        followedCryptos={followedCryptos}
        cryptoData={cryptoData}
        deleteCrypto={deleteCrypto}
      />
    </div>
  );
};

export default App;
