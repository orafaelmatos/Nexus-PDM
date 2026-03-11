using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace PDMAddin.Code
{
    public class ApiService
    {
        private readonly HttpClient _client;
        private const string BaseUrl = "http://localhost:8000/api/";

        public ApiService()
        {
            _client = new HttpClient();
            // In a real app, add Auth headers here
        }

        public async Task NotifyCheckout(string fileName, string user, bool isCheckout)
        {
            try
            {
                var payload = new { fileName, user, action = isCheckout ? "checkout" : "undo" };
                var content = new StringContent(JsonConvert.SerializeObject(payload), Encoding.UTF8, "application/json");
                // Example endpoint
                await _client.PostAsync($"{BaseUrl}pdm/sync-status/", content);
            }
            catch { /* Ignore network errors for now */ }
        }
    }
}
