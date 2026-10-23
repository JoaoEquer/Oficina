using System.IO;
using UnityEditor;
using UnityEngine;

// Installed by asset-forge into Assets/Editor. Applies pixel-art import settings to every
// texture under spritesRoot. Settings live in PixelArtImporter.json next to this file.
public class PixelArtImporter : AssetPostprocessor
{
    [System.Serializable]
    private class Settings
    {
        public string spritesRoot = "Assets/Sprites";
        public int pixelsPerUnit = 16;
    }

    private const string SettingsPath = "Assets/Editor/PixelArtImporter.json";

    private static Settings LoadSettings()
    {
        if (!File.Exists(SettingsPath)) return new Settings();
        return JsonUtility.FromJson<Settings>(File.ReadAllText(SettingsPath));
    }

    private void OnPreprocessTexture()
    {
        Settings settings = LoadSettings();
        if (!assetPath.StartsWith(settings.spritesRoot)) return;

        TextureImporter importer = (TextureImporter)assetImporter;
        importer.textureType = TextureImporterType.Sprite;
        importer.spriteImportMode = SpriteImportMode.Single;
        importer.spritePixelsPerUnit = settings.pixelsPerUnit;
        importer.filterMode = FilterMode.Point;
        importer.textureCompression = TextureImporterCompression.Uncompressed;
        importer.mipmapEnabled = false;
    }
}
