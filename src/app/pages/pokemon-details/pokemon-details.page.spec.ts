import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

import { PokemonDetailsPage } from './pokemon-details.page';
import { PokemonService } from '../../services/pokemon.service';
import { Pokemon, PokemonSpecies } from '../../models/pokemon.interface';

describe('PokemonDetailsPage', () => {
  let component: PokemonDetailsPage;
  let fixture: ComponentFixture<PokemonDetailsPage>;
  let pokemonService: jasmine.SpyObj<PokemonService>;
  let router: jasmine.SpyObj<Router>;
  let loadingController: jasmine.SpyObj<LoadingController>;
  let toastController: jasmine.SpyObj<ToastController>;

  const mockPokemon: Pokemon = {
    id: 1,
    name: 'bulbasaur',
    height: 7,
    weight: 69,
    base_experience: 64,
    url: 'https://pokeapi.co/api/v2/pokemon/1/',
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
      },
      {
        base_stat: 49,
        effort: 0,
        stat: { name: 'attack', url: 'https://pokeapi.co/api/v2/stat/2/' }
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
      front_default: 'front.png',
      back_default: 'back.png',
      front_shiny: 'front_shiny.png',
      back_shiny: 'back_shiny.png',
      other: {
        'official-artwork': {
          front_default: 'artwork.png'
        },
        dream_world: {
          front_default: 'dream.png'
        }
      }
    },
    species: {
      name: 'bulbasaur',
      url: 'https://pokeapi.co/api/v2/pokemon-species/1/'
    }
  };

  const mockSpecies: PokemonSpecies = {
    flavor_text_entries: [
      {
        flavor_text: 'A strange seed was planted on its back at birth.',
        language: { name: 'en', url: 'https://pokeapi.co/api/v2/language/9/' },
        version: { name: 'red', url: 'https://pokeapi.co/api/v2/version/1/' }
      },
      {
        flavor_text: 'Uma semente estranha foi plantada nas suas costas ao nascer.',
        language: { name: 'pt', url: 'https://pokeapi.co/api/v2/language/7/' },
        version: { name: 'blue', url: 'https://pokeapi.co/api/v2/version/2/' }
      }
    ],
    genera: [
      {
        genus: 'Seed Pokémon',
        language: { name: 'en', url: 'https://pokeapi.co/api/v2/language/9/' }
      },
      {
        genus: 'Pokémon Semente',
        language: { name: 'pt', url: 'https://pokeapi.co/api/v2/language/7/' }
      }
    ],
    habitat: {
      name: 'grassland',
      url: 'https://pokeapi.co/api/v2/pokemon-habitat/3/'
    },
    is_legendary: false,
    is_mythical: false
  };

  beforeEach(async () => {
    const pokemonServiceSpy = jasmine.createSpyObj('PokemonService', [
      'getPokemonWithDetails',
      'isFavorite',
      'addToFavorites',
      'removeFromFavorites',
      'formatPokemonName',
      'getTypeColor'
    ]);

    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const loadingControllerSpy = jasmine.createSpyObj('LoadingController', ['create']);
    const toastControllerSpy = jasmine.createSpyObj('ToastController', ['create']);

    const mockActivatedRoute = {
      snapshot: { paramMap: { get: jasmine.createSpy().and.returnValue('1') } }
    };

    const mockLoading = {
      present: jasmine.createSpy().and.returnValue(Promise.resolve()),
      dismiss: jasmine.createSpy().and.returnValue(Promise.resolve())
    };

    const mockToast = {
      present: jasmine.createSpy().and.returnValue(Promise.resolve())
    };

    await TestBed.configureTestingModule({
      imports: [
        PokemonDetailsPage,
        HttpClientTestingModule
      ],
      providers: [
        { provide: PokemonService, useValue: pokemonServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: LoadingController, useValue: loadingControllerSpy },
        { provide: ToastController, useValue: toastControllerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonDetailsPage);
    component = fixture.componentInstance;
    pokemonService = TestBed.inject(PokemonService) as jasmine.SpyObj<PokemonService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    loadingController = TestBed.inject(LoadingController) as jasmine.SpyObj<LoadingController>;
    toastController = TestBed.inject(ToastController) as jasmine.SpyObj<ToastController>;

    // Setup default return values
    pokemonService.getPokemonWithDetails.and.returnValue(of({
      pokemon: mockPokemon,
      species: mockSpecies
    }));
    pokemonService.formatPokemonName.and.returnValue('Bulbasaur');
    pokemonService.getTypeColor.and.returnValue('#78C850');
    pokemonService.isFavorite.and.returnValue(false);
    loadingController.create.and.returnValue(Promise.resolve(mockLoading as any));
    toastController.create.and.returnValue(Promise.resolve(mockToast as any));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.pokemon).toBeNull();
    expect(component.species).toBeNull();
    expect(component.loading).toBe(true);
    expect(component.selectedSegment).toBe('overview');
  });

  describe('ngOnInit', () => {
    it('should load pokemon details when valid id is provided', () => {
      spyOn(component, 'loadPokemonDetails');
      
      component.ngOnInit();
      
      expect(component.loadPokemonDetails).toHaveBeenCalledWith('1');
    });

    it('should not load when no id is provided', () => {
      const route = TestBed.inject(ActivatedRoute);
      route.snapshot.paramMap.get = jasmine.createSpy().and.returnValue(null);
      spyOn(component, 'loadPokemonDetails');
      
      component.ngOnInit();
      
      expect(component.loadPokemonDetails).not.toHaveBeenCalled();
    });
  });

  describe('loadPokemonDetails', () => {
    it('should load pokemon and species data successfully', async () => {
      await component.loadPokemonDetails('1');
      
      expect(pokemonService.getPokemonWithDetails).toHaveBeenCalledWith('1');
      expect(component.pokemon).toEqual(mockPokemon);
      expect(component.species).toEqual(mockSpecies);
      expect(component.loading).toBe(false);
    });

    it('should handle error when loading pokemon details', async () => {
      pokemonService.getPokemonWithDetails.and.returnValue(
        throwError(() => new Error('Pokemon not found'))
      );
      
      await component.loadPokemonDetails('999');
      
      expect(component.loading).toBe(false);
      expect(component.pokemon).toBeNull();
      expect(component.species).toBeNull();
      expect(toastController.create).toHaveBeenCalled();
    });

    it('should show loading indicator during request', async () => {
      const loadingInstance = await loadingController.create();
      
      await component.loadPokemonDetails('1');
      
      expect(loadingController.create).toHaveBeenCalled();
      expect(loadingInstance.present).toHaveBeenCalled();
      expect(loadingInstance.dismiss).toHaveBeenCalled();
    });
  });

  describe('calculateDerivedData', () => {
    beforeEach(() => {
      component.pokemon = mockPokemon;
      component.species = mockSpecies;
      component['calculateDerivedData']();
    });

    it('should calculate pokemon image correctly', () => {
      expect(component.pokemonImage).toBe('artwork.png');
    });

    it('should extract Portuguese description', () => {
      expect(component.pokemonDescription).toBe('Uma semente estranha foi plantada nas suas costas ao nascer.');
    });

    it('should extract Portuguese genus', () => {
      expect(component.pokemonGenus).toBe('Pokémon Semente');
    });

    it('should calculate main details', () => {
      expect(component.mainDetails.length).toBeGreaterThan(0);
      expect(component.mainDetails[0].label).toBe('Altura');
      expect(component.mainDetails[0].value).toBe('0.7 m');
    });

    it('should calculate ability names', () => {
      expect(component.abilityNames.length).toBe(1);
      expect(component.abilityNames[0]).toBe('Bulbasaur'); // Mocked formatPokemonName return
    });

    it('should calculate alternative images', () => {
      expect(component.alternativeImages.length).toBeGreaterThan(0);
      expect(component.alternativeImages[0].name).toBe('Frente (Normal)');
      expect(component.alternativeImages[0].url).toBe('front.png');
    });
  });

  describe('Favorite functionality', () => {
    beforeEach(() => {
      component.pokemon = mockPokemon;
    });

    it('should add pokemon to favorites when not favorited', () => {
      pokemonService.isFavorite.and.returnValue(false);
      
      component.toggleFavorite();
      
      expect(pokemonService.addToFavorites).toHaveBeenCalledWith(mockPokemon);
    });

    it('should remove pokemon from favorites when already favorited', () => {
      pokemonService.isFavorite.and.returnValue(true);
      
      component.toggleFavorite();
      
      expect(pokemonService.removeFromFavorites).toHaveBeenCalledWith(mockPokemon.id);
    });

    it('should check if pokemon is favorite', () => {
      pokemonService.isFavorite.and.returnValue(true);
      
      const result = component.isFavorite();
      
      expect(result).toBe(true);
      expect(pokemonService.isFavorite).toHaveBeenCalledWith(mockPokemon.id);
    });

    it('should return false when pokemon is not loaded', () => {
      component.pokemon = null;
      
      const result = component.isFavorite();
      
      expect(result).toBe(false);
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

    it('should calculate stat percentage', () => {
      const result = component.getStatPercentage(120);
      
      expect(result).toBeCloseTo(47.06, 2); // 120/255 * 100 ≈ 47.06
    });

    it('should get stat color', () => {
      const hpColor = component.getStatColor('hp');
      const attackColor = component.getStatColor('attack');
      const defaultColor = component.getStatColor('unknown');
      
      expect(hpColor).toBe('#FF5959');
      expect(attackColor).toBe('#F5AC78');
      expect(defaultColor).toBe('#68A090');
    });
  });

  describe('Navigation', () => {
    it('should navigate back to home', () => {
      component.goBack();
      
      expect(router.navigate).toHaveBeenCalledWith(['/tabs/home']);
    });

    it('should retry loading pokemon details', () => {
      spyOn(component, 'loadPokemonDetails');
      
      component.retryLoad();
      
      expect(component.loading).toBe(true);
      expect(component.pokemon).toBeNull();
      expect(component.species).toBeNull();
      expect(component.loadPokemonDetails).toHaveBeenCalledWith('1');
    });
  });

  describe('Segment handling', () => {
    it('should change selected segment', () => {
      const mockEvent = { detail: { value: 'stats' } };
      
      component.onSegmentChanged(mockEvent as any);
      
      expect(component.selectedSegment).toBe('stats');
    });
  });

  describe('Private methods', () => {
    beforeEach(() => {
      component.species = mockSpecies;
    });

    it('should get description from species in Portuguese', () => {
      const result = component['getDescriptionFromSpecies']();
      
      expect(result).toBe('Uma semente estranha foi plantada nas suas costas ao nascer.');
    });

    it('should fallback to English description when Portuguese not available', () => {
      component.species!.flavor_text_entries = [
        {
          flavor_text: 'A strange seed was planted on its back at birth.',
          language: { name: 'en', url: 'https://pokeapi.co/api/v2/language/9/' },
          version: { name: 'red', url: 'https://pokeapi.co/api/v2/version/1/' }
        }
      ];
      
      const result = component['getDescriptionFromSpecies']();
      
      expect(result).toBe('A strange seed was planted on its back at birth.');
    });

    it('should return default description when no entries available', () => {
      component.species!.flavor_text_entries = [];
      
      const result = component['getDescriptionFromSpecies']();
      
      expect(result).toBe('Descrição não disponível');
    });

    it('should get genus from species in Portuguese', () => {
      const result = component['getGenusFromSpecies']();
      
      expect(result).toBe('Pokémon Semente');
    });

    it('should fallback to English genus when Portuguese not available', () => {
      component.species!.genera = [
        {
          genus: 'Seed Pokémon',
          language: { name: 'en', url: 'https://pokeapi.co/api/v2/language/9/' }
        }
      ];
      
      const result = component['getGenusFromSpecies']();
      
      expect(result).toBe('Seed Pokémon');
    });
  });
}); 