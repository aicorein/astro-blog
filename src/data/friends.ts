// 友情链接数据配置
// 用于管理友情链接页面的数据

export interface FriendItem {
	id: number;
	title: string;
	imgurl: string;
	desc: string;
	siteurl: string;
	tags: string[];
}

// 友情链接数据
export const friendsData: FriendItem[] = [
	{
		id: 1,
		title: "小涵の个人网站",
		imgurl: "https://raw.githubusercontent.com/yuhan2680/yuhan2680/refs/heads/main/%E5%A4%B4%E5%83%8F.jpg",
		desc: "以一灯燃百千灯，直至万灯皆明",
		siteurl: "https://naiwenel.com",
		tags: ["朋友们"],
	},
	{
		id: 2,
		title: "氯喵の笔记本",
		imgurl: "https://github.com/AgxCOy.png",
		desc: "(ᗜ ˰ ᗜ)",
		siteurl: "https://nyacl.shimakaze.org/",
		tags: ["朋友们"],
	},
	{
		id: 3,
		title: "星川栀子的杂货铺",
		imgurl: "https://kutinana.com/wp-content/uploads/2024/09/avatar.webp",
		desc: "全能型大佬，膜拜~",
		siteurl: "https://kutinana.com/",
		tags: ["朋友们"],
	},
	{
		id: 4,
		title: "晓空blog",
		imgurl: "https://blog.moeworld.tech/wp-content/themes/kratos-pjax-master/static/images/photo.jpg",
		desc: "探索更大的世界",
		siteurl: "https://blog.moeworld.tech/",
		tags: ["朋友们"],
	},
	{
		id: 6,
		title: "小小黑的个人小站",
		imgurl: "https://lonelyenderman.top/wp-content/uploads/2022/03/logoo.jpeg",
		desc: "技术宅拯救世界",
		siteurl: "https://lonelyenderman.top/",
		tags: ["朋友们"],
	},
	{
		id: 7,
		title: "Nightola-227 FM",
		imgurl: "https://nightola.pages.dev/file/blog_avatar/1766510318687_avatar.webp",
		desc: "尝试自我记录、剖析的地方",
		siteurl: "https://nightola.bearblog.dev/",
		tags: ["朋友们"],
	},
	{
		id: 8,
		title: "Anosu",
		imgurl: "https://cdn.jitsu.top/img/blog/blog.jpeg",
		desc: "横看成岭侧成峰",
		siteurl: "https://blog.anosu.top/",
		tags: ["朋友们"],
	},
	{
		id: 9,
		title: "小宇",
		imgurl: "https://img.cdn.chs.pub/2021/07/09/940f36e7c78ea.webp",
		desc: "计谋千里，以揆百事~",
		siteurl: "https://www.xiaoyv404.top/",
		tags: ["朋友们"],
	},
	{
		id: 10,
		title: "RainChan的小博客",
		imgurl: "https://gravatar.loli.net/avatar/f7e8af6d341b76ad3de6757a8f86f2b4?d=mp&v=1.3.10",
		desc: "mirai 项目大佬，膜拜一下~",
		siteurl: "https://rainchan.win/",
		tags: ["朋友们"],
	},
	{
		id: 11,
		title: "我不是咕咕鸽",
		imgurl: "https://blog.laoda.de/upload/guguge.webp?v=1.6.11.7",
		desc: "learn or earn",
		siteurl: "https://blog.laoda.de/",
		tags: ["朋友们"],
	},
	// {
	// 	id: 12,
	// 	title: "小鹿生活志",
	// 	imgurl: "https://q1.qlogo.cn/g?b=qq&nk=1169702115&s=100",
	// 	desc: "一个写故事的博客",
	// 	siteurl: "https://www.t223.top/",
	// 	tags: ["朋友们"],
	// },
	{
		id: 13,
		title: "秋水墨色染",
		imgurl: "https://avatars.githubusercontent.com/u/62269111?v=4",
		desc: "真正的大师永远都怀着一颗学徒的心",
		siteurl: "http://shaoshaossm.github.io/",
		tags: ["朋友们"],
	},
	{
		id: 14,
		title: "104sama",
		imgurl: "https://github.com/sdax04.png",
		desc: "一位有才华的朋友",
		siteurl: "https://space.bilibili.com/85474351",
		tags: ["好基友"],
	},
];

// 获取所有友情链接数据
export function getFriendsList(): FriendItem[] {
	return friendsData;
}

// 获取随机排序的友情链接数据
export function getShuffledFriendsList(): FriendItem[] {
	const shuffled = [...friendsData];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}
