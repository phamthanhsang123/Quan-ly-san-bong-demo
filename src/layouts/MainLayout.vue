<template>
    <div class="min-h-screen flex flex-col bg-gray-50 text-gray-800">
        <!-- Navbar -->
        <nav class="bg-sky-300 text-dark p-4 flex justify-between shadow-md">
            <h1 class="font-bold text-lg">⚽ Football Booking</h1>
            <div class="space-x-4">
                <router-link to="/" class="hover:underline">Trang chủ</router-link>
                <router-link to="/booking" class="hover:underline">Đặt sân</router-link>
                <router-link to="/login" class="hover:underline">Đăng nhập</router-link>
            </div>
        </nav>

        <!-- Nội dung trang -->
        <main class="flex-1 ">
            <router-view />
        </main>

        <!-- Footer -->
        <footer class="bg-gray-200 text-center py-3 text-sm text-gray-600">
            © 2025 Football Booking System
        </footer>
    </div>
</template>
