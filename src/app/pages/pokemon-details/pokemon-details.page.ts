import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Pokemon, PokemonSpecies } from '../../models/pokemon.interface';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-pokemon-details',
  templateUrl: './pokemon-details.page.html',
  styleUrls: ['./pokemon-details.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class PokemonDetailsPage implements OnInit, OnDestroy {
  pokemon: Pokemon | null = null;
  species: PokemonSpecies | null = null;
  loading = true;
  private destroy$ = new Subject<void>();

  // Segmentos para organização do conteúdo
  selectedSegment = 'overview';

  // Propriedades calculadas para evitar recálculos no template
  pokemonImage = '';
  pokemonDescription = '';
  pokemonGenus = '';
  mainDetails: Array<{label: string, value: string}> = [];
  abilityNames: string[] = [];
  alternativeImages: Array<{name: string, url: string}> = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pokemonService: PokemonService,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    const pokemonId = this.route.snapshot.paramMap.get('id');
    if (pokemonId) {
      this.loadPokemonDetails(pokemonId);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async loadPokemonDetails(pokemonId: string) {
    const loading = await this.loadingController.create({
      message: 'Carregando detalhes...',
    });
    await loading.present();

    this.pokemonService.getPokemonWithDetails(pokemonId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.pokemon = data.pokemon;
          this.species = data.species;
          this.calculateDerivedData();
          this.loading = false;
          loading.dismiss();
        },
        error: async (error) => {
          console.error('Erro detalhado ao carregar:', error);
          this.loading = false;
          loading.dismiss();
          const toast = await this.toastController.create({
            message: `Erro ao carregar Pokémon: ${error.message || 'Erro desconhecido'}`,
            duration: 5000,
            color: 'danger'
          });
          toast.present();
        }
      });
  }

  goBack() {
    this.router.navigate(['/tabs/home']);
  }

  retryLoad() {
    const pokemonId = this.route.snapshot.paramMap.get('id');
    if (pokemonId) {
      this.loading = true;
      this.pokemon = null;
      this.species = null;
      this.loadPokemonDetails(pokemonId);
    }
  }

  private calculateDerivedData() {
    if (!this.pokemon) return;

    // Calcular imagem
    this.pokemonImage = this.pokemon.sprites?.other?.['official-artwork']?.front_default || 
           this.pokemon.sprites?.front_default || 
           'assets/icon/pokemon-placeholder.png';

    // Calcular descrição
    this.pokemonDescription = this.getDescriptionFromSpecies();
    
    // Calcular gênero
    this.pokemonGenus = this.getGenusFromSpecies();

    // Calcular detalhes principais
    this.mainDetails = [
      { label: 'Altura', value: `${(this.pokemon.height / 10).toFixed(1)} m` },
      { label: 'Peso', value: `${(this.pokemon.weight / 10).toFixed(1)} kg` },
      { label: 'Experiência Base', value: `${this.pokemon.base_experience || 'N/A'}` },
      { label: 'Habitat', value: this.species?.habitat?.name ? this.formatPokemonName(this.species.habitat.name) : 'Desconhecido' },
      { label: 'Lendário', value: this.species?.is_legendary ? 'Sim' : 'Não' },
      { label: 'Mítico', value: this.species?.is_mythical ? 'Sim' : 'Não' }
    ];

    // Calcular habilidades
    this.abilityNames = this.pokemon.abilities?.map(ability => 
      this.formatPokemonName(ability.ability.name)
    ) || [];

    // Calcular imagens alternativas
    this.alternativeImages = this.calculateAlternativeImages();
  }

  private getDescriptionFromSpecies(): string {
    if (!this.species?.flavor_text_entries) return 'Descrição não disponível';
    
    const ptDescription = this.species.flavor_text_entries.find(
      entry => entry.language.name === 'pt' || entry.language.name === 'pt-BR'
    );
    
    if (ptDescription) {
      return ptDescription.flavor_text.replace(/\f/g, ' ');
    }
    
    const enDescription = this.species.flavor_text_entries.find(
      entry => entry.language.name === 'en'
    );
    
    return enDescription ? enDescription.flavor_text.replace(/\f/g, ' ') : 'Descrição não disponível';
  }

  private getGenusFromSpecies(): string {
    if (!this.species?.genera) return 'Pokémon';
    
    const ptGenus = this.species.genera.find(
      genus => genus.language.name === 'pt' || genus.language.name === 'pt-BR'
    );
    
    if (ptGenus) return ptGenus.genus;
    
    const enGenus = this.species.genera.find(
      genus => genus.language.name === 'en'
    );
    
    return enGenus ? enGenus.genus : 'Pokémon';
  }

  private calculateAlternativeImages(): Array<{name: string, url: string}> {
    if (!this.pokemon?.sprites) return [];
    
    const images = [];
    
    if (this.pokemon.sprites.front_default) {
      images.push({ name: 'Frente (Normal)', url: this.pokemon.sprites.front_default });
    }
    if (this.pokemon.sprites.back_default) {
      images.push({ name: 'Costas (Normal)', url: this.pokemon.sprites.back_default });
    }
    if (this.pokemon.sprites.front_shiny) {
      images.push({ name: 'Frente (Shiny)', url: this.pokemon.sprites.front_shiny });
    }
    if (this.pokemon.sprites.back_shiny) {
      images.push({ name: 'Costas (Shiny)', url: this.pokemon.sprites.back_shiny });
    }
    if (this.pokemon.sprites.other?.dream_world?.front_default) {
      images.push({ name: 'Dream World', url: this.pokemon.sprites.other.dream_world.front_default });
    }
    
    return images;
  }

  toggleFavorite() {
    if (!this.pokemon) return;
    
    if (this.pokemonService.isFavorite(this.pokemon.id)) {
      this.pokemonService.removeFromFavorites(this.pokemon.id);
    } else {
      this.pokemonService.addToFavorites(this.pokemon);
    }
  }

  isFavorite(): boolean {
    return this.pokemon ? this.pokemonService.isFavorite(this.pokemon.id) : false;
  }

  formatPokemonName(name: string): string {
    return this.pokemonService.formatPokemonName(name);
  }

  getTypeColor(type: string): string {
    return this.pokemonService.getTypeColor(type);
  }

  getStatPercentage(stat: number): number {
    // Base máxima de status é tipicamente 255
    return Math.min((stat / 255) * 100, 100);
  }

  getStatColor(statName: string): string {
    const colors: { [key: string]: string } = {
      hp: '#FF5959',
      attack: '#F5AC78',
      defense: '#FAE078',
      'special-attack': '#9DB7F5',
      'special-defense': '#A7DB8D',
      speed: '#FA92B2'
    };
    return colors[statName] || '#68A090';
  }

  onSegmentChanged(event: any) {
    this.selectedSegment = event.detail.value;
  }
} 