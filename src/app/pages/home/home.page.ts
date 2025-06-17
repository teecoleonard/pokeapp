import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController, InfiniteScrollCustomEvent } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Pokemon } from '../../models/pokemon.interface';
import { PokemonService } from '../../services/pokemon.service';
import { WebHookService } from '../../services/webhook.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class HomePage implements OnInit, OnDestroy {
  pokemons: Pokemon[] = [];
  loading = false;
  searchTerm = '';
  currentOffset = 0;
  readonly limit = 20;
  hasMoreData = true;
  private destroy$ = new Subject<void>();

  constructor(
    private pokemonService: PokemonService,
    private router: Router,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private webhookService: WebHookService
  ) {}

  ngOnInit() {
    // Rastrear visita à página inicial
    this.webhookService.trackPageVisited('home', {
      user_agent: navigator.userAgent,
      screen_resolution: `${screen.width}x${screen.height}`
    });
    
    this.loadInitialData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async loadInitialData() {
    const loading = await this.loadingController.create({
      message: 'Carregando Pokémons...',
    });
    await loading.present();

    this.pokemonService.getPokemonListWithDetails(this.limit, this.currentOffset)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (pokemons) => {
          this.pokemons = pokemons;
          this.currentOffset += this.limit;
          loading.dismiss();
        },
        error: async (error) => {
          console.error('Erro ao carregar Pokémons:', error);
          loading.dismiss();
          const toast = await this.toastController.create({
            message: 'Erro ao carregar Pokémons. Tente novamente.',
            duration: 3000,
            color: 'danger'
          });
          toast.present();
        }
      });
  }

  onIonInfinite(event: InfiniteScrollCustomEvent) {
    if (!this.hasMoreData) {
      event.target.complete();
      return;
    }

    this.pokemonService.getPokemonListWithDetails(this.limit, this.currentOffset)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (newPokemons) => {
          if (newPokemons.length === 0) {
            this.hasMoreData = false;
          } else {
            this.pokemons.push(...newPokemons);
            this.currentOffset += this.limit;
          }
          event.target.complete();
        },
        error: (error) => {
          console.error('Erro ao carregar mais Pokémons:', error);
          event.target.complete();
        }
      });
  }

  async onSearchChange(event: any) {
    const value = event.target.value;
    if (!value) {
      this.currentOffset = 0;
      this.hasMoreData = true;
      await this.loadInitialData();
      return;
    }

    if (value.length < 3) return;

    this.pokemonService.searchPokemon(value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (pokemon) => {
          this.pokemons = [pokemon];
          this.hasMoreData = false;
          
          // Rastrear busca realizada
          this.webhookService.trackSearchPerformed(value, 1, 'name');
        },
        error: async (error) => {
          console.error('Erro na busca:', error);
          
          // Rastrear busca que falhou
          this.webhookService.trackSearchPerformed(value, 0, 'name');
          this.webhookService.trackError('search_error', error.message, { search_term: value });
          
          const toast = await this.toastController.create({
            message: 'Pokémon não encontrado.',
            duration: 2000,
            color: 'warning'
          });
          toast.present();
        }
      });
  }

  onPokemonClick(pokemon: Pokemon) {
    // Rastrear visualização do Pokémon
    this.webhookService.trackPokemonViewed(pokemon.id, pokemon.name);
    
    this.router.navigate(['/pokemon', pokemon.id]);
  }

  async toggleFavorite(pokemon: Pokemon, event: Event) {
    event.stopPropagation();
    
    if (this.pokemonService.isFavorite(pokemon.id)) {
      this.pokemonService.removeFromFavorites(pokemon.id);
      const toast = await this.toastController.create({
        message: `${this.formatPokemonName(pokemon.name)} removido dos favoritos!`,
        duration: 2000,
        color: 'warning',
        position: 'bottom'
      });
      toast.present();
    } else {
      this.pokemonService.addToFavorites(pokemon);
      const toast = await this.toastController.create({
        message: `${this.formatPokemonName(pokemon.name)} adicionado aos favoritos!`,
        duration: 2000,
        color: 'success',
        position: 'bottom'
      });
      toast.present();
    }
  }

  isFavorite(pokemonId: number): boolean {
    return this.pokemonService.isFavorite(pokemonId);
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

  async doRefresh(event: any) {
    this.currentOffset = 0;
    this.hasMoreData = true;
    this.searchTerm = '';
    
    this.pokemonService.getPokemonListWithDetails(this.limit, this.currentOffset)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (pokemons) => {
          this.pokemons = pokemons;
          this.currentOffset += this.limit;
          event.target.complete();
        },
        error: (error) => {
          console.error('Erro ao atualizar:', error);
          event.target.complete();
        }
      });
  }

  goToFavorites() {
    this.router.navigate(['/tabs/favorites']);
  }

  trackByPokemonId(index: number, pokemon: Pokemon): number {
    return pokemon.id;
  }
} 