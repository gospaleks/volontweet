import { Link } from 'react-router-dom';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import RegisterForm from './components/RegisterForm';

const RegisterPage = () => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>Create an account to get started!</CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterForm />
      </CardContent>
      <CardFooter className="justify-center">
        <span className="text-muted-foreground">Already have an account?</span>
        <Link
          to="/login"
          className="text-muted-foreground hover:text-primary ml-2 underline underline-offset-4"
        >
          Login
        </Link>
      </CardFooter>
    </Card>
  );
};

export default RegisterPage;
