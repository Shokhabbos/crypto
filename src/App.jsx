import React, { useState, useEffect } from "react";
import axios from "axios";
import { CryptoList, SearchBar } from "./components";
import { API_URL, API_KEY } from "./constants";

const App = () => {
  const [followedCryptos, setFollowedCryptos] = useState(["DOGE"]);
  const [cryptoData, setCryptoData] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData("DOGE");
    const updateInterval = setInterval(updateCryptoData, 5000);

    return () => {
      clearInterval(updateInterval);
    };
  }, []);

  const fetchCryptoData = async (crypto) => {
    try {
      const response = await axios.get(
        `${API_URL}?fsym=${crypto}&tsyms=USD&api_key=${API_KEY}`
      );
      return response.data;
    } catch (error) {
      setError("Error fetching data");
      return null;
    }
  };

  const updateCryptoData = async () => {
    const promises = followedCryptos.map((crypto) => fetchCryptoData(crypto));
    const cryptoDataArray = await Promise.all(promises);

    setCryptoData((prevCryptoData) => {
      const updatedCryptoData = { ...prevCryptoData };

      cryptoDataArray.forEach((cryptoData, index) => {
        updatedCryptoData[followedCryptos[index]] =
          cryptoData?.USD || "Data Unavailable";
      });

      return updatedCryptoData;
    });
  };

  const addCrypto = async (crypto) => {
    if (followedCryptos.includes(crypto)) {
      const valueInUSD = cryptoData[crypto]
        ? `$${cryptoData[crypto]}`
        : "Data Unavailable";
      const message = `${crypto} is already being followed. Value: ${valueInUSD}`;
      alert(message);
      return;
    }

    const data = await fetchCryptoData(crypto);

    if (data) {
      const updatedCryptoData = { ...cryptoData, [crypto]: data.USD };
      const updatedFollowedCryptos = [...followedCryptos, crypto];

      setFollowedCryptos(updatedFollowedCryptos);
      setCryptoData(updatedCryptoData);

      if (followedCryptos.length === 0) {
        setInterval(updateCryptoData, 5000);
      }
    }
  };

  const deleteCrypto = (crypto) => {
    const updatedCryptos = followedCryptos.filter((item) => item !== crypto);
    const updatedData = { ...cryptoData };
    delete updatedData[crypto];
    setFollowedCryptos(updatedCryptos);
    setCryptoData(updatedData);
  };

  const fetchData = async (crypto) => {
    const data = await fetchCryptoData(crypto);
    if (data) {
      setCryptoData({ DOGE: data.USD });
    }
  };

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
