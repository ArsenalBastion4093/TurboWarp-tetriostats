﻿// Please run it without sandbox.
(async function (Scratch) {
	"use strict";
	if (!Scratch.extensions.unsandboxed) {
		alert("This extension must be ran without sandbox!");
	}
	try {
		Scratch.translate.setup(await fetch("https://raw.githubusercontent.com/ArsenalBastion4093/TurboWarp-tetriostats/main/translation.json").then(r => r.json()))
	} catch (e) {
		Scratch.translate.setup(await fetch("https://mirror.ghproxy.com/https://raw.githubusercontent.com/ArsenalBastion4093/TurboWarp-tetriostats/main/translation.json").then(r => r.json()))
	}
	var vm = Scratch.vm;
	var runtime = vm.runtime;
	var newlyInputedUser = "";
	async function userdata(USER) {
		if (!saved_data[USER.toString().toLowerCase()]) {
			saved_data[USER.toString().toLowerCase()] = await fetch("https://ch.tetr.io/api/users/" + USER.toString().toLowerCase()).then(r => r.json());
			if (!history.user[USER.toString().toLowerCase()]) history.user[USER.toString().toLowerCase()] = saved_data[USER.toString().toLowerCase()];
			newlyInputedUser = USER.toString().toLowerCase()
			Scratch.vm.runtime.startHats("tetriostats_cacheGotInputed");
		}
		return saved_data[USER.toString().toLowerCase()]
	}
	async function rounddata(USER) {
		if (!saved_rounddata[USER.toString().toLowerCase()]) {
			saved_rounddata[USER.toString().toLowerCase()] = await fetch("https://ch.tetr.io/api/users/" + USER.toString().toLowerCase() + "/records/league/recent?limit=100").then(r => r.json());
			if (!history.round[USER.toString().toLowerCase()]) history.round[USER.toString().toLowerCase()] = saved_rounddata[USER.toString().toLowerCase()];
			newlyInputedUser = USER.toString().toLowerCase()
			Scratch.vm.runtime.startHats("tetriostats_cacheGotInputed");
		}
		return saved_rounddata[USER.toString().toLowerCase()]
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
			if (!history.sum[USER.toString().toLowerCase()]) history.sum[USER.toString().toLowerCase()] = summaries[USER.toString().toLowerCase()];
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
	async function getmetadata() {
		if (!metadata) {
			metadata = await(fetch("https://ch.tetr.io/api/general/stats").then(r => r.json()))
			Scratch.vm.runtime.startHats("tetriostats_cacheGotInputed");
		}
		return metadata
	}
	function UsernameLgeal(A) {
		A = A.toString();
		if (A == "") {
			return false;
		}
		return A.length >= 3 && A.length <= 16 && A.match(/[a-z0-9]/gi).length > 0 && A.match(/[\-_a-z0-9]/gi).length == A.length;
	}
	var currentseason = 2,
	ranks = ["x+","x","u","ss","s+","s","s-","a+","a","a-","b+","b","b-","c+","c","c-","d+","d"],
	saved_data = {},
	saved_achdata = {},
	saved_rounddata = {},
	summaries = {},
	history = {
		user: {},
		sum: {},
		round: {},
	},
	customranks = {},
	rankdata = null,
	metadata = null,
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
			if (metadata && Date.now() > metadata.cache.cached_until) {
				metadata = null;
				Scratch.vm.runtime.startHats("tetriostats_cacheGotRemoved");
				Scratch.vm.runtime.startHats("tetriostats_cacheGotAutoRemoved");
			}
			for (var i in saved_achdata) 
				if (Date.now() > saved_achdata[i].cache.cached_until) {
					delete saved_achdata[i];
					Scratch.vm.runtime.startHats("tetriostats_cacheGotRemoved");
					Scratch.vm.runtime.startHats("tetriostats_cacheGotAutoRemoved");
				}
			for (var i in saved_rounddata) 
				if (Date.now() > saved_rounddata[i].cache.cached_until) {
					delete saved_rounddata[i];
					Scratch.vm.runtime.startHats("tetriostats_cacheGotRemoved");
					Scratch.vm.runtime.startHats("tetriostats_cacheGotAutoRemoved");
				}
		}
		setTimeout(autoClearcache,1000 * autoClearcacheTime)
	}
	autoClearcache()
	class TETRIOSTATS {
		constructor() {
		}
		getInfo() {
			return {
				color1:"#ea50f0",
				color2:"#e500f0",
				color3:"#aa00b3",
				id: 'tetriostats',
				name: 'TETR.IO Stats',
				menuIconURI: "https://txt.osk.sh/branding/tetrio-color.svg",
				blockIconURI: "https://txt.osk.sh/branding/tetrio-mono.svg",
				menus: {
					ranks: {
						acceptReporters: true,
						items: ["x+","x","u","ss","s+","s","s-","a+","a","a-","b+","b","b-","c+","c","c-","d+","d",{text:Scratch.translate("no rank"),value:"z"}],
					},
					achs: {
						acceptReporters: true,
						items: [
							{text:"Stacker",value:1},
							{text:"Powerlevelling",value:2},
							{text:"Garbage Offensive",value:3},
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
					},
					achranks: {
						acceptReporters: true,
						items: [
							{text:"Bronze",value:"1"},
							{text:"Silver",value:"2"},
							{text:"Gold",value:"3"},
							{text:"Platinum",value:"4"},
							{text:"Diamond",value:"5"},/*
							{text:"Top 100",value:"t100"},
							{text:"Top 50",value:"t50"},
							{text:"Top 25",value:"t25"},
							{text:"Top 10",value:"t10"},
							{text:"Top 5",value:"t5"},
							{text:"Top 3",value:"t3"},*/
							{text:"Issued",value:"100"},
							{text:"Null",value:"0"},
						],
					},
					achtops: {
						acceptReporters: true,
						items: [
							{text:"Top 100",value:"t100"},
							{text:"Top 50",value:"t50"},
							{text:"Top 25",value:"t25"},
							{text:"Top 10",value:"t10"},
							{text:"Top 5",value:"t5"},
							{text:"Top 3",value:"t3"},
						],
					},
					lowerhigher: {
						acceptReporters: false,
						items: [
							{text:Scratch.translate("is"),value:"i"},
							{text:Scratch.translate("is lower than"),value:"l"},
							{text:Scratch.translate("is higher than"),value:"h"},
						]
					},
					psselect: {
						acceptReporters: false,
						items: [
							{text:Scratch.translate("TR"),value:"tr"},
							{text:Scratch.translate("Glicko"),value:"glicko"},
							{text:Scratch.translate("Rating Devision"),value:"rd"},
							{text:Scratch.translate("standing"),value:"placement"},
							{text:Scratch.translate("games played"),value:"gamesplayed"},
							{text:Scratch.translate("games won"),value:"gameswon"},
							{text:Scratch.translate("winrate"),value:"wr"},
							{text:Scratch.translate("Glixare"),value:"gxe"},
							{text:Scratch.translate("rank"),value:"rank"},
							{text:Scratch.translate("top rank"),value:"bestrank"},
							{text:Scratch.translate("PPS"),value:"pps"},
							{text:Scratch.translate("APM"),value:"apm"},
							{text:Scratch.translate("VS score"),value:"vs"},
							{text:Scratch.translate("Username"),value:"username"},
							{text:Scratch.translate("Country"),value:"country"},
						]
					},
					dstype:{
						acceptReporters: false,
						items: [
							{text:Scratch.translate("Opener Main"),value:"openermain"},
							{text:Scratch.translate("Offensive Stacker"),value:"os"},
							{text:Scratch.translate("Balanced Stacker"),value:"bs"},
							{text:Scratch.translate("Defensive Stacker"),value:"ds"},
							{text:Scratch.translate("Inf. Downstacker"),value:"infds"},
						]
					},
					zenith:{
						items:[
							{value:"zenith",text:Scratch.translate("Quick Play")},
							{value:"zenithex",text:Scratch.translate("Expert Quick Play")}
						]
					},
					zrecord:{
						items:[
							{value:"week",text:Scratch.translate("Weekly Best")},
							{value:"best",text:Scratch.translate("Career Best")}
						]
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
						opcode: 'userSummaryCacheExist',
						blockType: Scratch.BlockType.BOOLEAN,
						text: Scratch.translate('summary cache for user [USER] exists?'),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
						}
					},
					{
						opcode: 'rankdataCacheExist',
						blockType: Scratch.BlockType.BOOLEAN,
						text: Scratch.translate('cache for ranks exists?'),
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
						opcode: 'currentCache',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate('seconds of time between cache clearing'),
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
						opcode: 'newlyInputedUser',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate('newly inputed user'),
					},
					{
						blockType: "label",
						text: Scratch.translate("General Data"),
					},
					{
						opcode: 'usercount',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate('total players'),
					},
					{
						opcode: 'anoncount',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate('anonymous players'),
					},
					{
						opcode: 'registeredusercount',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate('registered players'),
					},
					{
						opcode: 'rankedcount',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate('ranked players'),
					},
					{
						opcode: 'recordcount',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate('records saved'),
					},
					{
						opcode: 'gamesplayed',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate('games played'),
					},
					{
						opcode: 'gamesfinished',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate('games finished'),
					},
					{
						opcode: 'gametime',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate('time played /s'),
					},
					{
						opcode: 'inputs',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate('keys pressed'),
					},
					{
						opcode: 'piecesplaced',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate('pieces placed'),
					},
					{
						opcode: 'avgpps',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate('average PPS'),
					},
					{
						opcode: 'avgkps',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate('average KPS'),
					},
					{
						opcode: 'avgkpp',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate('average KPP'),
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
						opcode: 'ioWhenUserBio',
						blockType: Scratch.BlockType.HAT,
						text: Scratch.translate("when user [USER] changed their bio"),
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
						opcode: 'ioRankIsLowerHigherThan',
						blockType: Scratch.BlockType.BOOLEAN,
						text: Scratch.translate("rank [RANKA] [LOWERHIGHER] [RANKB]"),
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
							LOWERHIGHER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'i',
								menu: "lowerhigher"
							}
						}
					},
					{
						opcode: 'ioIsRank',
						blockType: Scratch.BlockType.BOOLEAN,
						text: Scratch.translate("[RANK] is a rank?"),
						arguments: {
							RANK: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'x+',
								menu: "ranks"
							},
						}
					},
					{
						opcode: 'ioRankPercentile',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("percentile position [P]'s rank"),
						arguments: {
							P: {
								type: Scratch.ArgumentType.NUMBER,
								defaultValue: 0,
							},
						}
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
						text: Scratch.translate("user [USER]'s Glixare (Percentage chance of winning against the average player)"),
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
						text: Scratch.translate("user [USER]'s Pieces Per Second in TL"),
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
						text: Scratch.translate("user [USER]'s Attack Per Minute in TL"),
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
						text: Scratch.translate("user [USER]'s Versus score in TL"),
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
						opcode: 'ioUserTLPercentStanding',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("user [USER]'s percentile TL standing"),
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
						opcode: 'UserTLGP',
						blockType: Scratch.BlockType.HAT,
						text: Scratch.translate("when [USER] finish a TL game"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
						}
					},
					{
						opcode: 'UserTLGW',
						blockType: Scratch.BlockType.HAT,
						text: Scratch.translate("when [USER] win a TL game"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
						}
					},
					{
						opcode: 'ioIfUserTLGP',
						blockType: Scratch.BlockType.CONDITIONAL,
						text: Scratch.translate("if [USER] finished a TL game recently"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
						}
					},
					{
						opcode: 'ioIfUserTLGW',
						blockType: Scratch.BlockType.CONDITIONAL,
						text: Scratch.translate("if [USER] won a TL game recently"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
						}
					},
					{
						opcode: 'ioUserTLPastSeason',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("user [USER]'s [SELECT] in TL season [SEASON]"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
							SELECT: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'tr',
								menu: "psselect"
							},
							SEASON: {
								type: Scratch.ArgumentType.NUMBER,
								defaultValue: 1
							},
						}
					},
					{
						opcode: 'ioUserPastSeasonIsRanked',
						blockType: Scratch.BlockType.BOOLEAN,
						text: Scratch.translate("user [USER] was ranked when the season [SEASON] ends?"),
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
						opcode: 'ioUserTLPastSeasonPlayed',
						blockType: Scratch.BlockType.BOOLEAN,
						text: Scratch.translate("user [USER] has been playing in season [SEASON]?"),
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
						blockType: "label",
						text: Scratch.translate("Tetra League - Nerd Stats"),
					},
					{
						opcode: 'ioUserTLS1likeTR',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("user [USER]'s TR as would be calucated in season 1"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
						}
					},
					{
						opcode: 'ioUserTLAPP',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("user [USER]'s Attack Per Piece in TL"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
						}
					},
					{
						opcode: 'ioUserDsType',
						blockType: Scratch.BlockType.BOOLEAN,
						text: Scratch.translate("user [USER] is [DSTYPE]?"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
							DSTYPE: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'openermain',
								menu: "dstype"
							},
						}
					},
					{
						opcode: 'ioUserTLDsPS',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("user [USER]'s Downstack Per Second in TL"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
						}
					},
					{
						opcode: 'ioUserTLDsPP',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("user [USER]'s Downstack Per Piece in TL"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
						}
					},
					{
						opcode: 'ioUserTLCheese',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("user [USER]'s Cheese Index in TL"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
						}
					},
					{
						opcode: 'ioUserGarbageEff',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("user [USER]'s Garbage Efficienty in TL"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
						}
					},
					{
						opcode: 'ioUserWAPP',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("user [USER]'s weighted APP in TL"),
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
						opcode: 'ioUser40lPlayed',
						blockType: Scratch.BlockType.BOOLEAN,
						text: Scratch.translate("user [USER] played sprint?"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
							SUB: {
								type: Scratch.ArgumentType.NUMBER,
								defaultValue: 50
							},
						}
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
						opcode: 'ioUser40lSub',
						blockType: Scratch.BlockType.BOOLEAN,
						text: Scratch.translate("user [USER] sub[SUB]?"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
							SUB: {
								type: Scratch.ArgumentType.NUMBER,
								defaultValue: 50
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
						opcode: 'ioUser40lPPS',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("user [USER]'s PPS in 40l"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
						}
					},
					{
						blockType: "label",
						text: Scratch.translate("Quick Play"),
					},
					{
						opcode: 'ioUserZenithPlayed',
						blockType: Scratch.BlockType.BOOLEAN,
						text: Scratch.translate("user [USER] has been playing [ZENITH]?"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
							ZENITH: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'zenith',
								menu: "zenith"
							},
						}
					},
					{
						opcode: 'ioUserZenithWeekPlayed',
						blockType: Scratch.BlockType.BOOLEAN,
						text: Scratch.translate("user [USER] has been playing [ZENITH] in this week?"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
							ZENITH: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'zenith',
								menu: "zenith"
							},
						}
					},
					{
						opcode: 'ioUserZenithPPS',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("user [USER]'s pps in [ZENITH] [ZRECORD]"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
							ZENITH: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'zenith',
								menu: "zenith"
							},
							ZRECORD: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'week',
								menu: "zrecord"
							},
						}
					},
					{
						opcode: 'ioUserZenithAPM',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("user [USER]'s apm in [ZENITH] [ZRECORD]"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
							ZENITH: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'zenith',
								menu: "zenith"
							},
							ZRECORD: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'week',
								menu: "zrecord"
							},
						}
					},
					{
						opcode: 'ioUserZenithVS',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("user [USER]'s VS score in [ZENITH]"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
							ZENITH: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'week',
								menu: "zrecord"
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
								menu: "achs",
								acceptReporters: false,
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
						opcode: 'ioAchHas',
						blockType: Scratch.BlockType.BOOLEAN,
						text: Scratch.translate("[USER] has [ACH]?"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: "neko_ab4093",
							},
							ACH: {
								type: Scratch.ArgumentType.NUMBER,
								defaultValue: 1,
								menu: "achs"
							},
						}
					},
					{
						opcode: 'ioAchRank',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("[ACH]'s rank of [USER]"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: "neko_ab4093",
							},
							ACH: {
								type: Scratch.ArgumentType.NUMBER,
								defaultValue: 1,
								menu: "achs"
							},
						}
					},
					{
						opcode: 'ioAchRankHas',
						blockType: Scratch.BlockType.BOOLEAN,
						text: Scratch.translate("[USER] has [ARANK][ACH]?"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: "neko_ab4093",
							},
							ACH: {
								type: Scratch.ArgumentType.NUMBER,
								defaultValue: 1,
								menu: "achs"
							},
							ARANK: {
								type: Scratch.ArgumentType.NUMBER,
								defaultValue: 1,
								menu: "achranks"
							},
						}
					},
					{
						opcode: 'ioAchValue',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("[ACH]'s value of [USER]"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: "neko_ab4093",
							},
							ACH: {
								type: Scratch.ArgumentType.NUMBER,
								defaultValue: 1,
								menu: "achs"
							},
						}
					},
					{
						opcode: 'ioAchPosition',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("[ACH]'s position/standing of [USER]"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: "neko_ab4093",
							},
							ACH: {
								type: Scratch.ArgumentType.NUMBER,
								defaultValue: 1,
								menu: "achs"
							},
						}
					},
					{
						opcode: 'ioAchPercentile',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("[ACH]'s percentile position of [USER]"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: "neko_ab4093",
							},
							ACH: {
								type: Scratch.ArgumentType.NUMBER,
								defaultValue: 1,
								menu: "achs"
							},
						}
					},
					{
						opcode: 'ioAchShownOnProfile',
						blockType: Scratch.BlockType.BOOLEAN,
						text: Scratch.translate("[USER] shows [ACH] on their profile?"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: "neko_ab4093",
							},
							ACH: {
								type: Scratch.ArgumentType.NUMBER,
								defaultValue: 1,
								menu: "achs"
							},
						}
					},
					{
						opcode: 'ioRankAchObtained',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("[ARANK]-rank achievements [USER] obtained"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: "neko_ab4093",
							},
							ARANK: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: "1",
								menu: "achranks"
							},
						}
					},
					{
						opcode: 'ioUserAR',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("[USER]'s achievement rating"),
						arguments: {
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: "neko_ab4093",
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
						text: Scratch.translate("seconds record [PRI] spent on gaming"),
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
						text: Scratch.translate("minutes record [PRI] spent on gaming"),
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
						text: Scratch.translate("minutes record [PRI] spent on gaming (int)"),
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
						text: Scratch.translate("seconds record [PRI] spent on gaming (without minutes)"),
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
					{
						opcode: 'ioPrintDataConsole',
						blockType: Scratch.BlockType.COMMAND,
						text: Scratch.translate("print this extension's data in console"),
					},
					{
						opcode: 'defineCustomRank',
						blockType: Scratch.BlockType.COMMAND,
						text: Scratch.translate("define custom rank [NAME]"),
						arguments: {
							NAME: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'tetr'
							}
						}
					},
					{
						opcode: 'defineCustomRankWith',
						blockType: Scratch.BlockType.COMMAND,
						text: Scratch.translate("define custom rank [NAME] with data [DATA]"),
						arguments: {
							NAME: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'tetr'
							},
							DATA: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: '{"x+":0.002,"x":0.01,"u":0.05,"ss":0.11,"s+":0.17,"s":0.23,"s-":0.30,"a+":0.38,"a":0.46,"a-":0.54,"b+":0.62,"b":0.70,"b-":0.78,"c+":0.84,"c":0.90,"c-":0.95,"d+":0.975,"d":1}'
							},
						}
					},
					{
						opcode: 'defineCustomRankSetData',
						blockType: Scratch.BlockType.COMMAND,
						text: Scratch.translate("set rank [RANK]'s percentile position to [VALUE] in custom rank [NAME]"),
						arguments: {
							NAME: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'tetr'
							},
							RANK: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'a'
							},
							VALUE: {
								type: Scratch.ArgumentType.NUMBER,
								defaultValue: 0.33
							},
						}
					},
					{
						opcode: 'customRankData',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("rank [RANK]'s percentile position in custom rank [NAME]"),
						arguments: {
							NAME: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'tetr'
							},
							RANK: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'a'
							},
						}
					},
					{
						opcode: 'customRankDataExist',
						blockType: Scratch.BlockType.BOOLEAN,
						text: Scratch.translate("rank [RANK] exist in custom rank [NAME]"),
						arguments: {
							NAME: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'tetr'
							},
							RANK: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'a'
							},
						}
					},
					{
						opcode: 'rankInCustomRank',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("[USER]'s rank in custom rank [NAME]"),
						arguments: {
							NAME: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'tetr'
							},
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
						}
					},
					{
						opcode: 'deleteCustomRank',
						blockType: Scratch.BlockType.COMMAND,
						text: Scratch.translate("delete custom rank [NAME]"),
						arguments: {
							NAME: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'tetr'
							},
						}
					},
					{
						opcode: 'deleteCustomRanks',
						blockType: Scratch.BlockType.COMMAND,
						text: Scratch.translate("delete all custom ranks"),
					},
					{
						opcode: 'customRankExist',
						blockType: Scratch.BlockType.BOOLEAN,
						text: Scratch.translate("custom rank [NAME] exists?"),
						arguments: {
							NAME: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'tetr'
							},
						}
					},
					{
						opcode: 's1rankInCustomRank',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("[USER]'s s1 rank in custom rank [NAME]"),
						arguments: {
							NAME: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'tetr'
							},
							USER: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'neko_ab4093'
							},
						}
					},
					{
						opcode: 'pInCustomRank',
						blockType: Scratch.BlockType.REPORTER,
						text: Scratch.translate("percentile position [P]'s rank in custom rank [NAME]"),
						arguments: {
							NAME: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'tetr'
							},
							P: {
								type: Scratch.ArgumentType.NUMBER,
								defaultValue: 0.3
							},
						}
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
				if (saved_data[i].data._id == args.ID) return i
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
				"d":1
			}[args.RANK]||NaN
		}
		async ioRankTop(args) {
			if (ranks.indexOf(args.RANK) == -1) return NaN
			return ((await getranks()).data.data)[args.RANK].pos
		}
		async ioRankPlayers(args) {
			if (ranks.indexOf(args.RANK) == -1) return NaN
			return ((await getranks()).data.data)[args.RANK].count
		}
		async ioRankTR(args) {
			if (ranks.indexOf(args.RANK) == -1) return NaN
			return ((await getranks()).data.data)[args.RANK].tr
		}
		async ioRankTargetTR(args) {
			if (ranks.indexOf(args.RANK) == -1) return NaN
			return ((await getranks()).data.data)[args.RANK].targettr
		}
		async ioRankPPS(args) {
			if (ranks.indexOf(args.RANK) == -1) return NaN
			return ((await getranks()).data.data)[args.RANK].pps
		}
		async ioRankAPM(args) {
			if (ranks.indexOf(args.RANK) == -1) return NaN
			return ((await getranks()).data.data)[args.RANK].apm
		}
		async ioRankVS(args) {
			if (ranks.indexOf(args.RANK) == -1) return NaN
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
			if (data) return data.league.rank || "z"
			else return "z";
		}
		async ioUserIsRanked(args) {
			if (!UsernameLgeal(args.USER)) return false;
			var data = (await usersummaries(args.USER)).data
			if (data) return data.league.rank != "z"
			else return false;
		}
		async ioUserTopRank(args) {
			if (!UsernameLgeal(args.USER)) return "z";
			var data = (await usersummaries(args.USER)).data
			if (data) return data.league.bestrank
			else return "z";
		}
		async ioUserTLStanding(args) {
			if (!UsernameLgeal(args.USER)) return -1;
			var data = (await usersummaries(args.USER)).data
			if (data) return data.league.standing
			else return -1;
		}
		async ioUserTLPercentStanding(args) {
			if (!UsernameLgeal(args.USER)) return -1;
			var data = (await usersummaries(args.USER)).data
			if (data) return data.league.percentile
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
		async ioUserTLGlicko(args) {
			if (!UsernameLgeal(args.USER)) return -1;
			var data = (await usersummaries(args.USER)).data
			if (data) return data.league.glicko
			else return NaN;
		}
		async ioUserTLRD(args) {
			if (!UsernameLgeal(args.USER)) return NaN;
			var data = (await usersummaries(args.USER)).data
			if (data) return data.league.rd
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
		async ioUserTLS1likeTR(args) {
			if (!UsernameLgeal(args.USER)) return NaN;
			var data = (await usersummaries(args.USER)).data
			if (data) return data.league.gxe * 250
			else return NaN;
		}
		async ioUserTLPPS(args) {
			if (!UsernameLgeal(args.USER)) return NaN;
			var data = (await usersummaries(args.USER)).data
			if (data) return data.league.pps
			else return NaN;
		}
		async ioUserTLAPM(args) {
			if (!UsernameLgeal(args.USER)) return NaN;
			var data = (await usersummaries(args.USER)).data
			if (data) return data.league.apm
			else return NaN;
		}
		async ioUserTLVS(args) {
			if (!UsernameLgeal(args.USER)) return NaN;
			var data = (await usersummaries(args.USER)).data
			if (data) return data.league.vs
			else return NaN;
		}
		async ioUserTLGP(args) {
			if (!UsernameLgeal(args.USER)) return -1;
			var data = (await usersummaries(args.USER)).data
			if (data) return data.league.gamesplayed
			else return -1;
		}
		async ioUserTLGW(args) {
			if (!UsernameLgeal(args.USER)) return -1;
			var data = (await usersummaries(args.USER)).data
			if (data) return data.league.gameswon
			else return -1;
		}
		async ioUserTLGP(args) {
			if (!UsernameLgeal(args.USER)) return -1;
			var data = (await usersummaries(args.USER)).data
			if (data) return data.league.gamesplayed
			else return -1;
		}
		async ioUserTLGW(args) {
			if (!UsernameLgeal(args.USER)) return -1;
			var data = (await usersummaries(args.USER)).data
			if (data) return data.league.gameswon
			else return -1;
		}
		async UserTLGP(args) {
			if (!UsernameLgeal(args.USER)) return false;
			var data = (await usersummaries(args.USER)).data
			if ((!data) || (!history.sum[args.USER.toString().toLowerCase()])) return false 
			if (history.sum[args.USER.toString().toLowerCase()].data.league.gamesplayed == data.league.gamesplayed) return false
			else {
				history.sum[args.USER.toString().toLowerCase()].data.league.gamesplayed = data.league.gamesplayed;
				return true;
			}
		}
		async UserTLGW(args) {
			if (!UsernameLgeal(args.USER)) return false;
			var data = (await usersummaries(args.USER)).data
			if ((!data) || (!history.sum[args.USER.toString().toLowerCase()])) return false 
			if (history.sum[args.USER.toString().toLowerCase()].data.league.gameswon == data.league.gameswon) return false
			else {
				history.sum[args.USER.toString().toLowerCase()].data.league.gameswon = data.league.gameswon;
				return true;
			}
		}
		async ioIfUserTLGP(args) {
			if (!UsernameLgeal(args.USER)) return false;
			var data = (await usersummaries(args.USER)).data
			if ((!data) || (!history.sum[args.USER.toString().toLowerCase()])) return false 
			if (history.sum[args.USER.toString().toLowerCase()].data.league.gamesplayed == data.league.gamesplayed) return false
			else {
				history.sum[args.USER.toString().toLowerCase()].data.league.gamesplayed = data.league.gamesplayed;
				return true;
			}
		}
		async ioIfUserTLGW(args) {
			if (!UsernameLgeal(args.USER)) return false;
			var data = (await usersummaries(args.USER)).data
			if ((!data) || (!history.sum[args.USER.toString().toLowerCase()])) return false 
			if (history.sum[args.USER.toString().toLowerCase()].data.league.gameswon == data.league.gameswon) return false
			else {
				history.sum[args.USER.toString().toLowerCase()].data.league.gameswon = data.league.gameswon;
				return true;
			}
		}
		async ioUserTLWR(args) {
			if (!UsernameLgeal(args.USER)) return NaN;
			var data = (await usersummaries(args.USER)).data
			if (data) return data.league.gameswon / data.league.gamesplayed
			else return NaN;
		}
		async ioUserTLPastSeason(args) {
			if (!UsernameLgeal(args.USER)) return NaN;
			var data = (await usersummaries(args.USER)).data
			if (data)
				if (args.SEASON == currentseason)
					if (args.SELECT == "wr") return data.league.gameswon / data.league.gamesplayed
					else if (args.SELECT == "placement") return data.league.standing
					else return data.league[args.SELECT]
				else if (data.league.past[args.SEASON]) 
					if (args.SELECT == "wr") return data.league.past[args.SEASON].gameswon / data.league.past[args.SEASON].gamesplayed
					else return data.league.past[args.SEASON][args.SELECT]
				else return NaN
			else return NaN
		}
		async ioUserTLPastSeasonPlayed(args) {
			if (!UsernameLgeal(args.USER)) return false;
			var data = (await usersummaries(args.USER)).data
			if (data) 
				if (args.SEASON == currentseason) return !!data.league.gamesplayed
				else return !!data.league.past[args.SEASON]
			else return false;
		}
		async ioUserTLPastSeasonIsRanked(args) {
			if (!UsernameLgeal(args.USER)) return false;
			var data = (await usersummaries(args.USER)).data
			if (data) 
				if (args.SEASON == currentseason) return data.league.rank != "z"
				else if (data.league.past[args.SEASON]) return data.league.past[args.SEASON].ranked
				else return false
			else return false;
		}
		async ioUserPastSeasonIsRanked(args) {
			if (!UsernameLgeal(args.USER)) return false;
			var data = (await usersummaries(args.USER)).data
			if (data) return data.league.past[args.SEASON].ranked
			else return false;
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
		ioRankIsLowerHigherThan(args) {
			if (args.RANKA == "z" || args.RANKB == "z" || ranks.indexOf(args.RANKA) == -1 || ranks.indexOf(args.RANKB) == -1) return false
			if (args.LOWERHIGHER == "i") return args.RANKB == args.RANKA
			return args.LOWERHIGHER == "l" ? ranks.indexOf(args.RANKA) > ranks.indexOf(args.RANKB) : ranks.indexOf(args.RANKA) < ranks.indexOf(args.RANKB)
		}
		ioIsRank(args) {
			return ranks.indexOf(args.RANK) != -1
		}
		async ioUser40lRecord(args) {
			if (!UsernameLgeal(args.USER)) return NaN;
			var data = (await usersummaries(args.USER)).data
			if (data) return data["40l"].record.p.pri
			else return NaN;
		}
		async ioUser40lSub(args) {
			if (!UsernameLgeal(args.USER)) return false;
			var data = (await usersummaries(args.USER)).data
			if (data && data["40l"].record) return data["40l"].record.p.pri > -args.SUB * 1000
			else return false;
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
			if (data && data["40l"].record) return Math.floor(-data["40l"].record.p.pri/60000)
			else return NaN;
		}
		ioPriTo40lRecordIntMinute(args) {
			return Math.floor(Math.abs(args.PRI)/60000)
		}
		async ioUser40lRecordSecond(args) {
			if (!UsernameLgeal(args.USER)) return NaN;
			var data = (await usersummaries(args.USER)).data
			if (data && data["40l"].record) return -data["40l"].record.p.pri/1000
			else return NaN;
		}
		ioPriTo40lRecordSecond(args) {
			return Math.abs(args.PRI)/1000
		}
		async ioUser40lRecordSecondSubMinute(args) {
			if (!UsernameLgeal(args.USER)) return NaN;
			var data = (await usersummaries(args.USER)).data
			if (data && data["40l"].record) return -data["40l"].record.p.pri/1000 - 60*Math.floor(-data["40l"].record.p.pri/60000)
			else return NaN;
		}
		ioPriTo40lRecordSecondSubMinute(args) {
			return Math.abs(args.PRI)/1000 - 60*Math.floor(Math.abs(args.PRI)/60000)
		}
		async ioUser40lRecordMillisecond(args) {
			if (!UsernameLgeal(args.USER)) return NaN;
			var data = (await usersummaries(args.USER)).data
			if (data && data["40l"].record) return -data["40l"].record.p.pri
			else return NaN;
		}
		async ioUser40lRecordReplayID(args) {
			if (!UsernameLgeal(args.USER)) return NaN;
			var data = (await usersummaries(args.USER)).data
			if (data && data["40l"].record) return data["40l"].record.replayid
			else return NaN;
		}
		async ioUser40lRecordID(args) {
			if (!UsernameLgeal(args.USER)) return NaN;
			var data = (await usersummaries(args.USER)).data
			if (data && data["40l"].record) return data["40l"].record._id
			else return NaN;
		}
		async usercount(){
			var data = (await getmetadata()).data
			return data.usercount;
		}
		async anoncount(){
			var data = (await getmetadata()).data
			return data.anoncount;
		}
		async registeredusercount(){
			var data = (await getmetadata()).data
			return data.usercount - data.anoncount;
		}
		async rankedcount(){
			var data = (await getmetadata()).data
			return data.rankedcount;
		}
		async recordcount(){
			var data = (await getmetadata()).data
			return data.recordcount;
		}
		async gamesplayed(){
			var data = (await getmetadata()).data
			return data.gamesplayed;
		}
		async gamesfinished(){
			var data = (await getmetadata()).data
			return data.gamesfinished;
		}
		async gametime(){ // seconds
			var data = (await getmetadata()).data
			return data.gametime;
		}
		async inputs(){
			var data = (await getmetadata()).data
			return data.inputs;
		}
		async piecesplaced(){
			var data = (await getmetadata()).data
			return data.piecesplaced;
		}
		async avgpps(){
			var data = (await getmetadata()).data
			return data.piecesplaced / data.gametime;
		}
		async avgkps(){
			var data = (await getmetadata()).data
			return data.inputs / data.gametime;
		}
		async avgkpp(){
			var data = (await getmetadata()).data
			return data.inputs / data.piecesplaced;
		}
		ioAchName(args){
			return {"1":"Stacker","2":"Powerlevelling","3":"Grbage Offensive","4":"Elegance","5":"Sprinter","6":"Blitzer","7":"Secret Grade","8":"20TSD","9":"10PC","10":"Contender","12":"The Spike of all Time","13":"Speed Player","14":"Plonk","15":"Opener Main","16":"Tower Climber","17":"Whatever It Takes","18":"Zenith Explorer","19":"The Emperor","20":"The Devil","21":"Strengh","22":"The Tower","23":"Temperance","24":"Wheel of Fortune","25":"The Hermit","26":"The Magician","27":"The Lovers","28":"A Modern Classic","29":"Deadlock","30":"The Grandmaster","31":"Emperor's Decadence","32":"Divine Mastery","33":"The Escape Artist","34":"Swamp Water","35":"Champion of the Lobby","36":"All the Single Lines","37":"1-8 Stacking","38":"Mr. Boardwide","39":"Wabi-Sabi","40":"Trained Proessionals","41":"The Responsible One","42":"Zenith Speedrun","43":"Guardian Angel","44":"The Straving Artist","45":"Supercharged","46":"Vip List","47":"Against All Odds","48":"Detail Oriented","49":"The Con Artist"}[args.ACH]||""
		}
		ioAch(args){
			return 0 < args.ACH && args.ACH < 50 && args.ACH != 11 && args.ACH % 1 == 0 ? args.ACH : -1
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
		currentCache(){
			return autoClearcacheTime;
		}
		userCacheExist(args) {
			if (UsernameLgeal(args.USER)) return !!saved_data[args.USER]
			else return false;
		}
		userSummaryCacheExist(args){
			if (UsernameLgeal(args.USER)) return !!summaries[args.USER]
			else return false;
		}
		rankdataCacheExist(){
			return !!rankdata
		}
		newlyInputedUser(){ return newlyInputedUser; }
		ioBlockAuthor(){ return "neko_ab4093"; }
		ioTetraStatsAuthor(){ return "dan63"; }
		ioExTetrioStatsAuthor(){ return "tenchi"; }
		ioTetrioPlusAuthor(){ return "uniqmg"; }
		ioAuthor(){ return "osk"; }
		ioPrintDataConsole(){ console.log("%O",TETRIOSTATS); }
		async ioUserTLAPP(args) {
			if (!UsernameLgeal(args.USER)) return NaN;
			var data = (await usersummaries(args.USER)).data
			if (data) return data.league.apm/60 / data.league.pps
			else return NaN;
		}
		async ioUserDsType(args) {
			if (!UsernameLgeal(args.USER)) return false;
			var data = (await usersummaries(args.USER)).data
			if (data) 
				if (args.DSTYPE == "openermain") return data.league.vs / data.league.apm < 2
				if (args.DSTYPE == "os") return data.league.vs / data.league.apm >= 2 && data.league.vs / data.league.apm < 2.11
				if (args.DSTYPE == "bs") return data.league.vs / data.league.apm >= 2.11 && data.league.vs / data.league.apm < 2.21
				if (args.DSTYPE == "ds") return data.league.vs / data.league.apm >= 2.21 && data.league.vs / data.league.apm < 2.31
				if (args.DSTYPE == "infds") return data.league.vs / data.league.apm >= 2.31
			else return false;
		}
		async ioUserTLDsPS(args) {
			if (!UsernameLgeal(args.USER)) return NaN;
			var data = (await usersummaries(args.USER)).data
			if (data) return data.league.vs/100 - data.league.apm/60
			else return NaN;
		}
		async ioUserTLDsPP(args) {
			if (!UsernameLgeal(args.USER)) return NaN;
			var data = (await usersummaries(args.USER)).data
			if (data) return (data.league.vs/100 - data.league.apm/60)/data.league.pps
			else return NaN;
		}
		async ioUserTLCheese(args) {
			if (!UsernameLgeal(args.USER)) return NaN;
			var data = (await usersummaries(args.USER)).data
			if (data) return (150*(data.league.vs/100 - data.league.apm/60)/data.league.pps) + 50*(data.league.vs/data.league.apm-2) + 125*(0.6 - data.league.apm/60 / data.league.pps)
			else return NaN;
		}
		async ioUserGarbageEff(args) {
			if (!UsernameLgeal(args.USER)) return NaN;
			var data = (await usersummaries(args.USER)).data
			if (data) return 2 * data.league.apm/60 / data.league.pps * (data.league.vs/100 - data.league.apm/60)/data.league.pps
			else return NaN;
		}
		async ioUserWAPP(args) {
			if (!UsernameLgeal(args.USER)) return NaN;
			var data = (await usersummaries(args.USER)).data
			if (data) return data.league.apm/60 / data.league.pps
			else return NaN;
		}
		async ioAchHas(args){
			if (!UsernameLgeal(args.USER)) return false;
			var data = (await usersummaries(args.USER)).data
			if (data) {
				for (var i in data.achievements)
					if (data.achievements[i].k == args.ACH)
						return data.achievements[i].rank != 0 && !data.achievements[i].stub
				return false
			}
			else return false;
		}
		async ioAchValue(args){
			if (!UsernameLgeal(args.USER)) return NaN;
			var data = (await usersummaries(args.USER)).data
			if (data) {
				for (var i in data.achievements)
					if (data.achievements[i].k == args.ACH)
						return data.achievements[i].v
				return NaN
			}
			else return NaN;
		}
		async ioAchPosition(args){
			if (!(0 < args.ACH && args.ACH < 50 && args.ACH != 11 && args.ACH % 1 == 0)) return NaN;
			if (!UsernameLgeal(args.USER)) return NaN;
			var data = (await usersummaries(args.USER)).data
			if (data) {
				for (var i in data.achievements)
					if (data.achievements[i].k == args.ACH)
						return data.achievements[i].pos
				return NaN
			}
			else return NaN;
		}
		async ioAchPercentile(args){
			if (!(0 < args.ACH && args.ACH < 50 && args.ACH != 11 && args.ACH % 1 == 0)) return NaN;
			if (!UsernameLgeal(args.USER)) return NaN;
			var data = (await usersummaries(args.USER)).data
			if (data) {
				for (var i in data.achievements)
					if (data.achievements[i].k == args.ACH)
						return data.achievements[i].pos / data.achievements[i].total
				return NaN
			}
			else return NaN;
		}
		async ioAchRank(args){
			if (!(0 < args.ACH && args.ACH < 50 && args.ACH != 11 && args.ACH % 1 == 0)) return 0;
			if (!UsernameLgeal(args.USER)) return 0;
			var data = (await usersummaries(args.USER)).data
			if (data) {
				for (var i in data.achievements)
					if (data.achievements[i].k == args.ACH)
						return data.achievements[i].rank
				return 0
			}
			else return 0;
		}
		async ioAchRankHas(args){
			if (!(0 < args.ACH && args.ACH < 50 && args.ACH != 11 && args.ACH % 1 == 0)) return 0;
			if (!UsernameLgeal(args.USER)) return 0;
			var data = (await usersummaries(args.USER)).data
			if (data) {
				for (var i in data.achievements)
					if (data.achievements[i].k == args.ACH)
						return (data.achievements[i].rank || 0) == args.ARANK
				return 0
			}
			else return 0;
		}
		async ioAchShownOnProfile(args){
			if (!UsernameLgeal(args.USER)) return false;
			var data = (await userdata(args.USER)).data
			if (data) 
				return data.achievements.lastIndexOf(args.ACH) != -1
			else return false;
		}
		async ioAchsShownOnProfile(args){
			if (!UsernameLgeal(args.USER)) return false;
			var data = (await userdata(args.USER)).data
			if (data) 
				return data.achievements.join(",")
			else return false;
		}
		async ioRankAchObtained(args){
			if (!UsernameLgeal(args.USER)) return 0;
			var data = (await userdata(args.USER)).data
			if (data) 
				return data.ar_counts[args.ARANK]||0
			else return 0;
		}
		async ioUserAR(args){
			if (!UsernameLgeal(args.USER)) return 0;
			var data = (await userdata(args.USER)).data
			if (data) 
				return data.ar||0
			else return 0;
		}
		async ioWhenUserBio(args){
			if (!UsernameLgeal(args.USER)) return false;
			var data = (await userdata(args.USER)).data
			if ((!data) || (!history.sum[args.USER.toString().toLowerCase()])) return false 
			if (history.user[args.USER.toString().toLowerCase()].data.bio == data.bio) return false
			else {
				history.user[args.USER.toString().toLowerCase()].data.bio = data.bio;
				return true;
			}
		}
		defineCustomRank(args){
			customranks[args.NAME] = {};
		}
		defineCustomRankWith(args){
			try {
				var data = JSON.parse(args.DATA);
			} catch (e) {
				return;
			}
			var 
				entries = Object.entries(data);
			entries.sort((a,b) => {
				if (a[1]<b[1]) return -1
				else if (a[1]>b[1]) return 1
				else return 0
			})
			customranks[args.NAME] = data = Object.fromEntries(entries);
		}
		defineCustomRankSetData(args){
			var data = customranks[args.NAME];
			data[args.RANK] = args.VALUE
			var entries = Object.entries(data);
			entries.sort((a,b) => {
				if (a[1]<b[1]) return -1
				else if (a[1]>b[1]) return 1
				else return 0
			})
			data = Object.fromEntries(entries)
			customranks[args.NAME] = json;
		}
		deleteCustomRank(args){
			delete customranks[args.NAME];
		}
		deleteCustomRanks(args){
			customranks = {};
		}
		customRankData(args){
			return customranks[args.NAME][args.RANK]
		}
		customRankExist(args){
			return !!customranks[args.NAME]
		}
		customRankDataExist(args){
			return !!customranks[args.NAME] && !!customranks[args.NAME][args.RANK]
		}
		async rankInCustomRank(args){
			if (!UsernameLgeal(args.USER)) return "";
			var udata = (await usersummaries(args.USER)).data.league;
			if (!udata) return ""
			var percentile = udata.percentile,
			customrank = customranks[args.NAME];
			if (percentile < 0 || percentile > 1) return "";
			for (var i in customrank) {
				if (percentile < customrank[i]) return i
			}
			return "";
		}
		async s1rankInCustomRank(args){
			if (!UsernameLgeal(args.USER)) return "";
			var udata = (await usersummaries(args.USER)).data.league;
			if (!udata || !udata.past[1] || !udata.past[1].ranked) return ""
			var percentile = (udata.past[1].placement-1) / 49072,
			customrank = customranks[args.NAME];
			if (percentile < 0 || percentile > 1) return "";
			for (var i in customrank) {
				if (percentile < customrank[i]) return i
			}
			return "";
		}
		async pInCustomRank(args){
			if (args.P < 0 || args.P > 1) return "";
			var percentile = args.P,
			customrank = customranks[args.NAME];
			for (var i in customrank) {
				if (percentile < customrank[i]) return i
			}
			return "";
		}
		async ioRankPercentile(args){
			if (args.P < 0 || args.P > 1) return "d-";
			var percentile = args.P,
			ranks = {
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
				"d":1
			};
			for (var i in ranks) {
				if (percentile < ranks[i]) return i
			}
			return "d-";
		}
		async ioUser40lPlayed(args) {
			if (!UsernameLgeal(args.USER)) return false;
			var data = (await usersummaries(args.USER)).data
			if (data && data["40l"].record) return true
			else return true;
		}
		async ioUser40lPPS(args) {
			if (!UsernameLgeal(args.USER)) return NaN;
			var data = (await usersummaries(args.USER)).data
			if (data && data["40l"].record) return data["40l"].record.results.aggregatestats.pps
			else return NaN;
		}
		async ioUserBlitzPlayed(args) {
			if (!UsernameLgeal(args.USER)) return false;
			var data = (await usersummaries(args.USER)).data
			if (data && data.blitz.record) return true
			else return true;
		}
		async ioUserBlitzPPS(args) {
			if (!UsernameLgeal(args.USER)) return NaN;
			var data = (await usersummaries(args.USER)).data
			if (data && data.blitz.record) return data.blitz.record.results.aggregatestats.pps
			else return NaN;
		}
		async ioUserZenithPlayed(args) {
			if (!UsernameLgeal(args.USER)) return false;
			var data = (await usersummaries(args.USER)).data
			if (data && data[args.ZENITH] && (data[args.ZENITH].record || data[args.ZENITH].best)) return true
			else return false;
		}
		async ioUserZenithWeekPlayed(args) {
			if (!UsernameLgeal(args.USER)) return false;
			var data = (await usersummaries(args.USER)).data
			if (data && data[args.ZENITH] && data[args.ZENITH].record) return true
			else return false;
		}
		async ioUserZenithPPS(args) {
			if (!UsernameLgeal(args.USER)) return NaN;
			var data = (await usersummaries(args.USER)).data
			if (args.ZRECORD == "best")
				if (data && data[args.ZENITH].best.record) return data[args.ZENITH].best.record.results.aggregatestats.pps
			else
				if (data && data[args.ZENITH].record) return data[args.ZENITH].record.results.aggregatestats.pps
			else return NaN;
		}
		async ioUserZenithAPM(args) {
			if (!UsernameLgeal(args.USER)) return NaN;
			var data = (await usersummaries(args.USER)).data
			if (args.ZRECORD == "best")
				if (data && data[args.ZENITH] && data[args.ZENITH].best.record) return data[args.ZENITH].best.record.results.aggregatestats.apm
			else
				if (data && data[args.ZENITH] && data[args.ZENITH].record) return data[args.ZENITH].record.results.aggregatestats.apm
			else return NaN;
		}
		async ioUserZenithVS(args) {
			if (!UsernameLgeal(args.USER)) return NaN;
			var data = (await usersummaries(args.USER)).data
			if (args.ZRECORD == "best")
				if (data && data[args.ZENITH] && data[args.ZENITH].best.record) return data[args.ZENITH].best.record.results.aggregatestats.vsscore
			else
				if (data && data[args.ZENITH] && data[args.ZENITH].record) return data[args.ZENITH].record.results.aggregatestats.vsscore
			else return NaN;
		}
		async ioUserZenithClearLine(args) {
			if (!UsernameLgeal(args.USER)) return NaN;
			var data = (await usersummaries(args.USER)).data
			if (args.ZRECORD == "best")
				if (data && data[args.ZENITH] && data[args.ZENITH].best.record) return data[args.ZENITH].best.record.results.stats.clears[args.CLEARTYPE]
			else
				if (data && data[args.ZENITH] && data[args.ZENITH].record) return data[args.ZENITH].record.results.stats.clears[args.CLEARTYPE]
			else return NaN;
		}
		async ioUser40lClearLine(args) {
			if (!UsernameLgeal(args.USER)) return NaN;
			var data = (await usersummaries(args.USER)).data
			if (data && data["40l"].record) return data["40l"].record.results.stats.clears[args.CLEARTYPE]
			else return NaN;
		}
		async ioUserBlitzClearLine(args) {
			if (!UsernameLgeal(args.USER)) return NaN;
			var data = (await usersummaries(args.USER)).data
			if (data && data.blitz.record) return data.blitz.record.results.stats.clears[args.CLEARTYPE]
			else return NaN;
		}
		async ioUser40lRank(args) {
			if (!UsernameLgeal(args.USER)) return NaN;
			var data = (await usersummaries(args.USER)).data
			if (data && data["40l"].record) return data["40l"].rank
			else return NaN;
		}
		async ioUserBlitzRank(args) {
			if (!UsernameLgeal(args.USER)) return NaN;
			var data = (await usersummaries(args.USER)).data
			if (data && data.blitz.record) return data.blitz.rank
			else return NaN;
		}
		async ioUser40lRank(args) {
			if (!UsernameLgeal(args.USER)) return NaN;
			var data = (await usersummaries(args.USER)).data
			if (data && data["40l"].record) return data["40l"].rank
			else return NaN;
		}
	}
	Scratch.extensions.register(new TETRIOSTATS());
})(Scratch);
