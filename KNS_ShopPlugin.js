//=============================================================================
// KNS_ShopPlugin.js
//=============================================================================

/*:
 * @plugindesc [v1.0.0] ショップ改造プラグイン
 * @author 莞爾の草
 *
 * @param ShopperVariableId
 * @text 店員の顔変数ID
 * @default 1
 * @min 1
 * @type number
 * @desc ショップ画面に表示する店員の顔のファイル名を格納する変数IDです。
 *
 * @param ShopperWidth
 * @text 店員画像の横幅
 * @min 0
 * @type number
 * @default 500
 * @desc ショップ画面の右側に表示するキャラの横幅です。ウィンドウの幅に反映されます。
 *
 * @help
 * プラグインコマンドで画像を指定します。
 * 使う画像はimg/picturesの中に入れてください。ファイル名に半角スペースは使えません。
 * KNS_SHOP ファイル名
 * 
 * その後にイベントコマンドでショップ画面を表示すると
 * 指定の画像が表示されます。
 */


(function() {
var pluginParams = PluginManager.parameters('KNS_ShopPlugin');
pluginParams.shopperVariableId = Number(pluginParams['ShopperVariableId'] || 1);
pluginParams.shopperWidth      = Number(pluginParams["ShopperWidth"] || 500);

//===============================================================
// Game_Interpreter
//===============================================================
const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    if (command === 'KNS_SHOP') {
        $gameVariables.setValue(pluginParams.shopperVariableId, args[0]);
    }
};

//===============================================================
// Window_ShopGold
//===============================================================
function Window_ShopGold() {
    this.initialize.apply(this, arguments);
}

Window_ShopGold.prototype = Object.create(Window_Gold.prototype);
Window_ShopGold.prototype.constructor = Window_ShopGold;

Window_ShopGold.prototype.windowWidth = function() {
    return 400;
};

Window_ShopGold.prototype.windowHeight = function() {
    return this.fittingHeight(1.15);
};

Window_ShopGold.prototype.lineHeight = function() {
    return 72;
};

//===============================================================
// Window_ShopItemCategory
//===============================================================
function Window_ShopItemCategory() {
    this.initialize.apply(this, arguments);
}

Window_ShopItemCategory.prototype = Object.create(Window_ItemCategory.prototype);
Window_ShopItemCategory.prototype.constructor = Window_ShopItemCategory;

Window_ShopItemCategory.prototype.windowWidth = function() {
    return Graphics.boxWidth - pluginParams.shopperWidth;
};



//===============================================================
// Window_ShopCommand
//===============================================================
Window_ShopCommand.prototype.lineHeight = function() {
    return 72;
};

Window_ShopCommand.prototype.numVisibleRows = function() {
    return 1.15;
};

//===============================================================
// Window_ShopBuy
//===============================================================
Window_ShopBuy.prototype.windowWidth = function() {
    return Graphics.boxWidth - pluginParams.shopperWidth;
};

var y_Window_ShopBuy = 543;
Window_ShopBuy.prototype.initialize = function(x, y, height, shopGoods) {
    x = 0;
    y = y;
    width = Graphics.boxWidth - pluginParams.shopperWidth;
    height = y_Window_ShopBuy;
    var width = this.windowWidth();
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this._shopGoods = shopGoods;
    this._money = 0;
    this.refresh();
    this.select(0);
};

//===============================================================
// Window_ShopNumber
//===============================================================
Window_ShopNumber.prototype.windowWidth = function() {
    return Graphics.boxWidth - pluginParams.shopperWidth;
};

Window_ShopNumber.prototype.initialize = function(x, y, height) {
    var width = this.windowWidth();
    height = y_Window_ShopBuy;
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this._item = null;
    this._max = 1;
    this._price = 0;
    this._number = 1;
    this._currencyUnit = TextManager.currencyUnit;
    this.createButtons();
};


//===============================================================
// Window_ShopStatus
//===============================================================
Window_ShopStatus.prototype.initialize = function(x, y, width, height) {
    width = Graphics.boxWidth - pluginParams.shopperWidth;
    height = 310;
    x = 0;
    y += y_Window_ShopBuy;
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this._item = null;
    this._pageIndex = 0;
    this.refresh();
};

Window_ShopStatus.prototype.drawEquipInfo = function(x, y) {
    var members = this.statusMembers();
    var col = 2;
    var width = (this.contents.width + this.textPadding()) / col;
    var height = this.lineHeight() * 2.4;
    x += 10;

    for (var i = 0; i < members.length; i++) {
        this.drawActorEquipInfo(x + width * (i % col), 
        y + height * parseInt(i / col), members[i]);
    }
};

Window_ShopStatus.prototype.drawActorParamChange = function(x, y, actor, item1) {
    var width = (this.contents.width) / 2 - this.textPadding() * 6;
    var paramId = this.paramId();
    var change = this._item.params[paramId] - (item1 ? item1.params[paramId] : 0);
    this.changeTextColor(this.paramchangeTextColor(change));
    this.drawText((change > 0 ? '+' : '') + change, x, y, width, 'right');
};



//===============================================================
// Scene_Shop
//===============================================================
const _create = Scene_Shop.prototype.create;
Scene_Shop.prototype.create = function() {
    _create.apply(this, arguments);
    this.createShopperSprite();
};

Scene_Shop.prototype.createShopperSprite = function () {
    const name = $gameVariables.value(pluginParams.shopperVariableId);
    if (typeof name == "string") {
        this._shopperSprite = new Sprite(ImageManager.loadPicture(name));
        this._shopperSprite.x = Graphics.boxWidth - pluginParams.shopperWidth / 2;
        this._shopperSprite.y = Graphics.boxHeight;
        this._shopperSprite.anchor.x = 0.5;
        this._shopperSprite.anchor.y = 1;
        this.addChild(this._shopperSprite);
    }
}

const _createHelpWindow = Scene_Shop.prototype.createHelpWindow;
Scene_Shop.prototype.createHelpWindow = function () {
    _createHelpWindow.apply(this, arguments);
    this._helpWindow.y = Graphics.height - this._helpWindow.height;
    this._helpWindow.width = Graphics.width - pluginParams.shopperWidth;
};


Scene_Shop.prototype.createGoldWindow = function() {
    this._goldWindow = new Window_ShopGold(0, 0);
    this._goldWindow.x = Graphics.boxWidth - this._goldWindow.width;
    this.addWindow(this._goldWindow);
};

Scene_Shop.prototype.createSellWindow = function() {
    var wy = this._categoryWindow.y + this._categoryWindow.height;
    var wh = Graphics.boxHeight - wy - this._helpWindow.height;
    var ww = Graphics.boxWidth-pluginParams.shopperWidth;
    this._sellWindow = new Window_ShopSell(0, wy, ww, wh);
    this._sellWindow.setHelpWindow(this._helpWindow);
    this._sellWindow.hide();
    this._sellWindow.setHandler('ok',     this.onSellOk.bind(this));
    this._sellWindow.setHandler('cancel', this.onSellCancel.bind(this));
    this._categoryWindow.setItemWindow(this._sellWindow);
    this.addWindow(this._sellWindow);
};

Scene_Shop.prototype.createCategoryWindow = function() {
    this._categoryWindow = new Window_ShopItemCategory();
    this._categoryWindow.setHelpWindow(this._helpWindow);
    this._categoryWindow.y = this._dummyWindow.y;
    this._categoryWindow.hide();
    this._categoryWindow.deactivate();
    this._categoryWindow.setHandler('ok',     this.onCategoryOk.bind(this));
    this._categoryWindow.setHandler('cancel', this.onCategoryCancel.bind(this));
    this.addWindow(this._categoryWindow);
};


const _createCommandWindow = Scene_Shop.prototype.createCommandWindow;
Scene_Shop.prototype.createCommandWindow = function() {
    _createCommandWindow.apply(this, arguments);
    this._commandWindow.y = 0;
};

const _createDummyWindow = Scene_Shop.prototype.createDummyWindow;
Scene_Shop.prototype.createDummyWindow = function() {
    _createDummyWindow.apply(this, arguments);
    this._dummyWindow.hide();
};

const _onBuyCancel = Scene_Shop.prototype.onBuyCancel;
Scene_Shop.prototype.onBuyCancel = function() {
    _onBuyCancel.apply(this, arguments);
    this._dummyWindow.hide();
};

const _onCategoryCancel = Scene_Shop.prototype.onCategoryCancel;
Scene_Shop.prototype.onCategoryCancel = function() {
    _onCategoryCancel.apply(this, arguments);
    this._dummyWindow.hide();
};

})();