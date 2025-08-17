import { LayoutItem } from "../types";
import { TableColumn } from "../types/table";

export const mockApi = {
  getSerialNumber: async (): Promise<string> => {
    console.log("API: Fetching serial number...");
    await new Promise(r => setTimeout(r,
      600));
    return `SN-${Date.now()}`;
  },
  getCustomers: async (): Promise<any[]> => {
    console.log("API: Fetching customers...");
    await new Promise(r => setTimeout(r,
      300));
    return [
      { id: 'cust1', name: 'Công ty A', address: '123 Đường B,Quận C' }, { id: 'cust2', name: 'Công ty B', address: '456 Đường D,Quận E' }];
  },
  getCustomerById: async (customerId: string): Promise<any | null> => {
    console.log(`API: Fetching customer object for ${customerId}`);
    await new Promise(r => setTimeout(r,
      250));
    const customers = [{ id: 'cust1', name: 'Công ty A', address: '123 Đường B,Quận C,TP.HCM' }, { id: 'cust2', name: 'Công ty B', address: '456 Đường D,Quận F,Hà Nội' }];
    return customers.find(c => c.id === customerId) || null;
  },
  validateStepData: async (): Promise<void> => {
    console.log("API: Validating step data...");
    await new Promise(r => setTimeout(r,
      1500));
    if (Math.random() > 0.4) {
      console.log("API: Step data is valid.");
      return Promise.resolve();
    } else {
      console.error("API: Step data validation failed!");
      throw new Error("Dữ liệu không hợp lệ từ phía server!");
    }
  },
  getProductsColumns: async (): Promise<TableColumn[]> => {
    console.log("API: Fetching product columns...");
    await new Promise(r => setTimeout(r,
      700));
    return [{
      id: 'product_id',
      label: 'Mã SP',
      type: 'text'
    },
    {
      id: 'product_name',
      label: 'Tên Sản phẩm',
      type: 'text'
    },
    {
      id: 'quantity_on_hand',
      label: 'Tồn kho',
      type: 'number'
    },];
  },
  getProductsData: async (): Promise<any[]> => {
    console.log("API: Fetching product data...");
    await new Promise(r => setTimeout(r,
      1200));
    return [{
      product_id: 'LP-01',
      product_name: 'Laptop Pro',
      quantity_on_hand: 55
    },
    {
      product_id: 'MS-05',
      product_name: 'Mouse Wireless',
      quantity_on_hand: 250
    },
    {
      product_id: 'KB-12',
      product_name: 'Keyboard Mechanical',
      quantity_on_hand: 120
    },];
  },
  getFormConfiguration: async (id: number): Promise<LayoutItem[] | null> => {
    console.log(`API: Getting form config for id: ${id}`);
    await new Promise(r => setTimeout(r,
      800));
    const savedConfig = localStorage.getItem(`form_config_${id}`);
    if (savedConfig) {
      return JSON.parse(savedConfig);
    } return null;
  },
  saveFormConfiguration: async (id: number,
    layout: LayoutItem[]): Promise<{
      success: boolean,
      message: string
    }> => {
    console.log(`API: Saving form config for id: ${id}`);
    await new Promise(r => setTimeout(r,
      1000));
    localStorage.setItem(`form_config_${id}`,
      JSON.stringify(layout));
    if (Math.random() > 0.9) {
      throw new Error("Lỗi mạng ngẫu nhiên!");
    } return {
      success: true,
      message: 'Lưu cấu hình thành công!'
    };
  }
};

export const phieuThuConfig = {
  "id": "bfa6c3d8-c6f1-445b-91ae-dd7863c94612",
  "tableKey": "phieu-thu",
  "tableName": "Phiếu thu",
  "urlColumn": "Common/GetTableDefine?moduleID=CA1&pageID=04.10.02",
  "urlData": "CaVch01/GetListPhieuThu",
  "createdBy": "admin",
  "isActive": true,
  "createdAt": "2025-08-08T13:38:03.997",
  "modifiedAt": "2025-08-08T00:00:00",
  "metaData": null,
  "actions": [
    {
      "id": "0eed737d-0d51-43b4-a924-0187410a8ba4",
      "actionName": "Thêm mới",
      "actionType": "add",
      "iconClass": "add",
      "color": "primary",
      "style": "outlined",
      "sort": 1,
      "formId": "6f70e0a1-6b3a-4a1a-ae8e-67da3436244c",
      "roles": null,
      "parentId": "",
      "formName": "Thêm/Sửa phiếu thu",
      "submitUrl": "DynamicStore/PostStoreParameter/spCaVch02MIns",
      "afterSubmitType": "",
      "layoutJson": "[{\"id\":\"field_1754883700809\",\"type\":\"field\",\"config\":{\"id\":\"Ngay_ct\",\"type\":\"date\",\"label\":\"Ngày chứng từ\",\"grid\":3,\"validation\":{\"required\":true},\"config\":{\"defaultValue\":\"now\"}}},{\"id\":\"field_1754883704802\",\"type\":\"field\",\"config\":{\"id\":\"So_ct\",\"type\":\"text\",\"label\":\"Số chứng từ\",\"grid\":3,\"validation\":{\"required\":true,\"urlLoad\":\"Common/GetVoucherNo?ma_Cty={maCty}&ma_Ct=CA2\"},\"config\":{}}},{\"id\":\"field_1754883855399\",\"type\":\"field\",\"config\":{\"id\":\"Ngay_lct\",\"type\":\"date\",\"label\":\"Ngày lập\",\"grid\":3,\"validation\":{\"required\":true},\"config\":{\"defaultValue\":\"now\"}}},{\"id\":\"field_1754883880436\",\"type\":\"field\",\"config\":{\"id\":\"Ma_nt\",\"type\":\"select\",\"label\":\"Tỷ giá\",\"grid\":2,\"validation\":{\"required\":true},\"config\":{\"options\":[{\"value\":\"vnd\",\"label\":\"VND\"},{\"value\":\"usd\",\"label\":\"USD\"},{\"value\":\"eur\",\"label\":\"EUR\"}]}}},{\"id\":\"field_1754884140142\",\"type\":\"field\",\"config\":{\"id\":\"Ty_gia\",\"type\":\"number\",\"label\":\"Số tỷ giá\",\"grid\":1,\"validation\":{\"required\":true,\"minValue\":\"0\"},\"config\":{}}},{\"id\":\"field_1754884541538\",\"type\":\"field\",\"config\":{\"id\":\"IDcustomer\",\"type\":\"select\",\"label\":\"Khách hàng\",\"grid\":6,\"validation\":{\"required\":true},\"config\":{\"url\":\"Common/GetCommonInfo?func=lstCustomer\",\"valueField\":\"idcustomer\",\"labelField\":\"{idcustomer} - {ten_kh}\"}}},{\"id\":\"field_1754884586808\",\"type\":\"field\",\"config\":{\"id\":\"Dia_chi\",\"type\":\"text\",\"label\":\"Địa chỉ\",\"grid\":6,\"validation\":{\"required\":false},\"config\":{}}},{\"id\":\"field_1754884611644\",\"type\":\"field\",\"config\":{\"id\":\"Nguoi_gd\",\"type\":\"text\",\"label\":\"Người giao dịch\",\"grid\":6,\"validation\":{\"required\":false},\"config\":{}}},{\"id\":\"field_1754884643711\",\"type\":\"field\",\"config\":{\"id\":\"Dien_giai\",\"type\":\"text\",\"label\":\"Diễn giải\",\"grid\":6,\"validation\":{\"required\":false},\"config\":{}}},{\"id\":\"field_1755078567599\",\"type\":\"field\",\"config\":{\"id\":\"field_1755078567599\",\"type\":\"select\",\"label\":\"Nhân viên\",\"grid\":6,\"validation\":{\"required\":false},\"config\":{\"options\":[{\"value\":\"DP0001\",\"label\":\"Đặng Lê Phan Danh\"},{\"value\":\"TQ001\",\"label\":\"Hoàng Quốc Tuấn\"}]}}},{\"id\":\"field_1755078666179\",\"type\":\"field\",\"config\":{\"id\":\"field_1755078666179\",\"type\":\"text\",\"label\":\"Số chứng từ kèm theo\",\"grid\":6,\"validation\":{\"required\":false},\"config\":{}}},{\"id\":\"tabs_1754973852706\",\"type\":\"tabs\",\"config\":{\"tabs\":[{\"id\":\"tab_1754973852706\",\"label\":\"Chi tiết\",\"items\":[{\"id\":\"table_1754978516601\",\"type\":\"table\",\"config\":{\"id\":\"CaVch02d0Data\",\"label\":\"\",\"columns\":[{\"id\":\"Tk_no\",\"label\":\"TK\",\"type\":\"select\",\"config\":{\"options\":[{\"value\":\"11111\",\"label\":\"11111- Tiền việt nam\"}]}},{\"id\":\"Ps_no_nt\",\"label\":\"Số tiền\",\"type\":\"text\"},{\"id\":\"Dien_giai\",\"label\":\"Diễn giải\",\"type\":\"text\"},{\"id\":\"Ma_bp\",\"label\":\"Bộ phận\",\"type\":\"select\",\"config\":{\"options\":[{\"value\":\"00000\",\"label\":\"Công ty\"}]}},{\"id\":\"Ma_phi\",\"label\":\"Phí\",\"type\":\"select\",\"config\":{\"options\":[{\"value\":\"N23NHIENLIEU\",\"label\":\"chi phí xăng đầu, xăng xe\"}]}},{\"id\":\"Ma_hd\",\"label\":\"Hợp đồng\",\"type\":\"select\",\"config\":{\"options\":[{\"value\":\"030917\",\"label\":\"HD Dịch vụ\"}]}},{\"id\":\"Ma_ku\",\"label\":\"Kế ước\",\"type\":\"select\",\"config\":{\"options\":[{\"value\":\"\",\"label\":\"\"}]}},{\"id\":\"Ma_spct\",\"label\":\"SPCT\",\"type\":\"select\",\"config\":{\"options\":[{\"value\":\"â\",\"label\":\"Bộ trà 0.7\"}]}}],\"tableType\":\"CaVch01D0Type\",\"columnsApiUrl\":\"Common/GetTableDefine?moduleID=CA2_CT&pageID=04.10.05\",\"dataApiUrl\":\"DynamicStore/spCaVch02D0Get,{Ma_cty:{maCty},Stt_rec:{masterId}}\"}}]}]}}]"
    },
    {
      "id": "512f7814-27cd-4e01-a795-d2f206852ac5",
      "actionName": "Lọc",
      "actionType": "filter",
      "iconClass": "filter_list",
      "color": "primary",
      "style": "contained",
      "sort": 9,
      "formId": "b668bfa4-9ab4-481c-ba5a-34f712d22f82",
      "roles": null,
      "parentId": "phieu-thu",
      "formName": "Lọc phiếu thu",
      "submitUrl": "",
      "afterSubmitType": "",
      "layoutJson": "[{\"id\":\"field_1755155023399\",\"type\":\"field\",\"config\":{\"id\":\"Ngay1\",\"type\":\"date\",\"label\":\"Từ ngày\",\"grid\":6,\"validation\":{\"required\":true},\"config\":{\"labelField\":\"\",\"options\":[{\"value\":\"f\",\"label\":\"f\"}],\"defaultValue\":\"now-10\"}}},{\"id\":\"field_1755155225445\",\"type\":\"field\",\"config\":{\"id\":\"Ngay2\",\"type\":\"date\",\"label\":\"Đến ngày\",\"grid\":6,\"validation\":{\"required\":false},\"config\":{\"defaultValue\":\"now\"}}},{\"id\":\"field_1755155304624\",\"type\":\"field\",\"config\":{\"id\":\"So_ct1\",\"type\":\"text\",\"label\":\"Số chứng từ\",\"grid\":6,\"validation\":{\"required\":false,\"minLength\":\"0\",\"maxLength\":\"20\"},\"config\":{}}},{\"id\":\"field_1755155405666\",\"type\":\"field\",\"config\":{\"id\":\"So_ct2\",\"type\":\"text\",\"label\":\"Đến số\",\"grid\":6,\"validation\":{\"required\":false,\"minLength\":\"0\",\"maxLength\":\"20\"},\"config\":{}}},{\"id\":\"field_1755155451855\",\"type\":\"field\",\"config\":{\"id\":\"IDCustomer\",\"type\":\"select\",\"label\":\"Khách hàng\",\"grid\":12,\"validation\":{\"required\":true},\"config\":{\"url\":\"Common/GetCommonInfo?func=lstCustomer\",\"valueField\":\"IDCustomer\",\"labelField\":\"{ma_kh} - {ten_kh}\"}}},{\"id\":\"field_1755155787091\",\"type\":\"field\",\"config\":{\"id\":\"nguoi_gd\",\"type\":\"text\",\"label\":\"Người giao dịch\",\"grid\":12,\"validation\":{\"required\":false,\"minLength\":\"0\",\"maxLength\":\"500\"},\"config\":{}}},{\"id\":\"tabs_1755155868678\",\"type\":\"tabs\",\"config\":{\"tabs\":[{\"id\":\"tab_1755155868678\",\"label\":\"Thông tin chi tiết\",\"items\":[{\"id\":\"field_1755155915861\",\"type\":\"field\",\"config\":{\"id\":\"Tk\",\"type\":\"select\",\"label\":\"TK nợ\",\"grid\":12,\"validation\":{\"required\":false},\"config\":{\"url\":\"Common/GetCommonInfo?func=lstAccount\",\"valueField\":\"tk\",\"labelField\":\"{tk}-{ten_tk}\"}}},{\"id\":\"field_1755157097122\",\"type\":\"field\",\"config\":{\"id\":\"Tk_co\",\"type\":\"select\",\"label\":\"TK có\",\"grid\":12,\"validation\":{\"required\":false},\"config\":{\"url\":\"Common/GetCommonInfo?func=lstAccount\",\"valueField\":\"tk\",\"labelField\":\"{tk}-{ten_tk}\"}}},{\"id\":\"field_1755157218069\",\"type\":\"field\",\"config\":{\"id\":\"Ma_bp\",\"type\":\"select\",\"label\":\"Bộ phận\",\"grid\":12,\"validation\":{\"required\":false},\"config\":{\"url\":\"Common/GetCommonInfo?func=lstDepartment\",\"valueField\":\"ma_bp\",\"labelField\":\"{ma_bp}-{ten_bp}\"}}},{\"id\":\"field_1755157254619\",\"type\":\"field\",\"config\":{\"id\":\"ma_phi\",\"type\":\"select\",\"label\":\"Phí\",\"grid\":12,\"validation\":{\"required\":false},\"config\":{\"url\":\"Common/GetCommonInfo?func=lstCharges\",\"valueField\":\"ma_phi\",\"labelField\":\"{ma_phi}-{ten_phi}\"}}},{\"id\":\"field_1755157302833\",\"type\":\"field\",\"config\":{\"id\":\"Ma_hd\",\"type\":\"select\",\"label\":\"Hợp đồng\",\"grid\":12,\"validation\":{\"required\":false},\"config\":{\"url\":\"Common/GetCommonInfo?func=lstContract\",\"valueField\":\"ma_hd\",\"labelField\":\"{ma_hd}-{ten_hd}\"}}},{\"id\":\"field_1755157331739\",\"type\":\"field\",\"config\":{\"id\":\"Ma_ku\",\"type\":\"select\",\"label\":\"Khế ước\",\"grid\":12,\"validation\":{\"required\":false},\"config\":{\"url\":\"Common/GetCommonInfo?func=lstLoan\",\"valueField\":\"ma_ku\",\"labelField\":\"{ma_ku}-{ten_ku}\"}}}]}]}}]"
    }
  ]
}

export const phieuChiConfig = {
  "id": "7d93fad8-684a-4ca2-a844-cc790347efd8",
  "tableKey": "phieu-chi",
  "tableName": "Phiếu chi",
  "urlColumn": "Common/GetTableDefine?moduleID=CA2&pageID=04.10.05",
  "urlData": "CaVch02/GetListPhieuChi",
  "createdBy": "admin",
  "isActive": true,
  "createdAt": "2025-08-08T00:00:00",
  "modifiedAt": "2025-08-08T00:00:00",
  "metaData": null,
  "actions": [
    {
      "id": "0e764dcb-27eb-416a-a38a-bd6d6b2d86bb",
      "actionName": "Thêm mới",
      "actionType": "add",
      "iconClass": "add",
      "color": "primary",
      "style": "outlined",
      "sort": 1,
      "formId": "6ac72c7e-ee07-40ff-854a-c609f375cecc",
      "roles": null,
      "parentId": "",
      "formName": "Thêm/Sửa phiếu chi",
      "submitUrl": "DynamicStore/PostStoreParameter/spCaVch02MIns",
      "afterSubmitType": "",
      "layoutJson": "[{\"id\":\"field_1754883700809\",\"type\":\"field\",\"config\":{\"id\":\"Ngay_ct\",\"type\":\"date\",\"label\":\"Ngày chứng từ\",\"grid\":3,\"validation\":{\"required\":true},\"config\":{\"defaultValue\":\"now\"}}},{\"id\":\"field_1754883704802\",\"type\":\"field\",\"config\":{\"id\":\"So_ct\",\"type\":\"text\",\"label\":\"Số chứng từ\",\"grid\":3,\"validation\":{\"required\":true,\"urlLoad\":\"Common/GetVoucherNo?ma_Cty={maCty}&ma_Ct=CA2\"},\"config\":{}}},{\"id\":\"field_1754883855399\",\"type\":\"field\",\"config\":{\"id\":\"Ngay_lct\",\"type\":\"date\",\"label\":\"Ngày lập\",\"grid\":3,\"validation\":{\"required\":true},\"config\":{\"defaultValue\":\"now\"}}},{\"id\":\"field_1754883880436\",\"type\":\"field\",\"config\":{\"id\":\"Ma_nt\",\"type\":\"select\",\"label\":\"Tỷ giá\",\"grid\":2,\"validation\":{\"required\":true},\"config\":{\"options\":[{\"value\":\"vnd\",\"label\":\"VND\"},{\"value\":\"usd\",\"label\":\"USD\"},{\"value\":\"eur\",\"label\":\"EUR\"}]}}},{\"id\":\"field_1754884140142\",\"type\":\"field\",\"config\":{\"id\":\"Ty_gia\",\"type\":\"number\",\"label\":\"Số tỷ giá\",\"grid\":1,\"validation\":{\"required\":true,\"minValue\":\"0\"},\"config\":{}}},{\"id\":\"field_1754884189733\",\"type\":\"field\",\"config\":{\"id\":\"Stt_rec_dn\",\"type\":\"text\",\"label\":\"Số đề nghị\",\"grid\":4,\"validation\":{\"required\":false},\"config\":{\"url\":\"\"}}},{\"id\":\"field_1754884269381\",\"type\":\"field\",\"config\":{\"id\":\"So_ct_kem\",\"type\":\"text\",\"label\":\"Số chứng từ kèm theo\",\"grid\":4,\"validation\":{\"required\":false},\"config\":{}}},{\"id\":\"field_1754884404655\",\"type\":\"field\",\"config\":{\"id\":\"Tk_co\",\"type\":\"select\",\"label\":\"Tài khoản có\",\"grid\":4,\"validation\":{\"required\":true},\"config\":{\"url\":\"Common/GetCommonInfo?func=lstAccount\",\"valueField\":\"tk\",\"labelField\":\"{tk} - {ten_tk}\"}}},{\"id\":\"field_1754884541538\",\"type\":\"field\",\"config\":{\"id\":\"IDcustomer\",\"type\":\"select\",\"label\":\"Đối tượng\",\"grid\":6,\"validation\":{\"required\":true},\"config\":{\"url\":\"Common/GetCommonInfo?func=lstCustomer\",\"valueField\":\"idcustomer\",\"labelField\":\"{idcustomer} - {ten_kh}\"}}},{\"id\":\"field_1754884586808\",\"type\":\"field\",\"config\":{\"id\":\"Dia_chi\",\"type\":\"text\",\"label\":\"Địa chỉ\",\"grid\":6,\"validation\":{\"required\":false},\"config\":{}}},{\"id\":\"field_1754884611644\",\"type\":\"field\",\"config\":{\"id\":\"Nguoi_gd\",\"type\":\"text\",\"label\":\"Người giao dịch\",\"grid\":6,\"validation\":{\"required\":false},\"config\":{}}},{\"id\":\"field_1754884643711\",\"type\":\"field\",\"config\":{\"id\":\"Dien_giai\",\"type\":\"text\",\"label\":\"Diễn giải\",\"grid\":6,\"validation\":{\"required\":false},\"config\":{}}},{\"id\":\"tabs_1754973852706\",\"type\":\"tabs\",\"config\":{\"tabs\":[{\"id\":\"tab_1754973852706\",\"label\":\"Chi tiết\",\"items\":[{\"id\":\"table_1754978516601\",\"type\":\"table\",\"config\":{\"id\":\"CaVch02d0Data\",\"label\":\"\",\"columns\":[{\"id\":\"Tk_no\",\"label\":\"TK\",\"type\":\"select\",\"config\":{\"options\":[{\"value\":\"11111\",\"label\":\"11111- Tiền việt nam\"}]}},{\"id\":\"Ps_no_nt\",\"label\":\"Số tiền\",\"type\":\"text\"},{\"id\":\"Dien_giai\",\"label\":\"Diễn giải\",\"type\":\"text\"},{\"id\":\"Ma_bp\",\"label\":\"Bộ phận\",\"type\":\"select\",\"config\":{\"options\":[{\"value\":\"00000\",\"label\":\"Công ty\"}]}},{\"id\":\"Ma_phi\",\"label\":\"Phí\",\"type\":\"select\",\"config\":{\"options\":[{\"value\":\"N23NHIENLIEU\",\"label\":\"chi phí xăng đầu, xăng xe\"}]}},{\"id\":\"Ma_hd\",\"label\":\"Hợp đồng\",\"type\":\"select\",\"config\":{\"options\":[{\"value\":\"030917\",\"label\":\"HD Dịch vụ\"}]}},{\"id\":\"Ma_ku\",\"label\":\"Kế ước\",\"type\":\"select\",\"config\":{\"options\":[{\"value\":\"\",\"label\":\"\"}]}},{\"id\":\"Ma_spct\",\"label\":\"SPCT\",\"type\":\"select\",\"config\":{\"options\":[{\"value\":\"â\",\"label\":\"Bộ trà 0.7\"}]}}],\"tableType\":\"CaVch01D0Type\",\"columnsApiUrl\":\"Common/GetTableDefine?moduleID=CA2_CT&pageID=04.10.05\",\"dataApiUrl\":\"DynamicStore/spCaVch02D0Get,{Ma_cty:{maCty},Stt_rec:{masterId}}\"}}]},{\"id\":\"tab_1754985674856\",\"label\":\"thuế GTGT vào\",\"items\":[{\"id\":\"table_1754985712349\",\"type\":\"table\",\"config\":{\"id\":\"TaxInData\",\"label\":\"\",\"columns\":[{\"id\":\"phanloai\",\"label\":\"Phân loại\",\"type\":\"select\",\"config\":{\"options\":[{\"value\":\"1\",\"label\":\"HHDV\"}]}},{\"id\":\"Ghi_chu\",\"label\":\"Mẫu số\",\"type\":\"text\",\"config\":{\"options\":[{\"value\":\"\",\"label\":\"\"}]}},{\"id\":\"So_seri0\",\"label\":\"Ký hiệu\",\"type\":\"text\"},{\"id\":\"So_ct0\",\"label\":\"Số HĐ\",\"type\":\"text\"},{\"id\":\"Ngay_ct0\",\"label\":\"Ngày HĐ\",\"type\":\"date\"},{\"id\":\"IDCustomer\",\"label\":\"Tên KH\",\"type\":\"select\",\"config\":{\"options\":[{\"value\":\"1\",\"label\":\"FOSHAn\"}]}},{\"id\":\"Dia_chi\",\"label\":\"Địa chỉ\",\"type\":\"text\"},{\"id\":\"Ma_so_thue\",\"label\":\"Mã số thuế\",\"type\":\"text\"},{\"id\":\"IDItem\",\"label\":\"Mã vật tư\",\"type\":\"select\",\"config\":{\"options\":[{\"value\":\"12454\",\"label\":\"Công cụ\"}]}},{\"id\":\"Ten_vt\",\"label\":\"Tên vật tư\",\"type\":\"text\"},{\"id\":\"Tien_hang_nt\",\"label\":\"Tiền hàng\",\"type\":\"currency\"},{\"id\":\"Thue_suat\",\"label\":\"Thuế suất\",\"type\":\"number\",\"config\":{\"options\":[{\"value\":\"\",\"label\":\"\"}]}},{\"id\":\"T_thue_nt\",\"label\":\"Tiền thuế\",\"type\":\"currency\"},{\"id\":\"Tk_thue_no\",\"label\":\"TK thúe\",\"type\":\"select\",\"config\":{\"options\":[{\"value\":\"111111\",\"label\":\"11111- TK\"}]}},{\"id\":\"Tk_du\",\"label\":\"TK đối ứng\",\"type\":\"select\",\"config\":{\"options\":[{\"value\":\"11111\",\"label\":\"1111-tk\"}]}},{\"id\":\"Ma_bp\",\"label\":\"Bô phận\",\"type\":\"select\",\"config\":{\"options\":[{\"value\":\"sp\",\"label\":\"Bộ phận\"}]}},{\"id\":\"Ma_spct\",\"label\":\"Mã SPCT\",\"type\":\"select\",\"config\":{\"options\":[{\"value\":\"1545\",\"label\":\"Sản phẩm\"}]}}],\"tableType\":\"TaxInCtType\"}}]}]}}]"
    },
    {
      "id": "e4a054bf-5aad-4a56-bfa5-5dcdd21db258",
      "actionName": "Lọc",
      "actionType": "filter",
      "iconClass": "filter_list",
      "color": "primary",
      "style": "contained",
      "sort": 9,
      "formId": "24b4f4ac-29c9-4dc3-b7d6-265ad7a05909",
      "roles": null,
      "parentId": "phieu-chi",
      "formName": "Lọc phiếu chi",
      "submitUrl": null,
      "afterSubmitType": "",
      "layoutJson": "[{\"id\":\"field_1755155023399\",\"type\":\"field\",\"config\":{\"id\":\"Ngay1\",\"type\":\"date\",\"label\":\"Từ ngày\",\"grid\":6,\"validation\":{\"required\":true},\"config\":{\"labelField\":\"\",\"options\":[{\"value\":\"f\",\"label\":\"f\"}],\"defaultValue\":\"now-10\"}}},{\"id\":\"field_1755155225445\",\"type\":\"field\",\"config\":{\"id\":\"Ngay2\",\"type\":\"date\",\"label\":\"Đến ngày\",\"grid\":6,\"validation\":{\"required\":false},\"config\":{\"defaultValue\":\"now\"}}},{\"id\":\"field_1755155304624\",\"type\":\"field\",\"config\":{\"id\":\"So_ct1\",\"type\":\"text\",\"label\":\"Số chứng từ\",\"grid\":6,\"validation\":{\"required\":false,\"minLength\":\"0\",\"maxLength\":\"20\"},\"config\":{}}},{\"id\":\"field_1755155405666\",\"type\":\"field\",\"config\":{\"id\":\"So_ct2\",\"type\":\"text\",\"label\":\"Đến số\",\"grid\":6,\"validation\":{\"required\":false,\"minLength\":\"0\",\"maxLength\":\"20\"},\"config\":{}}},{\"id\":\"field_1755155451855\",\"type\":\"field\",\"config\":{\"id\":\"IDCustomer\",\"type\":\"select\",\"label\":\"Khách hàng\",\"grid\":12,\"validation\":{\"required\":true},\"config\":{\"url\":\"Common/GetCommonInfo?func=lstCustomer\",\"valueField\":\"IDCustomer\",\"labelField\":\"{ma_kh} - {ten_kh}\"}}},{\"id\":\"field_1755155787091\",\"type\":\"field\",\"config\":{\"id\":\"nguoi_gd\",\"type\":\"text\",\"label\":\"Người giao dịch\",\"grid\":12,\"validation\":{\"required\":false,\"minLength\":\"0\",\"maxLength\":\"500\"},\"config\":{}}},{\"id\":\"tabs_1755155868678\",\"type\":\"tabs\",\"config\":{\"tabs\":[{\"id\":\"tab_1755155868678\",\"label\":\"Thông tin chi tiết\",\"items\":[{\"id\":\"field_1755155915861\",\"type\":\"field\",\"config\":{\"id\":\"Tk\",\"type\":\"select\",\"label\":\"TK nợ\",\"grid\":12,\"validation\":{\"required\":false},\"config\":{\"url\":\"Common/GetCommonInfo?func=lstAccount\",\"valueField\":\"tk\",\"labelField\":\"{tk}-{ten_tk}\"}}},{\"id\":\"field_1755156006729\",\"type\":\"field\",\"config\":{\"id\":\"Ma_bp\",\"type\":\"select\",\"label\":\"Bộ phận\",\"grid\":12,\"validation\":{\"required\":false},\"config\":{\"url\":\"Common/GetCommonInfo?func=lstDepartment\",\"valueField\":\"ma_bp\",\"labelField\":\"{ma_bp}-{ten_bp}\"}}},{\"id\":\"field_1755156124219\",\"type\":\"field\",\"config\":{\"id\":\"Ma_phi\",\"type\":\"select\",\"label\":\"Phí\",\"grid\":12,\"validation\":{\"required\":false},\"config\":{\"url\":\"Common/GetCommonInfo?func=lstCharges\",\"valueField\":\"ma_phi\",\"labelField\":\"{ma_phi}-{ten_phi}\"}}},{\"id\":\"field_1755156207660\",\"type\":\"field\",\"config\":{\"id\":\"Ma_hd\",\"type\":\"select\",\"label\":\"Hợp đồng\",\"grid\":12,\"validation\":{\"required\":false},\"config\":{\"url\":\"Common/GetCommonInfo?func=lstContract\",\"valueField\":\"ma_hd\",\"labelField\":\"{ma_hd}-{ten_hd}\"}}},{\"id\":\"field_1755156345307\",\"type\":\"field\",\"config\":{\"id\":\"Ma_ku\",\"type\":\"select\",\"label\":\"Khế ước\",\"grid\":12,\"validation\":{\"required\":false},\"config\":{\"url\":\"Common/GetCommonInfo?func=lstLoan\",\"valueField\":\"ma_ku\",\"labelField\":\"{ma_ku}-{ten_ku}\"}}}]}]}}]"
    }
  ]
}