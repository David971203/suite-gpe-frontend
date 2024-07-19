import React from 'react';
import { Tooltip } from 'flowbite-react';

export const renderWithTooltip = (rowData, field) => {
    const fieldParts = field.split('.');
    let value = rowData;
    for (const part of fieldParts) {
      value = value ? value[part] : null;
    }

    if (typeof value === 'string' && value.length > 15) {
      return (
        <Tooltip content={value} placement="top">
          {value.substring(0, 15) + '...'}
        </Tooltip>
      );
    }

    if(value === null ) {
      return 'No Posee';
    }
    return value;
};

export const renderTooltipSidebar = (value) => {
  
  if (value.length > 20) {
    return (
      <Tooltip content={value} placement="right">
        {value.substring(0, 20) + '...'}
      </Tooltip>
    );
  }
  return value;
};