export const sampleCustomers: any[] = [
    { id: '1', name: 'Nguyễn Văn An', id_card: '001200001234', dob: '2000-01-15', gender: 'Nam', favorite_colors: ['Đỏ', 'Xanh dương'], income: 25, keywords: ['du lịch', 'công nghệ'], city: 'Hà Nội', status: 'Hoạt động' },
    { id: '2', name: 'Trần Thị Bình', id_card: '001201005678', dob: '1995-05-20', gender: 'Nữ', favorite_colors: ['Vàng', 'Tím'], income: 40, keywords: ['thời trang', 'ẩm thực'], city: 'TP. Hồ Chí Minh', status: 'Hoạt động' },
    { id: '3', name: 'Lê Minh Cường', id_card: '049202009876', dob: '2002-11-30', gender: 'Nam', favorite_colors: ['Đen'], income: 15, keywords: ['game', 'thể thao'], city: 'Đà Nẵng', status: 'Tạm khóa' },
    { id: '4', name: 'Phạm Hồng Dung', id_card: '092203001122', dob: '1988-07-10', gender: 'Nữ', favorite_colors: ['Xanh lá', 'Đỏ'], income: 70, keywords: ['gia đình', 'nấu ăn'], city: 'Cần Thơ', status: 'Hoạt động' },
    { id: '5', name: 'Hoàng Tiến Dũng', id_card: '001190003344', dob: '1990-03-25', gender: 'Nam', favorite_colors: ['Xanh dương'], income: 85, keywords: ['đầu tư', 'xe hơi'], city: 'Hà Nội', status: 'Hoạt động' },
    { id: '6', name: 'Vũ Thị Lan', id_card: '049200004567', dob: '2000-09-05', gender: 'Nữ', favorite_colors: ['Tím', 'Vàng', 'Xanh lá'], income: 22, keywords: ['âm nhạc', 'phim ảnh'], city: 'Đà Nẵng', status: 'Hoạt động' },
    { id: '7', name: 'Đặng Văn Em', id_card: '001185007890', dob: '1985-12-12', gender: 'Nam', favorite_colors: ['Đen', 'Đỏ'], income: 95, keywords: ['kinh doanh', 'thể thao'], city: 'TP. Hồ Chí Minh', status: 'Tạm khóa' },
    { id: '8', name: 'Ngô Thanh Hà', id_card: '092199008877', dob: '1999-02-18', gender: 'Nữ', favorite_colors: ['Xanh dương'], income: 30, keywords: ['du lịch', 'chụp ảnh'], city: 'Cần Thơ', status: 'Hoạt động' },
];

export const handocdeDataTemp = [
    {
        name: 'Phiếu thu',
        id: 'phieuthu',
        urlColumn: '/Common/GetTableDefine?moduleID=CA1&pageID=04.10.02',
        urlData:'/Common/GetTableDefine?moduleID=CA1&pageID=04.10.02',
        actions: [
            {
                name: 'Lọc',
                type: 'sidebar',
                icon: 'filter_list',
                color: 'primary',
                variant: 'outlined',//standard
                form: [
                    {
                        id: 'stepper_main', type: 'stepper', config: {
                            steps: [
                                {
                                    id: 'step_1', label: 'Xác thực thông tin', onNextAction: 'VALIDATE_STEP_API', items: [
                                        {
                                            id: 'field_info', type: 'field', config: {
                                                id: 'user_info', type: 'text', label: 'Thông tin cần xác thực',
                                                grid: 12, validation: { required: true }
                                            }
                                        }
                                    ]
                                },
                                {
                                    id: 'step_2', label: 'Hoàn thành', items: [
                                        { id: 'field_final', type: 'field', config: { id: 'final_notes', type: 'text', label: 'Ghi chú cuối', grid: 12 } }
                                    ]
                                }
                            ]
                        }
                    }
                ]
            },
            {
                name: 'Thêm mới',
                type: 'sidebar',
                icon: 'filter_list',
                color: 'primary',
                variant: 'outlined',//standard
                form: [
                    {
                        id: 'stepper_main',
                        type: 'stepper',
                        config: {
                            steps: [
                                {
                                    id: 'step_1',
                                    label: 'Xác thực thông tin',
                                    onNextAction: 'VALIDATE_STEP_API',
                                    items: [
                                        {
                                            id: 'field_info',
                                            type: 'field',
                                            config: {
                                                id: 'user_info',
                                                type: 'text',
                                                label: 'Thông tin cần xác thực',
                                                grid: 12,
                                                validation: { required: true }
                                            }
                                        }
                                    ]
                                },
                                {
                                    id: 'step_2',
                                    label: 'Hoàn thành',
                                    items: [
                                        {
                                            id: 'field_final',
                                            type: 'field',
                                            config: {
                                                id: 'final_notes',
                                                type: 'text',
                                                label: 'Ghi chú cuối',
                                                grid: 12
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    },
                    
                ]
            },
        ]
    },
    {
        name: 'Phiếu thu',
        id: 'phieuthu',
        urlColumn: '/Common/GetTableDefine?moduleID=CA1&pageID=04.10.02',
        actions: [
            {
                name: 'Lọc',
                type: 'sidebar',
                icon: 'filter_list',
                color: 'primary',
                variant: 'outlined',//standard
                form: [
                    {
                        id: 'stepper_main', type: 'stepper', config: {
                            steps: [
                                {
                                    id: 'step_1', label: 'Xác thực thông tin', onNextAction: 'VALIDATE_STEP_API', items: [
                                        {
                                            id: 'field_info', type: 'field', config: {
                                                id: 'user_info', type: 'text', label: 'Thông tin cần xác thực',
                                                grid: 12, validation: { required: true }
                                            }
                                        }
                                    ]
                                },
                                {
                                    id: 'step_2', label: 'Hoàn thành', items: [
                                        { id: 'field_final', type: 'field', config: { id: 'final_notes', type: 'text', label: 'Ghi chú cuối', grid: 12 } }
                                    ]
                                }
                            ]
                        }
                    }
                ]
            },
            {
                name: 'Thêm mới',
                type: 'sidebar',
                icon: 'filter_list',
                color: 'primary',
                variant: 'outlined',//standard
                form: [
                    {
                        id: 'stepper_main',
                        type: 'stepper',
                        config: {
                            steps: [
                                {
                                    id: 'step_1',
                                    label: 'Xác thực thông tin',
                                    onNextAction: 'VALIDATE_STEP_API',
                                    items: [
                                        {
                                            id: 'field_info',
                                            type: 'field',
                                            config: {
                                                id: 'user_info',
                                                type: 'text',
                                                label: 'Thông tin cần xác thực',
                                                grid: 12,
                                                validation: { required: true }
                                            }
                                        }
                                    ]
                                },
                                {
                                    id: 'step_2',
                                    label: 'Hoàn thành',
                                    items: [
                                        {
                                            id: 'field_final',
                                            type: 'field',
                                            config: {
                                                id: 'final_notes',
                                                type: 'text',
                                                label: 'Ghi chú cuối',
                                                grid: 12
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    },
                    
                ]
            },
        ]
    }
]
 