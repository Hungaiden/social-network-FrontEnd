'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Mail, Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { login, register, decodeToken } from '@/services/authService';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin && username && password) {
        // Call login API
        const response = await login({
          username,
          password,
        });

        if (response.code === 1000 && response.result.authenticated) {
          // Decode JWT token to get user info
          const tokenData = decodeToken(response.result.token);
          const userId = tokenData?.sub || tokenData?.userId || '1';

          const user = {
            id: userId,
            username,
            displayName: username,
            email: email || `${username}@example.com`,
            avatar: '/user-avatar.jpg',
          };
          localStorage.setItem('current_user', JSON.stringify(user));

          toast({
            title: 'Đăng nhập thành công',
            description: 'Chào mừng trở lại!',
          });

          router.push('/dashboard/timeline');
        }
      } else if (!isLogin && email && password && displayName && username) {
        // Call register API
        const registerResponse = await register({
          username,
          email,
          password,
          displayName,
        });

        if (registerResponse.code === 1000) {
          toast({
            title: 'Đăng ký thành công',
            description: 'Tài khoản của bạn đã được tạo. Vui lòng đăng nhập.',
          });

          // Reset form and switch to login
          setIsLogin(true);
          setEmail('');
          setPassword('');
          setDisplayName('');
          setUsername('');
        }
      }
    } catch (error: any) {
      toast({
        title: isLogin ? 'Đăng nhập thất bại' : 'Đăng ký thất bại',
        description: error.message || 'Vui lòng kiểm tra thông tin và thử lại.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-white text-3xl font-bold mb-6">Fakebook</h1>
          <h2 className="text-white text-3xl font-bold mb-2">
            {isLogin ? 'Chào mừng trở lại' : 'Tham gia với chúng tôi'}
          </h2>
          <p className="text-gray-400 text-sm">
            {isLogin ? 'Nhập thông tin để tiếp tục hành trình' : 'Tạo tài khoản để bắt đầu'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          {!isLogin && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Tên hiển thị</label>
                <Input
                  placeholder="John Doe"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  disabled={isLoading}
                  className="bg-white border-0 text-black placeholder:text-gray-500 px-4 py-3"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Tên người dùng</label>
                <Input
                  placeholder="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  required
                  className="bg-white border-0 text-black placeholder:text-gray-500 px-4 py-3"
                />
              </div>
            </>
          )}

          {isLogin && (
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-500" />
              <Input
                type="text"
                placeholder="Tên người dùng"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                required
                className="bg-white border-0 text-black placeholder:text-gray-500 pl-12 pr-4 py-3"
              />
            </div>
          )}

          {!isLogin && (
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-500" />
              <Input
                type="email"
                placeholder="Email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
                className="bg-white border-0 text-black placeholder:text-gray-500 pl-12 pr-4 py-3"
              />
            </div>
          )}

          <div className="relative">
            <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-500" />
            <Input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
              className="bg-white border-0 text-black placeholder:text-gray-500 pl-12 pr-4 py-3"
            />
          </div>

          {isLogin && (
            <div className="text-right">
              <button
                type="button"
                className="text-sm text-gray-400 hover:text-gray-200 transition-colors"
              >
                Quên mật khẩu?
              </button>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Đang kết nối...
              </>
            ) : (
              <>
                {isLogin ? 'Đăng nhập' : 'Đăng ký'}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        <div className="text-center border-t border-gray-700 pt-6">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setEmail('');
              setPassword('');
              setDisplayName('');
              setUsername('');
            }}
            disabled={isLoading}
            className="text-sm text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLogin ? (
              <>
                Chưa có tài khoản?{' '}
                <span className="font-semibold text-white hover:text-gray-300">Đăng ký ngay</span>
              </>
            ) : (
              <>
                Đã có tài khoản?{' '}
                <span className="font-semibold text-white hover:text-gray-300">Đăng nhập</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
