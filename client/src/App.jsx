import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";

const App = () => {
  const API_BASE_URL = "http://localhost:8000/";
  
  const [parcelas, setParcelas] = useState([]);
  
  const [formData, setFormData] = useState({
    nombreParcela: "",
    latitud: "",
    longitud: "",
    UltimoRiego: "",
    UltimaFertilizacion: "",
  });

  const endpoints = {
    parcelas: `${API_BASE_URL}parcelas`,
  };

  const MENSAJES_ERROR = {
    RESPUESTA_NO_SATISFACTORIA: "La respuesta de la red no fue satisfactoria",
  };

  const ApiService = {
    getTodasLasParcelas: async () => {
      try {
        const respuesta = await fetch(endpoints.parcelas);
        if (!respuesta.ok) {
          throw new Error(MENSAJES_ERROR.RESPUESTA_NO_SATISFACTORIA);
        }
        return await respuesta.json();
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    },
    agregarParcela: async (parcela) => {
      try {
        const respuesta = await fetch(endpoints.parcelas, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(parcela),
        });
        if (!respuesta.ok) {
          throw new Error(MENSAJES_ERROR.RESPUESTA_NO_SATISFACTORIA);
        }
        return await respuesta.json();
      } catch (error) {
        console.error("Error al agregar la parcela:", error);
      }
    },
  };

  useEffect(() => {
    const fetchParcelas = async () => {
      try {
        const data = await ApiService.getTodasLasParcelas();
        setParcelas(data);
      } catch (error) {
        console.error("Error al obtener las parcelas:", error);
      }
    };

    fetchParcelas();
  }, []);

  const handle = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddParcel = async (e) => {
    e.preventDefault();
    const nuevaParcela = {
      nombreParcela: formData.nombreParcela,
      localizacion: [formData.latitud, formData.longitud],
      UltimoRiego: formData.UltimoRiego,
      UltimaFertilizacion: formData.UltimaFertilizacion,
    };

    await ApiService.agregarParcela(nuevaParcela);

    setParcelas([...parcelas, nuevaParcela]);

    setFormData({
      nombreParcela: "",
      latitud: "",
      longitud: "",
      UltimoRiego: "",
      UltimaFertilizacion: "",
    });
  };

  return (
    <div className="flex flex-col items-center bg-gray-100 min-h-screen">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden my-4">
        <div className="p-4">
          <h2 className="text-xl font-bold text-gray-800">Mapa de Parcelas</h2>
          <MapContainer
            center={[3.43722, -76.5225]}
            zoom={12}
            style={{ height: "50vh", width: "100%" }}
          >
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution='&copy; <a href="https://www.esri.com/">Esri</a> &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community'
            />

            {parcelas.map((item, index) => (
              <Marker key={index} position={item.localizacion}>
                <Popup>
                  <strong>{item.nombreParcela}</strong>
                  <br />
                  <span>Último riego: {item.UltimoRiego}</span>
                  <br />
                  <span>Última fertilización: {item.UltimaFertilizacion}</span>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Agregar Nueva Parcela</h2>
        <form onSubmit={handleAddParcel} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre de la Parcela</label>
            <input
              type="text"
              name="nombreParcela"
              value={formData.nombreParcela}
              onChange={handle}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ejemplo: Parcela 1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Ubicación Latitud</label>
            <input
              type="text"
              name="latitud"
              value={formData.latitud}
              onChange={handle}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ejemplo: 40.7128"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Ubicación Longitud</label>
            <input
              type="text"
              name="longitud"
              value={formData.longitud}
              onChange={handle}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ejemplo: -74.0060"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Última Fecha de Riego</label>
            <input
              type="date"
              name="UltimoRiego"
              value={formData.UltimoRiego}
              onChange={handle}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Última Fecha de Fertilización</label>
            <input
              type="date"
              name="UltimaFertilizacion"
              value={formData.UltimaFertilizacion}
              onChange={handle}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Agregar Parcela
            </button>
          </div>
        </form>
      </div>

      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-4 mt-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Listado de Parcelas</h2>
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Nombre</th>
              <th className="px-4 py-2 border-b">Último Riego</th>
              <th className="px-4 py-2 border-b">Última Fertilización</th>
            </tr>
          </thead>
          <tbody>
            {parcelas.map((item, index) => (
              <tr key={index}>
                <td className="px-4 py-2 border-b">{item.nombreParcela}</td>
                <td className="px-4 py-2 border-b">{item.UltimoRiego}</td>
                <td className="px-4 py-2 border-b">{item.UltimaFertilizacion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;
