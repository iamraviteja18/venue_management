import { createClientHttpClient } from './lib/client';
const http = createClientHttpClient();

export type User = {
  _id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  secret: string;
  role: string;
};

const GetMe = async () => {
  const res = await http.get<User>('/auth/me');
  return res.data;
};

const Register = async (name: string, email: string, password: string) => {
  const res = await http.post<
    {
      name: string;
      email: string;
      password: string;
    },
    {
      qr: string;
      uid: string;
      token: string;
      ticket: string;
    }
  >('/auth/register', {
    name,
    email,
    password,
  });

  return res.data;
};

const Login = async (email: string, password: string) => {
  const res = await http.post<
    {
      email: string;
      password: string;
    },
    {
      mfa: boolean;
      uid: string;
      ticket?: string;
      token?: string;
    }
  >('/auth/login', {
    email,
    password,
  });

  return res.data;
};

const Verify = async (ticket: string, code: string) => {
  const res = await http.post<
    {
      ticket: string;
      code: string;
    },
    {
      mfa: boolean;
      uid: string;
      token: string;
    }
  >('/auth/mfa', {
    ticket,
    code,
  });

  return res.data;
};

const AuthService = {
  GetMe,
  Register,
  Login,
  Verify,
};

export default AuthService;
