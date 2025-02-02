using AuthBackendd.Context;
using AuthBackendd.Helper;
using AuthBackendd.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;

namespace AuthBackendd.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly AuthDbContext _context;

    public UserController(AuthDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [Authorize]
    public async Task<ActionResult<IEnumerable<User>>> GetAllUsers()
    {
        var response = await _context.Users.ToListAsync();
        return Ok(response);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] User user)
    {
        if(user is null)
        {
            return BadRequest();
        }

        var userInformation = await _context.Users.FirstOrDefaultAsync(x => x.UserName == user.UserName);
        if(userInformation is null)
        {
            return NotFound(new { Message = "User is not found."});
        }

        if (!PasswordHasher.VerifyPassword(user.Password, userInformation.Password))
        {
            return BadRequest(new
            {
                Message = "Incorrect password."
            });
        }

        user.Token = GenerateToken(userInformation);

        return Ok(new
        {
            Token = user.Token,
            Message = "Login Success"
        });
    }

    

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] User user)
    {
        if (user is null)
        {
            return BadRequest();
        }

        // check for existing user information like username, or email address
        if(await IsUserNameExists(user.UserName))
        {
            return BadRequest(new
            {
                Message = "User Name already exists."
            });
        }
        if (await IsEmailExists(user.Email))
        {
            return BadRequest(new
            {
                Message = "Email already exists."
            });
        }

        // check for password strength
        var pass = IsStrengthPass(user.Password);
        if (!string.IsNullOrEmpty(pass))
        {
            return BadRequest(new
            {
                Message = pass.ToString()
            });
        }

        user.Password = PasswordHasher.HashPassword(user.Password);
        user.Role = "Admin";
        user.Token = "";

        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();


        return Ok(new
        {
            Message = "User registered."
        });
    }

    private string IsStrengthPass(string password)
    {
        StringBuilder sb = new StringBuilder();
        if(password.Length < 6)
        {
            sb.Append("Minimum passsword length should be 6" + Environment.NewLine);
        }

        if(!(Regex.IsMatch(password, "[a-z]") && Regex.IsMatch(password, "[A-Z]") && Regex.IsMatch(password, "[0-9]")))
        {
            sb.Append("Password should be Alphanumeric" + Environment.NewLine);
        }

        return sb.ToString();
    }

    private async Task<bool> IsUserNameExists(string username)
    {
        return await _context.Users.AnyAsync(x => x.UserName == username);
    }
    private async Task<bool> IsEmailExists(string email)
    {
        return await _context.Users.AnyAsync(x => x.Email == email);
    }
    private string GenerateToken(User user)
    {
        var signingCredentials = new SigningCredentials(
                new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes("your-very-secure-and-long-key-string-here-32-chars")),
                SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.GivenName, $"{user.FirstName} {user.LastName}"),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };

        var securityToken = new JwtSecurityToken(
            issuer: "sober.org.bd",
            audience: "Rajib",
            expires: DateTime.UtcNow.AddMinutes(60),
            claims: claims,
            signingCredentials: signingCredentials);

        return new JwtSecurityTokenHandler().WriteToken(securityToken);
    }
}
