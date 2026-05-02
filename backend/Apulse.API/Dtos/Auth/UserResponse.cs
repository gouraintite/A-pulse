namespace Apulse.Api.Dtos.Auth;

public record UserResponse(
    int Id,
    string Email,
    string FirstName,
    string LastName,
    string? Department,
    string Role,
    DateTime CreatedAt
);