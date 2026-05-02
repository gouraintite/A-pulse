using Apulse.Api.Models;

namespace Apulse.Api.Services;

public interface IJwtService
{
    string GenerateToken(User user);
}