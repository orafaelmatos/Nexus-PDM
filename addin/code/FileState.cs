namespace PDMAddin.Code
{
    public enum FileStatus
    {
        Available,
        Modified,
        CheckedOut,
        Added
    }

    public class FileMetadata
    {
        public string FilePath { get; set; }
        public bool IsCheckedOut { get; set; }
        public string CheckedOutBy { get; set; }
        public System.DateTime? CheckoutDate { get; set; }
    }
}
