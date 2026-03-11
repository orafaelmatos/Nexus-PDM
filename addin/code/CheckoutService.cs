using System;

namespace PDMAddin.Code
{
    public class CheckoutService
    {
        private readonly MetadataService _metadataService;

        public CheckoutService(MetadataService metadataService)
        {
            _metadataService = metadataService;
        }

        public bool CheckOut(string filePath, string user)
        {
            var metadata = _metadataService.GetMetadata(filePath);
            if (metadata != null && metadata.IsCheckedOut) return false;

            metadata = new FileMetadata
            {
                FilePath = filePath,
                IsCheckedOut = true,
                CheckedOutBy = user,
                CheckoutDate = DateTime.Now
            };

            _metadataService.SaveMetadata(filePath, metadata);
            // In a real scenario, we might also toggle Read-Only flag on the file
            return true;
        }

        public void UndoCheckOut(string filePath)
        {
            _metadataService.DeleteMetadata(filePath);
        }

        public FileMetadata GetStatus(string filePath)
        {
            return _metadataService.GetMetadata(filePath);
        }
    }
}
