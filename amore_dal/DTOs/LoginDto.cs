using amore_dal.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace amore_dal.DTOs
{
    public class LoginDto
    {
        [Required]
        [StringLength(20, MinimumLength = 3)]
        public string Username { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
