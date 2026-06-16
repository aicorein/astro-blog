// 设备数据配置文件

export interface Device {
	name: string;
	image: string;
	specs: string;
	description: string;
	link: string;
}

// 设备类别类型，支持品牌和自定义类别
export type DeviceCategory = Record<string, Device[]> & {
	自定义?: Device[];
};

export const devicesData: DeviceCategory = {
	"手机": [
		{
			name: "HONOR WIN",
			image: "/images/device/78939-honor-win-2.jpg",
			specs: "White / 12GB+256GB",
			description: "Snapdragon 8 Elite Gen 5, 10000mAh",
			link: "https://www.honor.com/cn/phones/honor-win/spec/",
		},
		{
			name: "Xiaomi 10",
			image: "/images/device/xiaomi-mi-10-5g.jpg",
			specs: "Green / 8GB+256GB",
			description: "Snapdragon 865, 4780mAh",
			link: "https://www.mi.com/hk/mi-10/specs/",
		}
	],
	"计算机": [
		{
			name: "ITX 主机",
			image: "/images/device/windows.png",
			specs: "AMD Ryzen 7 9700X, NVIDIA 5070TI 16GB, 32 GB RAM",
			description: "常用，固定在家",
			link: "https://www.amd.com/zh-cn/products/processors/desktops/ryzen/9000-series/amd-ryzen-7-9700x.html",
		},
		{
			name: "老笔记本",
			image: "/images/device/ARL.png",
			specs: "AMD Ryzen 7 4800H, NVIDIA 1650TI Mobile 4GB, 16 GB RAM",
			description: "用于 linux 环境测试",
			link: "https://detail.zol.com.cn/1319/1318146/param.shtml",
		}
	],
	"服务器": [
		{
			name: "家里云",
			image: "/images/device/debian.png",
			specs: "Intel Core i7-13700K, NVIDIA 4090 24GB, 64GB RAM",
			description: "家庭 Linux 服务器",
			link: "https://www.intel.cn/content/www/cn/zh/products/sku/230500/intel-core-i713700k-processor-30m-cache-up-to-5-40-ghz/specifications.html",
		},
		{
			name: "阿里云 ECS",
			image: "/images/device/ubuntu.png",
			specs: "1 vCPU, 1GB RAM",
			description: "阿里云 vps",
			link: "https://www.aliyun.com/product/ecs",
		}
	]
};
