namespace Apulse.Api.Dtos.Auth;

public record LoginResponse(
    string Token,
    DateTime ExpireAt,
    UserResponse User
);