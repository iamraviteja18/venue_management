import { Button, Drawer, Form, Input, message } from 'antd';
import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';
import styles from './venues.module.css';
import VenueService from '@/services/venues';

export default function AddNew({ sendDataToParentAddNew }: any) {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [messageApi] = message.useMessage();
  const [base64Image, setBase64Image] = useState('');

  const showDrawer = () => {
    setOpen(true);
  };

  const handleImageUpload = (e:any) => {
    const file = e.target.files[0];
    if (file) {
      const reader: any = new FileReader();
      reader.onloadend = () => {
        const base64Content = reader.result.split(',')[1];
        setBase64Image(base64Content);
      };
      reader.readAsDataURL(file);
    }
  };

  const onClose = () => {
    setOpen(false);
    sendData();
    form.resetFields();
    messageApi.open({
      type: 'success',
      content: 'New Venue added successfully',
    });
  };

  const onAddNew = async () => {
    const { name, description, address, city, state, postal_code } =
      form.getFieldsValue();
    const payload = {
      name: name,
      description: description,
      location: {
        address: address,
        city: city,
        state: state,
        postal_code: postal_code,
      },
      image: base64Image,
    };
    await VenueService.Create(payload);
    onClose();
  };

  const sendData = () => {
    sendDataToParentAddNew();
  };

  return (
    <div>
      <Button type='primary' onClick={showDrawer}>
        {' '}
        <PlusOutlined style={{ margin: '0px' }} />
        Add New
      </Button>

      <Drawer
        title='Add new venue'
        placement='right'
        width='50%'
        onClose={onClose}
        open={open}
      >
        <Form
          form={form}
          autoComplete='off'
          layout='vertical'
          requiredMark='optional'
          onFinish={onAddNew}
        >
          <Form.Item
            label='Name'
            name='name'
            rules={[
              { required: true, message: 'Please enter your venue name' },
            ]}
          >
            <Input placeholder='Name' size='large' />
          </Form.Item>
          <Form.Item
            label='Description'
            name='description'
            rules={[
              {
                required: true,
                message: 'Please enter your venue description',
              },
            ]}
          >
            <TextArea rows={2} placeholder='Description' maxLength={4} />
          </Form.Item>
          <Form.Item
            label='Image'
            name='image'
            rules={[
              {
                required: true,
              },
            ]}
          >
            <input type='file' onChange={handleImageUpload} />
          </Form.Item>
          <Form.Item
            label='Address'
            name='address'
            rules={[
              { required: true, message: 'Please enter your venue address' },
            ]}
          >
            <Input placeholder='Address' size='large' />
          </Form.Item>
          <Form.Item
            label='City'
            name='city'
            rules={[
              { required: true, message: 'Please enter your venues city' },
            ]}
          >
            <Input placeholder='City' size='large' />
          </Form.Item>
          <Form.Item
            label='State'
            name='state'
            rules={[
              { required: true, message: 'Please enter your venues state' },
            ]}
          >
            <Input placeholder='State' size='large' />
          </Form.Item>
          <Form.Item
            label='Postal Code'
            name='postal_code'
            rules={[
              {
                required: true,
                message: 'Please enter your venues postal code',
              },
            ]}
          >
            <Input placeholder='Postal Code' size='large' />
          </Form.Item>
          <Form.Item>
            <div className={styles.btnContainer}>
              <div style={{ width: '30%' }}>
                <Button htmlType='submit' size='large' type='primary' block>
                  Add
                </Button>
              </div>
            </div>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}
