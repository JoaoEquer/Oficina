import { useState } from 'react';
import { isValidAssetName } from '../../scripts/lib/naming';
import type { AssetEntry } from './types';

export const ZOOM_STEPS = [25, 50, 100, 200, 300, 400] as const;

interface Props {
  asset: AssetEntry;
}

export function Preview({ asset }: Props) {
  const [zoom, setZoom] = useState<number>(200);
  const [crisp, setCrisp] = useState(true);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);

  const src = `/files/${asset.relPath.split('/').map(encodeURIComponent).join('/')}`;
  const width = size ? Math.round((size.w * zoom) / 100) : undefined;

  return (
    <section className="preview" aria-label={`Preview de ${asset.name}`}>
      <div className="toolbar">
        <label>
          Zoom
          <select value={zoom} onChange={(e) => setZoom(Number(e.target.value))}>
            {ZOOM_STEPS.map((z) => (
              <option key={z} value={z}>
                {z}%
              </option>
            ))}
          </select>
        </label>
        <label className="check">
          <input type="checkbox" checked={crisp} onChange={(e) => setCrisp(e.target.checked)} />
          Nítido (pixelated)
        </label>
        <span className="meta">
          {size ? `${size.w}×${size.h}px` : '…'} · {asset.ext.toUpperCase()}
        </span>
        {!isValidAssetName(asset.name) && <span className="warn">nome fora do padrão</span>}
      </div>
      <div className="stage">
        <img
          key={src}
          src={src}
          alt={asset.name}
          width={width}
          style={{ imageRendering: crisp ? 'pixelated' : 'auto' }}
          onLoad={(e) => setSize({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight })}
        />
      </div>
    </section>
  );
}
