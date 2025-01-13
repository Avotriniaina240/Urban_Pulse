const InputToolbar = ({ locationsInput, setLocationsInput, fetchData, loading }) => {
    return (
      <div className="flex flex-col sm:flex-row gap-4 w-[50%]">
        <input
          type="text"
          value={locationsInput}
          onChange={(e) => setLocationsInput(e.target.value)}
          placeholder="Entrez une ville..."
          className="rounded-lg"
        />
        <button
          onClick={fetchData}
          disabled={loading}
          className="px-6 py-2 bg-gradient-to-r from-[#9fdc23] to-[#00b8e4] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          Rechercher
        </button>
      </div>
    );
  };
  
  export default InputToolbar;