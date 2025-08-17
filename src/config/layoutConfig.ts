import { Layout } from "../types";


export const defaultLayout: Layout = [
  {
    id: 'invoice_details',
    type: 'table',
    config: {
      id: 'invoice_details',
      label: 'Hóa đơn chi tiết (với công thức)',
      columns: [
        {
          id: 'item_name',
          label: 'Tên mặt hàng',
          type: 'text',
          visible: true
        },
        {
          id: 'quantity',
          label: 'Số lượng',
          type: 'number',
          visible: true,
          defaultValue: '1'
        },
        {
          id: 'unit_price',
          label: 'Đơn giá',
          type: 'currency',
          visible: true,
          defaultValue: '0'
        },
        {
          id: 'total',
          label: 'Thành tiền',
          type: 'currency',
          visible: true,
          defaultValue: '{quantity}*{unit_price}'
        },
        {
          id: 'notes',
          label: 'Ghi chú',
          type: 'text',
          visible: false,
          defaultValue: 'Hàng bán'
        },
      ]
    }
  },
];