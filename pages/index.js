import { useState, useEffect } from 'react';
import Link from 'next/link';
//import styles from '../styles/Home.module.css';

export default function Home() {
  const [pokemon, setPokemon] = useState([]);
  const [pokemonName, setPokemonName] = useState([]);
  const [pokemonId, setPokemonId] = useState([]);

  const zeroPadding = (num, len) => {
    // 指定した数値の前に指定した桁数分0を追加したあと、後ろから0桁を返す
    return (Array(len).join('0') + num).slice(-len);
  };

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon/?limit=150')
      .then((res) => res.json())
      .then((data) => {
        setPokemon(data.results);
        setPokemonName(data.results.map((pokemon) => pokemon.name));
        setPokemonId(data.results.map((pokemon) => pokemon.url.split('/')[6]));
        console.log(data.results);
      });
  }, []);

  return (
    <main title='NextJS PokeDex'>
      <div className={'grid grid-cols-3 gap-4 mt-20 mr-80 ml-80'}>
        {pokemon.map((pokemon, index) => {
          const paddedId = zeroPadding(index + 1, 3);
          return (
            <a key={index}>
              <Link href={`/pokemon/${pokemonId[index]}`}>
                <a className='border-b-1 py-2 border-grey my-0 hover:shadow-md capitalize flex items-center text-xl bg-gray-100 shadow-lg'>
                  {/* <span className='text-sm'>{zeroPadding(index + 1, 3)}</span> */}
                  <span className='mr-2'>{paddedId}</span>
                  <img
                    src={`https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${paddedId}.png`}
                    alt={pokemon.name}
                    className='w-10 h-10 mr-2 font-bold'
                  />
                  <span className='font-bold'>{pokemonName[index]}</span>
                </a>
              </Link>
            </a>
          );
        })}
      </div>
    </main>
  );
}
