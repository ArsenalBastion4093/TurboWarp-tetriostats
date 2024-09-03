// Please run it without sandbox.
(function (Scratch) {
	var newlyInputedUser = "";
	async function userdata(USER) {
		if (!saved_data[USER.toString().toLowerCase()]) {
			saved_data[USER.toString().toLowerCase()] = await fetch("https://ch.tetr.io/api/users/" + USER.toString().toLowerCase()).then(r => r.json());
			newlyInputedUser = USER.toString().toLowerCase()
			Scratch.vm.runtime.startHats("tetriostats_cacheGotInputed");
		}
		return saved_data[USER.toString().toLowerCase()]
	}
	async function achdata(ACH) {
		if (!saved_achdata[ACH]) {
			saved_achdata[ACH] = await fetch("https://ch.tetr.io/api/achievements/" + ACH).then(r => r.json());
			Scratch.vm.runtime.startHats("tetriostats_cacheGotInputed");
		}
		return saved_achdata[ACH]
	}
	async function usersummaries(USER) {
		if (!summaries[USER.toString().toLowerCase()]){
			summaries[USER.toString().toLowerCase()] = await fetch("https://ch.tetr.io/api/users/" + USER.toString().toLowerCase() + "/summaries").then(r => r.json())
			newlyInputedUser = USER.toString().toLowerCase()
			Scratch.vm.runtime.startHats("tetriostats_cacheGotInputed");
		}
		return summaries[USER.toString().toLowerCase()]
	}
	async function getranks() {
		if (!rankdata) {
			rankdata = await(fetch("https://ch.tetr.io/api/labs/league_ranks").then(r => r.json()))
			Scratch.vm.runtime.startHats("tetriostats_cacheGotInputed");
		}
		return rankdata
	}
	function UsernameLgeal(A) {
		A = A.toString();
		if (A == "") {
			return false;
		}
		return A.length >= 3 && A.length <= 16 && A.match(/[a-z0-9]/gi).length > 0 && A.match(/[\-_a-z0-9]/gi).length == A.length;
	}
	var ranks = ["x+","x","u","ss","s+","s","s-","a+","a","a-","b+","b","b-","c+","c","c-","d+","d"],
	achievements = [
		{text:"Stacker",value:1},
		{text:"Powerlevelling",value:2},
		{text:"Grbage Offensive",value:3},
		{text:"Elegance",value:4},
		{text:"Sprinter",value:5},
		{text:"Blitzer",value:6},
		{text:"Secret Grade",value:7},
		{text:"20TSD",value:8},
		{text:"10PC",value:9},
		{text:"Contender",value:10},
		{text:"The Spike of all Time",value:12},
		{text:"Speed Player",value:13},
		{text:"Plonk",value:14},
		{text:"Opener Main",value:15},
		{text:"Tower Climber",value:16},
		{text:"Whatever It Takes",value:17},
		{text:"Zenith Explorer",value:18},
		{text:"The Emperor",value:19},
		{text:"The Devil",value:20},
		{text:"Strengh",value:21},
		{text:"The Tower",value:22},
		{text:"Temperance",value:23},
		{text:"Wheel of Fortune",value:24},
		{text:"The Hermit",value:25},
		{text:"The Magician",value:26},
		{text:"The Lovers",value:27},
		{text:"A Modern Classic",value:28},
		{text:"Deadlock",value:29},
		{text:"The Grandmaster",value:30},
		{text:"Emperor's Decadence",value:31},
		{text:"Divine Mastery",value:32},
		{text:"The Escape Artist",value:33},
		{text:"Swamp Water",value:34},
		{text:"Champion of the Lobby",value:35},
		{text:"All the Single Lines",value:36},
		{text:"1-8 Stacking",value:37},
		{text:"Mr. Boardwide",value:38},
		{text:"Wabi-Sabi",value:39},
		{text:"Trained Proessionals",value:40},
		{text:"The Responsible One",value:41},
		{text:"Zenith Speedrun",value:42},
		{text:"Guardian Angel",value:43},
		{text:"The Straving Artist",value:44},
		{text:"Supercharged",value:45},
		{text:"Vip List",value:46},
		{text:"Against All Odds",value:47},
		{text:"Detail Oriented",value:48},
		{text:"The Con Artist",value:49},
	],
	achtypes = [
		{text:"Bronze",value:"1"},
		{text:"Silver",value:"2"},
		{text:"Gold",value:"3"},
		{text:"Platinum",value:"4"},
		{text:"Diamond",value:"5"},
		{text:"Top 100",value:"t100"},
		{text:"Top 50",value:"t50"},
		{text:"Top 25",value:"t25"},
		{text:"Top 10",value:"t10"},
		{text:"Top 5",value:"t5"},
		{text:"Top 3",value:"t3"},
		{text:"Issued",value:"100"},
	],
	saved_data = {},
	saved_achdata = {},
	summaries = {},
	rankdata = null,
	autoClearcacheEnabled = true,
	autoClearcacheTime = 0.1;
	async function autoClearcache(){
		if (autoClearcacheEnabled) {
			for (var i in saved_data) 
				if (Date.now() > saved_data[i].cache.cached_until) {
					delete saved_data[i];
					Scratch.vm.runtime.startHats("tetriostats_cacheGotRemoved");
					Scratch.vm.runtime.startHats("tetriostats_cacheGotAutoRemoved");
				}
			if (rankdata && Date.now() > rankdata.cache.cached_until) {
				rankdata = null;
				Scratch.vm.runtime.startHats("tetriostats_cacheGotRemoved");
				Scratch.vm.runtime.startHats("tetriostats_cacheGotAutoRemoved");
			}
			for (var i in saved_achdata) 
				if (Date.now() > saved_achdata[i].cache.cached_until) {
					delete saved_achdata[i];
					Scratch.vm.runtime.startHats("tetriostats_cacheGotRemoved");
					Scratch.vm.runtime.startHats("tetriostats_cacheGotAutoRemoved");
				}
		}
		setTimeout(autoClearcache,1000 * autoClearcacheTime)
	}
	autoClearcache()
	Scratch.translate.setup({
"zh-cn":
{
    "_Direct Data Query": "直接获取数据",
    "_request basic data for [USER]": "获取用户[USER]的基础数据",
    "_request summaries for [USER]": "获取用户[USER]的摘要数据",
    "_Cache Management": "缓存管理",
    "_disable cache removing": "关闭缓存清理",
    "_enable cache removing": "开启缓存清理",
    "_cache removing enabled?": "缓存清理开启？",
    "_cache for user [USER] exists?": "[USER]的缓存数据存在？",
    "_when a cache got automatically removed": "当缓存被自动清除",
    "_when a cache got non-automatically removed": "当缓存被手动清除",
    "_when a cache got removed": "当缓存被清除",
    "_when a cache got inputed": "当缓存被输入",
    "_set caching speed as once / [N] seconds": "设置清理缓存速率为每[N]秒一次",
    "_remove cache: basic data for [USER]": "手动清理缓存：用户[USER]的基础数据",
    "_remove cache: summaries for [USER]": "手动清理缓存：用户[USER]的摘要数据",
    "_remove cache: all basic data for users": "手动清理缓存：所有用户基础数据",
    "_remove cache: all summaries for users": "手动清理缓存：所有用户摘要数据",
    "_remove all the cache": "清理所有缓存",
    "_remove all the cache cruelly": "刷新页面",
    "_newly inputed user": "新输入的用户",
    "_Users": "",
    "_username [NAME] lgeal?": "用户名[NAME]合法？",
    "_user [USER] exists?": "用户[USER]存在？",
    "_user [USER] is a supporter?": "用户[USER]充了会员？",
    "_user [USER]'s supporter tier": "用户[USER]的会员等级",
    "_user [USER] is in bad standing?": "用户[USER]信誉不佳？",
    "_user [USER] is anonymous?": "用户[USER]是匿名用户？",
    "_user [USER] is banned?": "用户[USER]被封禁？",
    "_user [USER]'s role": "用户[USER]的地位",
    "_user [USER]'s country code": "用户[USER]的地区代码",
    "_user [USER]'s ID": "用户[USER]的ID",
    "_user [USER]'s Bio": "用户[USER]的个人简介",
    "_user [USER]'s friends count": "用户[USER]的好友数量",
    "_The URL of user [USER]'s avatar": "用户[USER]的头像的URL",
    "_The URL of user [USER]'s banner": "用户[USER]的封面的URL",
    "_The user with ID [ID]": "用户ID[ID]所属用户",
    "_user [USER]'s total XP": "用户[USER]的总经验值",
    "_user [USER]'s XP level": "用户[USER]的经验等级",
    "_switch XP [XP] to level": "将总经验值[XP]转换为经验等级",
    //"_user [USER]'s distinguishment header": "undefined[USER]",
    //"_user [USER]'s distinguishment footer": "undefined[USER]",
    //"_user [USER]'s distinguishment type": "undefined[USER]",
    //"_user [USER]'s distinguishment detail": "undefined[USER]",
    "_Tetra League": "TETRA联赛",
    "_[RANK] rank's percentile position": "段位[RANK]的百分位置",
    "_[RANK] rank's position": "段位[RANK]的排名",
    "_[RANK] rank's TR": "段位[RANK]的TR",
    "_[RANK] rank's target TR": "段位[RANK]的目标TR",
    "_[RANK] rank's PPS": "段位[RANK]的每秒放置块数",
    "_[RANK] rank's APM": "段位[RANK]的每分发送垃圾行数",
    "_[RANK] rank's VS score": "段位[RANK]的VS分数",
    "_[RANK] rank's lower/previous rank": "段位[RANK]的上一个段位",
    "_[RANK] rank's higher/next rank": "段位[RANK]的下一个段位",
    "_rank [RANKA] < [RANKB]":"段位[RANKA] < [RANKB]",
    "_rank [RANKA] > [RANKB]":"段位[RANKA] > [RANKB]",
    "_no rank": "无段位",
    "_user [USER]'s rank": "[USER]的段位",
    "_user [USER] is ranked?": "[USER]拥有段位？",
    "_user [USER] received a rank?": "[USER]获得段位？",
    "_user [USER]'s rank is lost?": "[USER]的段位已丢失？",
    "_user [USER]'s top rank": "[USER]的最高段位",
    "_user [USER]'s TR": "[USER]的TR",
    "_user [USER]'s Glicko": "[USER]的Glicko分",
    "_user [USER]'s RD": "[USER]的Glicko偏移量",
    "_user [USER]'s RD is rising?": "[USER]的Glicko偏移量正在上升？",
    "_user [USER]'s rank is stable?": "[USER]的段位稳定？",
    "_user [USER]'s Glixare": "[USER]的Glixare值",
    "_user [USER]'s TL PPS": "Tetra联赛中[USER]的每秒放置块数",
    "_user [USER]'s TL APM": "Tetra联赛中[USER]的每分发送垃圾行数",
    "_user [USER]'s TL VS score": "Tetra联赛中[USER]的VS分数",
    "_user [USER]'s TL standing": "[USER]的Tetra联赛排名",
    "_user [USER]'s TL local standing": "[USER]的Tetra联赛地区排名",
    "_TL games user [USER] has played": "[USER]在Tetra联赛中的游戏场次",
    "_TL games user [USER] has won": "[USER]在Tetra联赛中的获胜场次",
    "_user [USER]'s possibility to win a TL game": "[USER]在Tetra联赛中的胜率",
    "_Achievements (Returns Numbers Except Achievement Name)": "成就",
    "_achievement [ACH]": "成就[ACH]",
    "_achievement name of [ACH]": "成就[ACH]的名称",
    "_Miscellaneous": "杂项",
    "_the author of the TurboWarp extension": "此TurboWarp拓展块的作者",
    "_the author of Tetra Stats": "Tetra Stats的作者",
    "_the author of deprecated Tetr.io Stats": "废弃Tetr.io Stats的作者",
    "_the author of TETR.IO+": "TETR.IO+ 的作者",
    "_the author of the game": "TETR.IO 的作者"
},
"zh-tw":{
    "_Direct Data Query": "直接獲取資料",
    "_request basic data for [USER]": "獲取使用者[USER]的基礎資料",
    "_request summaries for [USER]": "獲取使用者[USER]的摘要資料",
    "_Cache Management": "緩存管理",
    "_disable cache removing": "關閉緩存清理",
    "_enable cache removing": "開啟緩存清理",
    "_cache removing enabled?": "緩存清理開啟？",
    "_cache for user [USER] exists?": "[USER]的緩存資料存在？",
    "_when a cache got automatically removed": "當緩存被自動清除",
    "_when a cache got non-automatically removed": "當緩存被手動清除",
    "_when a cache got removed": "當緩存被清除",
    "_when a cache got inputed": "當緩存被輸入",
    "_set caching speed as once / [N] seconds": "設置清理緩存速率為每[N]秒一次",
    "_remove cache: basic data for [USER]": "手動清理緩存：使用者[USER]的基礎資料",
    "_remove cache: summaries for [USER]": "手動清理緩存：使用者[USER]的摘要資料",
    "_remove cache: all basic data for users": "手動清理緩存：所有使用者基礎資料",
    "_remove cache: all summaries for users": "手動清理緩存：所有使用者摘要資料",
    "_remove all the cache": "清理所有緩存",
    "_remove all the cache cruelly": "刷新頁面",
    "_newly inputed user": "新輸入的用戶",
    "_Users": "",
    "_username [NAME] lgeal?": "用戶名[NAME]合法？",
    "_user [USER] exists?": "用戶[USER]存在？",
    "_user [USER] is a supporter?": "用戶[USER]充了會員？",
    "_user [USER]'s supporter tier": "使用者[USER]的會員等級",
    "_user [USER] is in bad standing?": "用戶[USER]信譽不佳？",
    "_user [USER] is anonymous?": "用戶[USER]是匿名使用者？",
    "_user [USER] is banned?": "用戶[USER]被封禁？",
    "_user [USER]'s role": "用戶[USER]的地位",
    "_user [USER]'s country code": "使用者[USER]的地區代碼",
    "_user [USER]'s ID": "用戶[USER]的ID",
    "_user [USER]'s Bio": "用戶[USER]的個人簡介",
    "_user [USER]'s friends count": "用戶[USER]的好友數量",
    "_The URL of user [USER]'s avatar": "用戶[USER]的頭像的URL",
    "_The URL of user [USER]'s banner": "用戶[USER]的封面的URL",
    "_The user with ID [ID]": "用戶ID[ID]所屬用戶",
    "_user [USER]'s total XP": "用戶[USER]的總經驗值",
    "_user [USER]'s XP level": "使用者[USER]的經驗等級",
    "_switch XP [XP] to level": "將總經驗值[XP]轉換為經驗等級",
    //"_user [USER]'s distinguishment header": "undefined[USER]",
    //"_user [USER]'s distinguishment footer": "undefined[USER]",
    //"_user [USER]'s distinguishment type": "undefined[USER]",
    //"_user [USER]'s distinguishment detail": "undefined[USER]",
    "_Tetra League": "TETRA聯賽",
    "_[RANK] rank's percentile position": "段位[RANK]的百分位置",
    "_[RANK] rank's position": "段位[RANK]的排名",
    "_[RANK] rank's TR": "段位[RANK]的TR",
    "_[RANK] rank's target TR": "段位元[RANK]的目標TR",
    "_[RANK] rank's PPS": "段位[RANK]的每秒放置塊數",
    "_[RANK] rank's APM": "段位[RANK]的每分發送垃圾行數",
    "_[RANK] rank's VS score": "段位元[RANK]的VS分數",
    "_[RANK] rank's lower/previous rank": "段位[RANK]的上一個段位",
    "_[RANK] rank's higher/next rank": "段位[RANK]的下一個段位",
    "_rank [RANKA] < [RANKB]":"段位[RANKA] < [RANKB]",
    "_rank [RANKA] > [RANKB]":"段位[RANKA] > [RANKB]",
    "_no rank": "無段位",
    "_user [USER]'s rank": "[USER]的段位",
    "_user [USER] is ranked?": "[USER]擁有段位？",
    "_user [USER] received a rank?": "[USER]曾擁有段位？",
    "_user [USER]'s rank is lost?": "[USER]的段位已丟失？",
    "_user [USER]'s top rank": "[USER]的最高段位",
    "_user [USER]'s TR": "[USER]的TR",
    "_user [USER]'s Glicko": "[USER]的Glicko分",
    "_user [USER]'s RD": "[USER]的Glicko偏移量",
    "_user [USER]'s RD is rising?": "[USER]的Glicko偏移量正在上升？",
    "_user [USER]'s rank is stable?": "[USER]的段位穩定？",
    "_user [USER]'s Glixare": "[USER]的Glixare值",
    "_user [USER]'s TL PPS": "Tetra聯賽中[USER]的每秒放置塊數",
    "_user [USER]'s TL APM": "Tetra聯賽中[USER]的每分發送垃圾行數",
    "_user [USER]'s TL VS score": "Tetra聯賽中[USER]的VS分數",
    "_user [USER]'s TL standing": "[USER]的Tetra聯賽排名",
    "_user [USER]'s TL local standing": "[USER]的Tetra聯賽地區排名",
    "_TL games user [USER] has played": "[USER]在Tetra聯賽中的遊戲場次",
    "_TL games user [USER] has won": "[USER]在Tetra聯賽中的獲勝場次",
    "_user [USER]'s possibility to win a TL game": "[USER]在Tetra聯賽中的勝率",
    "_Achievements (Returns Numbers Except Achievement Name)": "成就",
    "_achievement [ACH]": "成就[ACH]",
    "_achievement name of [ACH]": "成就[ACH]的名稱",
    "_Miscellaneous": "雜項",
    "_the author of the TurboWarp extension": "此TurboWarp拓展塊的作者",
    "_the author of Tetra Stats": "Tetra Stats的作者",
    "_the author of deprecated Tetr.io Stats": "廢棄Tetr.io Stats的作者",
    "_the author of TETR.IO+": "TETR.IO+ 的作者",
    "_the author of the game": "TETR.IO 的作者"
},
"ja":
{
    "_Direct Data Query": "データを直接取得",
    "_request basic data for [USER]": "ユーザー[USER]の基本データを取得",
    "_request summaries for [USER]": "ユーザー[USER]のサマリデータを取得",
    "_Cache Management": "キャッシュ管理",
    "_disable cache removing": "キャッシュの削除をオフにする",
    "_enable cache removing": "キャッシュの削除を有効にする",
    "_cache removing enabled?": "キャッシュのクリーンアップがオンになっています",
    "_cache for user [USER] exists?": "[USER] のキャッシュデータは存在します",
    "_when a cache got automatically removed": "キャッシュが自動的にクリアされたとき",
    "_when a cache got non-automatically removed": "キャッシュが手動でクリアされたとき",
    "_when a cache got removed": "キャッシュがクリアされたとき",
    "_when a cache got inputed": "キャッシュが入力されたとき",
    "_set caching speed as once / [N] seconds": "キャッシュをクリアする速度を[N]秒ごとに1回に設定してください",
    "_remove cache: basic data for [USER]": "手動でキャッシュをクリアする：ユーザー[USER]の基本データ",
    "_remove cache: summaries for [USER]": "手動でキャッシュをクリーンアップ：ユーザー[USER]のサマリーデータ",
    "_remove cache: all basic data for users": "キャッシュを手動でクリア:ユーザーのすべての基本データ",
    "_remove cache: all summaries for users": "手動でキャッシュをクリーンアップ:すべてのサマリデータ",
    "_remove all the cache": "すべてのキャッシュをクリーンアップする",
    "_remove all the cache cruelly": "ページを更新してください",
    "_newly inputed user": "新しい入力ユーザー",
    "_Users": "ユーザー",
    "_username [NAME] lgeal?": "ユーザー名[NAME]は正当です",
    "_user [USER] exists?": "[USER]はメンバーです",
    "_user [USER] is a supporter?": "[USER]はサポーターです",
    "_user [USER]'s supporter tier": "[USER]のサポーター層",
    "_user [USER] is in bad standing?": "[USER]は不良状態です",
    "_user [USER] is anonymous?": "[USER]は匿名です",
    "_user [USER] is banned?": "[USER]は禁止されています",
    "_user [USER]'s role": "[USER]の役割",
    "_user [USER]'s country code": "[USER]の国コード",
    "_user [USER]'s ID": "[USER]のID",
    "_user [USER]'s Bio": "[USER]のバイオ",
    "_user [USER]'s friends count": "[USER]の友達の数",
    "_The URL of user [USER]'s avatar": "[USER]のアバターのURL",
    "_The URL of user [USER]'s banner": "[USER]のバナーのURL",
    "_The user with ID [ID]": "ID[ID]が属するユーザー",
    "_user [USER]'s total XP": "[USER]の合計XP",
    "_user [USER]'s XP level": "[USER]のXP等級",
    "_switch XP [XP] to level": "合計XP[XP]をXPレベルに変換する",
    //"_user [USER]'s distinguishment header": "undefined[USER]",
    //"_user [USER]'s distinguishment footer": "undefined[USER]",
    //"_user [USER]'s distinguishment type": "undefined[USER]",
    //"_user [USER]'s distinguishment detail": "undefined[USER]",
    "_Tetra League": "TETRAリーグ",
    "_[RANK] rank's percentile position": "ランク [RANK] のパーセンテージ位置",
    "_[RANK] rank's position": "ランク [RANK] の立場",
    "_[RANK] rank's TR": "ランク [RANK] のTR",
    "_[RANK] rank's target TR": "ランク [RANK] のターゲットTR",
    "_[RANK] rank's PPS": "ランク [RANK] の PPS",
    "_[RANK] rank's APM": "ランク [RANK] の APM",
    "_[RANK] rank's VS score": "ランク [RANK] の VS Score",
    "_[RANK] rank's lower/previous rank": "ランク [RANK] の下位",
    "_[RANK] rank's higher/next rank": "ランク [RANK] の上位",
    "_rank [RANKA] < [RANKB]":"ランク [RANKA] < [RANKB]",
    "_rank [RANKA] > [RANKB]":"ランク [RANKA] > [RANKB]",
    "_no rank": "ランクなし",
    "_user [USER]'s rank": "[USER]のランク",
    "_user [USER] is ranked?": "[USER]はランク付けされます",
    "_user [USER] received a rank?": "[USER]は過去にランク付けされています",
    "_user [USER]'s rank is lost?": "[USER]のランクが失われる",
    "_user [USER]'s top rank": "[USER]の最高ランク",
    "_user [USER]'s TR": "[USER]の TR",
    "_user [USER]'s Glicko": "[USER]の Glicko",
    "_user [USER]'s RD": "[USER]の Glicko レーティング偏差",
    "_user [USER]'s RD is rising?": "[USER]の Glicko レーティング偏差は上昇中です",
    "_user [USER]'s rank is stable?": "[USER]のランクは安定しています",
    "_user [USER]'s Glixare": "[USER] の Glixare",
    "_user [USER]'s TL PPS": "TETRAリーグで、[USER] の PPS",
    "_user [USER]'s TL APM": "TETRAリーグで、 [USER] の APM",
    "_user [USER]'s TL VS score": "TETRAリーグで、 [USER] の VS score",
    "_user [USER]'s TL standing": "TETRAリーグで、 [USER] の立場",
    "_user [USER]'s TL local standing": "TETRAリーグで、 [USER] のローカル立場",
    "_TL games user [USER] has played": "TETRAリーグで、 [USER] のゲーム数",
    "_TL games user [USER] has won": "TETRAリーグで、 [USER] のゲーム勝利数",
    "_user [USER]'s possibility to win a TL game": "[USER] の勝率",
    "_Achievements (Returns Numbers Except Achievement Name)": "完遂",
    "_achievement [ACH]": "完遂[ACH]",
    "_achievement name of [ACH]": "完遂[ACH]的名称",
    "_Miscellaneous": "杂项",
    "_the author of the TurboWarp extension": "このTurboWarp拡張機能の著者",
    "_the author of Tetra Stats": "Tetra Statsの著者",
    "_the author of deprecated Tetr.io Stats": "非推奨のTetr.io Statsの著者",
    "_the author of TETR.IO+": "TETR.IO+の著者",
    "_the author of the game": "TETR.IOの著者"
},
	})
	class TETRIOSTATS {
		constructor() {
		}
		getInfo() {
			return {
				color1:"#1d6429",
				color2:"#1e4822",
				color3:"#1c3e2a",
				id: 'tetriostats',
				name: 'TETR.IO Stats',
				menuIconURI: "https://txt.osk.sh/branding/tetrio-color.svg",
				menus: {
					ranks: {
						acceptReporters: true,
						items: ranks,
					},
					achs: {
						acceptReporters: true,
						items: achievements,
					},
					achtypes: {
						acceptReporters: true,
						items: achtypes,
					}
				},
				blocks: [
					{
						blockType: "label",
						text: Scratch.translate("Direct Data Query"),
					},
					{
						opcode: 'requestUser',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate('request basic data for [USER]'),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
						}
					},
					{
						opcode: 'requestUserSummaries',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate('request summaries for [USER]'),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
						}
					},
					{
						blockType: "label",
						text: Scratch.translate("Cache Management"),
					},
					{
						opcode: 'disableCache',
						blockType: Scratch.BlockType.COMMAND,
						text: Scratch.translate('disable cache removing'),
					},
					{
						opcode: 'enableCache',
						blockType: Scratch.BlockType.COMMAND,
						text: Scratch.translate('enable cache removing'),
					},
					{
						opcode: 'enabledCache',
						blockType: Scratch.BlockType.BOOLEAN,
						text: Scratch.translate('cache removing enabled?'),
					},
					{
						opcode: 'userCacheExist',
						blockType: Scratch.BlockType.BOOLEAN,
						text: Scratch.translate('cache for user [USER] exists?'),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
						}
					},
					{
						opcode: 'cacheGotAutoRemoved',
						blockType: Scratch.BlockType.EVENT,
						text: Scratch.translate('when a cache got automatically removed'),
						isEdgeActivated: false,
					},
					{
						opcode: 'cacheGotNonAutoRemoved',
						blockType: Scratch.BlockType.EVENT,
						text: Scratch.translate('when a cache got non-automatically removed'),
						isEdgeActivated: false,
					},
					{
						opcode: 'cacheGotRemoved',
						blockType: Scratch.BlockType.EVENT,
						text: Scratch.translate('when a cache got removed'),
						isEdgeActivated: false,
					},
					{
						opcode: 'cacheGotInputed',
						blockType: Scratch.BlockType.EVENT,
						text: Scratch.translate('when a cache got inputed'),
						isEdgeActivated: false,
					},
					{
						opcode: 'setCache',
						blockType: Scratch.BlockType.COMMAND,
						text: Scratch.translate('set caching speed as once / [N] seconds'),
						arguments: {
							N: {
								type: Scratch.ArgumentType.NUMBER,
								defaultValue: 0.1
							},
						}
					},
					{
						opcode: 'refreshUser',
						blockType: Scratch.BlockType.COMMAND,
						text: Scratch.translate('remove cache: basic data for [USER]'),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
						}
					},
					{
						opcode: 'refreshUserSummaries',
						blockType: Scratch.BlockType.COMMAND,
						text: Scratch.translate('remove cache: summaries for [USER]'),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
						}
					},
					{
						opcode: 'refreshUserAll',
						blockType: Scratch.BlockType.COMMAND,
						text: Scratch.translate('remove cache: all basic data for users'),
					},
					{
						opcode: 'refreshUserSummariesAll',
						blockType: Scratch.BlockType.COMMAND,
						text: Scratch.translate('remove cache: all summaries for users'),
					},
					{
						opcode: 'refreshAll',
						blockType: Scratch.BlockType.COMMAND,
						text: Scratch.translate('remove all the cache'),
					},
					{
						opcode: 'refreshPage',
						blockType: Scratch.BlockType.COMMAND,
						text: Scratch.translate('remove all the cache cruelly'),
					},
					{
						opcode: 'newlyInputedUser',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate('newly inputed user'),
					},
					{
						blockType: "label",
						text: Scratch.translate("Users"),
					},
					{
						opcode: 'ioUsernameLgeal',
						blockType: Scratch.BlockType.BOOLEAN,
						text: Scratch.translate('username [NAME] lgeal?'),
						arguments: {
							NAME: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
						}
					},
					{
						opcode: 'ioUsernameExist',
						blockType: Scratch.BlockType.BOOLEAN,
						text: Scratch.translate('user [USER] exists?'),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
						}
					},
					{
						opcode: 'ioUserSupporter',
						blockType: Scratch.BlockType.BOOLEAN,
						text: Scratch.translate('user [USER] is a supporter?'),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
						}
					},
					{
						opcode: 'ioUserSupporterTier',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("user [USER]'s supporter tier"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
						}
					},
					{
						opcode: 'ioUserBadStanding',
						blockType: Scratch.BlockType.BOOLEAN,
						text: Scratch.translate('user [USER] is in bad standing?'),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
						}
					},
					{
						opcode: 'ioUserAnon',
						blockType: Scratch.BlockType.BOOLEAN,
						text: Scratch.translate('user [USER] is anonymous?'),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
						}
					},
					{
						opcode: 'ioUserBanned',
						blockType: Scratch.BlockType.BOOLEAN,
						text: Scratch.translate('user [USER] is banned?'),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
						}
					},
					{
						opcode: 'ioUserRole',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("user [USER]'s role"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
						}
					},
					{
						opcode: 'ioUserCountry',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("user [USER]'s country code"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
						}
					},
					{
						opcode: 'ioUserId',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("user [USER]'s ID"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
						}
					},
					{
						opcode: 'ioUserBio',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("user [USER]'s Bio"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
						}
					},
					{
						opcode: 'ioUserFriends',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("user [USER]'s friends count"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
						}
					},
					{
						opcode: 'ioUserAvatarURL',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("The URL of user [USER]'s avatar"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
						}
					},
					{
						opcode: 'ioUserBannerURL',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("The URL of user [USER]'s banner"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
						}
					},
					{
						opcode: 'ioIDToUser',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("The user with ID [ID]"),
						arguments: {
							ID: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: '64d1e1de2cfd122f2a9bd18a'
							},
						}
					},
					{
						opcode: 'ioUserXP',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("user [USER]'s total XP"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
						}
					},
					{
						opcode: 'ioUserXPLevel',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("user [USER]'s XP level"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
						}
					},
					{
						opcode: 'ioUserDistinguishmentHeader',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("user [USER]'s distinguishment header"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'osk'
							},
						}
					},
					{
						opcode: 'ioUserDistinguishmentFooter',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("user [USER]'s distinguishment footer"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'osk'
							},
						}
					},
					{
						opcode: 'ioUserDistinguishmentType',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("user [USER]'s distinguishment type"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'osk'
							},
						}
					},
					{
						opcode: 'ioUserDistinguishmentDetail',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("user [USER]'s distinguishment detail"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'osk'
							},
						}
					},
					{
						blockType: "label",
						text: Scratch.translate("Tetra League"),
					},
					{
						opcode: 'ioRankTopPercent',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("[RANK] rank's percentile position"),
						arguments: {
							RANK: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'x+',
								menu: "ranks"
							},
						}
					},
					{
						opcode: 'ioRankTop',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("[RANK] rank's position"),
						arguments: {
							RANK: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'x+',
								menu: "ranks"
							},
						}
					},
					{
						opcode: 'ioRankTR',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("[RANK] rank's TR"),
						arguments: {
							RANK: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'x+',
								menu: "ranks"
							},
						}
					},
					{
						opcode: 'ioRankTargetTR',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("[RANK] rank's target TR"),
						arguments: {
							RANK: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'x+',
								menu: "ranks"
							},
						}
					},
					{
						opcode: 'ioRankPPS',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("[RANK] rank's PPS"),
						arguments: {
							RANK: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'x+',
								menu: "ranks"
							},
						}
					},
					{
						opcode: 'ioRankAPM',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("[RANK] rank's APM"),
						arguments: {
							RANK: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'x+',
								menu: "ranks"
							},
						}
					},
					{
						opcode: 'ioRankVS',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("[RANK] rank's VS score"),
						arguments: {
							RANK: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'x+',
								menu: "ranks"
							},
						}
					},
					{
						opcode: 'ioPrevRank',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("[RANK] rank's lower/previous rank"),
						arguments: {
							RANK: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'x+',
								menu: "ranks"
							},
						}
					},
					{
						opcode: 'ioNextRank',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("[RANK] rank's higher/next rank"),
						arguments: {
							RANK: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'x+',
								menu: "ranks"
							},
						}
					},
					{
						opcode: 'ioRankIsLowerThan',
						blockType: Scratch.BlockType.BOOLEAN,
						text: Scratch.translate("rank [RANKA] < [RANKB]"),
						arguments: {
							RANKA: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'x',
								menu: "ranks"
							},
							RANKB: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'x+',
								menu: "ranks"
							},
						}
					},
					{
						opcode: 'ioRankIsHigherThan',
						blockType: Scratch.BlockType.BOOLEAN,
						text: Scratch.translate("rank [RANKA] > [RANKB]"),
						arguments: {
							RANKA: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'x+',
								menu: "ranks"
							},
							RANKB: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'x',
								menu: "ranks"
							},
						}
					},
					{
						opcode: 'ioUnranked',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("no rank"),
					},
					{
						opcode: 'ioUserRank',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("user [USER]'s rank"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
						}
					},
					{
						opcode: 'ioUserPastSeasonRank',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("user [USER]'s rank in season [SEASON]"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
							SEASON: {
								type: Scratch.ArgumentType.NUMBER,
								defaultValue: 1
							},
						}
					},
					{
						opcode: 'ioUserIsRanked',
						blockType: Scratch.BlockType.BOOLEAN,
						text: Scratch.translate("user [USER] is ranked?"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
						}
					},
					{
						opcode: 'ioUserPastSeasonIsRanked',
						blockType: Scratch.BlockType.BOOLEAN,
						text: Scratch.translate("user [USER] was ranked in season [SEASON]?"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
							SEASON: {
								type: Scratch.ArgumentType.NUMBER,
								defaultValue: 1
							},
						}
					},
					{
						opcode: 'ioUserRankReceived',
						blockType: Scratch.BlockType.BOOLEAN,
						text: Scratch.translate("user [USER] received a rank?"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
						}
					},
					{
						opcode: 'ioUserRankLost',
						blockType: Scratch.BlockType.BOOLEAN,
						text: Scratch.translate("user [USER]'s rank is lost?"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
						}
					},
					{
						opcode: 'ioUserTopRank',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("user [USER]'s top rank"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
						}
					},
					{
						opcode: 'ioUserPastSeasonTopRank',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("user [USER]'s top rank in season [SEASON]"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
							SEASON: {
								type: Scratch.ArgumentType.NUMBER,
								defaultValue: 1
							},
						}
					},
					{
						opcode: 'ioUserTLTR',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("user [USER]'s TR"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
						}
					},
					{
						opcode: 'ioUserTLPastSeasonTR',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("user [USER]'s TR in season [SEASON]"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
							SEASON: {
								type: Scratch.ArgumentType.NUMBER,
								defaultValue: 1
							},
						}
					},
					{
						opcode: 'ioUserTLGlicko',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("user [USER]'s Glicko"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
						}
					},
					{
						opcode: 'ioUserTLPastSeasonGlicko',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("user [USER]'s Glicko in season [SEASON]"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
							SEASON: {
								type: Scratch.ArgumentType.NUMBER,
								defaultValue: 1
							},
						}
					},
					{
						opcode: 'ioUserTLRD',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("user [USER]'s RD"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
						}
					},
					{
						opcode: 'ioUserIsDecaying',
						blockType: Scratch.BlockType.BOOLEAN,
						text: Scratch.translate("user [USER]'s RD is rising?"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
						}
					},
					{
						opcode: 'ioUserRankIsStable',
						blockType: Scratch.BlockType.BOOLEAN,
						text: Scratch.translate("user [USER]'s rank is stable?"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
						}
					},
					{
						opcode: 'ioUserTLgxe',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("user [USER]'s Glixare"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
						}
					},
					{
						opcode: 'ioUserTLPPS',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("user [USER]'s TL PPS"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
						}
					},
					{
						opcode: 'ioUserTLAPM',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("user [USER]'s TL APM"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
						}
					},
					{
						opcode: 'ioUserTLVS',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("user [USER]'s TL VS score"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
						}
					},
					{
						opcode: 'ioUserTLStanding',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("user [USER]'s TL standing"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
						}
					},
					{
						opcode: 'ioUserTLLocalStanding',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("user [USER]'s TL local standing"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
						}
					},
					{
						opcode: 'ioUserTLGP',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("TL games user [USER] has played"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
						}
					},
					{
						opcode: 'ioUserTLGW',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("TL games user [USER] has won"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
						}
					},
					{
						opcode: 'ioUserTLWR',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("user [USER]'s possibility to win a TL game"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
						}
					},
					{
						blockType: "label",
						text: Scratch.translate("Sprint/40 Lines"),
					},
					{
						opcode: 'ioUser40lRecord',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("user [USER]'s direct 40l record"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
						}
					},
					{
						opcode: 'ioUser40lRecordMillisecond',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("milliseconds [USER] spent on 40 lines"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
						}
					},
					{
						opcode: 'ioUser40lRecordSecond',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("seconds [USER] spent on 40 lines"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
						}
					},
					{
						opcode: 'ioUser40lRecordMinute',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("minutes [USER] spent on 40 lines"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
						}
					},
					{
						opcode: 'ioUser40lRecordIntMinute',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("minutes [USER] spent on 40 lines (int)"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
						}
					},
					{
						opcode: 'ioUser40lRecordSecondSubMinute',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("seconds [USER] spent on 40 lines (without minutes)"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
						}
					},
					{
						blockType: "label",
						text: Scratch.translate("Achievements (Returns Numbers Except Achievement Name)"),
					},
					{
						opcode: 'ioAch',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("achievement [ACH]"),
						arguments: {
							ACH: {
								type: Scratch.ArgumentType.NUMBER,
								defaultValue: 1,
								menu: "achs"
							},
						}
					},
					{
						opcode: 'ioAchName',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("achievement name of [ACH]"),
						arguments: {
							ACH: {
								type: Scratch.ArgumentType.NUMBER,
								defaultValue: 1,
								menu: "achs"
							},
						}
					},
					{
						blockType: "label",
						text: Scratch.translate("Miscellaneous"),
					},
					{
						opcode: 'ioXPtoLevel',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("switch XP [XP] to level"),
						arguments: {
							XP: {
								type: Scratch.ArgumentType.NUMBER,
								defaultValue: '114514.1919810'
							},
						}
					},
					{
						opcode: 'ioPriTo40lRecordSecond',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("seconds record [PRI] spent on 40 lines"),
						arguments: {
							PRI: {
								type: Scratch.ArgumentType.NUMBER,
								defaultValue: '-12345'
							},
						}
					},
					{
						opcode: 'ioPriTo40lRecordMinute',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("minutes record [PRI] spent on 40 lines"),
						arguments: {
							PRI: {
								type: Scratch.ArgumentType.NUMBER,
								defaultValue: '-12345'
							},
						}
					},
					{
						opcode: 'ioPriTo40lRecordIntMinute',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("minutes record [PRI] spent on 40 lines (int)"),
						arguments: {
							PRI: {
								type: Scratch.ArgumentType.NUMBER,
								defaultValue: '-12345'
							},
						}
					},
					{
						opcode: 'ioPriTo40lRecordSecondSubMinute',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("seconds record [PRI] spent on 40 lines (without minutes)"),
						arguments: {
							PRI: {
								type: Scratch.ArgumentType.NUMBER,
								defaultValue: '-12345'
							},
						}
					},
					{
						opcode: 'ioBlockAuthor',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate('the author of the TurboWarp extension'),
					},
					{
						opcode: 'ioTetraStatsAuthor',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate('the author of Tetra Stats'),
					},
					{
						opcode: 'ioExTetrioStatsAuthor',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate('the author of deprecated Tetr.io Stats'),
					},
					{
						opcode: 'ioTetrioPlusAuthor',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate('the author of TETR.IO+'),
					},
					{
						opcode: 'ioAuthor',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate('the author of the game'),
					},
				]
			};
		}
		async requestUser(args) {
			if (UsernameLgeal(args.USER)) return JSON.stringify(await userdata(args.USER))
			else return null;
		}
		refreshUser(args) {
			delete saved_data[args.USER.toString().toLowerCase()];
			Scratch.vm.runtime.startHats("tetriostats_cacheGotRemoved");
			Scratch.vm.runtime.startHats("tetriostats_cacheGotNonAutoRemoved");
		}
		async requestUserSummaries(args) {
			if (UsernameLgeal(args.USER)) return JSON.stringify(await usersummaries(args.USER))
			else return null;
		}
		refreshUserSummaries(args) {
			delete saved_data[args.USER.toString().toLowerCase()];
			Scratch.vm.runtime.startHats("tetriostats_cacheGotRemoved");
			Scratch.vm.runtime.startHats("tetriostats_cacheGotNonAutoRemoved");
		}
		refreshUserAll() {
			saved_data={};
			Scratch.vm.runtime.startHats("tetriostats_cacheGotRemoved");
			Scratch.vm.runtime.startHats("tetriostats_cacheGotNonAutoRemoved");
		}
		refreshUserSummariesAll() {
			summaries={};
			Scratch.vm.runtime.startHats("tetriostats_cacheGotRemoved");
			Scratch.vm.runtime.startHats("tetriostats_cacheGotNonAutoRemoved");
		}
		refreshAll() {
			saved_data={};
			summaries={};
			rankdata=null;
			Scratch.vm.runtime.startHats("tetriostats_cacheGotRemoved")
			Scratch.vm.runtime.startHats("tetriostats_cacheGotNonAutoRemoved")
		}
		refreshPage(){
			location = location
		}
		ioUsernameLgeal(args) {
			return UsernameLgeal(args.NAME);
		}
		async ioUsernameExist(args) {
			if (UsernameLgeal(args.USER) && (await userdata(args.USER)).data) return (await userdata(args.USER)).success
			else return false;
		}
		async ioUserXP(args) {
			if (UsernameLgeal(args.USER) && (await userdata(args.USER)).data) return (await userdata(args.USER)).data.xp
			else return NaN;
		}
		async ioUserXPLevel(args) {
			var xp = await this.ioUserXP({USER: args.USER});
			return Math.pow(xp / 500, 0.6) + (xp / (5000 + Math.max(0, xp - 4000000) / 5000)) + 1
		}
		async ioUserDistinguishmentHeader(args) {
			if (!UsernameLgeal(args.USER)) return ""
			var data = (await userdata(args.USER)).data;
			if (data && data.distinguishment) return data.distinguishment.header
			else return ""
		}
		async ioUserDistinguishmentFooter(args) {
			if (!UsernameLgeal(args.USER)) return ""
			var data = (await userdata(args.USER)).data;
			if (data && data.distinguishment) return data.distinguishment.footer
			else return ""
		}
		async ioUserDistinguishmentType(args) {
			if (!UsernameLgeal(args.USER)) return ""
			var data = (await userdata(args.USER)).data;
			if (data && data.distinguishment) return data.distinguishment.type
			else return ""
		}
		async ioUserDistinguishmentDetail(args) {
			if (!UsernameLgeal(args.USER)) return ""
			var data = (await userdata(args.USER)).data;
			if (data && data.distinguishment) return data.distinguishment.detail
			else return ""
		}
		ioXPtoLevel(args) {
			return Math.pow(args.XP / 500, 0.6) + (args.XP / (5000 + Math.max(0, args.XP - 4000000) / 5000)) + 1;
		}
		async ioUserSupporter(args) {
			if (UsernameLgeal(args.USER) && (await userdata(args.USER)).data) return (await userdata(args.USER)).data.supporter
			else return false;
		}
		async ioUserSupporterTier(args) {
			if (UsernameLgeal(args.USER) && (await userdata(args.USER)).data) return (await userdata(args.USER)).data.supporter_tier||0
			else return 0;
		}
		async ioUserBadStanding(args) {
			if (UsernameLgeal(args.USER) && (await userdata(args.USER)).data) return (await userdata(args.USER)).data.badstanding
			else return false;
		}
		async ioUserRole(args) {
			if (UsernameLgeal(args.USER) && (await userdata(args.USER)).data) return (await userdata(args.USER)).data.role
			else return "username illgeal";
		}
		async ioUserBanned(args) {
			if (UsernameLgeal(args.USER) && (await userdata(args.USER)).data) return (await userdata(args.USER)).data.role=='banned';
			else return false;
		}
		async ioUserAnon(args) {
			if (UsernameLgeal(args.USER) && (await userdata(args.USER)).data) return (await userdata(args.USER)).data.role=='anon';
			else return false;
		}
		async ioUserCountry(args) {
			if (UsernameLgeal(args.USER) && (await userdata(args.USER)).data) return (await userdata(args.USER)).data.country||""
			else return "";
		}
		async ioUserId(args) {
			if (UsernameLgeal(args.USER) && (await userdata(args.USER)).data) return (await userdata(args.USER)).data._id
			else return "username illgeal";
		}
		async ioUserBio(args) {
			if (UsernameLgeal(args.USER) && (await userdata(args.USER)).data) return (await userdata(args.USER)).data.bio||""
			else return "";
		}
		async ioUserFriends(args) {
			if (UsernameLgeal(args.USER) && (await userdata(args.USER)).data) return (await userdata(args.USER)).data.friend_count
			else return NaN;
		}
		async ioUserAvatarURL(args) {
			if (!UsernameLgeal(args.USER)) return "https://tetr.io/res/avatar.png"
			var r = (await userdata(args.USER)).data.avatar_revision, id = await this.ioUserId(args);
			if (r && UsernameLgeal(args.USER)) return `https://tetr.io/res/user-content/avatars/${ id }.jpg?rv=${ r }`
			else return "https://tetr.io/res/avatar.png";
		}
		async ioUserBannerURL(args) {
			if (!UsernameLgeal(args.USER)) return ""
			var r = (await userdata(args.USER)).data.banner_revision, id = await this.ioUserId(args);
			if (r && UsernameLgeal(args.USER)) return `https://tetr.io/res/user-content/banners/${ id }.jpg?rv=${ r }`
			else return "";
		}
		async ioIDToUser(args) {
			if (args.ID.toString().length != 24) return "";
			for (var i in saved_data)
				if (saved_data[i].data._id = args.ID) return i
			var res = await fetch("https://ch.tetr.io/api/users/" + args.ID).then(r => r.json());
			var uname = res.data.username;
			saved_data[uname] = res;
			newlyInputedUser = uname
			Scratch.vm.runtime.startHats("tetriostats_cacheGotInputed");
			return uname
		}
		ioRankTopPercent(args) {
			return {
				"x+":0.002,
				"x":0.01,
				"u":0.05,
				"ss":0.11,
				"s+":0.17,
				"s":0.23,
				"s-":0.30,
				"a+":0.38,
				"a":0.46,
				"a-":0.54,
				"b+":0.62,
				"b":0.70,
				"b-":0.78,
				"c+":0.84,
				"c":0.90,
				"c-":0.95,
				"d+":0.975,
				"d":1,
			}[args.RANK]||NaN
		}
		async ioRankTop(args) {
			return ((await getranks()).data.data)[args.RANK].pos
		}
		async ioRankPlayers(args) {
			return ((await getranks()).data.data)[args.RANK].count
		}
		async ioRankTR(args) {
			return ((await getranks()).data.data)[args.RANK].tr
		}
		async ioRankTargetTR(args) {
			return ((await getranks()).data.data)[args.RANK].targettr
		}
		async ioRankPPS(args) {
			return ((await getranks()).data.data)[args.RANK].pps
		}
		async ioRankAPM(args) {
			return ((await getranks()).data.data)[args.RANK].apm
		}
		async ioRankVS(args) {
			return ((await getranks()).data.data)[args.RANK].vs
		}
		async ioUserPlayedTL(args) {
			if (!UsernameLgeal(args.USER)) return false;
			var data = (await usersummaries(args.USER)).data
			if (data) return data.league.gamesplayed > 0
			else return false;
		}
		async ioUserRankReceived(args) {
			if (!UsernameLgeal(args.USER)) return false;
			var data = (await usersummaries(args.USER)).data
			if (data) return data.league.gamesplayed > 9
			else return false;
		}
		async ioUserRankLost(args) {
			if (!UsernameLgeal(args.USER)) return false;
			var data = (await usersummaries(args.USER)).data
			if (data) return data.league.gamesplayed > 9 && data.league.rank == "z"
			else return false;
		}
		async ioUserRank(args) {
			if (!UsernameLgeal(args.USER)) return "z";
			var data = (await usersummaries(args.USER)).data
			if (data) return data.league.rank
			else return "z";
		}
		async ioUserPastSeasonRank(args) {
			if (!UsernameLgeal(args.USER)) return "z";
			var data = (await usersummaries(args.USER)).data
			if (data) return data.league.past[args.SEASON].rank
			else return "z";
		}
		async ioUserIsRanked(args) {
			if (!UsernameLgeal(args.USER)) return false;
			var data = (await usersummaries(args.USER)).data
			if (data) return data.league.rank != "z"
			else return false;
		}
		async ioUserPastSeasonIsRanked(args) {
			if (!UsernameLgeal(args.USER)) return false;
			var data = (await usersummaries(args.USER)).data
			if (data) return data.league.past[args.SEASON].ranked
			else return false;
		}
		async ioUserTopRank(args) {
			if (!UsernameLgeal(args.USER)) return "z";
			var data = (await usersummaries(args.USER)).data
			if (data) return data.league.bestrank
			else return "z";
		}
		async ioUserPastSeasonTopRank(args) {
			if (!UsernameLgeal(args.USER)) return "z";
			var data = (await usersummaries(args.USER)).data
			if (data) return data.league.past[args.SEASON].bestrank
			else return "z";
		}
		async ioUserTLStanding(args) {
			if (!UsernameLgeal(args.USER)) return -1;
			var data = (await usersummaries(args.USER)).data
			if (data) return data.league.standing
			else return -1;
		}
		async ioUserTLPastSeasonStanding(args) {
			if (!UsernameLgeal(args.USER)) return -1;
			var data = (await usersummaries(args.USER)).data
			if (data) return data.league.past[args.SEASON].placement
			else return -1;
		}
		async ioUserTLLocalStanding(args) {
			if (!UsernameLgeal(args.USER)) return -1;
			var data = (await usersummaries(args.USER)).data
			if (data) return data.league.standing_local
			else return -1;
		}
		async ioUserTLTR(args) {
			if (!UsernameLgeal(args.USER)) return -1;
			var data = (await usersummaries(args.USER)).data
			if (data) return data.league.tr
			else return -1;
		}
		async ioUserTLPastSeasonTR(args) {
			if (!UsernameLgeal(args.USER)) return -1;
			var data = (await usersummaries(args.USER)).data
			if (data) return data.league.past[args.SEASON].tr
			else return -1;
		}
		async ioUserTLGlicko(args) {
			if (!UsernameLgeal(args.USER)) return -1;
			var data = (await usersummaries(args.USER)).data
			if (data) return data.league.glicko
			else return NaN;
		}
		async ioUserTLPastSeasonGlicko(args) {
			if (!UsernameLgeal(args.USER)) return -1;
			var data = (await usersummaries(args.USER)).data
			if (data) return data.league.past[args.SEASON].glicko
			else return NaN;
		}
		async ioUserTLRD(args) {
			if (!UsernameLgeal(args.USER)) return NaN;
			var data = (await usersummaries(args.USER)).data
			if (data) return data.league.rd
			else return NaN;
		}
		async ioUserTLPastSeasonRD(args) {
			if (!UsernameLgeal(args.USER)) return NaN;
			var data = (await usersummaries(args.USER)).data
			if (data) return data.league.past[args.SEASON].rd
			else return NaN;
		}
		async ioUserRankIsStable(args) {
			if (!UsernameLgeal(args.USER)) return true;
			var data = (await usersummaries(args.USER)).data
			if (data) return !(data.league.decaying)
			else return true;
		}
		async ioUserIsDecaying(args) {
			if (!UsernameLgeal(args.USER)) return false;
			var data = (await usersummaries(args.USER)).data
			if (data) return data.league.decaying
			else return false;
		}
		async ioUserTLgxe(args) {
			if (!UsernameLgeal(args.USER)) return NaN;
			var data = (await usersummaries(args.USER)).data
			if (data) return data.league.gxe
			else return NaN;
		}
		async ioUserTLPastSeasongxe(args) {
			if (!UsernameLgeal(args.USER)) return NaN;
			var data = (await usersummaries(args.USER)).data
			if (data) return data.league.past[args.SEASON].gxe
			else return NaN;
		}
		async ioUserTLPPS(args) {
			if (!UsernameLgeal(args.USER)) return NaN;
			var data = (await usersummaries(args.USER)).data
			if (data) return data.league.pps
			else return NaN;
		}
		async ioUserTLPastSeasonPPS(args) {
			if (!UsernameLgeal(args.USER)) return NaN;
			var data = (await usersummaries(args.USER)).data
			if (data) return data.league.past[args.SEASON].pps
			else return NaN;
		}
		async ioUserTLAPM(args) {
			if (!UsernameLgeal(args.USER)) return NaN;
			var data = (await usersummaries(args.USER)).data
			if (data) return data.league.apm
			else return NaN;
		}
		async ioUserTLPastSeasonAPM(args) {
			if (!UsernameLgeal(args.USER)) return NaN;
			var data = (await usersummaries(args.USER)).data
			if (data) return data.league.past[args.SEASON].apm
			else return NaN;
		}
		async ioUserTLVS(args) {
			if (!UsernameLgeal(args.USER)) return NaN;
			var data = (await usersummaries(args.USER)).data
			if (data) return data.league.vs
			else return NaN;
		}
		async ioUserTLPastSeasonVS(args) {
			if (!UsernameLgeal(args.USER)) return NaN;
			var data = (await usersummaries(args.USER)).data
			if (data) return data.league.past[args.SEASON].vs
			else return NaN;
		}
		async ioUserTLGP(args) {
			if (!UsernameLgeal(args.USER)) return -1;
			var data = (await usersummaries(args.USER)).data
			if (data) return data.league.gamesplayed
			else return -1;
		}
		async ioUserTLPastSeasonGP(args) {
			if (!UsernameLgeal(args.USER)) return -1;
			var data = (await usersummaries(args.USER)).data
			if (data) return data.league.past[args.SEASON].gamesplayed
			else return -1;
		}
		async ioUserTLGW(args) {
			if (!UsernameLgeal(args.USER)) return -1;
			var data = (await usersummaries(args.USER)).data
			if (data) return data.league.gameswon
			else return -1;
		}
		async ioUserTLPastSeasonGW(args) {
			if (!UsernameLgeal(args.USER)) return -1;
			var data = (await usersummaries(args.USER)).data
			if (data) return data.league.past[args.SEASON].gameswon
			else return -1;
		}
		async ioUserTLWR(args) {
			if (!UsernameLgeal(args.USER)) return NaN;
			var data = (await usersummaries(args.USER)).data
			if (data) return data.league.gameswon / data.league.gamesplayed
			else return NaN;
		}
		async ioUserTLPastSeasonWR(args) {
			if (!UsernameLgeal(args.USER)) return NaN;
			var data = (await usersummaries(args.USER)).data
			if (data) return data.league.past[args.SEASON].gameswon / data.league.past[args.SEASON].gamesplayed
			else return NaN;
		}
		ioPrevRank(args) {
			if (ranks.indexOf(args.RANK) != -1) 
				if (ranks[ranks.indexOf(args.RANK)+1])
					return ranks[ranks.indexOf(args.RANK)+1]
				else return "z"
			else return "z"
		}
		ioNextRank(args) {
			if (ranks.indexOf(args.RANK) != -1) 
				if (ranks[ranks.indexOf(args.RANK)-1])
					return ranks[ranks.indexOf(args.RANK)-1]
				else return "z"
			else return "z"
		}
		ioRankIsLowerThan(args) {
			if (ranks.indexOf(args.RANKA) == -1 || ranks.indexOf(args.RANKB) == -1) return false
			return ranks.indexOf(args.RANKA) > ranks.indexOf(args.RANKB)
		}
		ioRankIsHigherThan(args) {
			if (ranks.indexOf(args.RANKA) == -1 || ranks.indexOf(args.RANKB) == -1) return false
			return ranks.indexOf(args.RANKA) < ranks.indexOf(args.RANKB)
		}
		async ioUser40lRecord(args) {
			if (!UsernameLgeal(args.USER)) return NaN;
			var data = (await usersummaries(args.USER)).data
			if (data) return data["40l"].record.p.pri
			else return NaN;
		}
		async ioUser40lRecordMinute(args) {
			if (!UsernameLgeal(args.USER)) return NaN;
			var data = (await usersummaries(args.USER)).data
			if (data) return -data["40l"].record.p.pri/60000
			else return NaN;
		}
		ioPriTo40lRecordMinute(args) {
			return Math.abs(args.PRI)/60000
		}
		async ioUser40lRecordIntMinute(args) {
			if (!UsernameLgeal(args.USER)) return NaN;
			var data = (await usersummaries(args.USER)).data
			if (data) return Math.floor(-data["40l"].record.p.pri/60000)
			else return NaN;
		}
		ioPriTo40lRecordIntMinute(args) {
			return Math.floor(Math.abs(args.PRI)/60000)
		}
		async ioUser40lRecordSecond(args) {
			if (!UsernameLgeal(args.USER)) return NaN;
			var data = (await usersummaries(args.USER)).data
			if (data) return -data["40l"].record.p.pri/1000
			else return NaN;
		}
		ioPriTo40lRecordSecond(args) {
			return Math.abs(args.PRI)/1000
		}
		async ioUser40lRecordSecondSubMinute(args) {
			if (!UsernameLgeal(args.USER)) return NaN;
			var data = (await usersummaries(args.USER)).data
			if (data) return -data["40l"].record.p.pri/1000 - 60*Math.floor(-data["40l"].record.p.pri/60000)
			else return NaN;
		}
		ioPriTo40lRecordSecondSubMinute(args) {
			return Math.abs(args.PRI)/1000 - 60*Math.floor(Math.abs(args.PRI)/60000)
		}
		async ioUser40lRecordMillisecond(args) {
			if (!UsernameLgeal(args.USER)) return NaN;
			var data = (await usersummaries(args.USER)).data
			if (data) return -data["40l"].record.p.pri
			else return NaN;
		}
		async ioUser40lRecordReplayID(args) {
			if (!UsernameLgeal(args.USER)) return NaN;
			var data = (await usersummaries(args.USER)).data
			if (data) return data["40l"].record.replayid
			else return NaN;
		}
		async ioUser40lRecordID(args) {
			if (!UsernameLgeal(args.USER)) return NaN;
			var data = (await usersummaries(args.USER)).data
			if (data) return data["40l"].record._id
			else return NaN;
		}
		ioAchName(args){
			return {"1":"Stacker","2":"Powerlevelling","3":"Grbage Offensive","4":"Elegance","5":"Sprinter","6":"Blitzer","7":"Secret Grade","8":"20TSD","9":"10PC","10":"Contender","12":"The Spike of all Time","13":"Speed Player","14":"Plonk","15":"Opener Main","16":"Tower Climber","17":"Whatever It Takes","18":"Zenith Explorer","19":"The Emperor","20":"The Devil","21":"Strengh","22":"The Tower","23":"Temperance","24":"Wheel of Fortune","25":"The Hermit","26":"The Magician","27":"The Lovers","28":"A Modern Classic","29":"Deadlock","30":"The Grandmaster","31":"Emperor's Decadence","32":"Divine Mastery","33":"The Escape Artist","34":"Swamp Water","35":"Champion of the Lobby","36":"All the Single Lines","37":"1-8 Stacking","38":"Mr. Boardwide","39":"Wabi-Sabi","40":"Trained Proessionals","41":"The Responsible One","42":"Zenith Speedrun","43":"Guardian Angel","44":"The Straving Artist","45":"Supercharged","46":"Vip List","47":"Against All Odds","48":"Detail Oriented","49":"The Con Artist"}[args.ACH]||""
		}
		ioAch(args){
			return 0 < args.ACH && args.ACH < 50 && args.ACH != 11 && args.ACH % 1 == 0 ? args.ACH : -1
		}
		ioUnranked(){
			return "z";
		}
		enableCache(){
			autoClearcacheEnabled = true;
		}
		disableCache(){
			autoClearcacheEnabled = false;
		}
		enabledCache(){
			return autoClearcacheEnabled;
		}
		setCache(a){
			autoClearcacheTime = a.N;
		}
		userCacheExist(args) {
			if (UsernameLgeal(args.USER)) return !!saved_data[args.USER]
			else return false;
		}
		newlyInputedUser(){ return newlyInputedUser; }
		ioBlockAuthor(){ return "neko_ab4093"; }
		ioTetraStatsAuthor(){ return "dan63"; }
		ioExTetrioStatsAuthor(){ return "tenchi"; }
		ioTetrioPlusAuthor(){ return "uniqmg"; }
		ioAuthor(){ return "osk"; }
	}
	console.log (new TETRIOSTATS())
	Scratch.extensions.register(new TETRIOSTATS());
})(Scratch);