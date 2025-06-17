import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { Pokemon } from '../../models/pokemon.interface';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class SearchPage implements OnInit {
  searchQuery = '';
  searchResults: Pokemon[] = [];
  loading = false;
  searchType = 'name';
  
  // Filtros avançados
  selectedTypes: string[] = [];
  selectedGeneration = '';
  minHeight = 0;
  maxHeight = 100;
  minWeight = 0;
  maxWeight = 1000;
  isLegendary = false;
  isMythical = false;

  // Dados para filtros
  pokemonTypes = [
    'normal', 'fire', 'water', 'electric', 'grass', 'ice',
    'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
    'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
  ];

  generations = [
    { value: '1', label: 'Geração I (Kanto)' },
    { value: '2', label: 'Geração II (Johto)' },
    { value: '3', label: 'Geração III (Hoenn)' },
    { value: '4', label: 'Geração IV (Sinnoh)' },
    { value: '5', label: 'Geração V (Unova)' },
    { value: '6', label: 'Geração VI (Kalos)' },
    { value: '7', label: 'Geração VII (Alola)' },
    { value: '8', label: 'Geração VIII (Galar)' },
    { value: '9', label: 'Geração IX (Paldea)' }
  ];

  constructor(
    private pokemonService: PokemonService,
    private router: Router,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.searchResults = [];
  }

  async performSearch() {
    if (!this.searchQuery.trim() && this.searchType === 'name') return;
    
    this.loading = true;
    this.searchResults = [];

    try {
      switch (this.searchType) {
        case 'name':
          await this.searchByName();
          break;
        case 'type':
          await this.searchByType();
          break;
        case 'ability':
          await this.searchByAbility();
          break;
        case 'advanced':
          await this.advancedSearch();
          break;
      }
    } catch (error) {
      console.error('Erro na busca:', error);
    } finally {
      this.loading = false;
    }
  }

  private async searchByName() {
    if (this.searchQuery.trim()) {
      try {
        const pokemon = await firstValueFrom(this.pokemonService.getPokemonByName(this.searchQuery.toLowerCase().trim()));
        if (pokemon) {
          this.searchResults = [pokemon];
        }
      } catch (error) {
        console.log('Pokémon não encontrado');
        this.searchResults = [];
      }
    }
  }

  private async searchByType() {
    // Implementar busca por tipo usando a API
  }

  private async searchByAbility() {
    // Implementar busca por habilidade usando a API
  }

  private async advancedSearch() {
    // Implementar busca avançada com filtros
  }

  onTypeToggle(type: string, event: any) {
    if (event.detail.checked) {
      this.selectedTypes.push(type);
    } else {
      const index = this.selectedTypes.indexOf(type);
      if (index > -1) {
        this.selectedTypes.splice(index, 1);
      }
    }
  }

  isTypeSelected(type: string): boolean {
    return this.selectedTypes.includes(type);
  }

  clearFilters() {
    this.selectedTypes = [];
    this.selectedGeneration = '';
    this.minHeight = 0;
    this.maxHeight = 100;
    this.minWeight = 0;
    this.maxWeight = 1000;
    this.isLegendary = false;
    this.isMythical = false;
    this.searchResults = [];
  }

  viewPokemon(pokemon: Pokemon) {
    this.router.navigate(['/pokemon', pokemon.id]);
  }

  formatPokemonName(name: string): string {
    return this.pokemonService.formatPokemonName(name);
  }

  getTypeColor(type: string): string {
    return this.pokemonService.getTypeColor(type);
  }

  toggleFavorite(pokemon: Pokemon, event: Event) {
    event.stopPropagation();
    if (this.pokemonService.isFavorite(pokemon.id)) {
      this.pokemonService.removeFromFavorites(pokemon.id);
    } else {
      this.pokemonService.addToFavorites(pokemon);
    }
  }

  isFavorite(pokemonId: number): boolean {
    return this.pokemonService.isFavorite(pokemonId);
  }
} 