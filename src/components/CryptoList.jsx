import React, { Component } from "react";

class CryptoList extends Component {
  state = {
    changeValues: {},
    previousValues: {},
  };

  componentDidUpdate(prevProps) {
    if (this.props.cryptoData !== prevProps.cryptoData) {
      this.highlightChanges();
    }
  }

  highlightChanges = () => {
    const { cryptoData } = this.props;
    const { previousValues } = this.state;

    const updatedChangeValues = {};
    const updatedPreviousValues = {};

    Object.keys(cryptoData).forEach((crypto) => {
      const currentValue = cryptoData[crypto] || 0;
      const previousValue = previousValues[crypto] || 0;

      const change = currentValue - previousValue;

      if (change !== 0) {
        updatedChangeValues[crypto] = change;
        updatedPreviousValues[crypto] = currentValue;
      }
    });

    if (Object.keys(updatedChangeValues).length > 0) {
      this.setState({
        changeValues: { ...this.state.changeValues, ...updatedChangeValues },
        previousValues: {
          ...this.state.previousValues,
          ...updatedPreviousValues,
        },
      });

      Object.keys(updatedChangeValues).forEach((crypto) => {
        setTimeout(() => {
          this.resetChange(crypto);
        }, 1000);
      });
    }
  };

  resetChange = (crypto) => {
    this.setState((prevState) => ({
      changeValues: {
        ...prevState.changeValues,
        [crypto]: 0,
      },
    }));
  };

  render() {
    const { followedCryptos, cryptoData, deleteCrypto } = this.props;
    const { changeValues } = this.state;

    return (
      <table className="min-w-full bg-white border-collapse overflow-hidden">
        <thead className="bg-gray-100 text-gray-800">
          <tr>
            <th className="border border-gray-300 py-2 px-4 text-center">
              Cryptocurrency
            </th>
            <th className="border border-gray-300 py-2 px-4 text-center">
              Value (USD)
            </th>
            <th className="border border-gray-300 py-2 px-4 text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {followedCryptos.length === 0 ? (
            <tr>
              <td
                className="border border-gray-300 py-2 px-4 text-center"
                colSpan="3"
              >
                No cryptocurrencies being followed.
              </td>
            </tr>
          ) : (
            followedCryptos.map((crypto, index) => (
              <tr
                key={index}
                className={`text-gray-700 ${
                  changeValues[crypto] > 0
                    ? "text-green-500"
                    : changeValues[crypto] < 0
                    ? "text-red-500"
                    : ""
                }`}
              >
                <td className="border border-gray-300 py-2 px-4 text-center">
                  {crypto}
                </td>
                <td className="border border-gray-300 py-2 px-4 text-center">
                  {cryptoData[crypto]
                    ? `$${cryptoData[crypto]}`
                    : "Data Unavailable"}
                </td>
                <td className="border border-gray-300 py-2 px-4 text-center">
                  <button
                    className="order px-4 py-2 bg-red-500 rounded font-normal text-white"
                    onClick={() => deleteCrypto(crypto)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    );
  }
}

export default CryptoList;
