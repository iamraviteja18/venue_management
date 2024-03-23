import React from 'react';
import { Input } from 'antd';

function SearchBar({ sendDataToParent }: any) {
  const sendData = (searchText: any) => {
    sendDataToParent(searchText);
  };

  return (
    <div style={{ width: '30%' }}>
      <Input
        placeholder='Enter search text...'
        onKeyPress={(event: any) => {
          if (event.key === 'Enter') {
            sendData(event?.target?.value);
          }
        }}
      />
    </div>
  );
}

export default SearchBar;
