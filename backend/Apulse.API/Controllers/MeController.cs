using System.Security.Claims;
using Apulse.Api.Dtos.Auth;
using Apulse.Api.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Apulse.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/me")]
public class MeController : ControllerBase
{
    private readonly ApulseDbContext _context;

    public MeController(ApulseDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<UserResponse>> GetMyProfile()
    {
        // Récupérer l'ID depuis le token
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        var user = await _context.Users.FindAsync(userId);
        if (user is null)
            return NotFound();

        var response = new UserResponse(
            user.Id, user.Email, user.FirstName, user.LastName,
            user.Department, user.Role, user.CreatedAt
        );

        return Ok(response);
    }
}