import { gql } from '@apollo/client';
import client from '../../apollo-client';
import Head from 'next/head';
//import styles from '../../styles/Pokemon.module.css';
import Link from 'next/link';

export default function Pokemon({ pokemon, sprite }) {
  console.log(pokemon, sprite);
  const zeroPadding = (num, len) => {
    // 指定した数値の前に指定した桁数分0を追加したあと、後ろから0桁を返す
    return (Array(len).join('0') + num).slice(-len);
  };
  return (
    <>
      <Head>
        <title>{pokemon.name}</title>
      </Head>

      <main className='container mx-auto px-4 max-w-3xl mt-20 pt-8'>
        <section
          // aspect-squareで縦横比を1:1に固定
          // 正方形のサイズはmargin(mx-20)で調整する
          className='flex flex-col items-center justify-center aspect-square shadow-lg mx-20'
        >
          <h1 className='ml-2 font-light'>
            No.{zeroPadding(pokemon.id + 1, 3)}
          </h1>
          <img className={'w-56 h-56'} src={sprite} alt={pokemon.name} />
          <h2 className='text-2xl mt-6 mb-2 font-bold text-left'>
            {pokemon.name}
          </h2>
          <div>
            {pokemon.pokemon_v2_pokemontypes.map((type) => {
              return (
                <a
                  className='mr-2 font-light text-left'
                  key={type.pokemon_v2_type.name}
                >
                  {type.pokemon_v2_type.name}
                </a>
              );
            })}
          </div>
        </section>
        <p className='mt-10 text-center'>
          <Link href='/'>
            <a>
              <button className='focus:outline-none text-white text-sm py-2.5 px-2 rounded-md bg-blue-500 hover:bg-blue-700 hover:shadow-lg'>
                一覧に戻る
              </button>
            </a>
          </Link>
        </p>
      </main>
    </>
  );
}
//getServerSidePropsを利用してデータを取得しページに表示させる
export async function getServerSideProps({ params }) {
  const pokemonSprite = await fetch(
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${params.id}.png`
  );
  const sprite = pokemonSprite.url;
  //Appllo のデータ呼び出す
  const { data } = await client.query({
    query: gql`
      query GetPokemon {
        pokemon_v2_pokemon(where: {id: {_eq: ${params.id}}}) {
          id
          name
          pokemon_v2_pokemonstats {
            base_stat
            pokemon_v2_stat {
              name
            }
          }
          pokemon_v2_pokemontypes {
            pokemon_v2_type {
              name
            }
          }
        }
      }
    `,
  });

  return {
    props: {
      pokemon: data.pokemon_v2_pokemon[0],
      sprite,
    },
  };
}
