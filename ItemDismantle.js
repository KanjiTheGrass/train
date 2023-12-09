//=============================================================================
// ItemDismantle.js
//=============================================================================
/*:ja
 * @plugindesc ver.2.0.0 「ItemDismantle open」でアイテム解体画面が開きます
 * @author 莞爾の草
 * @help 
 * プラグインコマンドで「ItemDismantle open」を実行すると解体画面が開きます
 * アイテム・武器・防具のメモ欄に<解体先:i4x5>と記述すると、
 * アイテムID４番が５つ手に入ります。
 * 解体先に武器を指定するときはiをwに、防具にしたい場合はaとしてください。
 * 
 * メモ欄記述例）
 * <解体先:i1>  　→ アイテムID１番が１つ（個数は省略できます）
 * <解体先:i4x5>　→ アイテムID４番が５つ
 * <解体先:w3x6>　→ 武器ID3番が６つ
 * <解体先:a2x7>　→ 防具ID2番が７つ
 * 
 * 解体先が指定されていないアイテムは解体できません。
 * 
 * ■更新履歴
 * ver.1.0.0(2019/05/18)
 * - 公開
 * ver.2.0.0(2023/12/19)
 * - 全体的にリファクタ
 * - drawTextのwidth漏れを対応
 * 
 * @param ItemsThatPartyIsGoingToObtain
 * @desc 画面右の手に入るアイテム一覧のところに表示されるテキストです。
 * @default 【手に入るアイテム】
 * @type string
 *
 * @param NumberOfItemPartyTriesToDismantle
 * @desc 画面右下の分解するアイテムを指定するウィンドウに表示されるテキストです。
 * @default 【分解する数】
 * @type string
 *
 * @param HowManyItemDoYouWantToDismantle
 * @desc アイテムを選んだ時にヘルプウィンドウに表示されるテキストです。■にはアイテム名が入ります。
 * @default ■をいくつ分解しますか？
 * @type string
 *
 * @param DismantleSound
 * @desc 分解したときの効果音
 * @default Bell2
 * @type string
 *
 * @param DismantledItem
 * @desc 分解したアイテム
 * @default 【分解したアイテム】
 * @type string
 *
 * @param ObtainedItem
 * @desc 手に入れたアイテム
 * @default 【手に入れたアイテム】
 * @type string
 *
 * @param CategoryWindowRect
 * @text 【座標】カテゴリーウィンドウ
 * @type struct<Rectangle>
 * @default {"x":"0","y":"108","width":"816","height":"72"}
 *
 * @param ItemListWindowRect
 * @text 【座標】アイテムウィンドウ
 * @type struct<Rectangle>
 * @default {"x":"0","y":"180","width":"420","height":"444"}
 *
 * @param DismantleListWindowRect
 * @text 【座標】解体先ウィンドウ
 * @type struct<Rectangle>
 * @default {"x":"420","y":"180","width":"396","height":"300"}
 *
 * @param DismantleCountWindowRect
 * @text 【座標】解体数ウィンドウ
 * @type struct<Rectangle>
 * @default {"x":"420","y":"480","width":"396","height":"144"}
 * 
 * @param ResultWindowRect
 * @text 【座標】解体結果ウィンドウ
 * @type struct<Rectangle>
 * @default {"x":"168","y":"147","width":"480","height":"330"}
 */
/*~struct~Rectangle:
 * @param x
 * @text X
 * @type number
 * @default 0
 * 
 * @param y
 * @text Y
 * @type number
 * @default 0
 * 
 * @param width
 * @text 横幅
 * @type number
 * @default 0
 * 
 * @param height
 * @text 縦幅
 * @type number
 * @default 0
 */

var KNS_ItemDismantle = {
	name: "ItemDismantle",
	param: null,
	reDismantleMeta: /<解体先[:：](i|w|a)(\d+)(?:x(\d+))?>/g,
	getDismantleList: function(item){
		var list = [];
		if (!item) { return list; };
		var data;
		item.note.replace(this.reDismantleMeta, function(_, type, id, num){
			switch (type.toLowerCase()) {
				case 'i': data = $dataItems;   break;
				case 'w': data = $dataWeapons; break;
				case 'a': data = $dataArmors;  break;
				default:  return;
			}
			var item = data[id];
			list.push([ item, Math.min(Math.floor(num || 1), $gameParty.maxItems(item)) ]);
		}, this);
		this.reDismantleMeta.lastIndex = 0;
		return list;
	},
	parseRectangle(json){
		const rect = JsonEx.parse(json);
		return new Rectangle(
			Number(rect.x), Number(rect.y), Number(rect.width), Number(rect.height)
		);
	}
};

(function(){
	this.param = PluginManager.parameters(this.name);

	this.param.ObtainItem = String(this.param["ItemsThatPartyIsGoingToObtain"]);
	this.param.DismantleNumber = String(this.param["NumberOfItemPartyTriesToDismantle"]);
	this.param.HowManyItems = String(this.param["HowManyItemDoYouWantToDismantle"]);
	this.param.DismantleSound = String(this.param["DismantleSound"]);
	this.param.DismantledItemName = String(this.param["DismantledItem"]);
	this.param.ObtainedItemName = String(this.param["ObtainedItem"]);

	this.param.CategoryWindowRect       = this.parseRectangle(this.param.CategoryWindowRect);
	this.param.ItemListWindowRect       = this.parseRectangle(this.param.ItemListWindowRect);
	this.param.DismantleListWindowRect  = this.parseRectangle(this.param.DismantleListWindowRect);
	this.param.DismantleCountWindowRect = this.parseRectangle(this.param.DismantleCountWindowRect);
	this.param.ResultWindowRect         = this.parseRectangle(this.param.ResultWindowRect);

	//===============================================================
	// alias Game_Interpreter
	//===============================================================
	var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function (command, args) {
		_Game_Interpreter_pluginCommand.call(this, command, args);
		if (command !== KNS_ItemDismantle.name) { return; }
		switch (args[0].toLowerCase()) {
			case 'open': SceneManager.push(Scene_Dismantle); break;
		}
	};
}).call(KNS_ItemDismantle);

//===============================================================
// new Window_DismantleList
//===============================================================
class Window_DismantleList extends Window_ItemList{
	maxCols() { return 1; }
	knsSetCountWindow(window) {
		this._knsCountWindow = window;
	};
	callUpdateHelp() {
		super.callUpdateHelp();
		var item = this.item();
		if (this._knsCountWindow){
			this._knsCountWindow.knsSetItem(item);
		}
	};
	isEnabled(item) {
		return KNS_ItemDismantle.getDismantleList(item).length > 0;
	};
};

//===============================================================
// new Window_DismantleResultList
//===============================================================
class Window_DismantleResultList extends Window_Base{
	knsSetItem(item, num){
		if (this._knsItem !== item || this._num !== num){
			this._knsItem = item;
			this._num = num;
			this.refresh();
		}
	}
	refresh(){
		this.contents.clear();
		var list = KNS_ItemDismantle.getDismantleList(this._knsItem);
		if (list) {
			this.changeTextColor(this.systemColor());
			this.drawText(KNS_ItemDismantle.param.ObtainItem, 0, 0, this.contents.width);
			this.changeTextColor(this.normalColor());
	
			var y = this.lineHeight();
			var wi = this.textWidth('000');
			list.forEach(function (data) {
				this.drawItemName(data[0], 0, y);
				this.drawText(":", 0, y, this.contents.width - wi, 'right');
				this.drawText(data[1] * this._num, 0, y, this.contents.width, 'right');
				y += this.lineHeight();
			}, this)
		}
	}
};

//===============================================================
// new Window_DismantleCount
//===============================================================
class Window_DismantleCount extends Window_Selectable{
	knsSetItem(item){
		if (this._knsItem !== item){
			this._knsItem = item;
			this.refresh();
		}
	}
	knsSetResultListWindow(window) {
		this._knsResultListWindow = window;
	};
	callUpdateHelp(){
		super.callUpdateHelp();
		if (this._knsResultListWindow){
			this._knsResultListWindow.knsSetItem(this._knsItem, this._num);
		}
	}

	initialize(x, y, width, height){
		super.initialize(x, y, width, height);
		this.knsCreateButtons();
		this.deactivate();
	}
	knsCreateButtons() {
		var bitmap = ImageManager.loadSystem('ButtonSet');
		var buttonWidth = 48;
		var buttonHeight = 48;
		this._knsButtonSprites = [];
		var x = 0;
		for (var i = 0; i < 5; i++) {
			var button = new Sprite_Button();
			var w = buttonWidth;
			var handler;
			switch (i){
				case 0: handler = this.cursorPagedown.bind(this); break;
				case 1: handler = this.buttonDown.bind(this); break;
				case 2: handler = this.buttonUp.bind(this); break;
				case 3: handler = this.cursorPageup.bind(this); break;
				case 4:
					handler = this.processOk.bind(this);
					w = buttonWidth * 2;
					break;
			}
			button.setClickHandler(handler);

			button.move(x + 32, 88);
			button.bitmap = bitmap;
			button.setColdFrame(x, 0, w, buttonHeight);
			button.setHotFrame(x, buttonHeight, w, buttonHeight);
			button.visible = false;
			x += w;
			this._knsButtonSprites.push(button);
			this.addChild(button);
		}
	}
	knsShowButtons() {
		this._knsButtonSprites.forEach(function(button){ button.visible = true; }, this);
	};
	knsHideButtons() {
		this._knsButtonSprites.forEach(function(button){ button.visible = false; }, this);
	};
	knsSetItem(item){
		if (this._knsItem !== item){
			this._knsItem = item;
			this.resetNum();
		}
	}

	itemWidth() {  return this.textWidth('0'); };
	itemHeight() { return this.lineHeight(); };
	maxCols() { return this.maxItems(); };
	maxItems() { return String($gameParty.maxItems(this._knsItem)).length; };
	
	drawItem(index) {
		var rect = this.itemRect(index)
		var s = this._num.padZero(this.maxItems());
		this.drawText(s[index], rect.x, rect.y, rect.width);
	};
	refresh() {
		super.refresh();
		this.changeTextColor(this.systemColor());
		this.drawText(KNS_ItemDismantle.param.DismantleNumber, 0, 0, this.contents.width);
		this.drawText("×", 8, this.lineHeight(), this.contents.width);
		this.changeTextColor(this.normalColor());
	};
	itemRect(index) {
		var rect = super.itemRect(index);
		rect.x += 38
		rect.y += this.lineHeight();
		return rect;
	};
	set_mcursor_data(){
		if (PluginManager.parameters('MOG_MenuCursor')) {
			if (!this._refCursorIndex) { this._refCursorIndex = true; this.select(this.index()) };
			var rect = this.itemRect(this.index());
			if (rect.x < 0 || rect.y < 0 || rect.x > (this.width - 48) || rect.y > (this.height - 48)) { return };
			$gameTemp._mcursorData[0] = true;
			$gameTemp._mcursorData[1] = 1;
			$gameTemp._mcursorData[2] = this.x + rect.x - 20;
			$gameTemp._mcursorData[3] = this.y + rect.y + (rect.height / 2);
			this.updateScrollRoll();
		};
	}

	resetNum() {
		this._num = 1;
		this.deselect();
		this.refresh();
	};
	knsSetNumber(n) {
		SoundManager.playCursor();
		this._num = Math.max(Math.min(n, $gameParty.numItems(this._knsItem)), 1);

		var max = this.maxItems();
		for (var i = 0; i < max; i++) { this.redrawItem(i) };
		this.callUpdateHelp();
	};
	cursorDown(wrap) { this.knsSetNumber(this._num - 10 ** (this.maxItems() - this._index - 1)); };
	cursorUp(wrap) {   this.knsSetNumber(this._num + 10 ** (this.maxItems() - this._index - 1)); };
	buttonDown(wrap) { this.cursorDown(false); };
	buttonUp(wrap) {   this.cursorUp(false); };
	cursorPagedown() { this.knsSetNumber(this._num - 10); };
	cursorPageup() {   this.knsSetNumber(this._num + 10); };

	playOkSound() {
		if (!KNS_ItemDismantle.param.DismantleSound){
			return;
		}
		AudioManager.playSe({
			name: KNS_ItemDismantle.param.DismantleSound, volume: 90, pitch: 100, pan: 0
		});
	};
};

//===============================================================
// new Window_DismantleResult
//===============================================================
class Window_DismantleResult extends Window_Selectable{
	initialize(x, y, width, height) {
		super.initialize(x, y, width, height);
		this._handlers = {};
		this._num = 0;
		this.deselect();
		this.openness = 0;
		this.close();
	};
	maxItems() { return 0; };
	knsSetItem(item, num){
		if (this._knsItem !== item || this._num !== num){
			this._knsItem = item;
			this._num = num;
			this.refresh();
		}
	}
	refresh() {
		this.contents.clear();
		if (!this._knsItem){ return; }
		var y = 0;
		this.changeTextColor(this.systemColor());
		this.drawText(KNS_ItemDismantle.param.DismantledItemName, 0, y, this.contents.width);
		this.changeTextColor(this.normalColor());

		y += this.lineHeight();
		this.drawItemName(this._knsItem, 0, y);

		y += this.lineHeight();
		this.changeTextColor(this.systemColor());
		this.drawText(KNS_ItemDismantle.param.ObtainedItemName, 0, y, this.contents.width);

		y += this.lineHeight();
		var wi = this.textWidth('000');
		this.changeTextColor(this.normalColor());
		KNS_ItemDismantle.getDismantleList(this._knsItem).forEach(function (data) {
			this.drawItemName(data[0], 0, y);
			this.drawText(":", 0, y, this.contents.width - wi, 'right');
			this.drawText(data[1] * this._num, 0, y, this.contents.width, 'right');
			y += this.lineHeight();
		}, this)
	};
	onTouch(triggered) { this.processOk(); };
};

//===============================================================
// new Scene_Dismantle
//===============================================================
class Scene_Dismantle extends Scene_MenuBase{
	create() {
		super.create();
		this.createHelpWindow();
		this.createCategoryWindow();
		this.createItemWindow();
		this.createResultListWindow();
		this.createCountWindow();
		this.createResultWindow();

		this._categoryWindow.setItemWindow(this._itemWindow);
		this._countWindow.knsSetResultListWindow(this._resultWindow);
		this._itemWindow.knsSetCountWindow(this._countWindow);
		this._itemWindow.setHelpWindow(this._helpWindow);
	};
	createResultWindow() {
		var rect = KNS_ItemDismantle.param.ResultWindowRect;
		this._resultBaseWindow = new Window_DismantleResult(rect.x, rect.y, rect.width, rect.height);
		this._resultBaseWindow.setHandler('ok', this.onResultDone.bind(this))
		this._resultBaseWindow.setHandler('cancel', this.onResultDone.bind(this))
		this.addWindow(this._resultBaseWindow);
	};
	createCategoryWindow() {
		var rect = KNS_ItemDismantle.param.CategoryWindowRect;
		this._categoryWindow = new Window_ItemCategory();
		this._categoryWindow.move(rect.x, rect.y);
		this._categoryWindow.width  = rect.width;
		this._categoryWindow.height = rect.height;
		this._categoryWindow.refresh();

		this._categoryWindow.setHelpWindow(this._helpWindow);
		this._categoryWindow.setHandler('ok', this.onCategoryOk.bind(this));
		this._categoryWindow.setHandler('cancel', this.popScene.bind(this));
		this.addWindow(this._categoryWindow);
	};
	createItemWindow () {
		var rect = KNS_ItemDismantle.param.ItemListWindowRect;
		this._itemWindow = new Window_DismantleList(rect.x, rect.y, rect.width, rect.height);
		this._itemWindow.setHandler('ok', this.onItemOk.bind(this));
		this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this));
		this.addWindow(this._itemWindow);
	};
	createResultListWindow(){
		var rect = KNS_ItemDismantle.param.DismantleListWindowRect;
		this._resultWindow = new Window_DismantleResultList(rect.x, rect.y, rect.width, rect.height);
		this.addWindow(this._resultWindow);
	}
	createCountWindow(){
		var rect = KNS_ItemDismantle.param.DismantleCountWindowRect;
		this._countWindow = new Window_DismantleCount(rect.x, rect.y, rect.width, rect.height);
		this._countWindow.setHandler('ok', this.onCountOk.bind(this));
		this._countWindow.setHandler('cancel', this.onCountCancel.bind(this));
		this.addWindow(this._countWindow);
	}
	onCategoryOk () {
		this._itemWindow.activate();
		this._itemWindow.selectLast();
	};
	onItemOk() {
		this._countWindow.activate();
		this._countWindow.select(0);
		var item = this._itemWindow.item();
		var text = KNS_ItemDismantle.param.HowManyItems.replace(
			"■", `\\i[${item.iconIndex}]${item.name}`
		);
		this._helpWindow.setText(text)
		this._countWindow.knsShowButtons();
	};
	onItemCancel() {
		this._itemWindow.deselect();
		this._categoryWindow.activate();
	};
	onResultDone() {
		this._countWindow.resetNum();
		this._resultBaseWindow.close();

		this._itemWindow.deselect();
		this._categoryWindow.activate();
	};
	onCountOk () {
		var item = this._itemWindow.item();
		var num = this._countWindow._num;
		$gameParty.loseItem(item, num);
		KNS_ItemDismantle.getDismantleList(item).forEach(function(array){
			$gameParty.gainItem(array[0], array[1] * num);
		});

		this._itemWindow.refresh();
		this._resultBaseWindow.activate();
		this._resultBaseWindow.knsSetItem(item, num);
		this._resultBaseWindow.open();
		this._countWindow.knsHideButtons();
	};
	onCountCancel () {
		this._itemWindow.activate();
		this._countWindow.resetNum();
		this._itemWindow.refresh();
		this._countWindow.knsHideButtons();
	};
};