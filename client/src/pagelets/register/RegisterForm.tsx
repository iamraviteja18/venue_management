'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { Button, Form, Input, Typography } from 'antd';
import { setCookie } from 'cookies-next';
import { BiLockAlt } from 'react-icons/bi';
import { MdOutlineBadge } from 'react-icons/md';
import { PiUserCircleBold } from 'react-icons/pi';

import { COLORS } from '@/constants/colors';
import AuthService from '@/services/auth';

import styles from './Register.module.css';
import Image from 'next/image';
import { getCookieDomain } from '@/services/lib/utils';

/* TYPES */

type Steps = 'register' | 'mfa';

/* COMPONENT */

const { Title, Text } = Typography;

export const RegisterForm = () => {
  // State
  const [registerForm] = Form.useForm();
  const [mfaForm] = Form.useForm();

  const [step, setStep] = useState<Steps>('register');
  const [mfaQr, setMfaQr] = useState('');
  const [mfaTicket, setMfaTicket] = useState('');

  const router = useRouter();

  // Handlers
  const onSubmit = async () => {
    const { name, email, password } = registerForm.getFieldsValue();

    const response = await AuthService.Register(name, email, password);

    if (response) {
      setCookie('access_token', response.token, {
        domain: getCookieDomain(),
        maxAge: 60 * 60 * 24,
        path: '/',
        sameSite: 'none',
        secure: true,
      });

      setMfaQr(response.qr);
      setMfaTicket(response.ticket);

      setStep('mfa');
    }
  };

  const onVerify = async () => {
    const { otp } = mfaForm.getFieldsValue();

    const response = await AuthService.Verify(mfaTicket, otp);

    if (response?.token) {
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

  // Renderers
  const renderRegisterForm = () => (
    <Form
      form={registerForm}
      autoComplete='off'
      layout='vertical'
      requiredMark='optional'
      onFinish={onSubmit}
    >
      <Form.Item
        label='Name'
        name='name'
        rules={[
          {
            required: true,
            message: 'Please input your name',
          },
        ]}
      >
        <Input prefix={<MdOutlineBadge />} placeholder='Name' size='large' />
      </Form.Item>
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
        rules={[{ required: true, message: 'Please input your password' }]}
      >
        <Input.Password
          prefix={<BiLockAlt color={COLORS.SECONDARY} />}
          placeholder='Password'
          size='large'
        />
      </Form.Item>
      <Form.Item>
        <Button htmlType='submit' size='large' type='primary' block>
          Sign Up
        </Button>
        Already have an account? <a href='/login'>Login</a>
      </Form.Item>
    </Form>
  );

  const renderMFAQr = () => (
    <div>
      <p>
        Scan the following QR code with your authenticator app and enter the
        verification code:
      </p>
      <Image src={mfaQr} alt='MFA QR Code' width={150} height={150} />
      <Form
        form={mfaForm}
        autoComplete='off'
        layout='vertical'
        requiredMark='optional'
        onFinish={onVerify}
      >
        <Form.Item
          label='Code'
          name='otp'
          rules={[{ required: true, message: 'Please input your 2FA code' }]}
        >
          <Input placeholder='Code' size='large' />
        </Form.Item>
        <Form.Item>
          <Button htmlType='submit' size='large' type='primary' block>
            Verify
          </Button>
        </Form.Item>
      </Form>
    </div>
  );

  const renderStep = () => {
    if (step === 'register') return renderRegisterForm();
    if (step === 'mfa' && Boolean(mfaQr)) return renderMFAQr();
  };

  return (
    <div className={styles.formLayout}>
      <div className={styles.formHeader}>
        <Title>Sign Up</Title>
        <Text type='secondary'>
          Join our venue reservation and management platform today and unlock a
          world of event planning possibilities. Register now to get started!
        </Text>
      </div>
      {renderStep()}
    </div>
  );
};
