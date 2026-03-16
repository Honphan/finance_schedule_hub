import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import type { AuthResponse } from '../../types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post<AuthResponse>('/auth/login', {
        username,
        password,
      });

      const data = response.data;
      
      // Assume API returns user object and a JWT token.
      // Adjust this based on your actual backend response structure.
      const token = data.token || 'dummy-token-for-now'; 
      
      login({
        id: data.id,
        username: data.username,
        email: data.email,
        role: data.role as any,
      }, token);

      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials or server error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your username below to login to your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            {error && <div className="text-sm font-medium text-destructive">{error}</div>}
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="johndoe"
                required
                value={username}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <div className="text-sm text-center text-muted-foreground w-full">
            Don't have an account?{' '}
            <Link to="/register" className="underline underline-offset-4 hover:text-primary">
              Register
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
