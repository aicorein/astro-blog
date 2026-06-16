import type { ProfileConfig } from "../types/config";

// 个人资料配置
export const profileConfig: ProfileConfig = {
	avatar: "assets/images/avatar.webp", // 相对于 /src 目录。如果以 '/' 开头，则相对于 /public 目录
	name: "律回",
	bio: "我们弹下的每段旋律，终将在某个时刻回归",
	typewriter: {
		enable: true, // 启用个人简介打字机效果
		speed: 80, // 打字速度（毫秒）
	},
	links: [
		{
			name: "GitHub",
			url: "https://github.com/aicorein",
			icon: "fa7-brands:github",
		},
		{
			name: "Bilibili",
			url: "https://space.bilibili.com/285880618",
			icon: "fa7-brands:bilibili",
		},
		{
			name: "网易云",
			url: "https://music.163.com/#/artist?id=53778861",
			icon: "mdi:music",
		},
		{
			name: "邮箱",
			url: "mailto:1574260633@qq.com",
			icon: "mdi:email"
		}
	],
};
