

using Apulse.Api.Data;
using Apulse.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]

public class UsersController : ControllerBase
{
    private readonly ApulseDbContext _context;

    public UsersController(ApulseDbContext context)
    {
        _context = context;
    }

    //GET api/users
    [HttpGet]
    public async Task<ActionResult<IEnumerable<User>>> GetAll()
    {
        var users = await _context.Users.ToListAsync();
        return Ok(users);
    }

    // // GET api/users/5
    [HttpGet("{id:int}")]
    public async Task<ActionResult<User>> GetUserById(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if(user is null)
            return NotFound();
        return Ok(user);
    }

    // // POST api/users
    [HttpPost]
    public async Task<ActionResult<User>> Create([FromBody] User user)
    {
        _context.Add(user);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetUserById), new {id = user.Id}, user);
    }

}
