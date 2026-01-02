import { Link } from 'react-router-dom';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import LoginForm from './components/LoginForm';

const LoginPage = () => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Welcome back! Please enter your credentials to log in.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
      <CardFooter className="justify-center">
        <span className="text-muted-foreground">Don't have an account?</span>
        <Link
          to="/register"
          className="text-muted-foreground hover:text-primary ml-2 underline underline-offset-4"
        >
          Register
        </Link>
      </CardFooter>
    </Card>
  );
};

export default LoginPage;
