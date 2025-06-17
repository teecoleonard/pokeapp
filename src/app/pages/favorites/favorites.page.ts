import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Pokemon } from '../../models/pokemon.interface';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterModule]
})
export class FavoritesPage implements OnInit, OnDestroy {
  favorites: Pokemon[] = [];
  filteredFavorites: Pokemon[] = [];
  private destroy$ = new Subject<void>();

  // Filtros
  searchQuery = '';
  selectedType = '';
  sortBy = 'id';
  viewMode = 'grid';

  // Tipos únicos dos favoritos
  availableTypes: string[] = [];

  constructor(
    private pokemonService: PokemonService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadFavorites();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadFavorites() {
    this.pokemonService.favorites$
      .pipe(takeUntil(this.destroy$))
      .subscribe(favorites => {
        this.favorites = favorites;
        this.updateAvailableTypes();
        this.applyFilters();
      });
  }

  updateAvailableTypes() {
    const types = new Set<string>();
    this.favorites.forEach(pokemon => {
      pokemon.types?.forEach(type => {
        types.add(type.type.name);
      });
    });
    this.availableTypes = Array.from(types).sort();
  }

  applyFilters() {
    let filtered = [...this.favorites];

    // Filtro por busca
    if (this.searchQuery.trim()) {
      filtered = filtered.filter(pokemon =>
        pokemon.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    // Filtro por tipo
    if (this.selectedType) {
      filtered = filtered.filter(pokemon =>
        pokemon.types?.some(type => type.type.name === this.selectedType)
      );
    }

    // Ordenação
    filtered.sort((a, b) => {
      switch (this.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'id':
          return a.id - b.id;
        case 'height':
          return (b.height || 0) - (a.height || 0);
        case 'weight':
          return (b.weight || 0) - (a.weight || 0);
        default:
          return a.id - b.id;
      }
    });

    this.filteredFavorites = filtered;
  }

  onSearchChange() {
    this.applyFilters();
  }

  onTypeChange() {
    this.applyFilters();
  }

  onSortChange() {
    this.applyFilters();
  }

  onPokemonClick(pokemon: Pokemon) {
    this.router.navigate(['/pokemon', pokemon.id]);
  }

  removeFromFavorites(pokemon: Pokemon, event: Event) {
    event.stopPropagation();
    this.pokemonService.removeFromFavorites(pokemon.id);
  }

  clearAllFavorites() {
    if (confirm('Tem certeza que deseja remover todos os Pokémon dos favoritos?')) {
      this.favorites.forEach(pokemon => {
        this.pokemonService.removeFromFavorites(pokemon.id);
      });
    }
  }

  getPokemonImage(pokemon: Pokemon): string {
    return this.pokemonService.getPokemonImage(pokemon);
  }

  formatPokemonName(name: string): string {
    return this.pokemonService.formatPokemonName(name);
  }

  getTypeColor(type: string): string {
    return this.pokemonService.getTypeColor(type);
  }

  trackByPokemonId(index: number, pokemon: Pokemon): number {
    return pokemon.id;
  }

  exportFavorites() {
    const data = this.favorites.map(pokemon => ({
      id: pokemon.id,
      name: pokemon.name,
      types: pokemon.types?.map(t => t.type.name) || []
    }));

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'meus-pokemon-favoritos.json';
    link.click();
    window.URL.revokeObjectURL(url);
  }
} 