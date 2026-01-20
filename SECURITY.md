# Security Policy

## Supported Versions

We actively support the following versions with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability in Green City Grow Hub, please help us by reporting it responsibly.

### How to Report

1. **Do not** create a public GitHub issue for the vulnerability
2. Email security reports to: security@greencitygrowhub.com
3. Include detailed information about:
   - The vulnerability description
   - Steps to reproduce
   - Potential impact
   - Any suggested fixes

### What to Expect

- **Acknowledgment**: We'll acknowledge receipt within 48 hours
- **Investigation**: We'll investigate and provide regular updates
- **Resolution**: We'll work on a fix and coordinate disclosure
- **Credit**: We'll credit you in the security advisory (if desired)

## Security Measures

### Authentication & Authorization
- JWT-based authentication with short-lived access tokens (15 minutes)
- Refresh tokens with secure storage and automatic revocation
- Password hashing using bcrypt with salt rounds
- Rate limiting on authentication endpoints

### Data Protection
- HTTPS enforcement in production
- Secure headers (HSTS, CSP, X-Frame-Options)
- Input validation and sanitization
- SQL injection prevention with parameterized queries

### File Upload Security
- Magic byte validation for file type verification
- Antivirus scanning with ClamAV integration
- File size limits and type restrictions
- Secure filename sanitization

### Infrastructure Security
- Container security with non-root user execution
- Regular dependency updates and security audits
- Environment variable validation
- Database connection encryption

## Security Best Practices

### For Developers
- Always validate and sanitize user inputs
- Use parameterized queries for database operations
- Implement proper error handling without exposing sensitive information
- Keep dependencies updated and review for vulnerabilities
- Use environment variables for sensitive configuration

### For Users
- Use strong, unique passwords
- Enable two-factor authentication when available
- Keep your browser and devices updated
- Be cautious with file uploads and downloads
- Report suspicious activity

## Security Updates

Security updates will be released as patch versions and documented in:
- [CHANGELOG.md](CHANGELOG.md)
- GitHub Security Advisories
- Release notes

## Contact

For security-related questions or concerns:
- Email: security@greencitygrowhub.com
- GitHub Security: https://github.com/your-org/green-city-grow-hub/security

## Responsible Disclosure

We kindly ask that you:
- Give us reasonable time to fix issues before public disclosure
- Avoid accessing or modifying user data
- Respect the privacy and rights of our users
- Follow ethical disclosure practices

Thank you for helping keep Green City Grow Hub secure!
