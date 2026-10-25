# ASSETS: <nome do jogo>

> Guia de estilo e lista de assets. Fonte da verdade para qualquer arte nova. Decisões de design do jogo ficam em `GDD.md`.
> Atualizado em <AAAA-MM-DD>.

## Estilo visual
- **Estilo:** <pixel art, cel-shade, vetor...>
- **Vista:** <topo, lateral, isométrica>
- **Contorno:** <sem contorno | 1px escuro | ...>
- **Luz:** <de onde vem, sombras>
- **Tom:** <cômico, sombrio, sem sangue...>

## Paleta
| Papel | Hex | Uso |
|---|---|---|
| Fundo | #000000 | |
| Destaque | #000000 | |
| Perigo | #000000 | |

Máximo de cores por sprite: <N>. Cores fora da paleta precisam de justificativa aqui.

## Tamanhos base
| Tipo | Tamanho | Observação |
|---|---|---|
| Personagem / alien comum | 32x32 | |
| Chefe | 64x64 | |
| Item / ícone | 16x16 | |
| Tile | 16x16 | |
| UI (botão) | 48x16 | |

Tamanho de exibição = múltiplo inteiro do tamanho base (nunca fracionário, para não borrar). Pixels Per Unit (Unity): <16>.

## Padrão de nomes
`categoria_objeto_estado_NN.png`, tudo minúsculo em snake_case, índice de dois dígitos.
Exemplos: `enemy_alien_idle_01.png`, `ui_button_hover_01.png`, `tile_grass_base_01.png`.
Nomes são únicos no projeto: o nome vira identificador no código gerado.

## Estrutura de pastas
```
assets/<projeto>/<categoria>/<arquivo>.png
```
Categorias usadas: enemies, heroes, items, tiles, ui, fx.

## Destinos de export
| Jogo | Target | Destino |
|---|---|---|
| <jogo> | <electron | unity | roblox> | <caminho> |

## Lista de assets
Marque o estado: `[ ]` a fazer, `[~]` em andamento, `[x]` pronto e exportado.

### enemies
- [ ] `enemy_alien_idle_01.png` (32x32)

### heroes
- [ ] 

### items
- [ ] 

### tiles
- [ ] 

### ui
- [ ] 

### fx
- [ ] 

## Regras de qualidade
- Conferir no viewer em 100% e 400%, com fundo xadrez, antes de exportar.
- Sem anti-aliasing em pixel art; sem meio-pixel.
- Fundo transparente, sem margem sobrando.
