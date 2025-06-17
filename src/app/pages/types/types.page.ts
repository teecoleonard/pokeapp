import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-types',
  templateUrl: './types.page.html',
  styleUrls: ['./types.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class TypesPage implements OnInit {
  pokemonTypes = [
    {
      name: 'normal',
      icon: 'ellipse',
      description: 'Pokémon comuns sem características especiais',
      weaknesses: ['fighting'],
      strengths: [],
      stats: { count: 0, avgAttack: 0, avgDefense: 0 }
    },
    {
      name: 'fire',
      icon: 'flame',
      description: 'Pokémon de fogo com ataques quentes e poderosos',
      weaknesses: ['water', 'ground', 'rock'],
      strengths: ['grass', 'ice', 'bug', 'steel'],
      stats: { count: 0, avgAttack: 0, avgDefense: 0 }
    },
    {
      name: 'water',
      icon: 'water',
      description: 'Pokémon aquáticos versáteis e defensivos',
      weaknesses: ['electric', 'grass'],
      strengths: ['fire', 'ground', 'rock'],
      stats: { count: 0, avgAttack: 0, avgDefense: 0 }
    },
    {
      name: 'electric',
      icon: 'flash',
      description: 'Pokémon elétricos rápidos e energéticos',
      weaknesses: ['ground'],
      strengths: ['water', 'flying'],
      stats: { count: 0, avgAttack: 0, avgDefense: 0 }
    },
    {
      name: 'grass',
      icon: 'leaf',
      description: 'Pokémon de plantas com habilidades naturais',
      weaknesses: ['fire', 'ice', 'poison', 'flying', 'bug'],
      strengths: ['water', 'ground', 'rock'],
      stats: { count: 0, avgAttack: 0, avgDefense: 0 }
    },
    {
      name: 'ice',
      icon: 'snow',
      description: 'Pokémon de gelo com ataques congelantes',
      weaknesses: ['fire', 'fighting', 'rock', 'steel'],
      strengths: ['grass', 'ground', 'flying', 'dragon'],
      stats: { count: 0, avgAttack: 0, avgDefense: 0 }
    },
    {
      name: 'fighting',
      icon: 'fitness',
      description: 'Pokémon lutadores fortes em combate físico',
      weaknesses: ['flying', 'psychic', 'fairy'],
      strengths: ['normal', 'ice', 'rock', 'dark', 'steel'],
      stats: { count: 0, avgAttack: 0, avgDefense: 0 }
    },
    {
      name: 'poison',
      icon: 'skull',
      description: 'Pokémon venenosos com ataques tóxicos',
      weaknesses: ['ground', 'psychic'],
      strengths: ['grass', 'fairy'],
      stats: { count: 0, avgAttack: 0, avgDefense: 0 }
    },
    {
      name: 'ground',
      icon: 'planet',
      description: 'Pokémon terrestres com ataques sísmicos',
      weaknesses: ['water', 'grass', 'ice'],
      strengths: ['fire', 'electric', 'poison', 'rock', 'steel'],
      stats: { count: 0, avgAttack: 0, avgDefense: 0 }
    },
    {
      name: 'flying',
      icon: 'paper-plane',
      description: 'Pokémon voadores ágeis e livres',
      weaknesses: ['electric', 'ice', 'rock'],
      strengths: ['grass', 'fighting', 'bug'],
      stats: { count: 0, avgAttack: 0, avgDefense: 0 }
    },
    {
      name: 'psychic',
      icon: 'eye',
      description: 'Pokémon psíquicos com poderes mentais',
      weaknesses: ['bug', 'ghost', 'dark'],
      strengths: ['fighting', 'poison'],
      stats: { count: 0, avgAttack: 0, avgDefense: 0 }
    },
    {
      name: 'bug',
      icon: 'bug',
      description: 'Pokémon insetos pequenos mas determinados',
      weaknesses: ['fire', 'flying', 'rock'],
      strengths: ['grass', 'psychic', 'dark'],
      stats: { count: 0, avgAttack: 0, avgDefense: 0 }
    },
    {
      name: 'rock',
      icon: 'square',
      description: 'Pokémon rochosos resistentes e duráveis',
      weaknesses: ['water', 'grass', 'fighting', 'ground', 'steel'],
      strengths: ['fire', 'ice', 'flying', 'bug'],
      stats: { count: 0, avgAttack: 0, avgDefense: 0 }
    },
    {
      name: 'ghost',
      icon: 'moon',
      description: 'Pokémon fantasmas misteriosos e etéreos',
      weaknesses: ['ghost', 'dark'],
      strengths: ['psychic', 'ghost'],
      stats: { count: 0, avgAttack: 0, avgDefense: 0 }
    },
    {
      name: 'dragon',
      icon: 'flash',
      description: 'Pokémon dragões poderosos e lendários',
      weaknesses: ['ice', 'dragon', 'fairy'],
      strengths: ['dragon'],
      stats: { count: 0, avgAttack: 0, avgDefense: 0 }
    },
    {
      name: 'dark',
      icon: 'moon',
      description: 'Pokémon sombrios com táticas astutas',
      weaknesses: ['fighting', 'bug', 'fairy'],
      strengths: ['psychic', 'ghost'],
      stats: { count: 0, avgAttack: 0, avgDefense: 0 }
    },
    {
      name: 'steel',
      icon: 'shield',
      description: 'Pokémon metálicos com alta defesa',
      weaknesses: ['fire', 'fighting', 'ground'],
      strengths: ['ice', 'rock', 'fairy'],
      stats: { count: 0, avgAttack: 0, avgDefense: 0 }
    },
    {
      name: 'fairy',
      icon: 'heart',
      description: 'Pokémon fadas mágicos e encantadores',
      weaknesses: ['poison', 'steel'],
      strengths: ['fighting', 'dragon', 'dark'],
      stats: { count: 0, avgAttack: 0, avgDefense: 0 }
    }
  ];

  loading = false;

  constructor(
    private pokemonService: PokemonService,
    private router: Router
  ) {}

  ngOnInit() {
    // Inicialização dos tipos Pokémon
    this.loadPokemonTypes();
  }

  private loadPokemonTypes() {
    // Lógica para carregar tipos se necessário
  }

  selectType(typeName: string) {
    this.router.navigate(['/tabs/search'], { 
      queryParams: { type: typeName } 
    });
  }

  formatPokemonName(name: string): string {
    return this.pokemonService.formatPokemonName(name);
  }

  getTypeColor(type: string): string {
    return this.pokemonService.getTypeColor(type);
  }

  getEffectivenessColor(effective: boolean): string {
    return effective ? 'success' : 'danger';
  }
} 