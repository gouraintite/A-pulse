using Microsoft.AspNetCore.Mvc;

namespace Apulse.API.Controllers;

[ApiController]
[Route("[controller]")]
public class WeatherForecastController : ControllerBase
{
    private static readonly string[] Summaries = new[]
    {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    };

    private static int _counter = 0;

    private readonly ILogger<WeatherForecastController> _logger;

    public WeatherForecastController(ILogger<WeatherForecastController> logger)
    {
        _logger = logger;
    }

    public class Detailed:WeatherForecast
    {
       public int Id { get; set; }
    }

    [HttpGet(Name = "GetWeatherForecast")]
    public IEnumerable<Detailed> Get()
    {
        return Enumerable.Range(1, 10).Select(index => new Detailed
        {
            Id = _counter++,
            Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            TemperatureC = Random.Shared.Next(-20, 55),
            Summary = Summaries[Random.Shared.Next(Summaries.Length)]
        }
        
        ).ToArray();
    }
}

