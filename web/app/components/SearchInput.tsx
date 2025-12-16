"use client"; // Precisa ser client porque usa interação do usuário

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchInput() {
  const [term, setTerm] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault(); // Evita recarregar a página
    if (term.trim()) {
      router.push(`/busca?q=${encodeURIComponent(term)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl relative group">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <Search className="h-6 w-6 text-gray-800" strokeWidth={2} />
      </div>
      <input
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        className="block w-full p-5 pl-14 text-sm md:text-base text-gray-900 border border-gray-300 rounded-full bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all shadow-lg hover:shadow-xl placeholder-gray-500 uppercase tracking-wide"
        placeholder="Digite o nome da música..."
      />
    </form>
  );
}