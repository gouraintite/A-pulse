
using Apulse.Api.Data;
using Apulse.Api.Dtos.Auth;
using Apulse.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Apulse.Api.Services;
public class AuthService:IAuthService
{
    public readonly ApulseDbContext _context;

    public AuthService(ApulseDbContext context)
    {
        _context = context;
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
}