
using Apulse.Api.Data;
using Apulse.Api.Dtos.Auth;
using Apulse.Api.Services;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace Apulse.Api.Controllers;

[ApiController]
[Route("api/[controller]")]

public class AuthController: ControllerBase
{
    public readonly IAuthService _authservice;

    public AuthController(IAuthService authservic)
    {
        _authservice = authservic;
    }

    [HttpPost("register")]
    public async Task<ActionResult<UserResponse>> Register([FromBody] RegisterRequest registerRequest)
    {
        try
        {
            var user = await _authservice.RegisterAsync(registerRequest);
            return CreatedAtAction(nameof(Register), new {id = user.Id}, user);
        }
        catch (Exception ex)
        {
            return Conflict(new {error = ex.Message});
        }
    }
}