import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { 
  Pokemon, 
  PokemonListResponse, 
  PokemonListItem, 
  PokemonSpecies 
} from '../models/pokemon.interface';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private apiUrl = 'https://pokeapi.co/api/v2';
  private favoritesSubject = new BehaviorSubject<Pokemon[]>([]);
  public favorites$ = this.favoritesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadFavoritesFromStorage();
  }

  // Buscar lista de Pokémons com paginação
  getPokemonList(limit: number = 20, offset: number = 0): Observable<PokemonListResponse> {
    return this.http.get<PokemonListResponse>(`${this.apiUrl}/pokemon?limit=${limit}&offset=${offset}`);
  }

  // Buscar detalhes de um Pokémon específico
  getPokemonDetails(nameOrId: string | number): Observable<Pokemon> {
    console.log(`Fazendo requisição para: ${this.apiUrl}/pokemon/${nameOrId}`);
    return this.http.get<Pokemon>(`${this.apiUrl}/pokemon/${nameOrId}`);
  }

  // Buscar espécies do Pokémon (para descrição)
  getPokemonSpecies(id: number): Observable<PokemonSpecies> {
    console.log(`Fazendo requisição para: ${this.apiUrl}/pokemon-species/${id}`);
    return this.http.get<PokemonSpecies>(`${this.apiUrl}/pokemon-species/${id}`);
  }

  // Buscar Pokémon com seus detalhes completos
  getPokemonWithDetails(nameOrId: string | number): Observable<{ pokemon: Pokemon; species: PokemonSpecies }> {
    console.log('Iniciando busca de detalhes para:', nameOrId);
    
    return this.getPokemonDetails(nameOrId).pipe(
      switchMap(pokemon => {
        console.log('Pokemon básico carregado:', pokemon.name);
        return this.getPokemonSpecies(pokemon.id).pipe(
          map(species => {
            console.log('Species carregada:', species);
            return {
              pokemon: pokemon,
              species: species
            };
          })
        );
      })
    );
  }

  // Buscar lista de Pokémons com detalhes básicos
  getPokemonListWithDetails(limit: number = 20, offset: number = 0): Observable<Pokemon[]> {
    return this.getPokemonList(limit, offset).pipe(
      switchMap(response => {
        const pokemonRequests = response.results.map(pokemon => 
          this.getPokemonDetails(pokemon.name)
        );
        return forkJoin(pokemonRequests);
      })
    );
  }

  // Buscar Pokémon por nome
  searchPokemon(name: string): Observable<Pokemon> {
    return this.getPokemonDetails(name.toLowerCase());
  }

  getPokemonByName(name: string): Observable<Pokemon> {
    return this.getPokemonDetails(name.toLowerCase());
  }

  // Gerenciamento de favoritos
  addToFavorites(pokemon: Pokemon): void {
    const currentFavorites = this.favoritesSubject.value;
    const isAlreadyFavorite = currentFavorites.find(fav => fav.id === pokemon.id);
    
    if (!isAlreadyFavorite) {
      const updatedFavorites = [...currentFavorites, pokemon];
      this.favoritesSubject.next(updatedFavorites);
      this.saveFavoritesToStorage(updatedFavorites);
      console.log(`${pokemon.name} adicionado aos favoritos!`);
    }
  }

  removeFromFavorites(pokemonId: number): void {
    const currentFavorites = this.favoritesSubject.value;
    const pokemonToRemove = currentFavorites.find(p => p.id === pokemonId);
    const updatedFavorites = currentFavorites.filter(pokemon => pokemon.id !== pokemonId);
    this.favoritesSubject.next(updatedFavorites);
    this.saveFavoritesToStorage(updatedFavorites);
    if (pokemonToRemove) {
      console.log(`${pokemonToRemove.name} removido dos favoritos!`);
    }
  }

  isFavorite(pokemonId: number): boolean {
    return this.favoritesSubject.value.some(pokemon => pokemon.id === pokemonId);
  }

  getFavorites(): Pokemon[] {
    return this.favoritesSubject.value;
  }

  // Persistência dos favoritos
  private saveFavoritesToStorage(favorites: Pokemon[]): void {
    localStorage.setItem('pokemonFavorites', JSON.stringify(favorites));
  }

  private loadFavoritesFromStorage(): void {
    const stored = localStorage.getItem('pokemonFavorites');
    if (stored) {
      try {
        const favorites = JSON.parse(stored);
        this.favoritesSubject.next(favorites);
      } catch (error) {
        console.error('Erro ao carregar favoritos do localStorage:', error);
        this.favoritesSubject.next([]);
      }
    }
  }

  // Utilitários
  getPokemonIdFromUrl(url: string): number {
    const urlParts = url.split('/');
    return parseInt(urlParts[urlParts.length - 2]);
  }

  formatPokemonName(name: string): string {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  getTypeColor(type: string): string {
    const typeColors: { [key: string]: string } = {
      normal: '#A8A878',
      fire: '#F08030',
      water: '#6890F0',
      electric: '#F8D030',
      grass: '#78C850',
      ice: '#98D8D8',
      fighting: '#C03028',
      poison: '#A040A0',
      ground: '#E0C068',
      flying: '#A890F0',
      psychic: '#F85888',
      bug: '#A8B820',
      rock: '#B8A038',
      ghost: '#705898',
      dragon: '#7038F8',
      dark: '#705848',
      steel: '#B8B8D0',
      fairy: '#EE99AC'
    };
    return typeColors[type] || '#68A090';
  }
} 