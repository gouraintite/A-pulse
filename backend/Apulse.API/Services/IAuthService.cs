using Apulse.Api.Dtos.Auth;

namespace Apulse.Api.Services;

public interface IAuthService
{
    Task<UserResponse> RegisterAsync(RegisterRequest request);
}