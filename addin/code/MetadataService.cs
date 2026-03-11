using System;
using System.IO;
using Newtonsoft.Json;

namespace PDMAddin.Code
{
    public class MetadataService
    {
        private const string MetadataFileName = ".pdm_metadata.json";

        public FileMetadata GetMetadata(string filePath)
        {
            string metadataPath = GetMetadataPath(filePath);
            if (!File.Exists(metadataPath)) return null;

            try
            {
                string json = File.ReadAllText(metadataPath);
                return JsonConvert.DeserializeObject<FileMetadata>(json);
            }
            catch { return null; }
        }

        public void SaveMetadata(string filePath, FileMetadata metadata)
        {
            string metadataPath = GetMetadataPath(filePath);
            string json = JsonConvert.SerializeObject(metadata, Formatting.Indented);
            File.WriteAllText(metadataPath, json);
        }

        public void DeleteMetadata(string filePath)
        {
            string metadataPath = GetMetadataPath(filePath);
            if (File.Exists(metadataPath)) File.Delete(metadataPath);
        }

        private string GetMetadataPath(string filePath)
        {
            return filePath + ".pdm";
        }
    }
}
