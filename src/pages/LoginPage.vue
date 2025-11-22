<template>
  <div class="min-h-screen flex">
    <!-- Toaster -->
    <div class="fixed top-4 right-4 z-50 flex flex-col gap-2">
      <div v-for="t in toasts" :key="t.id" class="px-4 py-2 rounded-lg shadow-md text-sm bg-black/80 text-white">
        {{ t.message }}
      </div>
    </div>

    <!-- Left column: login form -->
    <div class="w-full lg:w-1/2 bg-white flex items-center justify-center p-8">
      <div class="w-full max-w-md">
        <!-- Logo & title -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a10 10 0 0 0 0 20" />
              <path d="M2 12h20" />
            </svg>
          </div>
          <h1 class="text-black mb-2">Đặt Sân Bóng Đá</h1>
          <p class="text-gray-600">Đăng nhập để đặt sân yêu thích của bạn</p>
        </div>

        <!-- Login form -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email -->
          <div class="space-y-2">
            <label for="email" class="text-black flex items-center gap-2">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
                stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="5" width="18" height="14" rx="2" ry="2"></rect>
                <path d="M3 7l9 6 9-6"></path>
              </svg>
              Email hoặc Tên đăng nhập
            </label>
            <div class="relative">
              <input id="email" v-model="email" type="text" required placeholder="Nhập email hoặc tên đăng nhập"
                class="w-full pl-10 bg-white border-2 border-gray-200 focus:border-green-500 focus:ring-green-500 rounded-md py-3" />
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
          </div>

          <!-- Password -->
          <div class="space-y-2">
            <label for="password" class="text-black flex items-center gap-2">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
                stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              Mật khẩu
            </label>
            <div class="relative">
              <input id="password" :type="showPassword ? 'text' : 'password'" v-model="password" required
                placeholder="Nhập mật khẩu"
                class="w-full pl-10 pr-10 bg-white border-2 border-gray-200 focus:border-green-500 focus:ring-green-500 rounded-md py-3" />
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>

              <button type="button" @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <svg v-if="showPassword" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 3l18 18"></path>
                  <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-5 0-9.27-3-11-7 1.02-2.03 2.65-3.77 4.72-4.95">
                  </path>
                </svg>
                <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
                  stroke-linecap="round" stroke-linejoin="round">
                  <path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8S2 12 2 12z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </button>
            </div>
          </div>

          <!-- Forgot password + remember -->
          <div class="flex items-center justify-between">
            <label class="flex items-center gap-2 text-sm text-black cursor-pointer">
              <input type="checkbox" class="w-4 h-4 accent-green-500 border-gray-300 rounded" />
              Ghi nhớ đăng nhập
            </label>
            <button type="button" class="text-sm text-green-600 hover:text-green-700"
              @click="showForgotPasswordDialog = true">Quên mật khẩu?</button>
          </div>

          <!-- Login button -->
          <button type="submit" class="w-full bg-green-500 hover:bg-green-600 text-white py-6 rounded-md">Đăng
            nhập</button>

          <!-- Register link -->
          <div class="text-center">
            <p class="text-sm text-gray-600">Chưa có tài khoản? <button type="button"
                class="text-green-600 hover:text-green-700" @click="showRegisterDialog = true">Đăng ký
                ngay</button></p>
          </div>
        </form>

        <!-- social login -->
        <div class="mt-8">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200"></div>
            </div>
            <div class="relative flex justify-center text-sm"><span class="px-4 bg-white text-gray-500">Hoặc
                đăng nhập bằng</span></div>
          </div>

          <div class="mt-6 grid grid-cols-2 gap-4">
            <button type="button" @click="handleGoogleLogin"
              class="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
              <!-- google svg -->
              <svg class="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span class="text-black">Google</span>
            </button>
            <button type="button" @click="handleFacebookLogin"
              class="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
              <!-- facebook svg -->
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
                <path
                  d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span class="text-black">Facebook</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Right column: image + overlay -->
    <div class="hidden lg:block lg:w-1/2 relative">
      <img :src="imgSrc" :alt="imgAlt" class="w-full h-full object-cover" @error="onImgError" />
      <div class="absolute inset-0 bg-green-500/40"></div>
      <div class="absolute inset-0 flex flex-col items-center justify-center text-white p-12">
        <div class="text-center">
          <h2 class="mb-4 text-white">Hệ Thống Đặt Sân Hàng Đầu</h2>
          <p class="mb-8 text-white/90 max-w-md">Đặt sân bóng đá dễ dàng, nhanh chóng với giá cả hợp lý. Hơn
            100+ sân bóng trên toàn quốc.</p>
          <div class="grid grid-cols-3 gap-8 mt-12">
            <div class="text-center">
              <div class="mb-2 text-white">100+</div>
              <p class="text-sm text-white/80">Sân bóng</p>
            </div>
            <div class="text-center">
              <div class="mb-2 text-white">10K+</div>
              <p class="text-sm text-white/80">Người dùng</p>
            </div>
            <div class="text-center">
              <div class="mb-2 text-white">50K+</div>
              <p class="text-sm text-white/80">Lượt đặt</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Forgot password dialog (simple modal) -->
    <transition name="fade-slide">
      <div v-if="showForgotPasswordDialog"
        class="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
        <div class="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-xl p-6 relative">
          <button @click="closeForgot"
            class="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold">✕</button>
          <div class="flex items-center gap-2 mb-2">
            <div class="inline-flex items-center justify-center w-10 h-10 bg-green-500 rounded-full"><svg
                class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
                stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 1v2" />
                <path d="M20 12a8 8 0 1 0-16 0 8 8 0 0 0 16 0z" />
              </svg></div>
            <div>
              <h3 class="text-lg font-semibold text-black">Quên mật khẩu</h3>
              <p class="text-sm text-gray-600">Nhập email của bạn để nhận link khôi phục mật khẩu</p>
            </div>
          </div>

          <form @submit.prevent="handleForgotPassword" class="space-y-4 mt-4">
            <div class="space-y-2">
              <label class="text-black">Email</label>
              <div class="relative">
                <input id="forgotEmail" v-model="forgotPasswordEmail" type="email" required
                  placeholder="Nhập email đã đăng ký"
                  class="w-full pl-10 bg-white border-2 border-gray-200 focus:border-green-500 focus:ring-green-500 rounded-md p-2" />
                <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="5" width="18" height="14" rx="2" ry="2"></rect>
                  <path d="M3 7l9 6 9-6"></path>
                </svg>
              </div>
            </div>

            <div class="bg-green-50 border border-green-200 rounded-lg p-3">
              <p class="text-sm text-gray-700">Chúng tôi sẽ gửi link khôi phục mật khẩu đến email của bạn.
                Vui lòng kiểm tra hộp thư đến hoặc thư rác.</p>
            </div>

            <div class="flex gap-3 pt-4">
              <button type="button" @click="closeForgot"
                class="flex-1 border-2 border-gray-200 hover:bg-gray-50 rounded-lg py-2">Hủy</button>
              <button type="submit" class="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-lg py-2">Gửi link
                khôi
                phục</button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <!-- Register dialog -->
    <transition name="fade-slide">
      <div v-if="showRegisterDialog"
        class="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-4">
        <div class="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 relative">
          <button @click="closeRegister"
            class="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold">✕</button>

          <div class="flex items-center gap-3 mb-2">
            <div class="inline-flex items-center justify-center w-10 h-10 bg-green-500 rounded-full"><svg
                class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
                stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M20 8v6M23 11h-6"></path>
              </svg></div>
            <div>
              <h3 class="text-lg font-semibold text-black">Đăng ký tài khoản</h3>
              <p class="text-sm text-gray-600">Tạo tài khoản mới để bắt đầu đặt sân bóng đá</p>
            </div>
          </div>

          <form @submit.prevent="handleRegister" class="space-y-4 mt-2">
            <!-- full name -->
            <div>
              <label class="block text-sm font-medium mb-1">Họ và tên</label>
              <div class="relative">
                <input v-model="registerData.fullName" required type="text" placeholder="Nhập họ và tên"
                  class="w-full pl-10 border border-gray-300 rounded-lg p-2 bg-gray-50" />
                <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
            </div>

            <!-- email -->
            <div>
              <label class="block text-sm font-medium mb-1">Email</label>
              <div class="relative">
                <input v-model="registerData.email" required type="email" placeholder="Nhập email"
                  class="w-full pl-10 border border-gray-300 rounded-lg p-2 bg-gray-50" />
                <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="5" width="18" height="14" rx="2" ry="2"></rect>
                  <path d="M3 7l9 6 9-6"></path>
                </svg>
              </div>
            </div>

            <!-- phone -->
            <div>
              <label class="block text-sm font-medium mb-1">Số điện thoại</label>
              <div class="relative">
                <input v-model="registerData.phone" required type="tel" placeholder="Nhập số điện thoại"
                  class="w-full pl-10 border border-gray-300 rounded-lg p-2 bg-gray-50" />
                <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path
                    d="M22 16.92V21a1 1 0 0 1-1.11 1 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2 3.11 1 1 0 0 1 3 2h4.09a1 1 0 0 1 1 .75c.12.6.29 1.19.51 1.75a1 1 0 0 1-.24 1L7.16 7.84a16 16 0 0 0 6 6l1.33-1.33a1 1 0 0 1 1-.24c.56.22 1.15.39 1.75.51a1 1 0 0 1 .75 1V22z">
                  </path>
                </svg>
              </div>
            </div>

            <!-- password -->
            <div>
              <label class="block text-sm font-medium mb-1">Mật khẩu</label>
              <div class="relative">
                <input :type="showRegisterPassword ? 'text' : 'password'" v-model="registerData.password" required
                  placeholder="Nhập mật khẩu"
                  class="w-full pl-10 pr-10 border border-gray-300 rounded-lg p-2 bg-gray-50" />
                <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <button type="button" @click="showRegisterPassword = !showRegisterPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><svg
                    v-if="showRegisterPassword" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 3l18 18"></path>
                    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-5 0-9.27-3-11-7 1.02-2.03 2.65-3.77 4.72-4.95">
                    </path>
                  </svg><svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8S2 12 2 12z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg></button>
              </div>
            </div>

            <!-- confirm password -->
            <div>
              <label class="block text-sm font-medium mb-1">Xác nhận mật khẩu</label>
              <div class="relative">
                <input :type="showConfirmPassword ? 'text' : 'password'" v-model="registerData.confirmPassword" required
                  placeholder="Nhập lại mật khẩu"
                  class="w-full pl-10 pr-10 border border-gray-300 rounded-lg p-2 bg-gray-50" />
                <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <button type="button" @click="showConfirmPassword = !showConfirmPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><svg
                    v-if="showConfirmPassword" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 3l18 18"></path>
                    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-5 0-9.27-3-11-7 1.02-2.03 2.65-3.77 4.72-4.95">
                    </path>
                  </svg><svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8S2 12 2 12z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg></button>
              </div>
            </div>

            <div class="flex gap-3 pt-4">
              <button type="button" @click="closeRegister"
                class="flex-1 border-2 border-gray-200 hover:bg-gray-50 rounded-lg py-2">Hủy</button>
              <button type="submit" class="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-lg py-2">Đăng
                ký</button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

/* login state */
const email = ref('');
const password = ref('');
const showPassword = ref(false);

/* image fallback */
const imgAlt = 'Sân bóng đá';
const initialImg = 'https://images.unsplash.com/photo-1729843352938-0e10fbf96585?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMHNvY2NlciUyMGZpZWxkJTIwc3RhZGl1bXxlbnwxfHx8fDE3NjI5MzU2MTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';
const imgSrc = ref(initialImg);
function onImgError() {
  imgSrc.value = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><rect width="100%" height="100%" fill="%23c7f0d3"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="24" fill="%23006400">Image unavailable</text></svg>`
  );
}

/* forgot password modal */
const showForgotPasswordDialog = ref(false);
const forgotPasswordEmail = ref('');

/* register modal */
const showRegisterDialog = ref(false);
const registerData = ref({ fullName: '', email: '', phone: '', password: '', confirmPassword: '' });
const showRegisterPassword = ref(false);
const showConfirmPassword = ref(false);

/* toasts (simple) */
const toasts = ref<{ id: number; message: string }[]>([]);
let toastCounter = 1;
function toast(message: string) {
  const id = toastCounter++;
  toasts.value.push({ id, message });
  setTimeout(() => {
    const idx = toasts.value.findIndex(t => t.id === id);
    if (idx !== -1) toasts.value.splice(idx, 1);
  }, 3000);
}

/* router / route for query handling */
const route = useRoute();
const router = useRouter();

/* Auto-open modals when route query has action (e.g. ?action=register&redirect=/booking) */
onMounted(() => {
  const action = route.query.action as string | undefined;
  if (action === 'register') {
    showRegisterDialog.value = true;
  } else if (action === 'forgot') {
    showForgotPasswordDialog.value = true;
  }
});

/* also watch route.query.action in case navigation occurs after mount */
watch(() => route.query.action, (val) => {
  if (val === 'register') showRegisterDialog.value = true;
  if (val === 'forgot') showForgotPasswordDialog.value = true;
});

/* when user closes register/forgot modals, remove action query to avoid re-opening */
watch(showRegisterDialog, (isOpen) => {
  if (!isOpen && route.query && route.query.action) {
    // remove query (replace so we don't add a history entry)
    router.replace({ name: route.name as string || 'login', query: {} }).catch(() => { });
  }
});
watch(showForgotPasswordDialog, (isOpen) => {
  if (!isOpen && route.query && route.query.action) {
    router.replace({ name: route.name as string || 'login', query: {} }).catch(() => { });
  }
});

/* handlers */
function handleLogin() {
  console.log('Đăng nhập với:', { email: email.value, password: password.value });
  toast('Đăng nhập thành công!');
  // TODO: gọi API auth rồi redirect / set auth state
  router.push('/admin').catch(() => { });
}

function handleRegister() {
  if (registerData.value.password !== registerData.value.confirmPassword) {
    toast('Mật khẩu xác nhận không khớp!');
    return;
  }
  console.log('Đăng ký với:', registerData.value);
  toast('Đăng ký thành công! Vui lòng đăng nhập.');

  // Lưu redirect nếu có, rồi điều hướng
  const redirectTo = (route.query.redirect as string) || '/';
  // Đóng modal trước (giao diện)
  showRegisterDialog.value = false;

  // Reset form
  registerData.value = { fullName: '', email: '', phone: '', password: '', confirmPassword: '' };
  showRegisterPassword.value = false;
  showConfirmPassword.value = false;

  // Nếu có redirect, điều hướng người dùng về đó
  if (redirectTo) {
    router.push(redirectTo).catch(() => { });
  } else {
    // mặc định về trang chủ
    router.push('/').catch(() => { });
  }

  // đảm bảo xóa query action nếu vẫn ở trang login
  if (route.name === 'login' && route.query && route.query.action) {
    router.replace({ name: 'login', query: {} }).catch(() => { });
  }
}

function handleForgotPassword() {
  console.log('Gửi email khôi phục mật khẩu đến:', forgotPasswordEmail.value);
  toast('Link khôi phục mật khẩu đã được gửi đến email của bạn!');
  showForgotPasswordDialog.value = false;
  forgotPasswordEmail.value = '';
}

function handleGoogleLogin() {
  console.log('Đăng nhập bằng Google');
  toast('Chức năng đăng nhập Google đang được phát triển');
}
function handleFacebookLogin() {
  console.log('Đăng nhập bằng Facebook');
  toast('Chức năng đăng nhập Facebook đang được phát triển');
}

function closeForgot() {
  showForgotPasswordDialog.value = false;
  forgotPasswordEmail.value = '';
}
function closeRegister() {
  showRegisterDialog.value = false;
  registerData.value = { fullName: '', email: '', phone: '', password: '', confirmPassword: '' };

  // remove query.action if present
  if (route.query && route.query.action) {
    router.replace({ name: route.name as string || 'login', query: {} }).catch(() => { });
  }
}
</script>


<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all .25s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>