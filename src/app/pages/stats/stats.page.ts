import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.page.html',
  styleUrls: ['./stats.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class StatsPage implements OnInit {
  selectedView = 'overview';
  
  // Estatísticas gerais
  generalStats = {
    totalPokemon: 1010,
    totalTypes: 18,
    totalGenerations: 9,
    favoritesCount: 0,
    averageHeight: 12.8,
    averageWeight: 69.4
  };

  // Estatísticas por tipo
  typeStats = [
    { name: 'water', count: 144, percentage: 14.3 },
    { name: 'normal', count: 109, percentage: 10.8 },
    { name: 'flying', count: 101, percentage: 10.0 },
    { name: 'grass', count: 98, percentage: 9.7 },
    { name: 'psychic', count: 85, percentage: 8.4 },
    { name: 'bug', count: 77, percentage: 7.6 },
    { name: 'fire', count: 64, percentage: 6.3 },
    { name: 'poison', count: 54, percentage: 5.3 },
    { name: 'rock', count: 46, percentage: 4.6 },
    { name: 'ground', count: 43, percentage: 4.3 }
  ];

  // Estatísticas por geração
  generationStats = [
    { number: 'I', name: 'Kanto', count: 151, years: '1996' },
    { number: 'II', name: 'Johto', count: 100, years: '1999' },
    { number: 'III', name: 'Hoenn', count: 135, years: '2002' },
    { number: 'IV', name: 'Sinnoh', count: 107, years: '2006' },
    { number: 'V', name: 'Unova', count: 156, years: '2010' },
    { number: 'VI', name: 'Kalos', count: 72, years: '2013' },
    { number: 'VII', name: 'Alola', count: 81, years: '2016' },
    { number: 'VIII', name: 'Galar', count: 89, years: '2019' },
    { number: 'IX', name: 'Paldea', count: 119, years: '2022' }
  ];

  // Estatísticas de força
  strongestPokemon = [
    { name: 'Arceus', stat: 'Total', value: 720 },
    { name: 'Regigigas', stat: 'Ataque', value: 160 },
    { name: 'Shuckle', stat: 'Defesa', value: 230 },
    { name: 'Blissey', stat: 'HP', value: 255 },
    { name: 'Deoxys (Speed)', stat: 'Velocidade', value: 180 }
  ];

  constructor(private pokemonService: PokemonService) {}

  ngOnInit() {
    this.updateFavoritesCount();
  }

  updateFavoritesCount() {
    // Simular contagem de favoritos
    const favorites = JSON.parse(localStorage.getItem('pokemon-favorites') || '[]');
    this.generalStats.favoritesCount = favorites.length;
  }

  formatPokemonName(name: string): string {
    return this.pokemonService.formatPokemonName(name);
  }

  getTypeColor(type: string): string {
    return this.pokemonService.getTypeColor(type);
  }

  onSegmentChanged(event: any) {
    this.selectedView = event.detail.value;
  }
} 