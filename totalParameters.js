//=============================================================================
// totalParameters.js
//=============================================================================
/*:
 * @author 莞爾の草
 * @plugindesc 筋力、体力などを設定するプラグインです。
 * 
 * @param total_atk_name
 * @text total_atkの名称
 * @desc total_atkのステータス表示用の名称。
 * @default 攻撃力
 * @type string
 * 
 * @param total_def_name
 * @text total_defの名称
 * @desc total_defのステータス表示用の名称。
 * @default 防御力
 * @type string
 * 
 * @param enemyTotalParam
 * @text 敵の筋力・体力に使う数字
 * @desc 値をoriginalにすることで元の攻撃力・防御力が適用され、数字を入れるとその数字が使われます。
 * @default 1
 * @type string
 * 
 * @param equipItemColumn
 * @text 装備アイテムの列数
 * @desc 装備画面で候補となるアイテムが表示されるウィンドウの列数です。
 * @default 2
 * @type number
 * @min 1
 * @max 10
 * 
 * @param equipTerm
 * @text ステータス上での装備の表示名
 * @desc ステータス画面で装備の表示名を設定できます。
 * 空にすると上を詰めて表示されます。
 * @default 装備
 * @type string
 * 
 * @help
 * 武器・防具のメモ欄に
 * <威力:200>
 * <装甲:-100>
 * などと書くことでそれぞれ設定することができます。
 * 
 * ステートのメモ欄に
 * <威力バフ:75%>
 * <装甲バフ:125%>
 * などと書くことでそのステートにかかっているときにそれぞれの
 * パラメータをその割合だけ増減させることができます。
 * <威力バフ:15>
 * <装甲バフ:-20>
 * また、パーセントを外すことで実数で増減させることができます。
 * 実数は割合の計算前で加算され、そののち割合の計算がされます
 * 例）
 * <威力バフ:a%>
 * <威力バフ:b>の場合の計算式
 * (power + b) * a / 100
 * 
 * 敵の威力体力はパラメータから自動設定できますが、敵のメモ欄に
 * <威力:100>
 * <装甲:50>
 * と書くことによって個別に設定することができます。
 * 
 * ダメージ計算式には以下のものが使えます。
 * a.power      //威力値
 * b.armor      //装甲値
 * a.total_atk  //新攻撃力(atk + power)
 * b.total_def  //新防御力(def + armor)
*/

(function() {
	const parameter 			= PluginManager.parameters("totalParameters");
	parameter.totalAtkName		= String(parameter["total_atk_name"] || "攻撃力");
	parameter.totalDefName		= String(parameter["total_def_name"] || "防御力");
	parameter.equipItemColumn	= parseInt(parameter["equipItemColumn"]) || 2;
	parameter.enemyTotalParam	= String(parameter["enemyTotalParam"]);
	parameter.equipTerm			= parameter["equipTerm"];

	let loadedadditionalParams = true;

	const __kanjiLoadInfos = Scene_Boot.prototype.terminate;
	Scene_Boot.prototype.terminate = function() {
		__kanjiLoadInfos.call(this);
		const power = "威力", armor = "装甲", 
		reString = new RegExp(`<(${power}|${armor})\\s*[:：]\\s*(\\-?\\d+(?:\\.?\\d+))>`,'g');
		if (loadedadditionalParams && $dataWeapons && $dataArmors && $dataStates) {
			$dataWeapons.concat($dataArmors).forEach(item => {
				if (item) {
					item.__knsPower = item.__knsArmor = 0;
					if (item.note) {
						var note = item.note.match(reString);
						if (note) {
							for (var tag of note) {
								tag.match(reString);
								var num = Number(RegExp.$2);
								if (RegExp.$1 == power) {
									item.__knsPower += num;
								}else{
									item.__knsArmor += num;
								}
							}
						}
					}
				}
			});

			const powerBuff = "威力バフ", armorBuff = "装甲バフ",
			reBuff = new RegExp(`<(${powerBuff}|${armorBuff})\\s*[:：]\\s*(\\-?\\d+(?:\\.?\\d+)?)([\\%％]?)>`, 'g');
			$dataStates.forEach(item => {
				if (item) {
					item.__knsAtkBuff     = item.__knsDefBuff = 0;
					item.__knsAtkBuffRate = item.__knsDefBuffRate = 1;
					if (item.note) {
						var note = item.note.match(reBuff);
						if (note) {
							for (var tag of note) {
								tag.match(reBuff);
								var num = Number(RegExp.$2);
								if (RegExp.$3.length > 0) {
									num /= 100.0;
									if (RegExp.$1 == powerBuff) {
										item.__knsAtkBuffRate *= num;
									}else{
										item.__knsDefBuffRate *= num;
									}
								}else{
									if (RegExp.$1 == powerBuff) {
										item.__knsAtkBuff += num;
									}else{
										item.__knsDefBuff += num;
									}
								}
							}
						}
					}
				}
			});

			const enemyPower = "威力", enemyArmor = "装甲", 
			reEnemy = new RegExp(`<(${enemyPower}|${enemyArmor})\\s*[:：]\\s*(\\-?\\d+(?:\\.\\d+)?)>`, 'g');
			$dataEnemies.forEach(enemy => {
				if (enemy && enemy.note) {
					enemy.__knsEPower = 0,
					enemy.__knsEArmor = 0;
					var note = enemy.note.match(reEnemy);
					if (note) {
						for (var tag of note) {
							tag.match(reEnemy);
							var num = Number(RegExp.$2);
							if (RegExp.$1 == enemyPower) {
								enemy.__knsEPower += num;
							}else{
								enemy.__knsEArmor += num;
							}
						}
					}
				}
			})
			loadedadditionalParams = false
		}
	};

	Object.defineProperties(Game_BattlerBase.prototype, {
		total_atk: { get: function() { return this.totalParam(2);		}, configurable: true },
		total_def: { get: function() { return this.totalParam(3);		}, configurable: true },
		power:     { get: function() { return this.equipBonusParam(2);	}, configurable: true },
		armor:     { get: function() { return this.equipBonusParam(3);	}, configurable: true },
	});

	Game_Enemy.prototype.totalParam = function (paramId) { 
		var param = this.param(paramId),
		power = eval("this.enemy()" + (paramId == 2 ? ".__knsEPower" : ".__knsEArmor"));
		if (!power) {
			power = parameter.enemyTotalParam === "original" ? param : Number(parameter.enemyTotalParam);
		}

		var num = 0, rate = 1;
		for (var state of this.states()) {
			if (paramId == 2) {
				num  += state.__knsAtkBuff;
				rate *= state.__knsAtkBuffRate;
			}else{
				num  += state.__knsDefBuff;
				rate *= state.__knsDefBuffRate;
			}
		}
		return param + (power + num) * rate;
	};

	Game_Actor.prototype.totalParam = function (paramId) {
		return Math.max(this.param(paramId) + this.equipBonusParam(paramId), 1);
	}

	Game_Actor.prototype.equipBonusParam = function(paramId) {
		if (!(paramId > 1 && paramId < 4)) return 0;
		let value = 0;
		const equips = this.equips();
		for (let i = 0; i < equips.length; i++) {
			let item = equips[i]
			if (item) value += paramId == 2 ? item.__knsPower : item.__knsArmor;
		}

		var num = 0, rate = 1;
		for (var state of this.states()) {
			if (paramId == 2) {
				num  += state.__knsAtkBuff;
				rate *= state.__knsAtkBuffRate;
			}else{
				num  += state.__knsDefBuff;
				rate *= state.__knsDefBuffRate;
			}
		}
		return (value + num) * rate;
	};

	// ステータス
	function paramName (paramId) {
		return paramId == "total_atk" ? parameter.totalAtkName : parameter.totalDefName;
	}

	Window_Status.prototype.drawParameters = function(x, y) {
		var i = 0;
		y -= 14;
		const paramList = ["total_atk", "total_def", 2, 3, 4, 5, 6, 7],
		lineHeight = this.lineHeight() - 6;
		this.contents.fontSize = this.standardFontSize() - 5;
		for (var paramId of paramList) {
			var y2 = y + lineHeight * i;
			this.changeTextColor(this.systemColor());
			if ((typeof paramId) == "string") {
				this.drawText(paramName(paramId), x, y2, 160);
				this.resetTextColor();
				this.drawText(eval("this._actor."+paramId), x + 160, y2, 60, 'right');
			}else{
				this.drawText(TextManager.param(paramId), x, y2, 160);
				this.resetTextColor();
				this.drawText(this._actor.param(paramId), x + 160, y2, 60, 'right');
			}
			i++;
		}
		this.contents.fontSize = this.standardFontSize();
	};

	Window_Status.prototype.drawEquipments = function(x, y) {
		y -= 14;
		this.contents.fontSize = this.standardFontSize() - 5;
		const lineHeight = this.lineHeight() - 6,
		equips = this._actor.equips();
		count = Math.min(equips.length, this.maxEquipmentLines());
		if (parameter.equipTerm) {
			this.changeTextColor(this.systemColor());
			this.drawText(parameter.equipTerm, x, y);
			this.resetTextColor();
		}
		for (var i = 0; i < count; i++) {
			this.drawItemName(equips[i], x, y + lineHeight * (i + (parameter.equipTerm ? 1 : 0)));
		}
		this.contents.fontSize = this.standardFontSize();
	};

	Window_Status.prototype.drawItemName = function(item, x, y, width) {
		width = width || 312;
		if (item) {
			var iconBoxWidth = Window_Base._iconWidth + 4;
			this.resetTextColor();
			this.drawPetetIcon(item.iconIndex, x + 2, y + 2);
			this.drawText(item.name, x + iconBoxWidth, y, width - iconBoxWidth);
		}
	};

	Window_Status.prototype.drawPetetIcon = function (iconIndex, x, y) {
		var bitmap = ImageManager.loadSystem('IconSet');

		var size = 28;
		var pw = Window_Base._iconWidth;
		var ph = Window_Base._iconHeight;
		var space = (pw - size) / 2
		x += space;
		y += space;

		var sx = iconIndex % 16 * pw;
		var sy = Math.floor(iconIndex / 16) * ph;
		this.contents.blt(bitmap, sx, sy, pw, ph, x, y, size, size);
	}
	
	
	// 装備
	Window_EquipItem.prototype.maxCols = function() {
		return parameter.equipItemColumn;
	};

	Window_EquipStatus.prototype.windowHeight = function() {
		return Graphics.boxHeight - 108;
	};

	Window_EquipStatus.prototype.standardFontSize = function() {
		return 26;
	};

	Window_EquipStatus.prototype.refresh = function() {
		this.contents.clear();
		if (this._actor) {
			this.drawActorFace (this._actor, 0, 0)
			this.drawActorName (this._actor, this.textPadding() + 140, 84, 128);
			this.drawActorLevel(this._actor, this.textPadding() + 140, 114);
			var y = 118;
			const paramList = [0, 1, null, "total_atk", "total_def", null, 2, 3, 4, 5, 6, 7];
			for (var paramId of paramList) {
				if (paramId === null) {
					y += 10;
				}else{
					y += this.lineHeight() - 5;
					this.drawItem(0, y, paramId);
				}
			};
		}
	};


	Window_EquipStatus.prototype.drawParamName = function(x, y, paramId) {
		this.changeTextColor(this.systemColor());
		var text = (typeof paramId) == "string" ? paramName(paramId) : TextManager.param(paramId);
		this.drawText(text, x, y, 120);
	};
	
	Window_EquipStatus.prototype.drawCurrentParam = function(x, y, paramId) {
		this.resetTextColor();
		this.drawText((typeof paramId) == "string" ? 
		eval("this._actor." + paramId) : this._actor.param(paramId), x, y, 48, 'right');
	};
	
	const __kanji_drawNewParam = Window_EquipStatus.prototype.drawNewParam;
	Window_EquipStatus.prototype.drawNewParam = function(x, y, paramId) {
		if ((typeof paramId) == "string") {
			var newValue	= eval("this._tempActor." + paramId),
			diffvalue		= newValue - eval("this._actor." + paramId);
			this.changeTextColor(this.paramchangeTextColor(diffvalue));
			this.drawText(newValue, x, y, 48, 'right');
		}else{
			__kanji_drawNewParam.call(this, x, y, paramId);
		}
	};


	Scene_Equip.prototype.createSlotWindow = function() {
		var wx = this._statusWindow.width;
		var wy = this._commandWindow.y + this._commandWindow.height;
		var ww = Graphics.boxWidth - this._statusWindow.width;
		var wh = this._statusWindow.fittingHeight(7) - this._commandWindow.height;
		this._slotWindow = new Window_EquipSlot(wx, wy, ww, wh);
		this._slotWindow.setHelpWindow(this._helpWindow);
		this._slotWindow.setStatusWindow(this._statusWindow);
		this._slotWindow.setHandler('ok',       this.onSlotOk.bind(this));
		this._slotWindow.setHandler('cancel',   this.onSlotCancel.bind(this));
		this.addWindow(this._slotWindow);
	};

	Scene_Equip.prototype.createItemWindow = function() {
		var wx = this._slotWindow.x;
		var wy = this._slotWindow.y + this._slotWindow.height;
		var ww = this._slotWindow.width;
		var wh = Graphics.boxHeight - wy;
		this._itemWindow = new Window_EquipItem(wx, wy, ww, wh);
		this._itemWindow.setHelpWindow(this._helpWindow);
		this._itemWindow.setStatusWindow(this._statusWindow);
		this._itemWindow.setHandler('ok',     this.onItemOk.bind(this));
		this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this));
		this._slotWindow.setItemWindow(this._itemWindow);
		this.addWindow(this._itemWindow);
	};
})();