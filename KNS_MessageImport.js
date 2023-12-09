/*:
 * @target MZ
 * @plugindesc [ver.1.0.2(2023/5/20)]Merges .txt files as .json database exported by KNS_MessageExport
 * @url https://kanjinokusargss3.hatenablog.com/
 * @author Kanji the Grass
 *
 * @base KNS_MessageExport
 *
 * @help
 * This plugin exports .jsons file on "KNS_IMPORT" folder
 * from .txt files exported by KNS_MessageExport and editted.
 * You can replace text in the project at once by transfering
 * these files into "data" folder.
 *
 * ! WARNING !
 * * Use this plugin valid after exporting by
 * KNS_MessageExport and replacing text of them.
 *
 * * The developer of this plugin(me) does NOT take any
 * responsibility even if you failed to import by this.
 * I highly recommend to make a backup copy of 'data'
 * folder before using.
 *
 * * DO NOT change text of .txt excluding input sentences
 * even if it is one space letter.
 *
 * * Keep the same order and the same number of event commands
 * in the project as both of them when you exported by
 * KNS_MessageExport.
 *
 * * This plugin requires KNS_MessageExport, please set it
 * above this plugin on the list. And when this is active,
 * KNS_MessageExport doesn't export .txt files and only do merging
 * into .json files.
 *
 * * KNS_MessageExport does not overwrite files in KNS_EXPORT, but
 * this plugin do .json folder in 'KNS_IMPORT'.
 */
/*ja:
 * @target MZ
 * @plugindesc [ver.1.0.2(2023/5/20)]KNS_MessageExportで出力し改変したtxtファイルをjsonに戻します。
 * @url https://kanjinokusargss3.hatenablog.com/
 * @author 莞爾の草
 *
 * @base KNS_MessageExport
 *
 * @help
 * KNS_MessageExportで出力し改変したtxtファイルをjsonに戻したものを
 * KNS_IMPORTフォルダに出力します。
 * KNS_IMPORTに出力されたJSONファイルをdataフォルダに移行することで
 * テキストを置き換えることができます。
 *
 * 【注意】
 * ・このプラグインはKNS_MessageExportでテキストファイルを出力し、
 * 　テキストの置き換えなどを行った後に有効にしてください。
 *
 * ・インポートの際に復元に失敗した場合制作者は一切の責任を負いません。
 * 　各自dataフォルダのバックアップを取るなどのご対応をお願いします。
 *
 * ・KNS_EXPORTで出力された文章以外の文字列は半角スペース含め
 * 　絶対にいじらないでください。
 *
 * ・イベントコマンドの並びや数はKNS_EXPORTで出力したときと
 * 　同じ状態を保ってください。
 *
 * ・本プラグインの動作にはKNS_MessageExportが必要です。
 * 　本プラグインの上に設置してください。
 * 　また、本プラグインがONになっているとき
 * 　KNS_MessageExportは出力を行わず、jsonの出力作業のみを
 * 　行います。
 *
 * ・KNS_MessageExportと違い、このプラグインは出力時
 * 　ファイルを上書きします。
 */
const KNS_MessageImport = {
	basePath: 'KNS_IMPORT',
	stuckObj: {},
	main: function(){
		if (!KNS_MessageExport.isNwJs()){
			return;
		}
		KNS_MessageExport.makeFolder(this.basePath);
		if (SceneManager.showDevTools){ SceneManager.showDevTools(); }
		this.mergeCommonEvents();
		this.mergeMapInfos();
		this.mergeTroops();
		this.mergeDatabase('Actors');
		this.mergeDatabase('Classes');
		this.mergeDatabase('Skills');
		this.mergeDatabase('Items');
		this.mergeDatabase('Weapons');
		this.mergeDatabase('Armors');
		this.mergeDatabase('Enemies');
		this.mergeDatabase('States');
	},
	getKNSExportPath: function(name){
		return KNS_MessageExport.basePath + '/' + name + '.txt';
	},
	getDataJson: function(name){
		return 'data/' + name + '.json';
	},
	mergeCommonEvents: function(){
		const name = 'CommonEvents';
		this.loadDataBase(this.getKNSExportPath(name), function(obj){
			this.loadDataBase(this.getDataJson(name), function(json){
				this.restoreEventList(obj, json = JsonEx.parse(json));
				this.exportFile(name, JsonEx.stringify(json));
			}, true)
		});
	},
	mergeMapInfos: function(){
		this.loadDataBase(this.getDataJson('MapInfos'), function(json){
			JsonEx.parse(json).forEach(function(info){
				if (info){ this.mergeMap(info.id); }
			}, this);
		});
	},
	mergeMap: function(id){
		const name = KNS_MessageExport.getMapName(id);
		this.loadDataBase(this.getKNSExportPath(name), function(obj){
			this.loadDataBase(this.getDataJson(name), function(json){
				this.restoreEventList(obj, json = JsonEx.parse(json));
				this.exportFile(name, JsonEx.stringify(json));
			}, true);
		});
	},
	mergeTroops: function(){
		const name = 'Troops';
		this.loadDataBase(this.getKNSExportPath(name), function(obj){
			this.loadDataBase(this.getDataJson(name), function(json){
				this.restoreEventList(obj, json = JsonEx.parse(json));
				this.exportFile(name, JsonEx.stringify(json));
			}, true);
		});
	},

	reDatabaseSingle: /@(\w+): (.*)/,
	reDatabaseMulti: /@=(\w+):/,
	reDatabaseMultiEnd: /^@=end/,
	mergeDatabase: function(name){
		this.loadDataBase(this.getKNSExportPath(name), function(obj){
			this.loadDataBase(this.getDataJson(name), function(json){
				json = JsonEx.parse(json);
				let id = 0;
				let multiMode = false;
				let multiText = "";
				let multiKey = "";
				obj.split('\n').forEach(function(line){
					if (multiMode){
						if (this.reDatabaseMultiEnd.test(line)){
							json[id][multiKey] = multiText;
							multiMode = false;
							multiKey = "";
							multiText = "";
						}else{
							if (multiText){
								multiText += '\n' + line;
							}else{
								multiText += line;
							}
						}
						return;
					}
					if (!multiMode && this.reDatabaseMulti.test(line)){
						multiMode = true;
						multiKey = RegExp.$1;
						multiText = "";
						return;
					}
					if (this.reDatabaseSingle.test(line)){
						if (RegExp.$1 == 'id'){
							id = Math.floor(RegExp.$2);
						}else{
							json[id][RegExp.$1] = RegExp.$2;
						}
					}
				}, this);
				this.exportFile(name, JsonEx.stringify(json));
			}, true);
		});
	},

	reMap: /^<@{2}MAP .+?>(.*?)<\/@{2}MAP>/,
	reCE: /^<@{2}CE id="(\d+?)" name="(.*?)".*?>/,
	reBM: /^<@{2}([BM])E id="(\d+?)".*? page="(\d+)">/,

	re101: /^<@MESSAGE name="(.*?)" face=".*?" index="\d+">/,
	re105: /^<@SCROLL>/,
	reEnd: /^<[\/=@]/,

	re102: /^<@OPTION>(.*)/,
	re111: /^<@IS_NAME id="\d+">(.*)/,
	re32x: /^<@RE_(NAME|NICKNAME) id="\d+">(.*)/,
	re325: /^<@RE_PROFILE id="\d+">/,
	restoreEventList: function(text, json){
		let list, index;

		const lines = text.split('\n');
		for (let i = 0; i < lines.length; i++){
			let line = lines[i];
			// map title
			if (this.reMap.test(line)){
				json.displayName = RegExp.$1;
				continue;
			}
			// ce title
			if (this.reCE.test(line)){
				index = 0;
				let evId = Math.floor(RegExp.$1);
				list = json[evId].list;
				json[evId].name = RegExp.$2;
				continue;
			}
			// be/me title
			if (this.reBM.test(line)){
				index = 0;
				let evId = Math.floor(RegExp.$2);
				let pageId = Math.floor(RegExp.$3) - 1;
				if (RegExp.$1 == 'M'){
					list = json.events[evId].pages[pageId].list;
				}else{
					list = json[evId].pages[pageId].list;
				}
				continue;
			}

			// 102 - choice
			let array102 = [];
			while (this.re102.test(line)){
				array102.push(RegExp.$1);
				line = lines[++i];
			}
			if (array102.length > 0){
				while (array102.length > 0){
					index = this.seekCommandCode(index, list, 102);
					let min = list[index].parameters[0].length;
					list[index].parameters[0] = array102.slice(0, min);
					array102 = array102.slice(min);
					index++;
				}
				i--;
				continue;
			}
			// 101 - message
			if (this.re101.test(line)){
				index = this.seekCommandCode(index, list, 101);
				list[index].parameters[4] = RegExp.$1;
				let indent = list[index].indent;
				const nextCode = 401;
				// remove old messages
				index++;
				while(list[index] && list[index].code == nextCode){
					list.splice(index, 1);
				}
				// add new messages
				line = lines[++i];
				while(!this.reEnd.test(line)){
					list.splice(index, 0, {code: nextCode, indent: indent, parameters: [line]});
					index++;
					line = lines[++i];
				};
				i--;
				continue;
			}
			// 105 - scroll
			if (this.re105.test(line)){
				index = this.seekCommandCode(index, list, 105);
				list[index].parameters[4] = RegExp.$1;
				let indent = list[index].indent;
				const nextCode = 405;
				// remove old messages
				index++;
				while(list[index] && list[index].code == nextCode){
					list.splice(index, 1);
				}
				// add new messages
				line = lines[++i];
				while(!this.reEnd.test(line)){
					list.splice(index, 0, {code: nextCode, indent: indent, parameters: [line]});
					index++;
					line = lines[++i];
				};
				i--;
				continue;
			}
			// 111 - is name xxx?
			if (this.re111.test(line)){
				while(true){
					index = this.seekCommandCode(index, list, 111);
					if (!list[index]){
						break;
					}
					const param = list[index].parameters;
					if (param[0] == 4 && param[2] == 1){
						param[3] = RegExp.$1;
						index++;
						break;
					}
					index++;
				}
				continue;
			}
			// 320 - change name
			// 324 - change nickname
			if (this.re32x.test(line)){
				index = this.seekCommandCode(index, list, RegExp.$1 == 'NAME' ? 320 : 324);
				list[index].parameters[1] = RegExp.$2;
				index++;
				continue;
			}
			// 325 - change profile
			if (this.re325.test(line)){
				index = this.seekCommandCode(index, list, 325);
				let profile = "";
				line = lines[++i];
				while (!this.reEnd.test(line)){
					profile += (profile ? "\n" : "") + line;
					line = lines[++i];
				};
				i--;
				list[index].parameters[1] = profile;
				index++;
				continue;
			}
		}
	},
	seekCommandCode: function(i, list, code){
		for (; i < list.length; i++){
			const cur = list[i];
			if (cur && cur.code == code){ break; }
		}
		return i;
	},

	loadDataBase: function(path, afterLoad, pushStuck){
		const xhr = new XMLHttpRequest();
		xhr.open("GET", path);
		xhr.overrideMimeType("application/json");
		if (pushStuck){ this.stuckObj[name] = true; }
		xhr.onload = function(){
			afterLoad.call(KNS_MessageImport, this.responseText);
			if (pushStuck) KNS_MessageImport.popStuck(name);
		}
		xhr.onerror = function(){
			if (pushStuck) KNS_MessageImport.popStuck(name);
		}
		xhr.send();
	},
	popStuck: function(name){
		delete this.stuckObj[name];
		if (Object.keys(this.stuckObj).length == 0){
			console.info("imported!")
		}
	},
	exportFile: function(name, text, extension){
		const fs = require("fs");
		const path = this.basePath + '/' + name + (extension || '.json');
		fs.writeFileSync(path, text);
	},
};

;(function(){
	try{
		KNS_MessageExport.main = function(){
			KNS_MessageImport.main();
		};
	}catch(e){
		console.error('KNS_MessageImport requires KNS_MessageExport.');
	}
})();