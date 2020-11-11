//=============================================================================
// KNS_TitleCommand.js
//=============================================================================
/*:
 * @plugindesc [ver.1.0.0]タイトル画面のコマンドウィンドウを改造します。
 * @author 莞爾の草（依頼）
 * 
 * @param b1
 * @text ■コマンド設定
 * 
 * @param commandNumber
 * @desc コマンドの数を指定します。
 * @type Number
 * @default 4
 * 
 * @param comWidthHeight
 * @desc コマンド画像の横・縦幅を指定します。
 * @type Number[]
 * @default ["500","120"]
 * 
 * @param comStartXY
 * @desc コマンドが登場前最初にいるX,Y座標を指定します。
 * @type Number[]
 * @default ["2000","500"]
 * 
 * @param comEndXY
 * @desc コマンドが最終的に到着するX,Y座標を指定します。
 * @type Number[]
 * @default ["1000","500"]
 * 
 * @param comMoveFrames
 * @desc コマンドがcomEndXYに到着するまでの時間をフレーム(1/60秒)で指定します。
 * @type Number
 * @default 90
 * 
 * @param useImage
 * @desc コマンドの画像を用意するか。OFFの場合自動生成されます。
 * @type boolean
 * @default false
 *
 * @param b2
 * @text ■画像を用意しない場合
 * 
 * @param autoFontName
 * @desc コマンドを自動生成する場合に使うフォント名を指定します。
 * @type String
 * @default GameFont
 * 
 * @param autoFontSize
 * @desc コマンドを自動生成する場合のフォントサイズを指定します。
 * @type Number
 * @default 48
 * 
 * @param autoFontItalic
 * @desc コマンドを自動生成する場合斜体で表示するかを指定します。
 * @type boolean
 * @default false
 *
 * @param autoTextColor
 * @desc コマンドを自動生成する場合の文字色を指定します。
 * @type String
 * @default #fff
 *
 * @param autoOutlineColor
 * @desc コマンドを自動生成する場合の文字の縁取り色を指定します。
 * @type String
 * @default #000
 *
 * @param autoOutlineWidth
 * @desc コマンドを自動生成する場合の文字の縁取りの太さを指定します。
 * @type Number
 * @default 2
 *
 * @param autoTextAlign
 * @desc コマンドを自動生成する場合のテキストの表示方法です。
 * @type select
 * 
 * @default center
 * @option 左寄せ
 * @value left
 * @option 中央寄せ
 * @value center
 * @option 右寄せ
 * @value right
 * 
 * @help 
 * タイトル画面のコマンドウィンドウをスプライト化し動きをつけます。
 * 座標等はパラメータで調整できます。
 * 
 * ------------------コマンド画像について------------------
 * コマンドに専用の画像を使う場合はパラメータ「useImage」をONにして、
 * img/title2フォルダにknsComNと名付けた画像を用意してください。
 * （末尾Nは整数、Nは0から始まります）
 * 
 * 例えば、ニューゲームが一番目に表示される場合はknsCom0、
 * コンティニューが二番目にくる場合はknsCom1と名付けてください。
 * 
 * useImageがOFFの場合は自動生成されます。
 * パラメータでフォントサイズなどを調節できます。
 */
/*
* @param comPaddingBottom
* @desc コマンド間の縦幅を指定します。
* @type Number
* @default 188
const comPaddingBottom = Number(params.comPaddingBottom) || 48;
*/

(function () {
const params = PluginManager.parameters('KNS_TitleCommand');
const useImage = params.useImage == 'true';

const autoFontName = String(params.autoFontName) || "GameFont";
const autoFontSize = Number(params.autoFontSize) || 48;
const autoTextAlign = String(params.autoTextAlign) || 'center'
const autoFontItalic = params.autoFontItalic == 'true';
const autoTextColor = String(params.autoTextColor) || "white";
const autoOutlineColor = String(params.autoOutlineColor) || "black";
const autoOutlineWidth = Number(params.autoOutlineWidth);

const comMoveFrames = Number(params.comMoveFrames || 90);
const commandNumber = Number(params.commandNumber ||  4);
const comStartXY     = JSON.parse(params.comStartXY    ).map(num => Number(num)) || [2000, 500];
const comEndXY       = JSON.parse(params.comEndXY      ).map(num => Number(num)) || [1000, 500];
const comWidthHeight = JSON.parse(params.comWidthHeight).map(num => Number(num)) || [500, 120];

// Window_TitleCommand
Window_TitleCommand.prototype.drawItem = function(index) {
}

Window_TitleCommand.prototype.windowWidth = function() {
    return comWidthHeight[0] + 28;
}

Window_TitleCommand.prototype.lineHeight = function() {
    return comWidthHeight[1];
}

// Scene_Title
__knsComName = function (n) { return "knsCom"+n; }

const __systemLoad = Scene_Boot.loadSystemImages;
Scene_Boot.loadSystemImages = function () {
    __systemLoad.apply(this, arguments);
    if (useImage) this._knsLoadImages();
}

Scene_Boot._knsLoadImages = function () {
    for (var i = 0; i < commandNumber; i++) {
        ImageManager.reserveTitle2(__knsComName(i));
    }
}

const __start = Scene_Title.prototype.start;
Scene_Title.prototype.start = function () {
    this.createCommandSprites();
    __start.apply(this, arguments);
}

Scene_Title.prototype.createCommandSprites = function () {
    this._commandWindow.x = comEndXY[0];
    this._commandWindow.y = comEndXY[1];
    this._commandWindow.opacity = 0;

    this._comSprites = [];
    for (var i = 0; i < commandNumber; i++) {
        let sp = new Sprite();
        sp.bitmap = new Bitmap(comWidthHeight[0],comWidthHeight[1]);
        sp.bitmap.paintOpacity = this._commandWindow.isCommandEnabled(i) ? 255: 144;
        if (useImage) {
            const bmp = ImageManager.loadTitle2(__knsComName(i));
            sp.bitmap.blt(
                bmp,0,0,bmp.width,bmp.height,
                0,0,sp.bitmap.width,sp.bitmap.height,
            );
        }else{
            sp.bitmap.fontFace = autoFontName;
            sp.bitmap.fontSize = autoFontSize;

            sp.bitmap.fontItalic   = autoFontItalic;
            sp.bitmap.textColor    = autoTextColor;
            sp.bitmap.outlineColor = autoOutlineColor;
            sp.bitmap.outlineWidth = autoOutlineWidth;
            sp.bitmap.drawText(
                this._commandWindow.commandName(i),0,0,
                sp.bitmap.width,sp.bitmap.height,autoTextAlign
            );
        }

        sp.anchor.x = sp.anchor.y = 0.5;
        let padX = 14 + sp.bitmap.width  * sp.anchor.x;
        let padY = 14 + sp.bitmap.height * sp.anchor.y + comWidthHeight[1] * i;
        sp.x = comStartXY[0] + padX;
        sp.y = comStartXY[1] + padY;
        sp._KNSendX = comEndXY[0] + padX;
        sp._KNSendY = comEndXY[1] + padY;
        sp._KNSopacity = this._commandWindow.isOkEnabled(i);
        sp._sp_index = i * -10;
        sp.bitmap.smooth = true;
        this._comSprites.push(sp);
        this.addChild(sp);
    }
}

const old_command = Scene_Title.prototype.createCommandWindow;
Scene_Title.prototype.createCommandWindow = function() {
    old_command.call(this);
}

Scene_Title.prototype.comTime = function () {
    return comMoveFrames;
}

const __update__ = Scene_Title.prototype.update;
Scene_Title.prototype.update = function() {
    for (let i = 0; i < this._comSprites.length; i++ ) {
        let sp = this._comSprites[i];

        if (this._commandWindow._index == i) {
            if (sp.scale.y <= 1) sp.scale.x = sp.scale.y += 0.03125;
            if (sp.opacity <= 255) sp.opacity += 15;
        }else{
            if (sp.scale.y > 0.8) sp.scale.x = sp.scale.y -= 0.03125;
            if (sp.opacity >= 140) sp.opacity -= 15;
        }
        if (sp._sp_index != this.comTime()) {
            sp._sp_index++;
            if (sp._sp_index > 0) {
                let rate = sp._sp_index / this.comTime();
                sp.x = (sp._KNSendX - sp.x) * rate + sp.x;
                sp.y = (sp._KNSendY - sp.y) * rate + sp.y;
            }
        }
    }
    __update__.apply(this, arguments);
}
})()