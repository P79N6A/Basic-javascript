import React from 'react';

export default {
  formatDate(date) {
    if (!date) return '';
    let time = new Date(date);
    return `${time.getFullYear()}-${time.getMonth()+1}-${time.getDate()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`
  },
  pagination(data, callback) {
    return {
      onChange: (current) => {
        callback(current);
      },
      current: data.res.current,
      pageSize: data.res.page_size,
      total: data.res.total,
      showTotal: () => {
        return `共${data.res.total}条`;
      },
      showQuickJumper: true,
    };
  },
}