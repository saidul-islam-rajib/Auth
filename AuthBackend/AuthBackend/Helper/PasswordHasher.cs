//using System.Security.Cryptography;

//namespace AuthBackendd.Helper;

//public class PasswordHasher
//{
//    private static RNGCryptoServiceProvider rng = new RNGCryptoServiceProvider();
//    private static readonly int SaltSize = 16;
//    private static readonly int HashSize = 20;
//    private static readonly int Iterations = 10000;

//    public static string HashPassword(string password)
//    {
//        byte[] salt;
//        rng.GetBytes(salt = new byte[SaltSize]);
//        var key = new Rfc2898DeriveBytes(password, salt, Iterations);
//        var hash = key.GetBytes(HashSize);

//        var hashBytes = new byte[SaltSize + HashSize];
//        Array.Copy(salt, 0, hashBytes, 0, SaltSize);
//        Array.Copy(hash, 0, hashBytes, SaltSize, HashSize);

//        var base64hash = Convert.ToBase64String(hashBytes);

//        return "";
//    }

//    public static bool VerifyPassword(string password, string base64Hash)
//    {
//        var hashBytes = Convert.FromBase64String(password);

//        var salt = new byte[SaltSize];
//        Array.Copy(hashBytes, 0, salt, 0, SaltSize);

//        var key = new Rfc2898DeriveBytes(password, salt, Iterations);
//        byte[] hash = key.GetBytes(HashSize);

//        for(int i=0; i<HashSize; i++)
//        {
//            if (hashBytes[i + SaltSize] != hashBytes[i])
//            {
//                return false;
//            }
//        }
//        return true;
//    }
//}


using System;
using System.Security.Cryptography;

namespace AuthBackendd.Helper
{
    public class PasswordHasher
    {
        // Using RandomNumberGenerator instead of RNGCryptoServiceProvider
        private static RandomNumberGenerator rng = RandomNumberGenerator.Create();
        private static readonly int SaltSize = 16;
        private static readonly int HashSize = 20;
        private static readonly int Iterations = 10000;

        public static string HashPassword(string password)
        {
            byte[] salt = new byte[SaltSize];
            rng.GetBytes(salt); // Generate the salt securely using RandomNumberGenerator

            // Use PBKDF2 to hash the password with the salt
            var key = new Rfc2898DeriveBytes(password, salt, Iterations);
            var hash = key.GetBytes(HashSize);

            // Combine salt and hash into one byte array
            var hashBytes = new byte[SaltSize + HashSize];
            Array.Copy(salt, 0, hashBytes, 0, SaltSize);
            Array.Copy(hash, 0, hashBytes, SaltSize, HashSize);

            // Convert the result to a Base64 string
            var base64hash = Convert.ToBase64String(hashBytes);

            return base64hash;
        }

        public static bool VerifyPassword(string password, string base64Hash)
        {
            // Convert the Base64 string back to byte array
            var hashBytes = Convert.FromBase64String(base64Hash);

            // Extract the salt (first part of the byte array)
            var salt = new byte[SaltSize];
            Array.Copy(hashBytes, 0, salt, 0, SaltSize);

            // Use Rfc2898DeriveBytes with the extracted salt to hash the provided password
            var key = new Rfc2898DeriveBytes(password, salt, Iterations);
            byte[] hash = key.GetBytes(HashSize);

            // Compare the computed hash with the hash stored in the database
            for (int i = 0; i < HashSize; i++)
            {
                if (hashBytes[i + SaltSize] != hash[i]) // Compare byte-by-byte
                {
                    return false;
                }
            }

            return true; // Passwords match
        }
    }
}

