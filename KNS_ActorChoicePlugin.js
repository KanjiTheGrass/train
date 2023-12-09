//=============================================================================
// KNS_ActorChoicePlugin.js demo 4
//=============================================================================
/*:
 * @plugindesc 選択肢に指定されたアクターを表示して選択できます。
 * @author 莞爾の草（依頼）
 *
 * @param NooneChosen
 * @text テキスト【該当キャラなし】
 * @desc 誰も条件にマッチしなかった時だけ表示される選択肢です。
 * @type string
 * @default （誰もいない）
 *
 * @param linkBackground
 * @text ステータスと選択肢の背景を同期
 * @desc ステータスウィンドウを背景と同期するか。
 * @type boolean
 * @default false
 *
 * @help
 * ■使い方
 * 　イベントコマンド「選択肢の表示」の選択肢１に#choice get=n
 * 　と書くと、選ばれたアクターＩＤが変数n番目に格納されます。
 * （キャンセル時は変数に0が、該当するキャラがいなかった時は
 * 　変数に-1が入ります）
 * 
 * 　アクター選択時の分岐は選択肢１の中に、該当なしは選択肢２、
 * 　キャンセル時は「選択肢の表示」の「キャンセル」の設定を分岐に
 * 　すると出てくる「キャンセル」の中に設定できます。
 * 
 * 　選択肢の表示方法（位置、背景、キャンセルの種類）は通常の選択肢と
 * 　同様の方法で設定できます。
 * 　キャンセルの種類の設定は禁止と分岐以外は非推奨な使い方です
 * 　（該当のキャラがいない時にエラー）。
 * 　また、メッセージウィンドウ位置の「中」は対応していません。
 * 
 * ■選ばれるアクターの条件の追加方法
 * 　選択肢１～４に次の文字列を書き込むことで設定できます。
 * 　該当キャラがいないことが想定される場面では選択肢は必ず二つ以上用意してください。
 * 
 * 〇条件一覧
 * 【アクター範囲設定】（以下重複不可）
 * ALL
 * 　データベース内のすべての名前設定済みのアクターを
 * 　範囲として設定します。
 * 
 * OUT
 * 　ALLからパーティメンバーをのぞいたものを
 * 　範囲として設定します。
 * 
 * ※いずれも未指定の場合パーティメンバーが範囲となります。
 * 
 * 【範囲絞り込み】（以下重複可能）
 * state=n もしくは state!=n 
 * 　前者はステートn番目状態のアクターが選ばれます。
 * 　後者はステートn番目状態でないアクターが選ばれます。
 * 
 * switch=n もしくは switch!=n
 * 　スイッチの アクターのID - 1 + n 番目を参考に、それぞれの
 * 　アクターが選択可能かどうかを調べます。
 * 　前者はアクターのスイッチがONなら選択可能、後者はOFFなら選択可能。
 * 
 * ※範囲絞り込み条件は一つでも当てはまらないものがあるとマッチしません。
 * 　例えば、条件Aがマッチしたとしても、条件Bがマッチしていなければ
 * 　そのキャラは選ばれません（AかつBでマッチ）。
 * 
 * 【demo 3以降追加】
 * random=n
 * 　選ばれたメンバーの中からランダムでn人以下まで絞り込みます
 * 
 * ■選択肢の例
 * 　選択肢1 #choice ALL get=4
 * 　選択肢2 state!=1 switch=2
 * 　選択肢3 random=4
 * 
 * 【更新履歴】
 * demo 3(2022-02-05)
 * - 範囲選択にrandomを追加
 * - アクターのステータスと選択肢の背景がリンクするようになりました
 * - コードの可読性を向上しました
 * demo 4(2022-02-05)
 * - randomの範囲選択の不具合を修正
 */

(function() {
	//===========================================
	// new KNS_ActorChoice
	//===========================================
	var PARAMS = PluginManager.parameters('KNS_ActorChoicePlugin');
	KNS_ActorChoice = {
		_variableID: 1,
		CA_FLAG_SYMBOL: '#choice',
		RANGE_SYMBOLS: ['ALL', 'OUT'],
		RE_NUMBER: /(\!?)\s*\=\s*(\d+)$/,
		FLAG_SYMBOLS: ['get', 'switch', 'state', 'random'],
		NOONE_CHOSEN: String(PARAMS.NooneChosen),
		LINK_BACKGROUND: PARAMS.linkBackground == 'true'
	};

	KNS_ActorChoice.RE_FLAG_SYMBOL_S = new RegExp('(?:' + 
		KNS_ActorChoice.FLAG_SYMBOLS.join('|') + ')\\s*\\!?\\s*\\=\\s*\\d+', 'g');

	KNS_ActorChoice.isChoiceActorMode = function(){
		return this.isChoiceActor($gameMessage.choices()[0]);
	}
	KNS_ActorChoice.isChoiceActor = function(choice){
		return choice && choice.constructor == Game_Actor;
	}
	KNS_ActorChoice.getActorName = function(choice){
		if (this.isChoiceActor(choice)){
			return choice.name();
		}
		return choice;
	}
	KNS_ActorChoice.getActorList = function(condition){
		var actorList;
		var allMembers = $gameParty.allMembers();
		var isAll = condition.includes(this.RANGE_SYMBOLS[0]);
		if (isAll || condition.includes(this.RANGE_SYMBOLS[1])){
			actorList = []
			for (var i = 1; i < $dataActors.length; i++) {
				var actor = $gameActors.actor(i);
				if ((isAll || !allMembers.includes(actor)) && actor.name()){
					actorList.push(actor)
				}
			}
		}else{
			actorList = allMembers;
		}
		return this.filterByFlags(actorList, condition);
	}
	KNS_ActorChoice.filterByFlags = function(actorList, condition){
		var state = [], swc = [], random;
		condition.match(this.RE_FLAG_SYMBOL_S).forEach(function(conds){
			var num = conds.match(this.RE_NUMBER);
			if (conds.includes(this.FLAG_SYMBOLS[0])) {
				this._variableID = Math.floor(num[2]);
			}else if(conds.includes(this.FLAG_SYMBOLS[3])) {
				random = Math.floor(num[2]);
			}else{
				var value = num[2] * (num[1] ? -1 : 1);
				if (conds.includes(this.FLAG_SYMBOLS[2])){
					state.push(value)
				}else{
					swc.push(value);
				}
			}
		}, this);
		actorList = actorList.filter(function(actor){
			// condsState
			var condsState = true;
			for (var i = 0; condsState && i < state.length; i++) {
				var id = state[i];
				condsState = actor.isStateAffected(Math.abs(id));
				if (id < 0) condsState = !condsState;
			}
			// switch
			var condsSwc = true;
			for (var i = 0; condsSwc && i < swc.length; i++) {
				var data = swc[i];
				var id = actor.actorId() + Math.abs(data) - 1;
				condsSwc = $gameSwitches.value(id);
				if (data < 0) condsSwc = !condsSwc;
			}
			return condsState && condsSwc;
		}, this);
		// random
		if (random !== undefined && random < actorList.length){
			var randomArray = [];
			while (randomArray.length < random){
				var selected = Math.randomInt(actorList.length);
				if (!randomArray.includes(selected)){
					randomArray.push(selected);
				}
			}
			actorList = randomArray.sort(function(a, b){ return a - b; }
			).map(function(i){ return actorList[i]; });
		}
		return actorList;
	}


	//===========================================
	// alias Game_Interpreter
	//===========================================
	var _Game_Interpreter_setupChoices = Game_Interpreter.prototype.setupChoices;
	Game_Interpreter.prototype.setupChoices = function(params) {
		if ($gameParty.inBattle() || !params[0][0].includes(KNS_ActorChoice.CA_FLAG_SYMBOL)){
			_Game_Interpreter_setupChoices.apply(this, arguments);
			return;
		}
		var actorList = KNS_ActorChoice.getActorList(params[0].join(" "));
		if (actorList.length > 0) {
			// pre-load faces
			actorList.forEach(function(actor){ ImageManager.loadFace(actor.faceName()); });
		}else{
			actorList = [KNS_ActorChoice.NOONE_CHOSEN];
		}
		var cancelType = params[1];
		if (cancelType >= params[0].length){ cancelType = -2; }
		$gameMessage.setChoices(actorList, params.length > 2 ? params[2] : 0, cancelType);
		$gameMessage.setChoiceBackground(params.length > 4 ? params[4] : 0);
		$gameMessage.setChoicePositionType(params.length > 3 ? params[3] : 2);
		$gameMessage.setChoiceCallback(function(n){
			if (n == -2) {
				$gameVariables.setValue(KNS_ActorChoice._variableID, 0);
				this._branch[this._indent] = -2;
			}else{
				if (KNS_ActorChoice.isChoiceActor(actorList[n])){
					this._branch[this._indent] = 0;
					$gameVariables.setValue(
						KNS_ActorChoice._variableID, actorList[n].actorId()
					);
				}else{
					this._branch[this._indent] = 1;
					$gameVariables.setValue(KNS_ActorChoice._variableID, -1);
				}
			}
		}.bind(this));
		$gameVariables.setValue(KNS_ActorChoice._variableID, 0);
	};

	//===========================================
	// new Window_Message
	//===========================================
	var _Window_Message_createSubWindows = Window_Message.prototype.createSubWindows;
	Window_Message.prototype.createSubWindows = function() {
		_Window_Message_createSubWindows.apply(this, arguments);
		this._actorDetailWindow = new Window_Base(0, 0, Graphics.width, 192);
		this._actorDetailWindow.openness = 0;
		this._choiceWindow._actorDetailWindow = this._actorDetailWindow;
	};

	var _Window_Message_subWindows = Window_Message.prototype.subWindows;
	Window_Message.prototype.subWindows = function() {
		var windows = _Window_Message_subWindows.apply(this, arguments);
		return windows.concat(this._actorDetailWindow);
	};

	//===========================================
	// new Window_ChoiceList
	//===========================================
	var _Window_ChoiceList_start = Window_ChoiceList.prototype.start;
	Window_ChoiceList.prototype.start = function() {
		this.startActorDetail();
		_Window_ChoiceList_start.apply(this, arguments);
	};

	Window_ChoiceList.prototype.startActorDetail = function() {
		if (KNS_ActorChoice.isChoiceActorMode()) {
			if (KNS_ActorChoice.LINK_BACKGROUND){
				this._actorDetailWindow.setBackgroundType($gameMessage.choiceBackground());
			}
			this._actorDetailWindow.open();
			if ($gameMessage.positionType() == 0){
				this._actorDetailWindow.y = Graphics.height - this._actorDetailWindow.height;
			}else{
				this._actorDetailWindow.y = 0;
			}
		}
	};

	var _Window_ChoiceList_select = Window_ChoiceList.prototype.select;
	Window_ChoiceList.prototype.select = function(index) {
		_Window_ChoiceList_select.apply(this, arguments);
		this.refreshActorDetail();
	};

	var _Window_ChoiceList_close = Window_ChoiceList.prototype.close;
	Window_ChoiceList.prototype.close = function() {
		_Window_ChoiceList_close.apply(this, arguments);
		this._actorDetailWindow.close();
	};

	Window_ChoiceList.prototype.refreshActorDetail = function () {
		if (!this._actorDetailWindow) return;
		(function(actor){
			this.contents.clear();
			if (KNS_ActorChoice.isChoiceActor(actor)){
				this.drawActorFace(actor,0,0);
				var x = 156;
				var x2 = 368;
				this.drawActorName(actor, x, 0);
				this.drawActorLevel(actor, x, 36);
				this.drawActorClass(actor, x2, 0);
				var y = 72;
				var w = 184;
				this.drawActorHp(actor, x, y, w);
				this.drawActorMp(actor, x, y + 36, w);
				[2, 5, 3, 6, 4, 7].forEach(function(id, i){
					var x = x2 + i % 2 * (w + 32);
					var y = 45 + Math.floor(i / 2) * 34;
					this.changeTextColor(this.systemColor());
					this.drawText(TextManager.param(id), x, y, w);
					this.changeTextColor(this.normalColor());
					this.drawText(actor.param(id), x, y, w, 'right');
				}, this);
			}
		}).call(this._actorDetailWindow, $gameMessage.choices()[this.index()]);
	}

	var _Window_ChoiceList_numVisibleRows = Window_ChoiceList.prototype.numVisibleRows;
	Window_ChoiceList.prototype.numVisibleRows = function() {
		var choice = $gameMessage.choices();
		if (KNS_ActorChoice.isChoiceActorMode()){
			return Math.min(choice.length, 6);
		}else{
			return _Window_ChoiceList_numVisibleRows.apply(this, arguments);
		}
	};

	var _Window_ChoiceList_textWidthEx = Window_ChoiceList.prototype.textWidthEx;
	Window_ChoiceList.prototype.textWidthEx = function(text) {
		return _Window_ChoiceList_textWidthEx.call(this, KNS_ActorChoice.getActorName(text));
	};

	var _Window_ChoiceList_commandName = Window_ChoiceList.prototype.commandName;
	Window_ChoiceList.prototype.commandName = function(index) {
		return KNS_ActorChoice.getActorName(
			_Window_ChoiceList_commandName.apply(this, arguments));
	};
})();