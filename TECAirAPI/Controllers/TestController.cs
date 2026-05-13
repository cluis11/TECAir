using Microsoft.AspNetCore.Mvc;

namespace TECAirAPI.Controllers;

[ApiController]
[Route("[controller]")]
public class TestController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new { message = "TECAir API funcionando" });
    }
}