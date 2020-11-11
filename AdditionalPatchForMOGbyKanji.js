//=============================================================================
// AdditionalPatchForMOGbyKanji.js
//=============================================================================
/*:
 * 独自の追加パッチです。
 * @author 莞爾の草
 * 
 * @param menuXPos
 * @text ﾒﾆｭｰでｷｬﾗを表示させるX位置
 * @type number[]
 * @desc メニュー画面で表示されるキャラたちのX位置をそれぞれ指定できます。指定しない場合は0。
 * @default ["120","480"]
 * 
 * @help
 * ■利用規約
 * この作品は マテリアル・コモンズ・ブルー・ライセンスの下に提供されています。
 * - https://materialcommons.tk/mtcm-b-summary/
 * クレジット表示：莞爾の草 (仕様作成:ムノクラ fungamemake.com )
 *
 * ライセンス内容を確認の上、ご利用ください。
 */

(function() {
var param = PluginManager.parameters('AdditionalPatchForMOGbyKanji');
param.menuXPositions = eval(param['menuXPos'] || ["120", "480"]);

//★MOG_SceneMenu.js
Scene_Menu.prototype.createGold = function () {}

// MCharStatus
MCharStatus.prototype.createSprites = function() {
    this.createLayoutStatus();
	this.createName();
};	

MCharStatus.prototype.createLayoutStatus = function() {
    this._layout = new Sprite(this._layoutImg);
    this._layout.x = this.posX() - 70 + Moghunter.scMenu_layoutStatusX;
    this._layout.y = Graphics.boxHeight - 280 + Moghunter.scMenu_layoutStatusY;
    this.addChild(this._layout);
};	

function posXatMenu(index) { return parseInt(param.menuXPositions[index]) };
MCharStatus.prototype.posX = function() { return posXatMenu(this._index) };
MBustMenu  .prototype.posX = function() { return posXatMenu(this._index) };

//★MOG_SceneItem.js
Window_ItemCategory.prototype.makeCommandList = function() {
    this.addCommand(TextManager.item,    'item');
};

Window_ItemCategory.prototype.maxCols = function() { return 1 };

Scene_Item.prototype.loadBitmaps = function() {
	this._layImg = (ImageManager.loadMenusitem("Layout"));
	this._layItemImg = (ImageManager.loadMenusitem("ItemLayout"));
	this._comImg = [];
    this._comImg[0] = ImageManager.loadMenusitem("Com_0");
};

Scene_Item.prototype.createButtons = function() {
    this._buttons = [];
    this._buttonsAni = [];
};

Scene_Item.prototype.updateCommands = function() {};
})();