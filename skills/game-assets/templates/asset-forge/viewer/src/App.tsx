import { useEffect, useMemo, useState, type KeyboardEvent } from 'react';
import { Preview } from './Preview';
import { buildTree, exportCommand, matchesQuery } from './tree';
import type { AssetEntry, AssetListResponse, GameConfig } from './types';

export function App() {
  const [assets, setAssets] = useState<AssetEntry[]>([]);
  const [games, setGames] = useState<GameConfig[]>([]);
  const [game, setGame] = useState('');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/assets')
      .then((res) => res.json() as Promise<AssetListResponse>)
      .then((data) => {
        setAssets(data.assets);
        setGames(data.games);
        setGame(data.games[0]?.name ?? '');
      })
      .catch(() => setError('Não foi possível ler a pasta de assets.'));
  }, []);

  const visible = useMemo(() => assets.filter((a) => matchesQuery(a, query)), [assets, query]);
  const tree = useMemo(() => buildTree(visible), [visible]);
  const current = assets.find((a) => a.relPath === selected) ?? null;

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    const index = visible.findIndex((a) => a.relPath === selected);
    const next = visible[event.key === 'ArrowDown' ? index + 1 : index - 1];
    if (next) setSelected(next.relPath);
  }

  return (
    <div className="app">
      <header className="top">
        <h1>Asset Forge</h1>
        <input
          type="search"
          placeholder="Buscar por nome ou caminho"
          aria-label="Buscar assets"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <span className="count" aria-live="polite">
          {visible.length === assets.length ? `${assets.length} assets` : `${visible.length} de ${assets.length} assets`}
        </span>
      </header>

      <div className="body">
        <nav className="tree" aria-label="Assets" onKeyDown={onKeyDown}>
          {error && <p className="warn">{error}</p>}
          {tree.map((project) => (
            <details key={project.name} open>
              <summary>{project.name}</summary>
              {project.categories.map((category) => (
                <details key={category.name} open>
                  <summary>
                    {category.name} <span className="muted">({category.files.length})</span>
                  </summary>
                  <ul>
                    {category.files.map((file) => (
                      <li key={file.relPath}>
                        <button
                          type="button"
                          aria-current={file.relPath === selected}
                          className={file.relPath === selected ? 'file on' : 'file'}
                          onClick={() => setSelected(file.relPath)}
                        >
                          {file.file}
                        </button>
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
            </details>
          ))}
          {!error && assets.length === 0 && <p className="muted">Nenhum asset em assets/&lt;projeto&gt;/&lt;categoria&gt;/.</p>}
        </nav>

        <main>{current ? <Preview asset={current} /> : <p className="muted pad">Selecione um asset.</p>}</main>
      </div>

      <footer className="foot">
        {games.length > 1 && (
          <select aria-label="Jogo de destino" value={game} onChange={(e) => setGame(e.target.value)}>
            {games.map((g) => (
              <option key={g.name} value={g.name}>
                {g.name} ({g.target})
              </option>
            ))}
          </select>
        )}
        <code>{current && game ? exportCommand(game, current) : 'Selecione um asset para ver o comando de export.'}</code>
        {current && game && (
          <button type="button" onClick={() => void navigator.clipboard.writeText(exportCommand(game, current))}>
            Copiar
          </button>
        )}
      </footer>
    </div>
  );
}
