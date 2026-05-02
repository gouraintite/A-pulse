
using Apulse.Api.Data;
using Apulse.Api.Dtos.Auth;
using Apulse.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Apulse.Api.Services;
public class AuthService:IAuthService
{
    public readonly ApulseDbContext _context;
    private readonly IJwtService _jwtService;
    private readonly IConfiguration _configuration;

    public AuthService(
        ApulseDbContext context,
        IJwtService jwtService,
        IConfiguration configuration)
    {
        _context = context;
        _jwtService = jwtService;
        _configuration = configuration;
    }
    public async Task<UserResponse> RegisterAsync(RegisterRequest request)
    {
        // Verifier que l'email n'existe pas déja
        var emailExist = await _context.Users.AnyAsync(e => e.Email == request.Email);

        if (emailExist)
        {
            throw new InvalidOperationException("Email already registered.");
        }

        // Hasher le mot de password
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

        // Créer le User
        var user = new User
        {
            Email = request.Email,
            FirstName = request.FirstName,
            LastName = request.LastName,
            Department = request.Department ?? string.Empty,
            PasswordHash = passwordHash,
            Role = "User"
        };

        // Add user to DB
        _context.Add(user);
        await _context.SaveChangesAsync();

        //Mapper vers UserResponse
        return new UserResponse(
            user.Id,
            user.Email,
            user.FirstName,
            user.LastName,
            user.Department,
            user.Role,
            user.CreatedAt
        );

    }

    // login service
    public async Task<LoginResponse> LoginAsync(LoginRequest request)
    {
        // Trouver le user
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email);

        if (user is null)
            throw new UnauthorizedAccessException("Invalid credentials.");

        // Vérifier le password (BCrypt compare le hash)
        var passwordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);

        if (!passwordValid)
            throw new UnauthorizedAccessException("Invalid credentials.");

        // Générer le token
        var token = _jwtService.GenerateToken(user);
        var expiryInMinutes = int.Parse(_configuration["Jwt:ExpiryInMinutes"] ?? "60");
        var expiresAt = DateTime.UtcNow.AddMinutes(expiryInMinutes);

        // Construire la réponse
        var userResponse = new UserResponse(
            user.Id, user.Email, user.FirstName, user.LastName,
            user.Department, user.Role, user.CreatedAt
        );

        // la retourner
        return new LoginResponse(token, expiresAt,userResponse);
    }
}