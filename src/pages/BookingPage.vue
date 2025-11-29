<template>
    <div class="min-h-screen bg-Gray-50 text-gray-900 dark:text-gray-100 py-10 px-6 relative overflow-hidden">
        <div class="md:col-span-2 mb-6 flex flex-wrap items-center justify-between">
            <h2 class="text-2xl font-semibold text-stone-950">Danh sách sân bóng</h2>

            <!-- Bộ lọc giá -->
            <div class="flex items-center gap-3">
                <label class="font-medium text-gray-700 dark:text-gray-900">Lọc theo giá:</label>
                <select v-model="selectedPrice"
                    class="border border-gray-300 dark:border-gray-700 rounded-lg p-2 bg-gray-50 dark:bg-gray-900">
                    <option value="all">Tất cả</option>
                    <option value="low">Dưới 300.000 VNĐ</option>
                    <option value="mid">300.000 - 500.000 VNĐ</option>
                    <option value="high">Trên 500.000 VNĐ</option>
                </select>
            </div>
        </div>

        <div class="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
            <!-- Danh sách sân -->
            <div class="md:col-span-2">
                <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div v-for="field in filteredFields" :key="field.id"
                        class="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden">
                        <img :src="field.image" alt="" class="h-40 w-full object-cover" />
                        <div class="p-4">
                            <h3 class="text-lg font-bold mb-1">{{ field.name }}</h3>
                            <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                {{ field.location }} -- {{ field.description }}
                            </p>
                            <p class="font-semibold text-green-600 dark:text-green-400 mb-3">
                                {{ field.price }} VNĐ / giờ
                            </p>
                            <div class="flex gap-2">
                                <button @click="viewDetails(field)"
                                    class="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 py-2 rounded-xl transition">
                                    Xem chi tiết
                                </button>
                                <button @click="openBooking(field)"
                                    class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl transition">
                                    Đặt sân này
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Popup Đặt sân -->
        <transition name="fade-slide">
            <div v-if="showBooking"
                class="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
                <div
                    class="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-xl p-6 relative transform transition-all">
                    <button @click="closeBooking"
                        class="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-xl font-bold">
                        ✕
                    </button>

                    <h2 class="text-2xl font-semibold mb-4">Đặt sân</h2>

                    <!-- Step 1: Chọn loại khách -->
                    <div v-if="!bookingStep || bookingStep === 'chooseType'">
                        <p class="mb-3 text-sm text-gray-600 dark:text-gray-400">Bạn là:</p>
                        <div class="flex gap-3 mb-4">
                            <label class="flex-1 p-3 border rounded-lg cursor-pointer hover:shadow-md transition"
                                :class="bookingType === 'guest' ? 'border-green-500 bg-green-50 dark:bg-green-900/30' : ''">
                                <input type="radio" class="hidden" value="guest" v-model="bookingType" />
                                <div class="font-semibold">Khách vãng lai</div>
                                <div class="text-sm text-gray-500">Không cần đăng nhập, cung cấp thông tin để đặt.</div>
                            </label>

                            <label class="flex-1 p-3 border rounded-lg cursor-pointer hover:shadow-md transition"
                                :class="bookingType === 'customer' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : ''">
                                <input type="radio" class="hidden" value="customer" v-model="bookingType" />
                                <div class="font-semibold">Khách hàng (đăng nhập)</div>
                                <div class="text-sm text-gray-500">Nếu bạn đã có tài khoản, đăng nhập để quản lý đặt
                                    sân.</div>
                            </label>
                        </div>

                        <div class="flex gap-3">
                            <button @click="proceedBookingType"
                                class="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl transition">
                                Tiếp tục
                            </button>
                            <button @click="closeBooking"
                                class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-xl transition">
                                Hủy
                            </button>
                        </div>
                    </div>

                    <!-- If customer chosen but not authenticated -->
                    <div v-if="bookingStep === 'requireLogin'">
                        <p class="mb-4 text-gray-600 dark:text-gray-400">Bạn cần đăng nhập để thực hiện thao tác này.
                        </p>
                        <div class="flex gap-3">
                            <button @click="gotoLogin"
                                class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl transition">
                                Đăng nhập
                            </button>
                            <button @click="gotoRegister"
                                class="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded-xl transition">
                                Đăng ký
                            </button>
                            <button @click="bookingStep = 'chooseType'"
                                class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-xl transition">
                                Quay lại
                            </button>
                        </div>
                    </div>

                    <!-- Form đặt sân (guest or authenticated customer) -->
                    <div v-if="bookingStep === 'form'">
                        <form @submit.prevent="submitBooking" class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium mb-1">Sân bóng</label>
                                <select v-model="form.fieldId"
                                    class=" appearance-none w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2 bg-gray-50 dark:bg-gray-900"
                                    required disabled>
                                    <option value="" disabled>-- Chọn sân --</option>
                                    <option v-for="f in fields" :key="f.id" :value="f.id">
                                        {{ f.name }}
                                    </option>
                                </select>
                            </div>

                            <!-- Ngày đặt -->
                            <div>
                                <label class="block text-sm font-medium mb-1">Ngày đặt</label>
                                <div class="w-full border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 p-2 cursor-pointer flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                                    @click="openDatePicker">
                                    <input ref="dateInput" type="date" v-model="form.date" :min="today"
                                        onkeydown="return false"
                                        class="w-full bg-transparent outline-none cursor-pointer" required />
                                </div>
                            </div>

                            <!-- Giờ -->
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium mb-1">Giờ bắt đầu</label>
                                    <div class="w-full border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                                        @click="openStartTimePicker">
                                        <input ref="startTimeInput" type="time" v-model="form.startTime"
                                            onkeydown="return false"
                                            class="w-full bg-transparent outline-none cursor-pointer" required />
                                    </div>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium mb-1">Giờ kết thúc</label>
                                    <div class="w-full border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                                        @click="openEndTimePicker">
                                        <input ref="endTimeInput" type="time" v-model="form.endTime"
                                            onkeydown="return false"
                                            class="w-full bg-transparent outline-none cursor-pointer" required />
                                    </div>
                                </div>
                            </div>

                            <!-- Nếu là guest, yêu cầu tên & phone/email -->
                            <div v-if="bookingType === 'guest'">
                                <label class="block text-sm font-medium mb-1">Tên người đặt</label>
                                <input type="text" v-model="form.name" placeholder="Nguyễn Văn A"
                                    class="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2 bg-gray-50 dark:bg-gray-900"
                                    required />
                                <label class="block text-sm font-medium mb-1 mt-2">Số điện thoại</label>
                                <input type="tel" v-model="form.phone" placeholder="0944xxxxxx"
                                    class="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2 bg-gray-50 dark:bg-gray-900"
                                    required />
                            </div>

                            <!-- Nếu là customer và authenticated, show note -->
                            <div v-if="bookingType === 'customer' && isAuthenticated"
                                class="text-sm text-gray-600 dark:text-gray-400">
                                Bạn đang đặt với tài khoản: <span class="font-medium">{{ currentUser?.name || '—'
                                }}</span>
                            </div>

                            <button type="submit"
                                class="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl transition">
                                Xác nhận đặt sân
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </transition>

        <!-- Popup nhắc đăng nhập (nếu chưa đăng nhập) -->
        <transition name="fade-slide">
            <div v-if="showLoginPrompt"
                class="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
                <div class="bg-white dark:bg-gray-800 w-full max-w-sm rounded-2xl shadow-xl p-6 relative">
                    <button @click="closeLoginPrompt"
                        class="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-xl font-bold">✕</button>
                    <h3 class="text-lg font-semibold mb-2">Bạn chưa đăng nhập</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Để đặt sân bằng tài khoản, vui lòng đăng
                        nhập hoặc đăng ký. Bạn cũng có thể tiếp tục đặt dưới dạng khách vãng lai.</p>
                    <div class="flex gap-3">
                        <button @click="gotoLogin"
                            class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl transition">Đăng
                            nhập</button>
                        <button @click="gotoRegister"
                            class="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded-xl transition">Đăng
                            ký</button>
                    </div>
                    <div class="mt-3">
                        <button @click="continueAsGuest"
                            class="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-xl transition">Tiếp
                            tục đặt (Khách vãng lai)</button>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

/* --------------------------------
   1) DỮ LIỆU MẪU: GIỮ Y NGUYÊN
--------------------------------- */
const fields = ref([
    { id: 1, name: "Sân A1", location: "Khu thể thao Quận 1", price: "200.000", description: "Sân bóng đá 5 người", image: "https://tse3.mm.bing.net/th/id/OIP.tBLcp9pad-wn7tiv6Q6JhgHaFj?pid=Api&P=0&h=220" },
    { id: 2, name: "Sân A2", location: "Khu thể thao Quận 1", price: "200.000", description: "Sân bóng đá 5 người", image: "https://tse1.mm.bing.net/th/id/OIP.aVbYeGoSoJhCSg2OzKzESQHaFj?pid=Api&P=0&h=220" },
    { id: 3, name: "Sân B1", location: "Khu thể thao Quận 1", price: "200.000", description: "Sân bóng đá 5 người", image: "https://tse4.mm.bing.net/th/id/OIP.FNjkkXg6_xoIguQPIVq1LgHaE8?pid=Api&P=0&h=220" },
    { id: 4, name: "Sân B2", location: "Khu thể thao Quận 1", price: "200.000", description: "Sân bóng đá 5 người", image: "https://tse4.mm.bing.net/th/id/OIP.FfuAhspJJCFL2kcYRPvy1AHaFj?pid=Api&P=0&h=220" },
    { id: 5, name: "Sân C1", location: "Khu thể thao Quận 1", price: "250.000", description: "Sân bóng đá 6 người", image: "https://tse3.mm.bing.net/th/id/OIP.eRmajNoL8PHc2k5XWoWZpQHaEK?pid=Api&P=0&h=220" },
    { id: 6, name: "Sân C2", location: "Khu thể thao Quận 1", price: "250.000", description: "Sân bóng đá 6 người", image: "https://tse1.mm.bing.net/th/id/OIP.6koCM750UfzYdM8Qjj2a6QHaE8?pid=Api&P=0&h=220" },
    { id: 7, name: "Sân D1", location: "Khu thể thao Quận 1", price: "400.000", description: "Sân bóng đá 7 người", image: "https://tse3.mm.bing.net/th/id/OIP.eRmajNoL8PHc2k5XWoWZpQHaEK?pid=Api&P=0&h=220" },
    { id: 8, name: "Sân D2", location: "Khu thể thao Quận 1", price: "400.000", description: "Sân bóng đá 7 người", image: "https://tse1.mm.bing.net/th/id/OIP.6koCM750UfzYdM8Qjj2a6QHaE8?pid=Api&P=0&h=220" },
    { id: 9, name: "Sân E1", location: "Khu thể thao Quận 1", price: "800.000", description: "Sân bóng đá 11 người", image: "https://tse3.mm.bing.net/th/id/OIP.eRmajNoL8PHc2k5XWoWZpQHaEK?pid=Api&P=0&h=220" },
    { id: 10, name: "Sân E2", location: "Khu thể thao Quận 1", price: "800.000", description: "Sân bóng đá 11 người", image: "https://tse1.mm.bing.net/th/id/OIP.6koCM750UfzYdM8Qjj2a6QHaE8?pid=Api&P=0&h=220" },
]);

/* --------------------------------
   2) FILTER GIÁ: DÙNG MAP THAY IF
--------------------------------- */
const selectedPrice = ref("all");

const PRICE_FILTERS = {
    all: () => true,
    low: (price) => price < 300000,
    mid: (price) => price >= 300000 && price <= 500000,
    high: (price) => price > 500000,
};

const filteredFields = computed(() => {
    return fields.value.filter((field) => {
        // "200.000" -> 200000
        const price = parseInt(field.price.replace(/\./g, ""), 10);
        return PRICE_FILTERS[selectedPrice.value](price);
    });
});

/* --------------------------------
   3) FORM: HẰNG SỐ + HÀM RESET
--------------------------------- */
const today = new Date().toISOString().split("T")[0];

const DEFAULT_FORM = {
    fieldId: "",
    date: "",
    startTime: "",
    endTime: "",
    name: "",
    phone: "",
};

const form = ref({ ...DEFAULT_FORM });

function resetForm() {
    form.value = { ...DEFAULT_FORM };
}

/* --------------------------------
   4) AUTH (GIẢ LẬP NHƯ CŨ)
--------------------------------- */
const isAuthenticated = ref(false); // TODO: bind auth thật
const currentUser = ref(null);      // { id, name, email } khi đăng nhập

function closeLoginPrompt() {
    showLoginPrompt.value = false;
}

function gotoLogin() {
    closeLoginPrompt();
    router.push({ name: "login", query: { redirect: router.currentRoute.value.fullPath } });
}

function gotoRegister() {
    closeLoginPrompt();
    router.push({
        name: "login",
        query: { action: "register", redirect: router.currentRoute.value.fullPath },
    });
}

/* --------------------------------
   5) BOOKING: CHIA NHỎ HÀM RÕ NGHĨA
--------------------------------- */
const showBooking = ref(false);
const bookingType = ref("guest");       // 'guest' | 'customer'
const bookingStep = ref("chooseType");  // 'chooseType' | 'requireLogin' | 'form'
const showLoginPrompt = ref(false);

function openBooking(field) {
    form.value.fieldId = field.id;
    if (isAuthenticated.value) {
        startCustomerBooking();
    } else {
        showLoginPrompt.value = true;
    }
}

function startCustomerBooking() {
    bookingType.value = "customer";
    bookingStep.value = "form";
    if (currentUser.value) {
        form.value.name = currentUser.value.name || "";
        form.value.phone = currentUser.value.phone || "";
    }
    showBooking.value = true;
}

function continueAsGuest() {
    showLoginPrompt.value = false;
    bookingType.value = "guest";
    bookingStep.value = "form";
    showBooking.value = true;
}

function proceedBookingType() {
    if (bookingType.value === "customer") {
        if (!isAuthenticated.value) {
            bookingStep.value = "requireLogin";
            return;
        }
        // Đã đăng nhập: prefill
        if (currentUser.value) {
            form.value.name = currentUser.value.name || "";
            form.value.phone = currentUser.value.phone || "";
        }
    }
    bookingStep.value = "form";
}

function closeBooking() {
    showBooking.value = false;
    bookingStep.value = "chooseType";
    resetForm();
}

/* --------------------------------
   6) SUBMIT: TÁCH VALIDATION
--------------------------------- */
function validateForm() {
    if (!form.value.date || !form.value.startTime || !form.value.endTime) {
        alert("Vui lòng chọn ngày và giờ hợp lệ.");
        return false;
    }
    if (bookingType.value === "guest" && (!form.value.name || !form.value.phone)) {
        alert("Vui lòng nhập tên và số điện thoại.");
        return false;
    }
    return true;
}

function submitBooking() {
    if (!validateForm()) return;

    alert(
        `✅ Đặt sân thành công!\n` +
        `Loại: ${bookingType.value === "guest" ? "Khách vãng lai" : "Khách hàng"}\n` +
        `Sân: ${form.value.fieldId}\n` +
        `Ngày: ${form.value.date}\n` +
        `Giờ: ${form.value.startTime} - ${form.value.endTime}\n` +
        `Người đặt: ${form.value.name || (currentUser.value?.name || "—")}`
    );

    closeBooking();
}

/* --------------------------------
   7) TIỆN ÍCH KHÁC (template dùng)
--------------------------------- */
const dateInput = ref(null);
const startTimeInput = ref(null);
const endTimeInput = ref(null);

const openDatePicker = () => dateInput.value?.showPicker?.();
const openStartTimePicker = () => startTimeInput.value?.showPicker?.();
const openEndTimePicker = () => endTimeInput.value?.showPicker?.();

const viewDetails = (field) => router.push(`/field/${field.id}`);
</script>


<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: all 0.3s ease;
}

.fade-slide-enter-from {
    opacity: 0;
    transform: translateY(20px);
}

.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(20px);
}
</style>
