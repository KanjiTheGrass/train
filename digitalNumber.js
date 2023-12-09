 //=============================================================================
// digitalNum.js
//=============================================================================
/*:
 * @plugindesc Replace the timer to an image like a digital watch.
 * @author Kanji the Grass
 *
 * @help Uses "digitalNum.png" in "img/system/" as the dial.
 * The images of the dial must be drawn the same width, and they must be
 * in order, "0123456789:". The Width of one dial is supposed to be integer.
 *
 * @param timerStringLength
 * @desc Specifies the number of characters for the timer. It's for the adjustment for the person puts other plug-in of the timer.
 * @type number
 * @default 5
 *
 * @param timerMarginRight
 * @desc Width of the space from right side of timer screen.
 * @type number
 * @default 8
 *
 * @param timerMarginTop
 * @desc height of the space from top of timer screen.
 * @type number
 * @default 5
 */

/*:ja
 * @plugindesc タイマーの文字をデジタル時計風のものに置換します。
 * @author 莞爾の草
 *
 * @help Graphics/Systemの中のdigitalNum.pngという名前の画像を文字盤として使います。
 * 　文字盤の画像は等角で「0123456789:」という順番で描いてください。
 * 一文字の幅は整数であること以外指定はありません。
 *
 * @param timerStringLength
 * @desc タイマーの文字数を指定します。他にタイマーのプラグインを入れている方の調整用です。
 * @type number
 * @default 5
 *
 * @param timerMarginRight
 * @desc タイマーの画面右からのスペース幅。
 * @type number
 * @default 8
 *
 * @param timerMarginTop
 * @desc タイマーの画面上からのスペースの高さ。
 * @type number
 * @default 5
 */

(function() {
    var parameters   = PluginManager.parameters('digitalNum');
	var timerLength  = parseInt(parameters['timerStringLength'] || 5),
	timerMarginRight = parseInt(parameters['timerMarginRight'] || 8),
	timerMarginTop   = parseInt(parameters['timerMarginTop'] || 5);

	const _loadSystemImages = Scene_Boot.loadSystemImages;
	Scene_Boot.loadSystemImages = function() {
		_loadSystemImages.call(this);
		ImageManager.reserveSystem('digitalNum');
	};
	
	Sprite_Timer.prototype.createBitmap = function() {
		this._timerBitmap = ImageManager.loadSystem('digitalNum');
		this._timerWidth = parseInt(this._timerBitmap.width / 11);
		this.bitmap = new Bitmap(this._timerWidth * timerLength, 48);
	};
	
	Sprite_Timer.prototype.redraw = function() {
		this.bitmap.clear();
		var text = this.timerText();
		var str;
		for (var i = 0; str = text[i]; i++) {
			this.bitmap.blt(this._timerBitmap, this._timerWidth * (str === ':' ? 10 : parseInt(str)), 0, 
			this._timerWidth, this._timerBitmap.height, i * this._timerWidth, 0);
		}
	};
	
	Sprite_Timer.prototype.updatePosition = function() {
		this.x = Graphics.width - this.bitmap.width - timerMarginRight;
		this.y = timerMarginTop;
	};
})();