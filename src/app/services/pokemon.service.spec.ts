import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PokemonService } from './pokemon.service';
import { Pokemon, PokemonListResponse, PokemonSpecies } from '../models/pokemon.interface';

describe('PokemonService', () => {
  let service: PokemonService;
  let httpMock: HttpTestingController;

  const mockPokemon: Pokemon = {
    id: 1,
    name: 'bulbasaur',
    url: 'https://pokeapi.co/api/v2/pokemon/1/',
    height: 7,
    weight: 69,
    base_experience: 64,
    types: [
      {
        slot: 1,
        type: { name: 'grass', url: 'https://pokeapi.co/api/v2/type/12/' }
      }
    ],
    stats: [
      {
        base_stat: 45,
        effort: 0,
        stat: { name: 'hp', url: 'https://pokeapi.co/api/v2/stat/1/' }
      }
    ],
    abilities: [
      {
        ability: { name: 'overgrow', url: 'https://pokeapi.co/api/v2/ability/65/' },
        is_hidden: false,
        slot: 1
      }
    ],
    sprites: {
      front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
      back_default: '',
      front_shiny: '',
      back_shiny: '',
      other: {
        'official-artwork': {
          front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png'
        },
        dream_world: {
          front_default: ''
        }
      }
    },
    species: {
      name: 'bulbasaur',
      url: 'https://pokeapi.co/api/v2/pokemon-species/1/'
    }
  };

  const mockPokemonSpecies: PokemonSpecies = {
    flavor_text_entries: [
      {
        flavor_text: 'A strange seed was planted on its back at birth.',
        language: { name: 'en', url: 'https://pokeapi.co/api/v2/language/9/' },
        version: { name: 'red', url: 'https://pokeapi.co/api/v2/version/1/' }
      }
    ],
    genera: [
      {
        genus: 'Seed Pokémon',
        language: { name: 'en', url: 'https://pokeapi.co/api/v2/language/9/' }
      }
    ],
    habitat: {
      name: 'grassland',
      url: 'https://pokeapi.co/api/v2/pokemon-habitat/3/'
    },
    is_legendary: false,
    is_mythical: false
  };

  const mockPokemonList: PokemonListResponse = {
    count: 1302,
    next: 'https://pokeapi.co/api/v2/pokemon?offset=20&limit=20',
    previous: null,
    results: [
      { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
      { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' }
    ]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PokemonService]
    });
    service = TestBed.inject(PokemonService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    // Limpar localStorage
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPokemonList', () => {
    it('should return pokemon list', () => {
      service.getPokemonList(20, 0).subscribe(response => {
        expect(response).toEqual(mockPokemonList);
        expect(response.results.length).toBe(2);
      });

      const req = httpMock.expectOne('https://pokeapi.co/api/v2/pokemon?limit=20&offset=0');
      expect(req.request.method).toBe('GET');
      req.flush(mockPokemonList);
    });

    it('should handle custom limit and offset', () => {
      service.getPokemonList(10, 5).subscribe();

      const req = httpMock.expectOne('https://pokeapi.co/api/v2/pokemon?limit=10&offset=5');
      expect(req.request.method).toBe('GET');
      req.flush(mockPokemonList);
    });
  });

  describe('getPokemonDetails', () => {
    it('should return pokemon details by name', () => {
      service.getPokemonDetails('bulbasaur').subscribe(pokemon => {
        expect(pokemon).toEqual(mockPokemon);
        expect(pokemon.name).toBe('bulbasaur');
      });

      const req = httpMock.expectOne('https://pokeapi.co/api/v2/pokemon/bulbasaur');
      expect(req.request.method).toBe('GET');
      req.flush(mockPokemon);
    });

    it('should return pokemon details by id', () => {
      service.getPokemonDetails(1).subscribe(pokemon => {
        expect(pokemon).toEqual(mockPokemon);
        expect(pokemon.id).toBe(1);
      });

      const req = httpMock.expectOne('https://pokeapi.co/api/v2/pokemon/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockPokemon);
    });
  });

  describe('getPokemonSpecies', () => {
    it('should return pokemon species data', () => {
      service.getPokemonSpecies(1).subscribe(species => {
        expect(species).toEqual(mockPokemonSpecies);
        expect(species.is_legendary).toBe(false);
      });

      const req = httpMock.expectOne('https://pokeapi.co/api/v2/pokemon-species/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockPokemonSpecies);
    });
  });

  describe('Favorites Management', () => {
    beforeEach(() => {
      // Limpar favorites antes de cada teste
      service['favoritesSubject'].next([]);
    });

    it('should add pokemon to favorites', () => {
      service.addToFavorites(mockPokemon);
      
      const favorites = service.getFavorites();
      expect(favorites.length).toBe(1);
      expect(favorites[0]).toEqual(mockPokemon);
      expect(service.isFavorite(mockPokemon.id)).toBe(true);
    });

    it('should not add duplicate pokemon to favorites', () => {
      service.addToFavorites(mockPokemon);
      service.addToFavorites(mockPokemon); // Tentar adicionar novamente
      
      const favorites = service.getFavorites();
      expect(favorites.length).toBe(1);
    });

    it('should remove pokemon from favorites', () => {
      service.addToFavorites(mockPokemon);
      expect(service.isFavorite(mockPokemon.id)).toBe(true);
      
      service.removeFromFavorites(mockPokemon.id);
      expect(service.isFavorite(mockPokemon.id)).toBe(false);
      expect(service.getFavorites().length).toBe(0);
    });

    it('should persist favorites to localStorage', () => {
      const setItemSpy = spyOn(localStorage, 'setItem');
      service.addToFavorites(mockPokemon);
      
      expect(setItemSpy).toHaveBeenCalledWith(
        'pokemonFavorites', 
        JSON.stringify([mockPokemon])
      );
    });

    it('should load favorites from localStorage on init', () => {
      const getItemSpy = spyOn(localStorage, 'getItem').and.returnValue(
        JSON.stringify([mockPokemon])
      );
      
      // Criar nova instância do serviço para testar carregamento
      const mockWebhookService = jasmine.createSpyObj('WebHookService', ['trackPokemonFavorited']);
      const newService = new PokemonService(service['http'], mockWebhookService);
      
      expect(getItemSpy).toHaveBeenCalledWith('pokemonFavorites');
      expect(newService.getFavorites().length).toBe(1);
    });

    it('should handle invalid localStorage data gracefully', () => {
      const getItemSpy = spyOn(localStorage, 'getItem').and.returnValue('invalid-json');
      const consoleErrorSpy = spyOn(console, 'error');
      
      const mockWebhookService = jasmine.createSpyObj('WebHookService', ['trackPokemonFavorited']);
      const newService = new PokemonService(service['http'], mockWebhookService);
      
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(newService.getFavorites().length).toBe(0);
    });
  });

  describe('Utility Methods', () => {
    it('should format pokemon name correctly', () => {
      expect(service.formatPokemonName('bulbasaur')).toBe('Bulbasaur');
      expect(service.formatPokemonName('PIKACHU')).toBe('Pikachu');
      expect(service.formatPokemonName('')).toBe('');
    });

    it('should return correct type colors', () => {
      expect(service.getTypeColor('fire')).toBe('#F08030');
      expect(service.getTypeColor('water')).toBe('#6890F0');
      expect(service.getTypeColor('grass')).toBe('#78C850');
      expect(service.getTypeColor('unknown-type')).toBe('#68A090'); // Default color
    });

    it('should extract pokemon id from url correctly', () => {
      const url = 'https://pokeapi.co/api/v2/pokemon/25/';
      expect(service.getPokemonIdFromUrl(url)).toBe(25);
    });
  });

  describe('Complex Operations', () => {
    it('should get pokemon with details (pokemon + species)', () => {
      service.getPokemonWithDetails('bulbasaur').subscribe(result => {
        expect(result.pokemon).toEqual(mockPokemon);
        expect(result.species).toEqual(mockPokemonSpecies);
      });

      // Primeira requisição para pokemon details
      const pokemonReq = httpMock.expectOne('https://pokeapi.co/api/v2/pokemon/bulbasaur');
      pokemonReq.flush(mockPokemon);

      // Segunda requisição para species
      const speciesReq = httpMock.expectOne('https://pokeapi.co/api/v2/pokemon-species/1');
      speciesReq.flush(mockPokemonSpecies);
    });

    it('should handle error in pokemon details request', () => {
      service.getPokemonDetails('invalid-pokemon').subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne('https://pokeapi.co/api/v2/pokemon/invalid-pokemon');
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('Observable Patterns', () => {
    it('should emit favorites changes through observable', (done) => {
      let emissionCount = 0;
      
      service.favorites$.subscribe(favorites => {
        emissionCount++;
        
        if (emissionCount === 1) {
          // Initial empty state
          expect(favorites.length).toBe(0);
        } else if (emissionCount === 2) {
          // After adding favorite
          expect(favorites.length).toBe(1);
          expect(favorites[0].name).toBe('bulbasaur');
          done();
        }
      });

      // Trigger change
      service.addToFavorites(mockPokemon);
    });
  });
}); 