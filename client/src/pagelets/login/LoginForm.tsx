'use client';

import { useRouter } from 'next/navigation';

import { Button, Form, Input, Typography } from 'antd';
import { setCookie } from 'cookies-next';
import { BiLockAlt } from 'react-icons/bi';
import { PiUserCircleBold } from 'react-icons/pi';

import { useState } from 'react';

import { COLORS } from '@/constants/colors';
import AuthService from '@/services/auth';

import styles from './Login.module.css';
import { getCookieDomain } from '@/services/lib/utils';

/* COMPONENT */

const { Title, Text } = Typography;

export const LoginForm = () => {
  // State
  const [form] = Form.useForm();
  const [mfa, setMfa] = useState(false);
  const [ticket, setTicket] = useState('');

  const router = useRouter();

  // Handlers
  const onSubmit = async () => {
    const { email, password } = form.getFieldsValue();

    const response = await AuthService.Login(email, password);

    if (response?.mfa) {
      setMfa(true);
      setTicket(response?.ticket || '');
    } else if (response?.token) {
      setCookie('access_token', response.token, {
        domain: getCookieDomain(),
        maxAge: 60 * 60 * 24,
        path: '/',
        sameSite: 'none',
        secure: true,
      });
      router.push('/dashboard');
    }
  };

  const onVerify = async (data: { otp: string }) => {
    const { otp } = data;
    try {
      const response = await AuthService.Verify(ticket, otp);

      if (response?.token) {
        setCookie('access_token', response.token, {
          domain: getCookieDomain(),
          maxAge: 60 * 60 * 24,
          path: '/',
          sameSite: 'none',
          secure: true,
        });
        router.push('/dashboard');
      } else {
        throw new Error('Invalid OTP');
      }
    } catch (error) {
      console.error('Error when verifying OTP');
    }
  };

  return (
    <div className={styles.formLayout}>
      {mfa ? (
        <Form
          autoComplete='off'
          layout='vertical'
          requiredMark='optional'
          onFinish={onVerify}
        >
          <Form.Item
            label='2FA Code'
            name='otp'
            rules={[{ required: true, message: 'Please input your 2FA code' }]}
          >
            <Input placeholder='2FA Code' size='large' />
          </Form.Item>
          <Form.Item>
            <Button htmlType='submit' size='large' type='primary' block>
              Verify
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <>
          <div className={styles.formHeader}>
            <Title>Sign In</Title>
            <Text type='secondary'>
              Welcome back to our venue reservation and management platform!
              We&apos;re thrilled to have you here, ready to help you plan your
              next event effortlessly.
            </Text>
          </div>
          <Form
            form={form}
            autoComplete='off'
            layout='vertical'
            requiredMark='optional'
            onFinish={onSubmit}
          >
            <Form.Item
              label='Email'
              name='email'
              rules={[
                {
                  required: true,
                  message: 'Please input your email',
                  type: 'email',
                },
              ]}
            >
              <Input
                prefix={<PiUserCircleBold color={COLORS.SECONDARY} />}
                placeholder='Email'
                size='large'
              />
            </Form.Item>
            <Form.Item
              label='Password'
              name='password'
              rules={[
                { required: true, message: 'Please input your password' },
              ]}
            >
              <Input.Password
                prefix={<BiLockAlt color={COLORS.SECONDARY} />}
                placeholder='Password'
                size='large'
              />
            </Form.Item>
            <Form.Item>
              <a className={styles.forgotLink} href=''>
                Forgot password
              </a>
            </Form.Item>
            <Form.Item>
              <Button htmlType='submit' size='large' type='primary' block>
                Login
              </Button>
              Need an account? <a href='/register'>Sign Up</a>
            </Form.Item>
          </Form>
        </>
      )}
    </div>
  );
};
