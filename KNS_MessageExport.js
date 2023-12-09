// KNS_MessageExport.js
//
/*:
 * @target MZ
 * @plugindesc [ver.1.0.1(2022/3/23)]exports texts in events and database.
 * @url https://kanjinokusargss3.hatenablog.com/
 * @author Kanji the Grass
 *
 * @help
 * This plugin corrects and exports texts below from commands in
 * Events of Map, CommonEvents, and BattleEvents.
 * -Show Text(code 101, 401)
 * -Show Choices(code 102)
 * -Show Scrolling Text(code 105, 405)
 * -Conditional Branch(code 111)
 * (only when it checks if an actor's name equals the input name)
 * -Change Name(code 320)
 * -Change Nickname(code 324)
 * -Change Profile(code 325)
 *
 * And also exports some text from database below.
 * -Actors(name, nickname, profile)
 * -Classes(name)
 * -Skills(name, description, message1-2)
 * -Items/Weapons/Armors(name, description)
 * -Enemies(name)
 * -States(name, message1-4)
 *
 * When all of the exportation has been done,
 * you got "KNS_EXPORT" folder on the same directory as index.html
 * and a message on console(Devepoler toop) notify you.
 */
/*ja:
 * @target MZ
 * @plugindesc [ver.1.0.1(2022/3/23)]イベントやデータベース中のテキストを抽出します。
 * @url https://kanjinokusargss3.hatenablog.com/
 * @author 莞爾の草
 *
 * @help
 * 　マップ上のイベント、コモンイベント、戦闘イベントの下記の
 * コマンドで使われたテキストを抽出します。
 * -文章の表示(code 101, 401)
 * -選択肢の表示(code 102)
 * -文章のスクロール表示(code 105, 405)
 * -条件分岐(code 111)
 * (アクターの名前が入力された文字列と等しいか確かめるコマンドのみ)
 * -名前変更(code 320)
 * -二つ名の変更(code 324)
 * -プロフィールの変更(code 325)
 *
 * 　それと同時に下記のデータベースからもテキストを抽出します。
 * -アクター(name, nickname, profile)
 * -職業(name)
 * -スキル(name, description, message1-2)
 * -アイテム/武器/防具(name, description)
 * -エネミー(name)
 * -ステート(name, message1-4)
 *
 * 　抽出が完了したらindex.htmlと同じフォルダに
 * KNS_EXPORTというフォルダが作られ、開発者ツールの
 * console上に「exported!」と表示されます。
 */

const KNS_MessageExport = {
	basePath: 'KNS_EXPORT',
	stuckObj: {},
	isNwJs: function(){
		if (!Utils.isNwjs()){
			console.error("This plugin does work only on NW.js.");
			return false;
		}
		return true;
	},
	makeFolder: function(name){
		const fs = require("fs");
		if (!fs.existsSync(name)){ fs.mkdirSync(name); }
	},
	main: function(){
		if (!this.isNwJs()){
			return;
		}
		this.makeFolder(this.basePath);
		if (SceneManager.showDevTools){ SceneManager.showDevTools(); }
		this.exportCommonEvents();
		this.exportMapInfos();
		this.exportTroops();
		this.exportDatabase('Actors', ['name', 'nickname', '=profile']);
		this.exportDatabase('Classes', ['name']);
		this.exportDatabase('Skills', ['name', '=description', 'message1', 'message2']);
		this.exportDatabase('Items', ['name', '=description']);
		this.exportDatabase('Weapons', ['name', '=description']);
		this.exportDatabase('Armors', ['name', '=description']);
		this.exportDatabase('Enemies', ['name']);
		this.exportDatabase('States', ['name', 'message1', 'message2', 'message3', 'message4']);
	},

	fmtDataText: '@%1: %2\n',
	fmtDataMultiText: '@=%1: \n%2\n@=end\n',
	reMultiline: /^\=(.+)/,
	exportDatabase: function(name, list){
		this.loadDataBase(name, function(obj){
			let text = "";
			obj.forEach(function(data, id){
				if (!data){ return; }
				text += "\n" + this.fmtDataText.format('id', id);
				list.forEach(function(key){
					if (this.reMultiline.test(key)){
						key = RegExp.$1;
						text += this.fmtDataMultiText.format(key, data[key]);
					}else{
						text += this.fmtDataText.format(key, data[key]);
					}
				}, this);
			}, this);
			this.exportFile(name, text);
		});
	},

	fmtCeName: '<@@CE id="%1" name="%2">\n%3</@@CE>\n\n',
	exportCommonEvents: function(){
		const name = "CommonEvents";
		this.loadDataBase(name, function(obj){
			let text = "";
			obj.forEach(function(ce){
				if (!ce){ return; }
				const result = this.formatEventList(ce.list);
				if (result){
					text += this.fmtCeName.format(ce.id, ce.name, result);
				}
			}, this);
			this.exportFile(name, text);
		});
	},

	fmtBeName: '<@@BE id="%1" name="%2" page="%3">\n%4</@@BE>\n\n',
	exportTroops: function(){
		const name = "Troops";
		let text = "";
		this.loadDataBase(name, function(obj){
			obj.forEach(function(troop){
				if (!troop){ return; }
				troop.pages.forEach(function(page, idx){
					const result = this.formatEventList(page.list);
					if (result){
						text += this.fmtBeName.format(troop.id, troop.name, idx + 1, result);
					}
				}, this);
			}, this);
			this.exportFile(name, text);
		});
	},
	exportMapInfos: function(){
		this.loadDataBase("MapInfos", function(obj){
			obj.forEach(function(info){
				if (info){ this.exportMap(info.id, info.name); }
			}, this);
		});
	},
	getMapName: function(id){
		return "Map" + String(id).padZero(3);
	},

	fmtMapHeader: '<@@MAP id="%1" info_name="%2">%3</@@MAP>\n\n',
	fmtMeName: '<@@ME id="%1" name="%2" page="%3">\n%4</@@ME>\n\n',
	exportMap: function(id, infoName){
		const name = this.getMapName(id);
		this.loadDataBase(name, function(obj){
			let text = "";
			text += this.fmtMapHeader.format(id, infoName, obj.displayName);
			obj.events.forEach(function(ev){
				if (!ev){ return; }
				ev.pages.forEach(function(page, idx){
					const result = this.formatEventList(page.list);
					if (result){
						text += this.fmtMeName.format(ev.id, ev.name, idx + 1, result);
					}
				}, this);
			}, this);
			this.exportFile(name, text);
		});
	},


	fmt101: '<@MESSAGE name="%1" face="%2" index="%3">\n',
	fmt101e: '',

	fmt105: '<@SCROLL>\n',
	fmt105e: '',

	fmt102: '<@OPTION>%1\n',

	fmt111: '<@IS_NAME id="%1">%2\n',

	fmt320: '<@RE_NAME id="%1">%2\n',
	fmt324: '<@RE_NICKNAME id="%1">%2\n',
	fmt325: '<@RE_PROFILE id="%1">\n%2\n',

	loadDataBase: function(name, afterLoad){
		const xhr = new XMLHttpRequest();
		xhr.open("GET", 'data/' + name + '.json');
		xhr.overrideMimeType("application/json");

		this.stuckObj[name] = true;
		xhr.onload = function(){
			const obj = JsonEx.parse(this.responseText);
			afterLoad.call(KNS_MessageExport, obj);
			KNS_MessageExport.popStuck(name);
		}
		xhr.onerror = function(){
			KNS_MessageExport.popStuck(name);
		}
		xhr.send();
	},
	popStuck: function(name){
		delete this.stuckObj[name];
		if (Object.keys(this.stuckObj).length == 0){
			console.info("exported!")
		}
	},
	formatEventList: function(list){
		let text = "", param;
		for (let i = 0; i < list.length; i++){
			switch(list[i].code){
				case 101: // message
					text += this.fmt101.format(
						list[i].parameters[4] || "",
						list[i].parameters[0], list[i].parameters[1]
					);
					while (list[++i].code == 401){
						text += list[i].parameters[0] + '\n';
					}
					text += this.fmt101e;
					i--;
					break;
				case 105: // scroll
					text += this.fmt105;
					while (list[++i].code == 405){
						text += list[i].parameters[0] + '\n';
					}
					text += this.fmt105e;
					i--;
					break;
				case 102: // choice
					list[i].parameters[0].forEach(function(choice){
						text += this.fmt102.format(choice);
					}, this);
					break;
				case 111: // is name xxx?
					param = list[i].parameters;
					if (param[0] == 4 && param[2] == 1){
						text += this.fmt111.format(param[1], param[3]);
					}
					break;
				case 320:
				case 324:
				case 325:
					param = list[i].parameters;
					text += this["fmt" + list[i].code].format(param[0], param[1]);
					break;
			}
		}
		return text;
	},
	exportFile: function(name, text, extension){
		const fs = require("fs");
		const path = this.basePath + '/' + name + (extension || '.txt');
		if (fs.existsSync(path)){
			console.error("'" + path + "' already exists!")
		}else{
			fs.writeFileSync(path, text);
		}
	},
};

;(function(){
	const _Scene_Boot_create = Scene_Boot.prototype.create;
	Scene_Boot.prototype.create = function() {
		_Scene_Boot_create.call(this);
		KNS_MessageExport.main();
	};
})();