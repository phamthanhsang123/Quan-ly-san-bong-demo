<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-8">
        <div v-if="field" class="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <img :src="field.image" alt="Sân bóng" class="w-full h-64 object-cover" />

            <div class="p-6">
                <h1 class="text-2xl font-bold mb-2">{{ field.name }}</h1>
                <p class="text-gray-500 dark:text-gray-400 mb-4">
                    {{ field.location }} — {{ field.description }}
                </p>
                <p class="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                    {{ field.description }}
                </p>
                <p class="text-green-600 dark:text-green-400 text-lg font-semibold mb-6">
                    Giá cơ bản: {{ field.price }} VND / giờ
                </p>

                <div class="mt-8">
                    <h2 class="text-xl font-semibold mb-4">
                        Bảng giá theo khung giờ
                    </h2>

                    <div class="grid md:grid-cols-2 gap-3">
                        <div v-for="slot in priceSlots" :key="slot.time"
                            class="flex items-center justify-between p-3 rounded-lg border transition" :class="slot.isPrime ? 'bg-green-50 dark:bg-green-900/30 border-green-400'
                                : 'bg-green-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                                ">
                            <div>
                                <p class="font-medium">
                                    {{ slot.time }}
                                </p>

                                <p v-if="slot.isPrime" class="text-xs text-green-600 dark:text-green-300 mt-1">
                                    Giờ đẹp(cao điểm)
                                </p>
                            </div>
                            <p class="font-semibold">
                                {{ formatPrice(slot.price) }} VND / Giờ

                            </p>

                        </div>
                    </div>

                </div>

                <button @click="goBack"
                    class="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition khoangcach">
                    ← Quay lại danh sách
                </button>
            </div>
        </div>

        <div v-else class="text-center text-gray-500 mt-10">Không tìm thấy sân.</div>
    </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'

const route = useRoute()
const router = useRouter()
const field = ref(null)
const priceSlots = ref([]) // danh sách khung giờ + giá
// 🧠 Giả lập dữ liệu — giống danh sách bên BookingPage.vue
const fields = [
    {
        id: 1,
        name: "Sân A1",
        location: "Khu thể thao Quận 1",
        price: "200.000",
        description: "Sân bóng mini 5 người được thiết kế hiện đại với mặt cỏ nhân tạo đạt chuẩn FIFA, giúp người chơi có cảm giác di chuyển êm ái và an toàn. Hệ thống đèn LED công suất cao đảm bảo tầm nhìn tuyệt vời ngay cả khi thi đấu ban đêm. Khu vực xung quanh sân được bố trí ghế ngồi cho khán giả, bãi giữ xe rộng rãi và phòng thay đồ sạch sẽ. Đây là lựa chọn hoàn hảo cho các đội bóng phong trào, học sinh, sinh viên hoặc công ty tổ chức giao lưu thể thao.",
        image: "https://tse3.mm.bing.net/th/id/OIP.tBLcp9pad-wn7tiv6Q6JhgHaFj?pid=Api&P=0&h=220"
    },
    {
        id: 2,
        name: "Sân A2",
        location: "Khu thể thao Quận 1",
        price: "200.000",
        description: "Sân A2 là sân 5 người được bảo trì thường xuyên, mặt cỏ nhân tạo mềm mịn, không trơn trượt, giúp các pha di chuyển trở nên linh hoạt hơn. Hệ thống thoát nước tốt đảm bảo sân luôn khô ráo dù trong mùa mưa. Có đầy đủ đèn chiếu sáng, nhà vệ sinh, và khu vực nghỉ ngơi với mái che. Sân phù hợp cho các trận đấu nội bộ, tập luyện kỹ năng cá nhân hoặc tổ chức giải nhỏ giữa bạn bè.",
        image: "https://tse1.mm.bing.net/th/id/OIP.aVbYeGoSoJhCSg2OzKzESQHaFj?pid=Api&P=0&h=220"
    },
    {
        id: 3,
        name: "Sân B1",
        location: "Khu thể thao Quận 1",
        price: "200.000",
        description: "Sân B1 được thiết kế cho 5 người thi đấu, mang lại trải nghiệm chuyên nghiệp với mặt cỏ nhân tạo chất lượng cao, hệ thống chiếu sáng hiện đại và khu vực khán giả nhỏ gọn. Sân có khu vực gửi xe miễn phí, phòng thay đồ riêng, cùng quầy nước phục vụ nhanh. Đây là sân lý tưởng cho các đội bóng phong trào muốn có không gian tập luyện ổn định và tiện nghi.",
        image: "https://tse4.mm.bing.net/th/id/OIP.FNjkkXg6_xoIguQPIVq1LgHaE8?pid=Api&P=0&h=220"
    },
    {
        id: 4,
        name: "Sân B2",
        location: "Khu thể thao Quận 1",
        price: "200.000",
        description: "Sân B2 là sân bóng 5 người có chất lượng cao, được bao quanh bởi cây xanh thoáng mát. Cỏ nhân tạo mềm, thoát nước nhanh, giúp thi đấu ổn định trong mọi điều kiện thời tiết. Đèn chiếu sáng công suất lớn giúp duy trì tầm nhìn tốt khi chơi buổi tối. Ngoài ra, sân còn có khu vực nghỉ ngơi, phòng thay đồ, bãi gửi xe, và quán nước nhỏ tiện lợi.",
        image: "https://tse4.mm.bing.net/th/id/OIP.FfuAhspJJCFL2kcYRPvy1AHaFj?pid=Api&P=0&h=220"
    },
    {
        id: 5,
        name: "Sân C1",
        location: "Khu thể thao Quận 1",
        price: "250.000",
        description: "Sân bóng 6 người với không gian rộng rãi, mặt cỏ nhân tạo mềm, độ nảy bóng chuẩn. Hệ thống đèn chiếu sáng được bố trí đều, giúp người chơi dễ quan sát khi thi đấu buổi tối. Sân có khu vực nghỉ, phòng thay đồ, khu vệ sinh và bãi giữ xe riêng biệt. Đây là lựa chọn tuyệt vời cho các đội bóng phong trào, công ty tổ chức giải hoặc nhóm bạn muốn giao lưu cuối tuần.",
        image: "https://tse3.mm.bing.net/th/id/OIP.eRmajNoL8PHc2k5XWoWZpQHaEK?pid=Api&P=0&h=220"
    },
    {
        id: 6,
        name: "Sân C2",
        location: "Khu thể thao Quận 1",
        price: "250.000",
        description: "Sân C2 dành cho 6 người thi đấu, được đầu tư kỹ lưỡng về mặt cỏ, ánh sáng và không gian xung quanh. Mặt sân bằng phẳng, thoát nước nhanh, hạn chế trơn trượt khi trời mưa. Hệ thống chiếu sáng tiêu chuẩn cùng khu vực nghỉ mát, phòng thay đồ và bãi xe giúp người chơi luôn thoải mái. Phù hợp cho đội bóng phong trào, học sinh hoặc các nhóm công ty.",
        image: "https://tse1.mm.bing.net/th/id/OIP.6koCM750UfzYdM8Qjj2a6QHaE8?pid=Api&P=0&h=220"
    },
    {
        id: 7,
        name: "Sân D1",
        location: "Khu thể thao Quận 1",
        price: "400.000",
        description: "Sân D1 được thiết kế cho 7 người thi đấu, diện tích sân rộng, cỏ nhân tạo đạt tiêu chuẩn quốc tế. Hệ thống chiếu sáng đồng đều và sân được bao quanh bởi hàng cây xanh, tạo cảm giác mát mẻ và dễ chịu. Ngoài ra, sân có khu khán đài nhỏ, bãi xe riêng, phòng thay đồ và khu vệ sinh sạch sẽ. Đây là sân phù hợp để tổ chức các giải đấu nghiệp dư hoặc thi đấu giao hữu giữa các câu lạc bộ.",
        image: "https://tse3.mm.bing.net/th/id/OIP.eRmajNoL8PHc2k5XWoWZpQHaEK?pid=Api&P=0&h=220"
    },
    {
        id: 8,
        name: "Sân D2",
        location: "Khu thể thao Quận 1",
        price: "400.000",
        description: "Sân D2 là sân bóng 7 người có thiết kế hiện đại với mặt cỏ nhân tạo mềm, độ nảy ổn định, giúp bóng lăn mượt mà. Hệ thống chiếu sáng công nghệ cao cùng không gian mở thoáng mát mang lại trải nghiệm tuyệt vời cho người chơi. Sân còn có khu nghỉ, phòng thay đồ, khu vệ sinh và quán giải khát phục vụ nhanh. Phù hợp cho các câu lạc bộ hoặc doanh nghiệp tổ chức giải đấu cuối tuần.",
        image: "https://tse1.mm.bing.net/th/id/OIP.6koCM750UfzYdM8Qjj2a6QHaE8?pid=Api&P=0&h=220"
    },
    {
        id: 9,
        name: "Sân E1",
        location: "Khu thể thao Quận 1",
        price: "800.000",
        description: "Sân E1 là sân bóng đá 11 người đạt tiêu chuẩn thi đấu chuyên nghiệp, được trải cỏ nhân tạo chất lượng cao và có hệ thống thoát nước hiện đại. Hệ thống đèn LED công suất lớn đảm bảo độ sáng tốt vào buổi tối. Ngoài ra, sân có khán đài mini, phòng thay đồ, bãi giữ xe rộng rãi, và khu vực bán nước giải khát phục vụ người chơi và khán giả. Đây là sân lý tưởng để tổ chức giải đấu, giao hữu quy mô lớn hoặc huấn luyện đội bóng bán chuyên.",
        image: "https://tse3.mm.bing.net/th/id/OIP.eRmajNoL8PHc2k5XWoWZpQHaEK?pid=Api&P=0&h=220"
    },
    {
        id: 10,
        name: "Sân E2",
        location: "Khu thể thao Quận 1",
        price: "800.000",
        description: "Sân E2 là sân 11 người được đầu tư quy mô lớn với mặt cỏ nhân tạo nhập khẩu, hệ thống chiếu sáng mạnh và không gian rộng rãi thoáng mát. Sân được trang bị đầy đủ tiện ích như khán đài nhỏ, phòng thay đồ, khu vệ sinh sạch sẽ và bãi xe lớn. Đây là lựa chọn hàng đầu cho các đội bóng chuyên nghiệp, công ty hoặc trường học tổ chức giải thi đấu, huấn luyện, hoặc sự kiện thể thao.",
        image: "https://tse1.mm.bing.net/th/id/OIP.6koCM750UfzYdM8Qjj2a6QHaE8?pid=Api&P=0&h=220"
    },
]


const id = Number(route.params.id)
field.value = fields.find((f) => f.id === id)

// khung giờ + giá ví dụ 
function getSlotsByField(currentField) {
    if (!currentField) return []

    return [
        {
            time: '08:30 - 16:30',
            price: '150000',
            isPrime: false,
        },
        {
            time: '16:30 - 20:30',
            price: '250000',
            isPrime: true,
        },
        {
            time: '20:30 - 08:30',
            price: '200000',
            isPrime: false,
        },

    ]
}

// gán khung giờ cho sân hiện tại 
if (field.value) {
    priceSlots.value = getSlotsByField(field.value)
}

function formatPrice(value) {
    if (typeof value === 'string') return value
    return value.toLocaleString('vi-VN')
}


function goBack() {
    router.push('/booking')
}
</script>

<style>
.khoangcach {
    margin-top: 10px;
}
</style>