import React, { useEffect, useState, useRef } from "react";
import useFetchData from "./useFetchData";
import { API_KEY, API_URL } from "../constants";

const useCryptoData = (followedCryptos) => {
  const [cryptoData, setCryptoData] = useState({});
  const [rateChanges, setRateChanges] = useState({});
  const [fetchTrigger, setFetchTrigger] = useState(false);

  const prevCryptoData = useRef({});

  const url = `${API_URL}?fsyms=${followedCryptos.join(
    ","
  )}&tsyms=USD&api_key=${API_KEY}`;
  const { data, fetchData } = useFetchData(url);

  useEffect(() => {
    if (data) {
      setCryptoData(data);
    }
  }, [data]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFetchTrigger(true);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (fetchTrigger) {
      fetchData();
      setFetchTrigger(false);
    }
  }, [fetchTrigger, fetchData]);

  useEffect(() => {
    if (Object.keys(cryptoData).length > 0) {
      const changes = {};
      Object.keys(cryptoData).forEach((crypto) => {
        if (
          prevCryptoData.current[crypto] !== undefined &&
          prevCryptoData.current[crypto] !== cryptoData[crypto]
        ) {
          changes[crypto] =
            prevCryptoData.current[crypto] < cryptoData[crypto] ? "up" : "down";
        }
      });
      setRateChanges(changes);
      prevCryptoData.current = { ...cryptoData };
    }
  }, [cryptoData]);

  return { cryptoData, rateChanges };
};

export default useCryptoData;
