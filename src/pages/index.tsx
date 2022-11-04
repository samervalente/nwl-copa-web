import Image from "next/image";
import logo from "../assets/logo.svg";
import appMockup from "../assets/app-mockup.png";
import avatars from "../assets/avatars-example.png";
import iconCheck from "../assets/icon-check.svg";
import { api } from "../api/axios";
import { FormEvent, useState } from "react";

interface HomeProps {
  poolsCount: number;
  guessesCount: number;
  usersCount: number;
}

export default function Home(props: HomeProps) {
  const [poolTitle, setPoolTItle] = useState("");
  async function createPool(event: FormEvent) {
    event.preventDefault();
    try {
      const body = { title: poolTitle };
      const response = await api.post("/pools", body);
      const { code } = response.data;

      await navigator.clipboard.writeText(code);
      setPoolTItle('')
      alert(
        `Bolão criado com sucesso! Seu código é ${code} e foi copiado para a área de transferência.`
      );

      

    } catch (error) {
      alert("Não foi possível criar o bolão. Tente novamente.");
    }
  }

  return (
    <>
      <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center">
        <main>
          <Image src={logo} alt="nlw-copa logo" />
          <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
            Crie seu próprio bolão da copa e compartilhe entre amigos!
          </h1>
          <div className="mt-10 flex items-center gap-2">
            <Image src={avatars} alt="avatars example" />
            <strong className="text-gray-100 text-xl">
              <span className="text-ignite-500">+{props.usersCount}</span>{" "}
              pessoas já estão usando
            </strong>
          </div>
          <form onSubmit={createPool} className="mt-10 flex gap-2">
            <input
              className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100"
              type="text"
              required
              placeholder="Qual nome do seu bolão?"
              onChange={(e) => setPoolTItle(e.target.value)}
              value={poolTitle}
            />
            <button
              className="bg-yellow-500  px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700"
              type="submit"
            >
              Criar meu bolão
            </button>
          </form>
          <p className="mt-4 text-sm text-gray-300 leading-relaxed">
            Após criar seu bolão, você receberá um código único que poderá usar
            para convidar outras pessoas 🚀
          </p>
          <div className="mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100">
            <div className="flex items-center gap-6">
              <Image src={iconCheck} alt="" />
              <div className="flex flex-col">
                <span className="font-boldk text-2xl">+{props.poolsCount}</span>
                <span>Bolões criados</span>
              </div>
            </div>
            <div className="w-px h-14 bg-gray-600" />
            <div className="flex items-center gap-6">
              <Image src={iconCheck} alt="" />
              <div className="flex flex-col">
                <span className="font-boldk text-2xl">
                  +{props.guessesCount}
                </span>
                <span>Palpites enviados</span>
              </div>
            </div>
          </div>
        </main>
        <Image src={appMockup} alt="App mockup" quality={100} />
      </div>
    </>
  );
}

export const getStaticProps = async () => {
  const [poolsCountResponse, guessesCountResponse, usersCountResponse] =
    await Promise.all([
      api.get("pools/count"),
      api.get("guesses/count"),
      api.get("users/count"),
    ]);

  if (!poolsCountResponse || !guessesCountResponse || !usersCountResponse) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      poolsCount: poolsCountResponse.data.count,
      guessesCount: guessesCountResponse.data.count,
      usersCount: usersCountResponse.data.count,
    },
  };
};
