<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Toaster -->
    <div class="fixed top-4 right-4 z-50 flex flex-col gap-2">
      <div v-for="t in toasts" :key="t.id" class="px-4 py-2 rounded-lg shadow-md text-sm bg-black/80 text-white">
        {{ t.message }}
      </div>
    </div>

    <Sidebar :activeMenu="activeMenu" @changeMenu="activeMenu = $event" />
    <Header />

    <main class="ml-64 pt-16">
      <div class="p-8">
        <component :is="currentView" />
      </div>
    </main>

    <!-- Modals -->
    <BookingModal :is-open="bookingModal.isOpen" :booking="bookingModal.booking"
      @close="bookingModal = { isOpen: false, booking: null }" @save="handleSaveBooking" />
    <FieldModal :is-open="fieldModal.isOpen" :field="fieldModal.field"
      @close="fieldModal = { isOpen: false, field: null }" @save="handleSaveField" />
    <CustomerModal :is-open="customerModal.isOpen" :customer="customerModal.customer"
      @close="customerModal = { isOpen: false, customer: null }" @save="handleSaveCustomer" />
    <ConfirmDialog :is-open="confirmDialog.isOpen" :title="confirmDialog.title" :message="confirmDialog.message"
      @close="confirmDialog = { isOpen: false }" @confirm="handleConfirmDelete" />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, defineComponent } from 'vue';

// Types
interface Booking { id: string; customer: string; phone: string; field: string; date: string; time: string; price: string; status: string }
interface Field { id: string; name: string; type: string; status: 'available' | 'occupied' | 'maintenance'; pricePerHour: string; description: string; currentBooking?: string; nextBooking?: string }
interface Customer { id: string; name: string; phone: string; email: string; address: string; totalBookings: number; totalSpent: string; notes: string }

// Global state for app (could be moved to store)
const activeMenu = ref('dashboard');

const toasts = reactive<{ id: string; message: string }[]>([]);
function toastSuccess(msg: string) { toasts.push({ id: Date.now().toString(), message: msg }); setTimeout(() => toasts.shift(), 3000); }
function toastError(msg: string) { toasts.push({ id: Date.now().toString(), message: msg }); setTimeout(() => toasts.shift(), 3000); }

const bookings = ref<Booking[]>([
  { id: '#BK001', customer: 'Nguyễn Văn A', phone: '0901234567', field: 'Sân 1 (5 người)', date: '2024-11-20', time: '18:00 - 19:30', price: '500.000đ', status: 'confirmed' },
  { id: '#BK002', customer: 'Trần Thị B', phone: '0907654321', field: 'Sân 2 (7 người)', date: '2024-11-20', time: '19:00 - 20:30', price: '700.000đ', status: 'pending' },
  { id: '#BK003', customer: 'Lê Văn C', phone: '0912345678', field: 'Sân 3 (11 người)', date: '2024-11-21', time: '07:00 - 08:30', price: '800.000đ', status: 'confirmed' },
  { id: '#BK004', customer: 'Phạm Thị D', phone: '0923456789', field: 'Sân 1 (5 người)', date: '2024-11-21', time: '20:00 - 21:30', price: '500.000đ', status: 'completed' },
  { id: '#BK005', customer: 'Hoàng Văn E', phone: '0934567890', field: 'Sân 2 (7 người)', date: '2024-11-22', time: '17:00 - 18:30', price: '700.000đ', status: 'confirmed' },
]);

const fields = ref<Field[]>([
  { id: 'field-1', name: 'Sân 1', type: 'Sân 5 người', status: 'occupied', pricePerHour: '300.000đ', description: 'Sân 5 người tiêu chuẩn', currentBooking: '18:00 - 19:30 - Nguyễn Văn A', nextBooking: '20:00 - 21:30 - Phạm Thị D' },
  { id: 'field-2', name: 'Sân 2', type: 'Sân 7 người', status: 'occupied', pricePerHour: '400.000đ', description: 'Sân 7 người có mái che', currentBooking: '19:00 - 20:30 - Trần Thị B', nextBooking: '21:00 - 22:30 - Team Alpha' },
  { id: 'field-3', name: 'Sân 3', type: 'Sân 11 người', status: 'available', pricePerHour: '600.000đ', description: 'Sân 11 người cỏ nhân tạo', nextBooking: '21:00 - 23:00 - FC United' },
  { id: 'field-4', name: 'Sân 4', type: 'Sân 5 người', status: 'available', pricePerHour: '300.000đ', description: 'Sân 5 người' },
  { id: 'field-5', name: 'Sân 5', type: 'Sân 7 người', status: 'maintenance', pricePerHour: '400.000đ', description: 'Đang bảo trì' },
  { id: 'field-6', name: 'Sân 6', type: 'Sân 11 người', status: 'available', pricePerHour: '600.000đ', description: 'Sân 11 người', nextBooking: '20:00 - 22:00 - Team Victory' },
]);

const customers = ref<Customer[]>([
  { id: 'cus-1', name: 'Nguyễn Văn A', phone: '0901234567', email: 'nguyenvana@email.com', address: 'Hà Nội', totalBookings: 15, totalSpent: '7.500.000đ', notes: 'Khách VIP' },
  { id: 'cus-2', name: 'Trần Thị B', phone: '0907654321', email: 'tranthib@email.com', address: 'TP.HCM', totalBookings: 8, totalSpent: '5.600.000đ', notes: '' },
  { id: 'cus-3', name: 'Lê Văn C', phone: '0912345678', email: 'levanc@email.com', address: 'Đà Nẵng', totalBookings: 12, totalSpent: '9.600.000đ', notes: '' },
  { id: 'cus-4', name: 'Phạm Thị D', phone: '0923456789', email: '', address: 'Hải Phòng', totalBookings: 5, totalSpent: '2.500.000đ', notes: '' },
]);

const bookingModal = reactive<{ isOpen: boolean; booking: Booking | null }>({ isOpen: false, booking: null });
const fieldModal = reactive<{ isOpen: boolean; field: Field | null }>({ isOpen: false, field: null });
const customerModal = reactive<{ isOpen: boolean; customer: Customer | null }>({ isOpen: false, customer: null });
const confirmDialog = reactive<{ isOpen: boolean; type?: string; id?: string; title?: string; message?: string }>({ isOpen: false });

function handleSaveBooking(b: Booking) {
  if (bookingModal.booking) {
    bookings.value = bookings.value.map(x => x.id === b.id ? b : x);
  } else {
    bookings.value = [b, ...bookings.value];
  }
  toastSuccess(bookingModal.booking ? 'Cập nhật đặt sân thành công!' : 'Tạo đặt sân mới thành công!');
}

function handleSaveField(f: Field) {
  if (fieldModal.field) {
    fields.value = fields.value.map(x => x.id === f.id ? f : x);
  } else { fields.value = [...fields.value, f]; }
  toastSuccess(fieldModal.field ? 'Cập nhật sân thành công!' : 'Thêm sân mới thành công!');
}

function handleSaveCustomer(c: Customer) {
  if (customerModal.customer) {
    customers.value = customers.value.map(x => x.id === c.id ? c : x);
  } else { customers.value = [...customers.value, c]; }
  toastSuccess(customerModal.customer ? 'Cập nhật khách hàng thành công!' : 'Thêm khách hàng mới thành công!');
}

function confirmDelete(type: string, id: string) {
  confirmDialog.isOpen = true;
  confirmDialog.type = type;
  confirmDialog.id = id;
  confirmDialog.title = 'Xác nhận xóa';
  confirmDialog.message = `Bạn có chắc chắn muốn xóa ${type === 'booking' ? 'đặt sân' : type === 'field' ? 'sân' : 'khách hàng'} này?`;
}

function handleConfirmDelete() {
  if (confirmDialog.type === 'booking') {
    bookings.value = bookings.value.filter(b => b.id !== confirmDialog.id);
    toastSuccess('Đã xóa đặt sân!');
  } else if (confirmDialog.type === 'field') {
    fields.value = fields.value.filter(f => f.id !== confirmDialog.id);
    toastSuccess('Đã xóa sân!');
  } else if (confirmDialog.type === 'customer') {
    customers.value = customers.value.filter(c => c.id !== confirmDialog.id);
    toastSuccess('Đã xóa khách hàng!');
  }
  confirmDialog.isOpen = false;
}

const currentView = computed(() => {
  switch (activeMenu.value) {
    case 'dashboard': return DashboardView;
    case 'fields': return FieldsView;
    case 'bookings': return BookingsView;
    case 'schedule': return ScheduleView;
    case 'customers': return CustomersView;
    case 'revenue': return RevenueView;
    case 'analytics': return AnalyticsView;
    case 'settings': return SettingsView;
    default: return DashboardView;
  }
});

// ------------ Components defined inline ------------

const Sidebar = defineComponent({
  props: ['activeMenu'],
  emits: ['changeMenu'],
  setup(props: any, { emit }) {
    const menuItems = [
      { id: 'dashboard', label: 'Tổng quan' },
      { id: 'fields', label: 'Quản lý sân' },
      { id: 'bookings', label: 'Đặt sân' },
      { id: 'schedule', label: 'Lịch đặt' },
      { id: 'customers', label: 'Khách hàng' },
      { id: 'revenue', label: 'Doanh thu' },
      { id: 'analytics', label: 'Thống kê' },
      { id: 'settings', label: 'Cài đặt' },
    ];
    return () => (
      <div class= "w-64 h-screen bg-green-500 fixed left-0 top-0 flex flex-col" >
      <div class="p-6 border-b border-green-600" > <h2 class="text-white" > Quản lý sân bóng < /h2></div >
        <nav class="flex-1 p-4" >
        {
          menuItems.map(item => (
            <button key= { item.id } onClick = {() => emit('changeMenu', item.id)} class={ `w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${props.activeMenu === item.id ? 'bg-green-600 text-white' : 'text-green-50 hover:bg-green-600'}` }>
              <span>{ item.label } </span>
              </button>
          ))}
</nav>
  </div>
    );
  }
});

const Header = defineComponent({
  setup() {
    return () => (
      <header class= "h-16 bg-white border-b border-gray-200 fixed top-0 right-0 left-64 z-10" >
      <div class="h-full px-8 flex items-center justify-between" >
        <div class="flex-1 max-w-xl" > <div class="relative" > <input type="text" placeholder = "Tìm kiếm..." class="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" /> </div></div >
          <div class="flex items-center gap-4" >
            <button class="p-2 hover:bg-gray-100 rounded-lg relative" > <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" > </span></button >
              <div class="flex items-center gap-3 pl-4 border-l border-gray-200" > <div class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white" > A < /div><div><p class="text-sm">Admin</p > <p class="text-xs text-gray-600" > Quản trị viên < /p></div > </div>
                </div>
                </div>
                </header>
); } });

const Modal = defineComponent({
  props: ['isOpen', 'title'], emits: ['close'], setup(props: any, { slots, emit }) {
    return () => props.isOpen ? (
      <div class= "fixed inset-0 z-50 flex items-center justify-center" >
      <div class="absolute inset-0 bg-black bg-opacity-50" onClick = {()=> emit('close')}> </div>
        < div class="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" >
          <div class="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10" >
            <h3>{ props.title } </h3>
            < button onClick = {()=> emit('close')} class="p-2 hover:bg-gray-100 rounded-lg transition-colors" >✕</button>
              </div>
              < div class="p-6" > { slots.default && slots.default() } </div>
                </div>
                </div>
  ) : null
}});

const ConfirmDialog = defineComponent({
  props: ['isOpen', 'title', 'message'], emits: ['close', 'confirm'], setup(props: any, { emit }) {
    return () => (
      <Modal isOpen= { props.isOpen } title = { props.title } onVnodeMounted = {()=> { }} onClose = {()=> emit('close')}>
        <div class="text-center" >
          <p class="text-gray-600 mb-6" > { props.message } </p>
            < div class="flex gap-3" >
              <button onClick={ () => emit('close') } class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50" > Hủy </button>
                < button onClick = {()=> { emit('confirm'); emit('close'); }} class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700" > Xóa </button>
                  </div>
                  </div>
                  </Modal>
  );
}});

// BookingModal, FieldModal, CustomerModal simplified
const BookingModal = defineComponent({
  props: ['isOpen', 'booking'], emits: ['close', 'save'], setup(props: any, { emit }) {
    const form = reactive<Booking>(props.booking ? { ...props.booking } : { id: '', customer: '', phone: '', field: '', date: '', time: '', price: '', status: 'pending' });
    function onSubmit(e: any) { e.preventDefault(); if (!form.customer || !form.phone || !form.field || !form.date || !form.time) { toastError('Vui lòng điền đầy đủ thông tin!'); return } const out = { ...form, id: form.id || `#BK${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}` }; emit('save', out); emit('close'); }
    return () => (
      <Modal isOpen= { props.isOpen } title = { props.booking ? 'Chỉnh sửa đặt sân' : 'Đặt sân mới' } onClose = {()=> emit('close')}>
        <form onSubmit={ onSubmit }>
          <div class="space-y-4" >
            <div class="grid grid-cols-2 gap-4" >
              <div>
              <label class="block text-sm mb-2 text-gray-700" > Tên khách hàng * </label>
                < input v - model={ form.customer } class="w-full px-4 py-2 border" />
                  </div>
                  < div >
                  <label class="block text-sm mb-2 text-gray-700" > Số điện thoại * </label>
                    < input v - model={ form.phone } class="w-full px-4 py-2 border" />
                      </div>
                      </div>
                      < div >
                      <label class="block text-sm mb-2 text-gray-700" > Chọn sân * </label>
                        < select v - model={ form.field } class="w-full px-4 py-2 border" > <option value="" > --Chọn sân-- < /option>{fields.value.map(f=> <option value={f.name}>{f.name}</option >)}</select>
                          </div>
                          < div class="grid grid-cols-2 gap-4" >
                            <div>
                            <label class="block text-sm mb-2 text-gray-700" > Ngày đặt * </label>
                              < input type = "date" v - model={ form.date } class="w-full px-4 py-2 border" />
                                </div>
                                < div >
                                <label class="block text-sm mb-2 text-gray-700" > Khung giờ * </label>
                                  < input v - model={ form.time } placeholder = "18:00 - 19:30" class="w-full px-4 py-2 border" />
                                    </div>
                                    </div>
                                    < div class="grid grid-cols-2 gap-4" >
                                      <div>
                                      <label class="block text-sm mb-2 text-gray-700" > Giá thuê </label>
                                        < input v - model={ form.price } class="w-full px-4 py-2 border" />
                                          </div>
                                          < div >
                                          <label class="block text-sm mb-2 text-gray-700" > Trạng thái </label>
                                            < select v - model={ form.status } class="w-full px-4 py-2 border" > <option value="pending" > Chờ xác nhận < /option><option value="confirmed">Đã xác nhận</option > <option value="completed" > Hoàn thành < /option><option value="cancelled">Đã hủy</option > </select>
                                              </div>
                                              </div>
                                              </div>
                                              < div class="flex gap-3 mt-6 pt-6 border-t border-gray-200" > <button type="button" onClick = {()=> emit('close')} class="flex-1 px-4 py-2 border" > Hủy < /button><button type="submit" class="flex-1 px-4 py-2 bg-green-500 text-white">{props.booking ? 'Cập nhật' : 'Tạo đặt sân'}</button > </div>
                                                </form>
                                                </Modal>
  );
}});

const FieldModal = defineComponent({
  props: ['isOpen', 'field'], emits: ['close', 'save'], setup(props: any, { emit }) {
    const form = reactive<Field>(props.field ? { ...props.field } : { id: '', name: '', type: '', status: 'available', pricePerHour: '', description: '' });
    function onSubmit(e: any) { e.preventDefault(); if (!form.name || !form.type || !form.pricePerHour) { toastError('Vui lòng điền đầy đủ thông tin!'); return } const out = { ...form, id: form.id || `field-${Date.now()}` }; emit('save', out); emit('close'); }
    return () => (
      <Modal isOpen= { props.isOpen } title = { props.field ? 'Chỉnh sửa sân' : 'Thêm sân mới' } onClose = {()=> emit('close')}>
        <form onSubmit={ onSubmit }>
          <div class="space-y-4" >
            <div class="grid grid-cols-2 gap-4" >
              <div>
              <label class="block text-sm mb-2 text-gray-700" > Tên sân * </label>
                < input v - model={ form.name } class="w-full px-4 py-2 border" />
                  </div>
                  < div >
                  <label class="block text-sm mb-2 text-gray-700" > Loại sân * </label>
                    < select v - model={ form.type } class="w-full px-4 py-2 border" > <option value="" > --Chọn loại-- < /option><option value="Sân 5 người">Sân 5 người</option > <option value="Sân 7 người" > Sân 7 người < /option><option value="Sân 11 người">Sân 11 người</option > </select>
                      </div>
                      </div>
                      < div class="grid grid-cols-2 gap-4" >
                        <div>
                        <label class="block text-sm mb-2 text-gray-700" > Giá thuê / giờ * </label>
                          < input v - model={ form.pricePerHour } class="w-full px-4 py-2 border" />
                            </div>
                            < div >
                            <label class="block text-sm mb-2 text-gray-700" > Trạng thái </label>
                              < select v - model={ form.status } class="w-full px-4 py-2 border" > <option value="available" > Sẵn sàng < /option><option value="occupied">Đang thuê</option > <option value="maintenance" > Bảo trì < /option></select >
                                </div>
                                </div>
                                < div >
                                <label class="block text-sm mb-2 text-gray-700" > Mô tả </label>
                                  < textarea v - model={ form.description } rows = { 3} class="w-full px-4 py-2 border" />
                                    </div>
                                    </div>
                                    < div class="flex gap-3 mt-6 pt-6 border-t border-gray-200" > <button type="button" onClick = {()=> emit('close')} class="flex-1 px-4 py-2 border" > Hủy < /button><button type="submit" class="flex-1 px-4 py-2 bg-green-500 text-white">{props.field ? 'Cập nhật' : 'Thêm sân'}</button > </div>
                                      </form>
                                      </Modal>
  );
}});

const CustomerModal = defineComponent({
  props: ['isOpen', 'customer'], emits: ['close', 'save'], setup(props: any, { emit }) {
    const form = reactive<Customer>(props.customer ? { ...props.customer } : { id: '', name: '', phone: '', email: '', address: '', totalBookings: 0, totalSpent: '0đ', notes: '' });
    function onSubmit(e: any) { e.preventDefault(); if (!form.name || !form.phone) { toastError('Vui lòng điền tên và số điện thoại!'); return } const out = { ...form, id: form.id || `cus-${Date.now()}` }; emit('save', out); emit('close'); }
    return () => (
      <Modal isOpen= { props.isOpen } title = { props.customer ? 'Chỉnh sửa khách hàng' : 'Thêm khách hàng mới' } onClose = {()=> emit('close')}>
        <form onSubmit={ onSubmit }>
          <div class="space-y-4" >
            <div class="grid grid-cols-2 gap-4" >
              <div>
              <label class="block text-sm mb-2 text-gray-700" > Tên khách hàng * </label>
                < input v - model={ form.name } class="w-full px-4 py-2 border" />
                  </div>
                  < div >
                  <label class="block text-sm mb-2 text-gray-700" > Số điện thoại * </label>
                    < input v - model={ form.phone } class="w-full px-4 py-2 border" />
                      </div>
                      </div>
                      < div >
                      <label class="block text-sm mb-2 text-gray-700" > Email </label>
                        < input v - model={ form.email } class="w-full px-4 py-2 border" />
                          </div>
                          < div >
                          <label class="block text-sm mb-2 text-gray-700" > Địa chỉ </label>
                            < input v - model={ form.address } class="w-full px-4 py-2 border" />
                              </div>
                              < div >
                              <label class="block text-sm mb-2 text-gray-700" > Ghi chú </label>
                                < textarea v - model={ form.notes } rows = { 3} class="w-full px-4 py-2 border" />
                                  </div>
                                  </div>
                                  < div class="flex gap-3 mt-6 pt-6 border-t border-gray-200" > <button type="button" onClick = {()=> emit('close')} class="flex-1 px-4 py-2 border" > Hủy < /button><button type="submit" class="flex-1 px-4 py-2 bg-green-500 text-white">{props.customer ? 'Cập nhật' : 'Thêm khách hàng'}</button > </div>
                                    </form>
                                    </Modal>
  );
}});

// Small reusable stat card
const StatCard = defineComponent({
  props: ['title', 'value', 'change', 'isPositive'], setup(props: any) {
    return () => (
      <div class= "bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow" >
      <p class="text-gray-600 text-sm mb-1" > { props.title } </p>
        < h3 > { props.value } </h3>
        < div class="text-sm mt-2" : class="props.isPositive ? 'text-green-600' : 'text-red-600'" > { props.change } </div>
          </div>
); } });

// Simplified RevenueChart (pure CSS bars)
const RevenueChart = defineComponent({
  setup() {
    const data = [45000000, 52000000, 48000000, 61000000, 55000000, 67000000, 72000000, 68000000, 75000000, 81000000, 78000000, 89000000]; const max = Math.max(...data); return () => (
      <div class= "bg-white p-6 rounded-xl border border-gray-200" >
      <h3 class="mb-2" > Doanh thu thuê sân 2024 </h3>
        < div class="w-full flex items-end gap-2 h-40" >
        {
          data.map((v, i) => <div key={ i } class= "flex-1 flex flex-col items-center" >
            <div class="w-full rounded-t" style = {{ height: `${(v / max) * 100}%`, background: '#22c55e' }} > </div>
          < div class="text-xs mt-1" > T{ i + 1 } </div>
            </div>)}
</div>
  </div>
); } });

// Views
const DashboardView = defineComponent({
  setup() {
    return () => (
      <>
      <div class= "mb-8" > <h1 class="mb-2" > Tổng quan hệ thống < /h1><p class="text-gray-600">Chào mừng trở lại! Đây là tổng quan về sân bóng của bạn.</p > </div>
        < div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" >
          <StatCard title="Tổng số sân" value = {`${fields.value.length} sân`
  } change="2 sân mới" isPositive={ true} />
  <StatCard title="Đặt sân hôm nay" value = "24 lượt" change="18.5%" isPositive={ true} />
  <StatCard title="Giờ hoạt động" value = "156 giờ" change="12.2%" isPositive={ true} />
  <StatCard title="Doanh thu tháng" value = "89M đ" change="15.3%" isPositive={ true} />
  </div>

  < div class= "mb-8" >
    <div class="mb-4 flex items-center justify-between"> <div><h3 class="mb-1"> Trạng thái sân</ h3 > <p class="text-gray-600" > Tình trạng các sân hiện tại < /p></div > <button onClick={()=> { fieldModal.isOpen = true; fieldModal.field = null }} class="px-4 py-2 bg-green-500 text-white rounded-lg" > + Thêm sân < /button></div >
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" > {
        fields.value.map(f => <div key={ f.id } > <FieldCard f={ f } /> </div>)}</div >
          </div>

          < div class= "mb-8" > <ScheduleViewInline /></div >

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8" > <div class="lg:col-span-2" > <RevenueChart /></div >
        <div class="bg-white p-6 rounded-xl border border-gray-200" >
        <h3 class="mb-1" > Khung giờ phổ biến </h3>
        < p class= "text-gray-600" > Tỷ lệ đặt sân </p>
        < div class= "space-y-4 mt-4" > {
          [{ time: '18:00 - 19:30', bookings: 234 }, { time: '19:00 - 20:30', bookings: 198 }, { time: '20:00 - 21:30', bookings: 176 }, { time: '17:00 - 18:30', bookings: 145 }, { time: '07:00 - 08:30', bookings: 123 }].map((slot) => (
            <div class= "space-y-2" >
            <div class="flex justify-between text-sm" > <span class="text-gray-900" > { slot.time } < /span><span class="text-gray-600">{slot.bookings} lượt</span > </div>
          < div class= "w-full bg-gray-200 rounded-full h-2" > <div class="h-2 rounded-full bg-green-500" style = {{ width: `${(slot.bookings / 234) * 100}%` }} > </div></div >
        </div>
        ))
      }
        </div>
        </div>
        </div>

        < div class="mb-8" > <BookingTable items={ bookings.value.slice(0, 5) } /></div >
          </>
); } });

const FieldCard = defineComponent({
  props: ['f'], setup(props: any) {
    return () => (
      <div class= "bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow relative" >
      <div class="flex items-start justify-between mb-4" > <div><h4 class="mb-1" > { props.f.name } < /h4><p class="text-gray-600 text-sm">{props.f.type}</p > </div>
        < div class="flex items-center gap-2" > <span class={ `px-3 py-1 rounded-full text-sm ${props.f.status === 'available' ? 'bg-green-100 text-green-700' : props.f.status === 'occupied' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}` }> { props.f.status === 'available' ? 'Trống' : props.f.status === 'occupied' ? 'Đang thuê' : 'Bảo trì' } </span>
          < div class="relative" >
            <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors" >⋮</button>
              < div class="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]" > <button class="w-full text-left px-4 py-2" > Chỉnh sửa < /button><button class="w-full text-left px-4 py-2 text-red-600">Xóa</button > </div>
                </div>
                </div>
                </div>
    { props.f.currentBooking && <div class="bg-gray-50 p-3 rounded-lg mb-2" > <p class="text-sm text-gray-600 mb-1" > Đang thuê: </p><p class="text-sm">{props.f.currentBooking}</p > </div> }
    { props.f.nextBooking && <div class="bg-green-50 p-3 rounded-lg" > <p class="text-sm text-gray-600 mb-1" > Lịch tiếp theo: </p><p class="text-sm text-green-700">{props.f.nextBooking}</p > </div> }
    </div>
); } });

const ScheduleViewInline = defineComponent({
  setup() {
    const timeSlots = ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00']; const flds = ['Sân 1 (5 người)', 'Sân 2 (7 người)', 'Sân 3 (11 người)']; const bks: any = { 'Sân 1 (5 người)': [{ time: '18:00', duration: 1.5, customer: 'Nguyễn Văn A' }, { time: '20:00', duration: 1.5, customer: 'Phạm Thị D' }], 'Sân 2 (7 người)': [{ time: '19:00', duration: 1.5, customer: 'Trần Thị B' }], 'Sân 3 (11 người)': [{ time: '07:00', duration: 1.5, customer: 'Lê Văn C' }, { time: '16:00', duration: 2, customer: 'Team FC' }] }; const isBooked = (field: string, time: string) => (bks[field] || []).some((bk: any) => bk.time === time); const getBooking = (field: string, time: string) => (bks[field] || []).find((bk: any) => bk.time === time);
    return () => (
      <div class= "bg-white p-6 rounded-xl border border-gray-200" >
      <div class="mb-6" > <h3 class="mb-1" > Lịch đặt sân hôm nay < /h3><p class="text-gray-600">20/11 / 2024 - Thứ 4 < /p></div >
        <div class="overflow-x-auto" > <table class="w-full border-collapse" > <thead><tr><th class="border border-gray-200 bg-gray-50 p-3 text-left min-w-[100px]" > Giờ < /th>{flds.map(f=> <th class="border border-gray-200 bg-gray-50 p-3 text-left min-w-[200px]">{f}</th >)}</tr></thead > <tbody>
          { timeSlots.map(time => <tr><td class="border border-gray-200 p-3 bg-gray-50" > { time } < /td>{flds.map(f=> { const booked = isBooked(f,time); const bk=getBooking(f,time); return <td class={`border border-gray-200 p-3 ${booked?'bg-green-100':'bg-white hover:bg-gray-50 cursor-pointer'}`}>{bk? <div class="text-sm"><p class="text-green-700">{bk.customer}</p > <p class="text-gray-600 text-xs" > { bk.duration }h < /p></div >: null} < /td> })}</tr >)}
</tbody></table > </div></div >
  ); } });

const BookingTable = defineComponent({
  props: ['items'], setup(props: any) {
    function getStatusConfig(status: string) { if (status === 'confirmed') return { label: 'Đã xác nhận', cls: 'bg-green-100 text-green-700' }; if (status === 'pending') return { label: 'Chờ xác nhận', cls: 'bg-yellow-100 text-yellow-700' }; if (status === 'completed') return { label: 'Hoàn thành', cls: 'bg-blue-100 text-blue-700' }; if (status === 'cancelled') return { label: 'Đã hủy', cls: 'bg-red-100 text-red-700' }; return { label: status, cls: 'bg-gray-100 text-gray-700' } }
    return () => (
      <div class= "bg-white p-6 rounded-xl border border-gray-200" >
      <div class="mb-6 flex items-center justify-between" > <div><h3 class="mb-1" > Đặt sân gần đây < /h3><p class="text-gray-600">Danh sách đặt sân mới nhất</p > </div><button class="px-4 py-2 bg-green-500 text-white rounded-lg">+ Đặt sân mới</button > </div>
        < div class="overflow-x-auto" > <table class="w-full" > <thead><tr class="border-b border-gray-200" > <th class="text-left py-3 px-4 text-gray-600" > Mã < /th><th class="text-left py-3 px-4 text-gray-600">Khách hàng</th > <th class="text-left py-3 px-4 text-gray-600" > SĐT < /th><th class="text-left py-3 px-4 text-gray-600">Sân</th > <th class="text-left py-3 px-4 text-gray-600" > Ngày < /th><th class="text-left py-3 px-4 text-gray-600">Giờ</th > <th class="text-left py-3 px-4 text-gray-600" > Giá < /th><th class="text-left py-3 px-4 text-gray-600">Trạng thái</th > <th class="text-left py-3 px-4 text-gray-600" > Thao tác < /th></tr > </thead><tbody>
    { props.items.map((b: Booking) => { const st = getStatusConfig(b.status); return (<tr class= "border-b border-gray-100 hover:bg-gray-50 transition-colors" > <td class="py-4 px-4" > { b.id } < /td><td class="py-4 px-4">{b.customer}</td > <td class="py-4 px-4" > { b.phone } < /td><td class="py-4 px-4">{b.field}</td > <td class="py-4 px-4" > { b.date } < /td><td class="py-4 px-4">{b.time}</td > <td class="py-4 px-4" > { b.price } < /td><td class="py-4 px-4"><span class={`inline-block px-3 py-1 rounded-full text-sm ${st.cls}`}>{st.label}</span > </td><td class="py-4 px-4"><div class="flex gap-2"><button class="p-2 hover:bg-green-50 text-green-600 rounded-lg">✎</button > <button class="p-2 hover:bg-red-50 text-red-600 rounded-lg" >🗑</button></div > </td></tr >) })}
</tbody></table > </div></div >
  ); } });

// Other views (simple wrappers)
const FieldsView = defineComponent({ setup() { return () => (<div><h1 class= "mb-2" > Quản lý sân < /h1><p class="text-gray-600 mb-4">Quản lý thông tin và trạng thái các sân</p > <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" > { fields.value.map(f => <FieldCard f={ f } />) } < /div></div >); } });
const BookingsView = defineComponent({ setup() { return () => (<div><h1 class= "mb-2" > Quản lý đặt sân < /h1><p class="text-gray-600 mb-4">Xem và quản lý tất cả đơn đặt sân</p > <BookingTable items={ bookings.value } /></div >); } });
const ScheduleView = defineComponent({ setup() { return () => (<ScheduleViewInline />); } });
const CustomersView = defineComponent({ setup() { return () => (<CustomerList />); } });

const CustomerList = defineComponent({
  setup() {
    return () => (
      <div>
      <div class= "mb-6 flex items-center justify-between" > <div><h3 class="mb-1" > Danh sách khách hàng < /h3><p class="text-gray-600">Quản lý thông tin khách hàng</p > </div><button class="px-4 py-2 bg-green-500 text-white rounded-lg">+ Thêm khách hàng</button > </div>
        < div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" > {
          customers.value.map(c => (
            <div class= "border border-gray-200 rounded-lg p-4 hover:shadow-md" > <div class="flex items-start justify-between mb-3" > <div><h4 class="mb-1" > { c.name } < /h4><div class="flex items-center gap-2 text-sm text-gray-600 mb-1">{c.phone}</div > { c.email && <div class="text-sm text-gray-600"> { c.email } < /div>}</div > <div class="flex gap-1"> <button class="p-2 hover:bg-green-50 text-green-600 rounded-lg">✎< /button><button class="p-2 hover:bg-red-50 text-red-600 rounded-lg">🗑</button > </div></div > <div class="grid grid-cols-2 gap-2 pt-3 border-t border-gray-200" > <div class="bg-green-50 p-2 rounded" > <p class="text-xs text-gray-600" > Lượt đặt < /p><p class="text-sm text-green-700">{c.totalBookings}</p > </div><div class="bg-blue-50 p-2 rounded"><p class="text-xs text-gray-600">Chi tiêu</p > <p class="text-sm text-blue-700" > { c.totalSpent } < /p></div > </div></div >))}</div>
              </div>
); } });

const RevenueView = defineComponent({ setup() { return () => (<div><h1 class= "mb-2" > Báo cáo doanh thu < /h1><p class="text-gray-600 mb-4">Chi tiết doanh thu và thống kê</p > <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" > <div class="bg-white p-6 rounded-xl border" > <p class="text-gray-600 mb-2" > Doanh thu hôm nay < /p><h2 class="mb-2">12.5M đ</h2 > <p class="text-sm text-green-600" > +18.5 % </p></div > <div class="bg-white p-6 rounded-xl border" > <p class="text-gray-600 mb-2" > Doanh thu tháng này < /p><h2 class="mb-2">89M đ</h2 > </div><div class="bg-white p-6 rounded-xl border"><p class="text-gray-600 mb-2">Doanh thu năm</p > <h2 class="mb-2" > 891M đ < /h2></div > </div><RevenueChart / > </div>); } });
const AnalyticsView = defineComponent({
  setup() {
    return () => (
      <div>
      <h1 class= "mb-2" > Thống kê & Phân tích </h1>
        < p class="text-gray-600" > Phân tích chi tiết hoạt động kinh doanh </p>
          < div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 mt-4" >
            <div class="bg-white p-6 rounded-xl border" > <h3 class="mb-4" > Khung giờ phổ biến < /h3>{[{ time:'18:00 - 19:30', bookings:234 },{ time:'19:00 - 20:30', bookings:198 }].map(slot=> <div class="space-y-2"><div class="flex justify-between text-sm"><span class="text-gray-900">{slot.time}</span > <span class="text-gray-600" > { slot.bookings } lượt < /span></div > <div class="w-full bg-gray-200 rounded-full h-2" > <div class="h-2 rounded-full bg-green-500" style = {{ width: `${(slot.bookings / 234) * 100}%` }
  }> </div></div > </div>)}</div >
  <div class="bg-white p-6 rounded-xl border" > <h3 class="mb-4" > Top khách hàng < /h3>{customers.value.slice(0,5).map((customer,i)=> <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"><div class="flex items-center gap-3"><div class="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center">{i+1}</div > <div><p class="text-sm" > { customer.name } < /p><p class="text-xs text-gray-600">{customer.totalBookings} lượt</p > </div></div > <p class="text-sm text-green-600" > { customer.totalSpent } < /p></div >)}</div>
    </div>
    < RevenueChart />
    </div>
); } });

const SettingsView = defineComponent({ setup() { return () => (<div><h1 class= "mb-2" > Cài đặt hệ thống < /h1><p class="text-gray-600">Quản lý cấu hình và thiết lập</p > <div class="bg-white p-6 rounded-xl border" > <h3 class="mb-4" > Thông tin chung < /h3><div class="grid grid-cols-2 gap-4"><div><label class="block text-sm mb-2">Tên sân bóng</label > <input class="w-full px-4 py-2 border" value = "Sân bóng ABC" /> </div><div><label class="block text-sm mb-2">Số điện thoại</label > <input class="w-full px-4 py-2 border" value = "0901234567" /> </div><div class="col-span-2"><label class="block text-sm mb-2">Địa chỉ</label > <input class="w-full px-4 py-2 border" value = "123 Đường ABC, Quận XYZ, TP.HCM" /> </div></div > <div class="pt-6 border-t mt-6" > <button class="px-6 py-2 bg-green-500 text-white rounded-lg" > Lưu thay đổi < /button></div > </div></div >); } });

</script>

<style scoped>
/* minor scoped styles */
</style>
