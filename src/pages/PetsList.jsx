import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { pets as petsApi } from "../api";
import Loading from "../components/Loading";
import Toast from "../components/Toast";

export default function PetsList() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await petsApi.list();
      setPets(data || []);
    } catch (err) {
      setToast(err.message || "Erro ao carregar pets");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Meus Pets
        </h1>
        <Link
          to="/pets/add"
          className="py-2 px-4 bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white rounded-lg font-medium transition-colors shadow-sm"
        >
          Cadastrar Pet
        </Link>
      </div>
      {loading ? (
        <Loading />
      ) : (
        <div className="space-y-4">
          {pets.length === 0 && (
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
              <div className="text-6xl mb-4">🐾</div>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Nenhum pet cadastrado ainda.
              </p>
              <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
                Clique em "Cadastrar Pet" para adicionar seu primeiro amiguinho!
              </p>
            </div>
          )}
          {pets.map((p) => (
            <div
              key={p.id}
              className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 flex items-center justify-between transition-all duration-300 group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  🐾
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                    {p.name}
                    <span className="text-sm text-gray-500 dark:text-gray-400 font-normal ml-2">
                      ({p.species})
                    </span>
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {p.breed} • {p.age} anos
                  </p>
                </div>
              </div>
              <Link
                to={`/pets/${p.id}`}
                className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium flex items-center gap-1 transition-colors"
              >
                Ver detalhes
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
              <button
                onClick={async () => {
                  if (
                    window.confirm(`Tem certeza que deseja remover ${p.name}?`)
                  ) {
                    try {
                      await petsApi.delete(p.id); // Chama a API para remover
                      setPets((prev) => prev.filter((pet) => pet.id !== p.id)); // Atualiza a lista local
                      setToast(`Pet ${p.name} removido com sucesso!`);
                    } catch (err) {
                      setToast(err.message || "Erro ao remover pet");
                    }
                  }
                }}
                className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white px-3 py-1 rounded-lg font-medium transition-colors"
              >
                Remover
              </button>
            </div>
          ))}
        </div>
      )}
      <Toast message={toast} onClose={() => setToast(null)} />
    </div>
  );
}
