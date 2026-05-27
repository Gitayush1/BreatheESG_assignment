import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  EnergySavingsLeaf as EcoIcon,
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [username, setUsername] = useState('analyst@breatheesg.com');
  const [password, setPassword] = useState('demo2026');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0a0e1a 0%, #111827 50%, #0a0e1a 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-20%',
          left: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.06) 0%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
        <Box className="animate-fade-in">
          {/* Logo */}
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '18px',
                background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2.5,
                boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)',
                animation: 'float 3s ease-in-out infinite',
              }}
            >
              <EcoIcon sx={{ color: '#fff', fontSize: 32 }} />
            </Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 0.5,
              }}
            >
              BreatheESG
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              Emissions Data Intelligence Platform
            </Typography>
          </Box>

          {/* Login Card */}
          <Box
            sx={{
              p: 4,
              borderRadius: '20px',
              background: 'rgba(17, 24, 39, 0.6)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              boxShadow: '0 24px 80px rgba(0, 0, 0, 0.4)',
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, mb: 0.5, color: '#f1f5f9' }}
            >
              Welcome back
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, color: '#64748b' }}>
              Sign in to access your dashboard
            </Typography>

            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 2.5,
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  color: '#fca5a5',
                }}
              >
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="login-username"
                label="Email Address"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: '#64748b', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 1 }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="login-password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: '#64748b', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
                        sx={{ color: '#64748b' }}
                      >
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 1 }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  borderRadius: '12px',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #34d399, #10b981)',
                    boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
                    transform: 'translateY(-1px)',
                  },
                  '&:active': {
                    transform: 'translateY(0)',
                  },
                  '&.Mui-disabled': {
                    background: 'rgba(255, 255, 255, 0.08)',
                  },
                  transition: 'all 0.25s ease',
                }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </Box>

            {/* Demo credentials */}
            <Box
              sx={{
                mt: 2,
                p: 2,
                borderRadius: '10px',
                background: 'rgba(16, 185, 129, 0.05)',
                border: '1px solid rgba(16, 185, 129, 0.1)',
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  fontWeight: 700,
                  color: '#10b981',
                  mb: 0.5,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  fontSize: '0.65rem',
                }}
              >
                Demo Credentials
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', color: '#94a3b8', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                analyst@breatheesg.com
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', color: '#94a3b8', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                demo2026
              </Typography>
            </Box>
          </Box>

          {/* Footer */}
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              textAlign: 'center',
              mt: 4,
              color: '#475569',
              fontSize: '0.7rem',
            }}
          >
            © 2026 BreatheESG · Emissions Data Intelligence
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Login;
