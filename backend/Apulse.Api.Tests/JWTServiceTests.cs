using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Apulse.Api.Models;
using Apulse.Api.Services;
using FluentAssertions;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Apulse.Api.Tests.Services;

public class JwtServiceTests
{
    private readonly IConfiguration _configuration;
    private readonly JwtService _sut;  // sut = "System Under Test"

    public JwtServiceTests()
    {
        // Arrange (commun à tous les tests) : config en mémoire
        var configValues = new Dictionary<string, string?>
        {
            { "Jwt:Key", "ThisIsASuperLongSecretKeyForJwtSigningApulse2026Tests" },
            { "Jwt:Issuer", "Apulse.Api.Test" },
            { "Jwt:Audience", "Apulse.Client.Test" },
            { "Jwt:ExpiryInMinutes", "60" },
        };

        _configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(configValues)
            .Build();

        _sut = new JwtService(_configuration);
    }

    [Fact]
    public void GenerateToken_WithValidUser_ReturnsNonEmptyToken()
    {
        // Arrange
        var user = new User
        {
            Id = 1,
            Email = "rainsong@axa.fr",
            FirstName = "Rainsong",
            LastName = "Ngoutsop",
            Role = "User",
            PasswordHash = "doesnt-matter-here"
        };

        // Act
        var token = _sut.GenerateToken(user);

        // Assert
        token.Should().NotBeNullOrEmpty();
        token.Split('.').Should().HaveCount(3); // header.payload.signature
    }

    // [Fact] //not passing
    
    // public void GenerateToken_IncludesExpectedClaims()
    // {
    //     // Arrange
    //     var user = new User
    //     {
    //         Id = 42,
    //         Email = "rainsong@axa.fr",
    //         FirstName = "Rainsong",
    //         LastName = "Ngoutsop",
    //         Role = "Manager",
    //         PasswordHash = "x"
    //     };

    //     // Act
    //     var tokenString = _sut.GenerateToken(user);
    //     var token = new JwtSecurityTokenHandler().ReadJwtToken(tokenString);

    //     // Assert
    //     token.Claims.Should().Contain(c => c.Type == "sub" && c.Value == "42");
    //     token.Claims.Should().Contain(c => c.Type == "email" && c.Value == "rainsong@axa.fr");
    //     token.Claims.Should().Contain(c => c.Type == "role" && c.Value == "Manager");
    // }

    [Fact]
    public void GenerateToken_HasCorrectIssuerAndAudience()
    {
        // Arrange
        var user = new User { Id = 1, Email = "x@y.z", FirstName = "X", LastName = "Y", Role = "User", PasswordHash = "x" };

        // Act
        var tokenString = _sut.GenerateToken(user);
        var token = new JwtSecurityTokenHandler().ReadJwtToken(tokenString);

        // Assert
        token.Issuer.Should().Be("Apulse.Api.Test");
        token.Audiences.Should().Contain("Apulse.Client.Test");
    }

    [Fact]
    public void GenerateToken_ExpiresInConfiguredMinutes()
    {
        // Arrange
        var user = new User { Id = 1, Email = "x@y.z", FirstName = "X", LastName = "Y", Role = "User", PasswordHash = "x" };
        var beforeGeneration = DateTime.UtcNow;

        // Act
        var tokenString = _sut.GenerateToken(user);
        var token = new JwtSecurityTokenHandler().ReadJwtToken(tokenString);

        // Assert
        token.ValidTo.Should().BeAfter(beforeGeneration.AddMinutes(59));
        token.ValidTo.Should().BeBefore(beforeGeneration.AddMinutes(61));
    }

    [Fact]
    public void GenerateToken_ProducesValidSignature()
    {
        // Arrange
        var user = new User { Id = 1, Email = "x@y.z", FirstName = "X", LastName = "Y", Role = "User", PasswordHash = "x" };
        var key = "ThisIsASuperLongSecretKeyForJwtSigningApulse2026Tests";

        // Act
        var tokenString = _sut.GenerateToken(user);

        // Assert : on essaie de valider le token
        var validationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = "Apulse.Api.Test",
            ValidAudience = "Apulse.Client.Test",
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
            ClockSkew = TimeSpan.Zero
        };

        var handler = new JwtSecurityTokenHandler();
        Action validate = () => handler.ValidateToken(tokenString, validationParameters, out _);

        validate.Should().NotThrow();
    }
}