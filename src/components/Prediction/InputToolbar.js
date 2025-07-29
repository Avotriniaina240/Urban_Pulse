const InputToolbar = ({ locationsInput, setLocationsInput, fetchData, loading }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 w-[50%]">
      <input
        type="text"
        value={locationsInput}
        onChange={(e) => setLocationsInput(e.target.value)}
        placeholder="Entrez une ville..."
        className="flex-1 px-4 py-3 rounded-lg border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
      />
      <button
        onClick={fetchData}
        disabled={loading}
        className="px-8 py-3 bg-gradient-to-r from-[#9fdc23] to-[#00b8e4] text-white font-medium rounded-lg hover:opacity-90 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:transform-none disabled:shadow-none min-w-[120px] flex items-center justify-center"
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Recherche...</span>
          </div>
        ) : (
          'Rechercher'
        )}
      </button>
    </div>
  );
};

export default InputToolbar;