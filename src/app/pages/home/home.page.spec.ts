import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IonicModule, LoadingController, ToastController } from '@ionic/angular';
import { of, throwError } from 'rxjs';

import { HomePage } from './home.page';
import { PokemonService } from '../../services/pokemon.service';
import { WebHookService } from '../../services/webhook.service';
import { Pokemon } from '../../models/pokemon.interface';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let pokemonService: jasmine.SpyObj<PokemonService>;
  let webhookService: jasmine.SpyObj<WebHookService>;
  let router: jasmine.SpyObj<Router>;
  let loadingController: jasmine.SpyObj<LoadingController>;
  let toastController: jasmine.SpyObj<ToastController>;

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
          front_default: ''
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

  beforeEach(async () => {
    const pokemonServiceSpy = jasmine.createSpyObj('PokemonService', [
      'getPokemonListWithDetails',
      'searchPokemon',
      'isFavorite',
      'addToFavorites',
      'removeFromFavorites',
      'formatPokemonName',
      'getTypeColor'
    ]);

    const webhookServiceSpy = jasmine.createSpyObj('WebHookService', [
      'trackPageVisited',
      'trackPokemonViewed',
      'trackSearchPerformed',
      'trackError'
    ]);

    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const loadingControllerSpy = jasmine.createSpyObj('LoadingController', ['create']);
    const toastControllerSpy = jasmine.createSpyObj('ToastController', ['create']);

    const mockLoading = {
      present: jasmine.createSpy().and.returnValue(Promise.resolve()),
      dismiss: jasmine.createSpy().and.returnValue(Promise.resolve())
    };

    const mockToast = {
      present: jasmine.createSpy().and.returnValue(Promise.resolve())
    };

    await TestBed.configureTestingModule({
      imports: [
        HomePage,
        IonicModule.forRoot(),
        HttpClientTestingModule
      ],
      providers: [
        { provide: PokemonService, useValue: pokemonServiceSpy },
        { provide: WebHookService, useValue: webhookServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: LoadingController, useValue: loadingControllerSpy },
        { provide: ToastController, useValue: toastControllerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    pokemonService = TestBed.inject(PokemonService) as jasmine.SpyObj<PokemonService>;
    webhookService = TestBed.inject(WebHookService) as jasmine.SpyObj<WebHookService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    loadingController = TestBed.inject(LoadingController) as jasmine.SpyObj<LoadingController>;
    toastController = TestBed.inject(ToastController) as jasmine.SpyObj<ToastController>;

    // Setup default return values
    pokemonService.getPokemonListWithDetails.and.returnValue(of([mockPokemon]));
    pokemonService.formatPokemonName.and.returnValue('Bulbasaur');
    pokemonService.getTypeColor.and.returnValue('#78C850');
    pokemonService.isFavorite.and.returnValue(false);
    pokemonService.searchPokemon.and.returnValue(of(mockPokemon));
    loadingController.create.and.returnValue(Promise.resolve(mockLoading as any));
    toastController.create.and.returnValue(Promise.resolve(mockToast as any));
  });

  afterEach(() => {
    // Reset all spies after each test
    if (pokemonService) {
      pokemonService.getPokemonListWithDetails.calls.reset();
      pokemonService.searchPokemon.calls.reset();
      pokemonService.formatPokemonName.calls.reset();
      pokemonService.getTypeColor.calls.reset();
      pokemonService.isFavorite.calls.reset();
      pokemonService.addToFavorites.calls.reset();
      pokemonService.removeFromFavorites.calls.reset();
    }
    if (webhookService) {
      webhookService.trackPageVisited.calls.reset();
      webhookService.trackPokemonViewed.calls.reset();
      webhookService.trackSearchPerformed.calls.reset();
      webhookService.trackError.calls.reset();
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.pokemons).toEqual([]);
    expect(component.loading).toBe(false);
    expect(component.searchTerm).toBe('');
    expect(component.currentOffset).toBe(0);
    expect(component.hasMoreData).toBe(true);
  });

  describe('ngOnInit', () => {
    it('should track page visit and load initial data', () => {
      component.ngOnInit();
      
      expect(webhookService.trackPageVisited).toHaveBeenCalledWith('home', jasmine.any(Object));
      expect(pokemonService.getPokemonListWithDetails).toHaveBeenCalledWith(20, 0);
    });
  });

  describe('Pokemon interactions', () => {
    it('should navigate to pokemon details and track view when pokemon is clicked', () => {
      component.onPokemonClick(mockPokemon);

      expect(webhookService.trackPokemonViewed).toHaveBeenCalledWith(mockPokemon.id, mockPokemon.name);
      expect(router.navigate).toHaveBeenCalledWith(['/pokemon', mockPokemon.id]);
    });

    it('should check if pokemon is favorite', () => {
      pokemonService.isFavorite.and.returnValue(true);
      
      const result = component.isFavorite(1);
      
      expect(result).toBe(true);
      expect(pokemonService.isFavorite).toHaveBeenCalledWith(1);
    });

    it('should add pokemon to favorites when not favorited', async () => {
      pokemonService.isFavorite.and.returnValue(false);
      const mockEvent = new Event('click');
      spyOn(mockEvent, 'stopPropagation');

      await component.toggleFavorite(mockPokemon, mockEvent);

      expect(mockEvent.stopPropagation).toHaveBeenCalled();
      expect(pokemonService.addToFavorites).toHaveBeenCalledWith(mockPokemon);
    });

    it('should remove pokemon from favorites when already favorited', async () => {
      pokemonService.isFavorite.and.returnValue(true);
      const mockEvent = new Event('click');
      spyOn(mockEvent, 'stopPropagation');

      await component.toggleFavorite(mockPokemon, mockEvent);

      expect(pokemonService.removeFromFavorites).toHaveBeenCalledWith(mockPokemon.id);
    });
  });

  describe('Search functionality', () => {
    it('should handle search input change and trigger search for valid terms', async () => {
      const mockEvent = { target: { value: 'pikachu' } };
      
      await component.onSearchChange(mockEvent as any);

      expect(pokemonService.searchPokemon).toHaveBeenCalledWith('pikachu');
      expect(webhookService.trackSearchPerformed).toHaveBeenCalledWith('pikachu', 1, 'name');
    });

    it('should reload initial data when search is empty', async () => {
      const mockEvent = { target: { value: '' } };
      
      await component.onSearchChange(mockEvent as any);

      expect(pokemonService.getPokemonListWithDetails).toHaveBeenCalled();
    });

    it('should handle search errors', async () => {
      const mockEvent = { target: { value: 'invalidpokemon' } };
      pokemonService.searchPokemon.and.returnValue(throwError(() => new Error('Not found')));
      
      await component.onSearchChange(mockEvent as any);

      expect(webhookService.trackSearchPerformed).toHaveBeenCalledWith('invalidpokemon', 0, 'name');
      expect(webhookService.trackError).toHaveBeenCalledWith('search_error', jasmine.any(String), jasmine.any(Object));
    });
  });

  describe('Infinite scroll', () => {
    beforeEach(() => {
      // Reset component state for infinite scroll tests
      component.currentOffset = 0;
      component.hasMoreData = true;
      component.loading = false;
      pokemonService.getPokemonListWithDetails.calls.reset();
    });

    it('should load more pokemons when hasMoreData is true', () => {
      component.hasMoreData = true;
      const mockEvent = { target: { complete: jasmine.createSpy() } };
      
      component.onIonInfinite(mockEvent as any);

      expect(pokemonService.getPokemonListWithDetails).toHaveBeenCalledWith(20, 20);
    });

    it('should not load more when hasMoreData is false', () => {
      // Reset spy call count
      pokemonService.getPokemonListWithDetails.calls.reset();
      component.hasMoreData = false;
      const mockEvent = { target: { complete: jasmine.createSpy() } };
      
      component.onIonInfinite(mockEvent as any);

      expect(mockEvent.target.complete).toHaveBeenCalled();
      expect(pokemonService.getPokemonListWithDetails).not.toHaveBeenCalled();
    });
  });

  describe('Utility methods', () => {
    it('should format pokemon name', () => {
      const result = component.formatPokemonName('bulbasaur');
      
      expect(pokemonService.formatPokemonName).toHaveBeenCalledWith('bulbasaur');
      expect(result).toBe('Bulbasaur');
    });

    it('should get type color', () => {
      const result = component.getTypeColor('grass');
      
      expect(pokemonService.getTypeColor).toHaveBeenCalledWith('grass');
      expect(result).toBe('#78C850');
    });

    it('should get pokemon image', () => {
      const result = component.getPokemonImage(mockPokemon);
      
      expect(result).toBe(mockPokemon.sprites.front_default);
    });

    it('should track pokemon by id', () => {
      const result = component.trackByPokemonId(0, mockPokemon);
      
      expect(result).toBe(mockPokemon.id);
    });
  });

  describe('Navigation', () => {
    it('should navigate to favorites page', () => {
      component.goToFavorites();

      expect(router.navigate).toHaveBeenCalledWith(['/tabs/favorites']);
    });
  });

  describe('Refresh functionality', () => {
    it('should refresh pokemon list', async () => {
      // Set initial state
      component.currentOffset = 20;
      component.hasMoreData = false;
      component.pokemons = [mockPokemon];
      
      const mockEvent = { target: { complete: jasmine.createSpy() } };
      
      await component.doRefresh(mockEvent as any);

      expect(component.currentOffset).toBe(0);
      expect(component.hasMoreData).toBe(true);
      expect(component.pokemons).toEqual([mockPokemon]); // Espera resultado do mock
      expect(mockEvent.target.complete).toHaveBeenCalled();
    });
  });
});