import { Feather } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex h-screen">
      {/* Lado esquerdo */}
      <div className="w-1/2 bg-[#CFFAFE] flex flex-col justify-center items-center p-10">
        <div className="flex items-center text-orange-500 text-3xl font-bold mb-8">
          <Feather className="w-8 h-8 mr-2" />
          Nublia
        </div>
        <h1 className="text-5xl font-semibold text-center text-orange-500 leading-tight">
          Bem vindo(a)<br />à Nublia
        </h1>
        <p className="text-sm text-gray-700 mt-4">se conecte com quem se cuida.</p>
      </div>

      {/* Lado direito */}
      <div className="w-1/2 bg-gradient-to-br from-purple-400 to-indigo-600 text-white flex flex-col justify-between p-10">
        <div className="flex justify-end">
          <p className="mr-2">Novo no Nublia?</p>
          <button className="border border-white px-4 py-1 rounded hover:bg-white hover:text-indigo-600 transition">
            Criar conta
          </button>
        </div>

        <div className="flex flex-col items-center justify-center flex-grow">
          <h2 className="text-3xl font-semibold mb-6">Entrar na Nublia</h2>
          <form className="w-full max-w-sm">
            <input
              type="email"
              placeholder="Digite seu e-mail"
              className="w-full px-4 py-2 rounded bg-white text-black mb-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded transition"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
