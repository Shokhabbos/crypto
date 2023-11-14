import React from "react";

class CryptoList extends React.Component {
  render() {
    const { followedCryptos, cryptoData, deleteCrypto } = this.props;

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
          {followedCryptos.map((crypto, index) => (
            <tr key={index} className="text-gray-700">
              <td className="border border-gray-300 py-2 px-4 text-center">
                {crypto}
              </td>
              <td className="border border-gray-300 py-2 px-4 text-center">
                {cryptoData[crypto]
                  ? `$${cryptoData[crypto]}`
                  : "Data Unavailable"}
              </td>
              <td className="border border-gray-300 py-2 px-4 flex justify-center">
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => deleteCrypto(crypto)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {followedCryptos.length === 0 && (
            <tr>
              <td
                colSpan="3"
                className="border border-gray-300 py-2 px-4 text-center"
              >
                No cryptocurrencies to display
              </td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }
}

export default CryptoList;
