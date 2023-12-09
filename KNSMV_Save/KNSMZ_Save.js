//=============================================================================
// KNSMZ_Save.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc ver.1.0.2 Add screenshots on Save/Load scene.
 * @author Kanji the Grass
 * @url https://kanjinokusargss3.hatenablog.com/
 * 
 * @param MaxSaveFile
 * @text Number of save files
 * @type number
 * @min 1
 * @default 25
 * @desc This number includes auto save
 * 
 * @param InfoHorzLineColor
 * @text Border color on info window
 * @type string
 * @default gray
 * 
 * @param Vocab
 * @text About Terms
 * 
 * @param VocabPrice
 * @type string
 * @parent Vocab
 * @text Money of the party
 * @default Money
 * 
 * @param VocabPlace
 * @type string
 * @parent Vocab
 * @text Current location
 * @default Location
 * 
 * @param Screenshot
 * @text About Screenshot
 * 
 * @param ImageSize
 * @text Image size for display
 * @desc Images of save file will be expanded to this size.
 * @type struct<Surface>
 * @parent Screenshot
 * @default {"width":"280","height":"220"}
 * 
 * @param ImagePivot
 * @text Pivot of images
 * @type struct<Point>
 * @parent Screenshot
 * @default {"x":"408","y":"224"}
 * 
 * @param RadiusSize
 * @text Moving Radius of images
 * @type struct<Surface>
 * @parent Screenshot
 * @default {"width":"560","height":"80"}
 * 
 * @param ImageBorderColor
 * @text Border color of images
 * @type string
 * @parent Screenshot
 * @default black
 * 
 * @param ArrowImage
 * @parent Screenshot
 * @text Arrow HUD
 * @type file
 * @dir img/system
 * @default KnsSave_HUD
 * 
 * @param ImageExists
 * @parent Screenshot
 * @text Image when file exists
 * @type file
 * @dir img/system
 * @default KnsSave_HasData
 * @desc Used when file exists but screenshot does not.
 * 
 * @param NoImageExists
 * @parent Screenshot
 * @text Image when file doesn't exist
 * @type file
 * @dir img/system
 * @default KnsSave_NoData
 * @desc Used when file does not exist.
 * 
 * @param UseScreenshot
 * @parent Screenshot
 * @text Use screenshot?
 * @type boolean
 * @default true
 * 
 * @param WhenUseImage
 * @text when use screenshot
 * @parent Screenshot
 * 
 * @param ImageSaveSize
 * @text Actual Size of Screenshot
 * @desc Screenshots will be saved in this size, and expanded when displayed.
 * @type struct<Surface>
 * @parent WhenUseImage
 * @default {"width":"128","height":"96"}
 * 
 * @param ImageType
 * @parent WhenUseImage
 * @text Image extension(PNG/JPEG)
 * @type select
 * @default jpeg
 * 
 * @option .PNG
 * @value png
 * 
 * @option .JPEG
 * @value jpeg
 * 
 * @param JpegQuality
 * @parent WhenUseImage
 * @text JPEG Quality(1-100)
 * @desc When saved in JPEG format, the lower this value, the lower the image quality and the size.
 * @type number
 * @default 50
 * @min 1
 * @max 100
 * 
 * @param SetMonochrome
 * @parent WhenUseImage
 * @text Set Monochrome?
 * @desc Setting monochrome makes the size reduced, but this is not so effective.
 * @type boolean
 * @default false
 * 
 * @param Windows
 * @text About Windows
 * 
 * @param HelpWindow
 * @parent Windows
 * @type struct<Window>
 * @default {"point":"{\"x\":\"0\",\"y\":\"0\"}","surface":"{\"width\":\"660\",\"height\":\"72\"}","windowType":"0"}
 * 
 * @param InfoWindow
 * @parent Windows
 * @type struct<Window>
 * @default {"point":"{\"x\":\"0\",\"y\":\"432\"}","surface":"{\"width\":\"816\",\"height\":\"192\"}","windowType":"0"}
 * 
 * @help
 * This plug-in is published under MTCM Blue Licence.
 * https://en.materialcommons.org/mtcm-b-summary
 * 
 * * Two images provided as sample named KnsSave_HasData and
 *  KnsSave_NoData includes a font 'Anton', and it was published
 *  under 'Open Font License'.
 *   If you'd like to use them without editting, 
 *  please check articles of the licence below.
 * https://fonts.google.com/specimen/Anton
 * 
 * *Change Log
 * ver.1.0.0(2022/02/19)
 * - Published
 * 
 * ver.1.0.1(2022/02/20)
 * - Fixed a miss specifying of JPEG Quality.
 * - Added an English description.
 * 
 * ver.1.0.2(2022/02/20)
 * - Optimized the code.
 * - Changed the display order of windows and sprites(Z-axis).
 */
/*~struct~Window:
 * @param point
 * @text Point
 * @type struct<Point>
 * 
 * @param surface
 * @text Size
 * @type struct<Surface>
 * 
 * @param windowType
 * @text Background type
 * @type select
 * @default 1
 * 
 * @option Window
 * @value 0
 * @option Dark
 * @value 1
 * @option Transparent
 * @value 2
 */
/*~struct~Point:
 * @param x
 * @text X-axis
 * @type number
 * @default 0
 * 
 * @param y
 * @text Y-axis
 * @type number
 * @default 0
 */
/*~struct~Surface:
 * @param width
 * @text Width
 * @type number
 * @default 1
 * @min 1
 * 
 * @param height
 * @text Height
 * @type number
 * @default 1
 * @min 1
 */

/*:ja
 * @target MZ
 * @plugindesc ver.1.0.2 セーブ/ロード画面にスクリーンショットを追加します。
 * @author 莞爾の草
 * @url https://kanjinokusargss3.hatenablog.com/
 * 
 * @param MaxSaveFile
 * @text セーブファイル最大数
 * @type number
 * @min 1
 * @default 25
 * @desc オートセーブ分も含まれます。
 * 
 * @param InfoHorzLineColor
 * @text セーブ詳細ウィンドウ横線の色
 * @type string
 * @default gray
 * 
 * @param Vocab
 * @text 用語集
 * 
 * @param VocabPrice
 * @type string
 * @parent Vocab
 * @text 所持金
 * @default 所持金
 * 
 * @param VocabPlace
 * @type string
 * @parent Vocab
 * @text 現在地
 * @default 現在地
 * 
 * @param Screenshot
 * @text スクショ関連
 * 
 * @param ImageSize
 * @text 画像表示サイズ
 * @desc セーブイメージを表示する際使用する画像のサイズをこのサイズに補正します。
 * @type struct<Surface>
 * @parent Screenshot
 * @default {"width":"280","height":"220"}
 * 
 * @param ImagePivot
 * @text 画像の円運動中心
 * @type struct<Point>
 * @parent Screenshot
 * @default {"x":"408","y":"224"}
 * 
 * @param RadiusSize
 * @text 画像の円運動サイズ
 * @type struct<Surface>
 * @parent Screenshot
 * @default {"width":"560","height":"80"}
 * 
 * @param ImageBorderColor
 * @text 画像の縁取り色
 * @type string
 * @parent Screenshot
 * @default black
 * 
 * @param ArrowImage
 * @parent Screenshot
 * @text 矢印画像
 * @type file
 * @dir img/system
 * @default KnsSave_HUD
 * 
 * @param ImageExists
 * @parent Screenshot
 * @text データがある場合の画像
 * @type file
 * @dir img/system
 * @default KnsSave_HasData
 * @desc セーブファイルは存在してもスクショがない場合に使われます。
 * 
 * @param NoImageExists
 * @parent Screenshot
 * @text データがない場合の画像
 * @type file
 * @dir img/system
 * @default KnsSave_NoData
 * @desc セーブファイルが存在しないときスクショの代わりに使われます。
 * 
 * @param UseScreenshot
 * @parent Screenshot
 * @text スクショを保存するか
 * @type boolean
 * @default true
 * 
 * @param WhenUseImage
 * @text スクショを保存する場合の設定
 * @parent Screenshot
 * 
 * @param ImageSaveSize
 * @text スクショ実寸サイズ
 * @desc セーブデータ上に保存するスクショのサイズです。表示する際は「画像表示サイズ」まで拡大縮小されます。
 * @type struct<Surface>
 * @parent WhenUseImage
 * @default {"width":"128","height":"96"}
 * 
 * @param ImageType
 * @parent WhenUseImage
 * @text 画像拡張子(PNG/JPEG)
 * @type select
 * @default jpeg
 * 
 * @option .PNG
 * @value png
 * 
 * @option .JPEG
 * @value jpeg
 * 
 * @param JpegQuality
 * @parent WhenUseImage
 * @text JPEG圧縮率(1-100)
 * @desc JPEG形式で保存したとき、この値が低いほど画質が下がり容量が軽くなります。
 * @type number
 * @default 50
 * @min 1
 * @max 100
 * 
 * @param SetMonochrome
 * @parent WhenUseImage
 * @text スクショをモノクロに
 * @desc モノクロにすることで容量軽量化を図ります。効果は薄いです。
 * @type boolean
 * @default false
 * 
 * @param Windows
 * @text ウィンドウ関連
 * 
 * @param HelpWindow
 * @parent Windows
 * @type struct<Window>
 * @default {"point":"{\"x\":\"0\",\"y\":\"0\"}","surface":"{\"width\":\"660\",\"height\":\"72\"}","windowType":"0"}
 * 
 * @param InfoWindow
 * @parent Windows
 * @type struct<Window>
 * @default {"point":"{\"x\":\"0\",\"y\":\"432\"}","surface":"{\"width\":\"816\",\"height\":\"192\"}","windowType":"0"}
 * 
 * @help
 * このプラグインはマテコモ青ライセンスの下で提供されます。
 * 利用規約はこちら。
 * https://kanjinokusargss3.hatenablog.com/entry/2020/08/12/184854
 * 
 * セーブ時に保存されたスクリーンショットの画像が
 * セーブ画面でぐるぐる回ります。
 * 
 * アツマールなどのセーブファイルの容量が限られている環境では
 * スクリーンショットの画質をできるだけ落とすことをお勧めします。
 * 
 * ※サンプルで提供されているKnsSave_HasData.png、KnsSave_NoData.pngには
 * 　Open Font Licenseで提供されたフォント『Anton』が使用されています。
 * 　それらの画像を改変しないでそのまま使う場合はそちらをご一読ください。
 * フォント公開ページ：https://fonts.google.com/specimen/Anton
 * 
 * 【更新履歴】
 * ver.1.0.0(2022/02/19)
 * - 公開
 * ver.1.0.1(2022/02/20)
 * - JPEG圧縮率の指定方法が間違っていたため修正。
 * - 英文の説明を追加。
 * ver.1.0.2(2022/02/20)
 * - コードを最適化。
 * - ウィンドウ、スプライトの表示順位(いわゆるZ軸)を変更。
 */
/*~struct~Window:ja
 * @param point
 * @text 座標
 * @type struct<Point>
 * 
 * @param surface
 * @text サイズ
 * @type struct<Surface>
 * 
 * @param windowType
 * @text ウィンドウ背景
 * @type select
 * @default 1
 * 
 * @option ウィンドウ
 * @value 0
 * @option 暗くする
 * @value 1
 * @option 透明
 * @value 2
 */
/*~struct~Point:ja
 * @param x
 * @text X座標
 * @type number
 * @default 0
 * 
 * @param y
 * @text Y座標
 * @type number
 * @default 0
 */
/*~struct~Surface:ja
 * @param width
 * @text 横幅
 * @desc 横幅を数値で指定します
 * @type number
 * @default 1
 * @min 1
 * 
 * @param height
 * @text 縦幅
 * @desc 縦幅を数値で指定します
 * @type number
 * @default 1
 * @min 1
 */

const KNSMZ_Save = {};
(function() {
'use strict';
const param = PluginManager.parameters('KNSMZ_Save');
KNSMZ_Save.MaxSaveFile = Number(param.MaxSaveFile || 25);

KNSMZ_Save.VocabPrice = String(param.VocabPrice);
KNSMZ_Save.VocabPlace = String(param.VocabPlace);

KNSMZ_Save.ImagePivot = JsonEx.parse(param.ImagePivot) || {};
KNSMZ_Save.ImageSize = JsonEx.parse(param.ImageSize) || {};
KNSMZ_Save.ImageSaveSize = JsonEx.parse(param.ImageSaveSize) || {};
KNSMZ_Save.RadiusSize = JsonEx.parse(param.RadiusSize) || {};

KNSMZ_Save.UseScreenshot = param.UseScreenshot === 'true';
// ss settings
KNSMZ_Save.ImageType = String(param.ImageType);
KNSMZ_Save.JpegQuality = Number(param.JpegQuality || 1) / 100;
KNSMZ_Save.SetMonochrome = param.SetMonochrome === 'true';
// img
KNSMZ_Save.ImageExists = String(param.ImageExists);
KNSMZ_Save.NoImageExists = String(param.NoImageExists);
KNSMZ_Save.ArrowImage = String(param.ArrowImage);

KNSMZ_Save.ImageBorderColor = String(param.ImageBorderColor);
KNSMZ_Save.InfoHorzLineColor = String(param.InfoHorzLineColor);

KNSMZ_Save.parseWindow = function(json){
	const obj = JsonEx.parse(json) || {};
	const point = JsonEx.parse(obj.point) || {};
	const surface = JsonEx.parse(obj.surface) || {};
	obj.rect = new Rectangle(
		Number(point.x || 0), Number(point.y || 0), 
		Number(surface.width || 0), Number(surface.height || 0)
	);
	obj.windowType = Number(obj.windowType || '0');
	return obj;
}
KNSMZ_Save.HelpWindow = KNSMZ_Save.parseWindow(param.HelpWindow);
KNSMZ_Save.InfoWindow = KNSMZ_Save.parseWindow(param.InfoWindow);


//======================================================
// alias DataManager
//======================================================
DataManager.maxSavefiles = function(){ return KNSMZ_Save.MaxSaveFile; };

const _makeSavefileInfo = DataManager.makeSavefileInfo;
DataManager.makeSavefileInfo = function() {
	const info	= _makeSavefileInfo.apply(this, arguments);
	const bitmap = this.makeScreenshot();
	if (bitmap){
		info.snapUrl = bitmap._canvas.toDataURL('image/' + KNSMZ_Save.ImageType, KNSMZ_Save.JpegQuality);
	}
	info.gold	= $gameParty.gold();
	info.place	= $dataMap ? $dataMap.displayName : '';
	return info;
};

DataManager.makeScreenshot = function(){
	const oldBmp = SceneManager.backgroundBitmap();
	if (!oldBmp || KNSMZ_Save.UseScreenshot === false){
		return null;
	}
	let width  = Number(KNSMZ_Save.ImageSaveSize.width || 0);
	let height = Number(KNSMZ_Save.ImageSaveSize.height || 0);

	const newBmp = new Bitmap(width, height);
	newBmp.blt(oldBmp, 0, 0, oldBmp.width, oldBmp.height, 0, 0, width, height);
	if (KNSMZ_Save.SetMonochrome === true){
		newBmp._context.save();
		newBmp._context.globalCompositeOperation = 'color';
		newBmp._context.fillStyle = 'black';
		newBmp._context.fillRect(0, 0, width, height);
		newBmp._context.restore();
	}
	return newBmp;
};

//======================================================
// new Sprite_ScreenShot
//======================================================
class Sprite_ScreenShot extends Sprite{
	loadSS(noData, hasData) {
		if (!this._loadedImg){
			if (this._globalInfo){
				this._loadedImg = hasData;
				if (this._globalInfo.snapUrl){
					try{
						this._loadedImg = ImageManager.loadBitmapFromUrl(
							this._globalInfo.snapUrl);
					}catch (e){
						console.log(e);
					}
				}
			}
			if (!this._loadedImg){
				this._loadedImg = noData;
			}
		}
		return this._loadedImg;
	}
	_knsZIndex(){ return this._knsMoveInfo.ty; }
	fileTitle(){
		if (this._id === 0) {
			return TextManager.autosave;
		} else {
			return TextManager.file + " " + this._id;
		}
	}
	constructor(id, calced, noData, hasData) {
		super(new Bitmap(
			Number(KNSMZ_Save.ImageSize.width || 0) + 2,
			Number(KNSMZ_Save.ImageSize.height || 0) + 2
		));
		this._id = id;
		this._globalInfo = DataManager.savefileInfo(this._id);
		this._moveList = calced;
		this.moveCount = this._moveList.length;

		this.anchor.x = this.anchor.y = 0.5;
		this.scale.x = this.scale.y = 0;
		this.bitmap.fillAll(KNSMZ_Save.ImageBorderColor);
		this.loadSS(noData, hasData);
	}
	_knsMoveTo(rate){
		this.moveCount = 0;
		const thF = Math.cos(rate);
		this._knsMoveInfo = {
			ox: this.x,
			oy: this.y,
			tx: Number(KNSMZ_Save.RadiusSize.width || 0) * Math.sin(rate),
			ty: Number(KNSMZ_Save.RadiusSize.height || 0) * thF,
			oldScale: this.scale.x,
			newScale: Math.max(Math.min(thF * 1.25, 1), 0.625)
		}
		this._knsMoveInfo.padX = this._knsMoveInfo.tx - this._knsMoveInfo.ox;
		this._knsMoveInfo.padY = this._knsMoveInfo.ty - this._knsMoveInfo.oy;
		this._knsMoveInfo.padScale = this._knsMoveInfo.newScale - this._knsMoveInfo.oldScale;
		this.opacity = Math.max(255 * thF, -20) + 90;
	}
	update() {
		super.update();
		if (this.moveCount < this._moveList.length) {
			const rate = this._moveList[this.moveCount++];
			this.x = this._knsMoveInfo.padX * rate + this._knsMoveInfo.ox;
			this.y = this._knsMoveInfo.padY * rate + this._knsMoveInfo.oy;
			this.scale.x = this.scale.y = 
			this._knsMoveInfo.padScale * rate + this._knsMoveInfo.oldScale;
		}
	}
	refresh() {
		const bmp = this.loadSS();
		this.bitmap.blt(bmp, 0, 0, bmp.width, bmp.height,
			1, 1, this.bitmap.width - 2, this.bitmap.height - 2);
		this.drawNumber();
	}
	drawNumber(){
		let h = 28;
		this.bitmap.fontSize = 25;
		this.bitmap.fontFace = $gameSystem.mainFontFace();
		this.bitmap.drawText(this.fileTitle(), 4, 2, this.bitmap.width, h);
		if (!this._globalInfo) return;
		// プレイ時間の描画
		if (this._globalInfo.playtime) {
			this.bitmap.drawText(
				this._globalInfo.playtime, 0, this.bitmap.height - h,
				this.bitmap.width, h, "right"
			);
		}
	}
}

//======================================================
// new Spriteset_File
//======================================================
class Spriteset_File extends Sprite{
	// create
	constructor(listWindow, infoWindow){
		super();
		this._infoWindow = infoWindow;
		this._listWindow = listWindow;
		this._lastIndex = this._listWindow.index();
		this.x = Number(KNSMZ_Save.ImagePivot.x || 0);
		this.y = Number(KNSMZ_Save.ImagePivot.y || 0);
		this.createFiles();
	}
	createFiles(){
		// move
		const calced = new Array(8);
		for (let i = 0; i < calced.length; i++) calced[i] = (i + 1) / calced.length;
		// img
		const hasData = ImageManager.loadSystem(KNSMZ_Save.ImageExists);
		const noData = ImageManager.loadSystem(KNSMZ_Save.NoImageExists);

		this.sortedChildren = new Array(this._listWindow.maxItems());
		for (let i = 0; i < this.sortedChildren.length; i++){
			this.sortedChildren[i] = new Sprite_ScreenShot(
				this._listWindow.indexToSavefileId(i), calced, noData, hasData);
		};
		this.addChild(...this.sortedChildren);
	}
	// update
	refreshInfoWindow(){
		this._infoWindow.refresh(this.sortedChildren[this._listWindow.index()]);
	}
	update(){
		super.update();
		this.updateTouchInput();
		const index = this._listWindow.index();
		if (this._lastIndex != index){
			this._lastIndex = index;
			SoundManager.playCursor();
			this.updatePosition();
			this.refreshInfoWindow();
		}
	}
	updateTouchInput(){
		if (this._listWindow.active && TouchInput.isRepeated()){
			if (TouchInput.y < 64){
				// not to fire cancel button of touch ui simultaneously
				return;
			}
			const tx = TouchInput.x - this.x;
			const sp = this.sortedChildren[this._listWindow.index()];
			const w  = 0.5 * sp.width;
			if (sp.x > tx + w) {
				this._listWindow.cursorUp();
			}else if (sp.x + w < tx) {
				this._listWindow.cursorDown();
			}else{
				const ty = TouchInput.y - this.y;
				const h = 0.5 * sp.height;
				if (ty < sp.y + h && ty + h > sp.y) {
					this._listWindow.processOk();
				}
			}
		}
	}
	updatePosition() {
		// set z-axis
		const math = Math.PI / this.sortedChildren.length * 2;
		let index = this._listWindow.index();
		this.sortedChildren.forEach(function(sp, i){ sp._knsMoveTo(math * (i - index)); });
		this.removeChildren();
		this.addChild(...Array.from(this.sortedChildren).sort(function(a, b){
			return a._knsZIndex() - b._knsZIndex();
		}));
	}
	__start(){
		this.sortedChildren.forEach(sp => sp.refresh());
		this.refreshInfoWindow();
		this.updatePosition();
	}
	__terminate(){
		this.sortedChildren.forEach(sp => sp.destroy());
		this.destroy();
	}
}

//======================================================
// new Window_SSStatus
//======================================================
class Window_SSStatus extends Window_Base{
	refresh(sp){
		this.contents.clear();
		if (!sp){
			return;
		}
		this.resetFontSettings();
		this.contents.fillRect(0,34,this.contents.width, 2, KNSMZ_Save.InfoHorzLineColor)
		this.drawText(sp.fileTitle(), 0, 0, 200);
		const info = sp._globalInfo;
		if (!info) return;
		if (info.playtime){
			this.drawText(info.playtime, 0, 0, this.contents.width, "right");
		}
		let x = 0, y = 40, w = 124;
		if (info.faces) {
			info.faces.forEach(function(actor){
				this.drawFace(actor[0], actor[1], x, y, w);
				x += w + 2;
			}, this);
		}
		w = 270;
		x = this.contents.width - w;
		this.drawSubInfo(x, 40, w, KNSMZ_Save.VocabPrice, info.gold, TextManager.currencyUnit);
		this.drawSubInfo(x, 100, w, KNSMZ_Save.VocabPlace, info.place, null);
	}
	drawSubInfo(x, y, w, title, text, unit){
		if (text == undefined) return;
		this.changeTextColor(ColorManager.systemColor());
		this.drawText(title, x, y, w);
		y += 24;
		if (unit){
			let unitWidth = this.textWidth(unit);
			this.drawText(unit, x + w - unitWidth, y, w);
			w -= unitWidth;
		}
		this.changeTextColor(ColorManager.normalColor());
		this.drawText(text, x, y, w, "right");
	}
}

//======================================================
// alias Scene_File
//======================================================
// create
const _Scene_File_create = Scene_File.prototype.create;
Scene_File.prototype.create = function() {
	_Scene_File_create.apply(this, arguments);
	this.knsCreateFileDataWindow();
	this.knsCreateScreenShots();
	this.knsCreateFileTouchSprite();
	this._listWindow.y = Graphics.height;
}

Scene_File.prototype.helpWindowRect = function(){ return KNSMZ_Save.HelpWindow.rect; };
const _Scene_File_createHelpWindow = Scene_File.prototype.createHelpWindow;
Scene_File.prototype.createHelpWindow = function(){
	_Scene_File_createHelpWindow.apply(this, arguments);
	this._helpWindow.setBackgroundType(KNSMZ_Save.HelpWindow.windowType)
};
Scene_File.prototype.knsCreateFileDataWindow = function (){
	this._infoWindow = new Window_SSStatus(KNSMZ_Save.InfoWindow.rect);
	this._infoWindow.setBackgroundType(KNSMZ_Save.InfoWindow.windowType)
	this.addWindow(this._infoWindow);
}
Scene_File.prototype.knsCreateScreenShots = function () {
	this._spriteset = new Spriteset_File(this._listWindow, this._infoWindow);
	this.addChildAt(this._spriteset, this.children.indexOf(this._backgroundSprite) + 1);
}
Scene_File.prototype.knsCreateFileTouchSprite = function () {
	const img = KNSMZ_Save.ArrowImage;
	this._fileTouchSprite = new Sprite(img && ImageManager.loadSystem(img));
	this.addChildAt(this._fileTouchSprite, this.children.indexOf(this._spriteset) + 1);
}
// main
const _Scene_File_start = Scene_File.prototype.start;
Scene_File.prototype.start = function () {
	_Scene_File_start.apply(this, arguments);
	this._spriteset.__start();
}
const _Scene_File_terminate = Scene_File.prototype.terminate;
Scene_File.prototype.terminate = function () {
	_Scene_File_terminate.apply(this, arguments);
	this._spriteset.__terminate();
}

//======================================================
// alias Window_SavefileList
//======================================================
Window_SavefileList.prototype.refresh = function(){};
Window_SavefileList.prototype.cursorDown = function(wrap){
	Window_Selectable.prototype.cursorDown.call(this, true);
};
Window_SavefileList.prototype.cursorUp = function(wrap){
	Window_Selectable.prototype.cursorUp.call(this, true);
};
Window_SavefileList.prototype.cursorRight = function(wrap){
	this.cursorDown(true);
};
Window_SavefileList.prototype.cursorLeft = function(wrap){
	this.cursorUp(true);
};
})();