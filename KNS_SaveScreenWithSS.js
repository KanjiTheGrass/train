//=============================================================================
// KNS_SaveScreenWithSS.js
// original: KMS_SaveWithSnap.js
//   Last update: 2020/6/21
//=============================================================================

/*:
 * @plugindesc [v1.0.1] このプラグインはKMS_SaveWithSnap.jsの下に置いてください。
 * @author 莞爾の草（改造元：TOMY （Kamesoft））
 *
 * @param ImageCircleCenterX
 * @text スクショ画像円運動の原点X
 * @default 408
 * @type number
 * @desc スクショ画像らの円運動の横原点です。
 *
 * @param ImageCircleCenterY
 * @text スクショ画像円運動の原点Y
 * @default 224
 * @type number
 * @desc スクショ画像らの円運動の高さ原点です。
 *
 * @param ImageHorizontalRadius
 * @text スクショ画像の横半径
 * @default 400
 * @type number
 * @desc セーブ時のスクショの円運動に使う横の半径です。
 *
 * @param ImageHorizontalRadius
 * @text スクショ画像の横半径
 * @default 370
 * @type number
 * @desc セーブ時のスクショの円運動に使う横の半径です。
 *
 * @param ImageVerticalRadius
 * @text スクショ画像の縦半径
 * @default 80
 * @type number
 * @desc セーブ時のスクショの円運動に使う縦の半径です。
 *
 * @param ImageWidth
 * @text スクショ画像の幅
 * @default 280
 * @type number
 * @desc スクショの幅です。KMSのImage scaleを拡大してこの大きさで表示します。
 *
 * @param ImageHeight
 * @text スクショ画像の高さ
 * @default 220
 * @type number
 * @desc スクショの高さです。KMSのImage scaleを拡大してこの大きさで表示します。
 *
 * @param SaveFileSize
 * @text 最大セーブファイル数
 * @type number
 * @default 20
 * @min 1
 * @desc セーブファイルの数です。２０以上にすると環境によって処理落ちすることがあります。
 *
 * @param NoDataPicture
 * @text NoDataに画像を指定
 * @type file
 * @dir img/system
 * @desc 自動生成される画像ではなく指定した画像をNoDataに使います。未設定だと自動生成。
 *
 * @param GoldText
 * @text 「所持金：」の文字列
 * @default 所持金：
 * @desc セーブデータの所持金の表示する文字列です。未入力にするとセーブ画面に所持金が表示されなくなります。
 *
 * @param PlaceText
 * @text 「現在地：」の文字列
 * @default 現在地：
 * @desc セーブデータの現在地の表示する文字列です。未入力にするとセーブ画面に現在地が表示されなくなります。
 *
 * @param BorderColor
 * @text スクショ画像の縁取り色
 * @default #000000
 * @desc 色をrgbaコードで指定できます。
 * #0000にすると透明。
 * 
 * @param StatusBorderColor
 * @text ファイル詳細の水平線色
 * @default #000000
 * @desc 色をrgbaコードで指定できます。
 * #0000にすると透明。
 *
 * @help
 * KMS_SaveWithSnap.js v0.1.0をもとに追加パッチとして作りました。
 * 必ず合わせてお使いください。
 * このプラグインに関するご質問をTOMY氏にしないようお願いします。
 * 
 * ■使う画像素材(img/...)
 * 〇 必須
 * ・system/saveArrows.png
 * 〇 任意（パラメータで指定）
 * ・system/... .png
 * 
 * ■各自調整用
 * ・セーブデータ数は２０個以下までを想定しています。
 * 　それを超えても動作はしますが、処理落ちが発生する可能性があります。
 * 　このプラグインのパラメータで最大数を変更できます。
 * 
 * ・スクショの画像の粗さはKMSのImage scaleで調整できます。
 * 　この値が大きいほど画質は良くなりますがデータの容量が膨張するため
 * 　アツマールの場合は0.15前後が推奨です。
 * （アツマールはセーブデータの容量が限られているため）
 * 
 * ■更新履歴
 * ver.1.0.0 - 2020/03/20
 * ・公開しました。
 * 
 * ver.1.0.1 - 2020/06/21
 * ・マウスで入力後、入力判定が残っていたため
 * 何度もロードしてしまう不具合を修正しました。
 */

var KMS = KMS || {};
(function() {
KMS.imported = KMS.imported || {};
KMS.imported['SaveWithSnap_KanjiEdit'] = true;

var pluginParams = PluginManager.parameters('KNS_SaveScreenWithSS');
var Params = {};
Params.noDataPic   = String(pluginParams["NoDataPicture"] || "");
Params.borderColor = String(pluginParams["BorderColor"]   || "#000000");
Params.statusBorderColor = String(pluginParams["StatusBorderColor"]   || "#000000");
Params.goldText  = String(pluginParams["GoldText"]);
Params.placeText = String(pluginParams["PlaceText"]);
Params.circleX   = Number(pluginParams["ImageCircleCenterX"] || 408);
Params.circleY   = Number(pluginParams["ImageCircleCenterY"] || 224);
Params.maxSaveFile = Number(pluginParams['SaveFileSize']   || 20);
Params.savefileBitmapWidth = Number(pluginParams['ImageWidth']   || 280);
Params.savefileBitmapHeight = Number(pluginParams['ImageHeight'] || 220);
Params.savefileBitmapHr = Number(pluginParams['ImageHorizontalRadius'] || 400);
Params.savefileBitmapVr = Number(pluginParams['ImageVerticalRadius']   || 80);
pluginParams = null;

// DataManager
const _makeSavefileInfo = DataManager.makeSavefileInfo;
DataManager.makeSavefileInfo = function() {
    var info = _makeSavefileInfo.apply(this, arguments);
    info.gold  = $gameParty.gold();
    info.place = $gameMap.displayName();
    return info;
};

DataManager.maxSavefiles = function() {
    return Params.maxSaveFile;
};


// Sprite_ScreenShot
function Sprite_ScreenShot() {
    this.initialize.apply(this, arguments);
}

Sprite_ScreenShot.prototype = Object.create(Sprite.prototype);
Sprite_ScreenShot.prototype.constructor = Sprite_ScreenShot;

Sprite_ScreenShot.prototype.initialize = function (id, info, max, calced) {
    Sprite.prototype.initialize.call(this, 
        new Bitmap(Params.savefileBitmapWidth, Params.savefileBitmapHeight));
    this.moveCount = this._maxMoveFrame = max;
    this._moveList = calced
    this.anchor.x = this.anchor.y = 0.5;
    this._id = id;
    this._info = info;

    if (info) {
        if (info.faces && info.faces[0]) ImageManager.loadFace(info.faces[0][0]);
        if (info.characters) info.characters.forEach(a => ImageManager.loadCharacter(a[0]))
    }
    this.loadSS();
}

Sprite_ScreenShot.prototype.loadSS = function () {
    return this._info && this._info.snapUrl ? ImageManager.loadNormalBitmap(this._info.snapUrl) : 
           Params.noDataPic ? ImageManager.loadSystem(Params.noDataPic) : null;
}

Sprite_ScreenShot.prototype.update = function () {
    Sprite.prototype.update.call(this);
    if (this.moveCount < this._maxMoveFrame) {
        var rate = this._moveList[this.moveCount++];
        this.x = (this.tx - this.x) * rate + this.x;
        this.y = (this.ty - this.y) * rate + this.y;
    }
}

Sprite_ScreenShot.prototype.refresh = function () {
    this.bitmap.fillAll(Params.borderColor);
    var sw = this.bitmap.width-2, sh = this.bitmap.height-2;

    // スクショを描画
    var bitmap = this.loadSS();
    if (bitmap) {
        this.bitmap.blt(bitmap, 0, 0, bitmap.width, bitmap.height, 1, 1, sw, sh);
    }else{
        // 画像がなければ自動生成
        this.bitmap.gradientFillRect(1, 1, sw, sh, "#444", "#000", true);
        this.bitmap.drawText("NO DATA", 1, 1, sw, sh, "center")
    }

    // ファイルID描画
    var h = 28;
    this.bitmap.drawText(TextManager.file + this._id, 4, 2, sw, h)
    if (this._info) {
        // ファイルを読み込めなければ半透明で文字列を描画
        var valid = DataManager.isThisGameFile(this._id);
        this.bitmap.paintOpacity = valid ? 255 : 128;
        // プレイ時間の描画
        if (this._info.playtime) {
            this.bitmap.drawText(this._info.playtime, 1,sh - h, sw, h, "right")
        }
    }
}



// Game_Party
Game_Party.prototype.facesForSavefile = function() {
    var actor = this.battleMembers()[0];
    return actor ? [[actor.faceName(), actor.faceIndex(), actor.name(), actor.level]] : [];
};



// Window_SSStatus
function Window_SSStatus() {
    this.initialize.apply(this, arguments);
}

Window_SSStatus.prototype = Object.create(Window_Base.prototype);
Window_SSStatus.prototype.constructor = Window_SSStatus;

Window_SSStatus.prototype.initialize = function () {
    Window_Base.prototype.initialize.call(this, 0, Graphics.height - this.windowHeight(), 
        Graphics.width, this.windowHeight());
    this.undef = void(0);
    this.normal = this.normalColor();
    this.system = this.systemColor();
}

Window_SSStatus.prototype.windowHeight = function () {
    return 200;
}

Window_SSStatus.prototype.refresh = function (id, info) {
    this.contents.clear();
    this.drawText(TextManager.file + id, 0, 0, 200);
    this.contents.fillRect(0,34,this.contents.width,2,Params.statusBorderColor)
    if (info) {
        if (info.playtime) {
            this.drawText(info.playtime, 0, 0, this.contents.width, "right");
        }
        if (info.faces) {
            var actor = info.faces[0];
            var y = 40;

            // 一人目の顔
            if (actor[0] && actor[1] !== this.undef) {
                this.drawFace(actor[0], actor[1],0,y);
            }
            // 一人目の名前
            if (actor[2] && actor[3] !== this.undef) {
                this.drawText(actor[2], 150, y, 320);
                this.drawText(actor[3], 380, y, 100, "right");
                this.changeTextColor(this.system);
                this.drawText(TextManager.levelA, 380, y, 100);
                this.changeTextColor(this.normal);
            }
        }
        // パーティの歩行グラ
        if (info.characters) {
            var l = Math.min(info.characters.length, 5);
            for (var i = 0;i < l; i++){
                var chara = info.characters[i];
                this.drawCharacter(chara[0],chara[1], 170 + 77 * i, 160);
            }
        }
        this.contents.fontSize = 24;
        // 所持金
        if (info.gold !== this.undef && Params.goldText) {
            this.changeTextColor(this.system);
            this.drawText(Params.goldText, 500, 40, 200);
            this.drawText(TextManager.currencyUnit, 680, 70, 90, "right");
            this.changeTextColor(this.normal);
            this.drawText(info.gold, 570, 70, 160, "right");
        }
        // 場所
        if (info.place !== this.undef && Params.placeText) {
            this.changeTextColor(this.system);
            this.drawText(Params.placeText, 500, 100, 200);
            this.changeTextColor(this.normal);
            this.drawText(info.place, 500, 130, 270, "right");
        }
        this.contents.fontSize = this.standardFontSize();
    }
}


// Scene_File
const _Scene_File_create = Scene_File.prototype.create;
Scene_File.prototype.create = function() {
    _Scene_File_create.apply(this, arguments);
    this._listWindow.y = Graphics.height
    this.createScreenShots();
    this.createFileTouchSprite();
    this.createFileDataWindow();
}

const _Scene_File_start = Scene_File.prototype.start;
Scene_File.prototype.start = function () {
    _Scene_File_start.apply(this, arguments);
    this._screenShots.forEach(sp => sp.refresh());
    this.refreshFileDataWindow();
    this.updateSettingOfSS();
}

Scene_File.prototype.createHelpWindow = function() {
    this._helpWindow = new Window_Help(1);
    this._helpWindow.setText(this.helpWindowText());
    this.addChild(this._helpWindow);
};

Scene_File.prototype.createFileTouchSprite = function () {
    this._fileTouchSprite = new Sprite(ImageManager.loadSystem("saveArrows"));
    this.addChild(this._fileTouchSprite);
}

Scene_File.prototype.createFileDataWindow = function () {
    this._fileDataWindow = new Window_SSStatus;
    this.addChild(this._fileDataWindow);
}

Scene_File.prototype.refreshFileDataWindow = function () {
    var id = this._listWindow._index;
    var info = this._screenShots[id]._info;
    this._fileDataWindow.refresh(id + 1, info);
}

Scene_File.prototype.createScreenShots = function () {
    this._listWindow.hide();
    this._screenShots = [];
    this._lastIndex = this.firstSavefileIndex()
    this.refreshSS();
}

Scene_File.prototype.refreshSS = function () {
    this._screenShots.length = 0;

    var maxFrame = 7;
    var calced = [];
    for (var i = 1; i <= maxFrame; i++) calced.push(i / maxFrame);

    Graphics.callGC();
    for (var i = 1; i <= this._listWindow.maxItems(); i++) {
        var sp = new Sprite_ScreenShot(i, DataManager.loadSavefileInfo(i), maxFrame, calced);
        sp.x = Params.circleX;
        sp.y = Params.circleY;
        sp.opacity = sp.tOpacity = 0;
        this._screenShots.push(sp);
    };
    this._lHarf = this._listWindow.maxItems() / 2;
    this._Math  = Math.PI / this._lHarf;
}

const _Scene_File_update = Scene_File.prototype.update;
Scene_File.prototype.update = function () {
    _Scene_File_update.apply(this, arguments);
    this.updateInputSS();
    if (this._lastIndex != this._listWindow._index) {
        this._lastIndex = this._listWindow._index;
        this.updateSettingOfSS();
        this.refreshFileDataWindow();
    }
}

Scene_File.prototype.updateInputSS = function () {
    if (!this._listWindow.active) return;
    if (TouchInput.isRepeated() && TouchInput.y < this._fileDataWindow.y && 
        TouchInput.y > this._helpWindow.y + this._helpWindow.height) {

        var spX = this._screenShots[this._listWindow._index].x;
        var w  = Params.savefileBitmapWidth / 2;
        if (spX - w > TouchInput.x) {
            this._listWindow.cursorUp();
            SoundManager.playCursor();
        }else if (TouchInput.x > spX + w) {
            this._listWindow.cursorDown();
            SoundManager.playCursor();
        }else{
            var sp = this._screenShots[this._listWindow._index];
            var h = sp.height / 2;
            if (TouchInput.y < sp.y + h && TouchInput.y > sp.y - h) {
                this._listWindow.processOk();
            }
        }
    }
}

Scene_File.prototype.updateSettingOfSS = function () {
    // set z-axis
    var i = this._listWindow._index;
    var l = this._screenShots.length;
    var j = 1;
    var rank = [i];
    while (rank.length < l) rank.push((l+i+(rank.length%2 ? j : -j++))%l);

    // set positions
    this._screenShots.forEach(sp => {
        var rate = this._Math * (l - i--);
        var thF = Math.cos(rate);
        sp.moveCount = 0;
        sp.tx = Params.circleX + Params.savefileBitmapHr * Math.sin(rate);
        sp.ty = Params.circleY + Params.savefileBitmapVr * thF;
        sp.scale.x = sp.scale.y = Math.max(Math.min(thF * 1.25, 1), 0.625);
        sp.opacity = Math.max(255 * thF, -20) + 90;
        this.removeChild(sp);
    });

    rank.reverse().forEach(r => this.addChild(this._screenShots[r]));
    this.addChild(this._fileTouchSprite);
    this.addChild(this._helpWindow);
    this.addChild(this._fileDataWindow);
}

const _Scene_File_terminate = Scene_File.prototype.terminate;
Scene_File.prototype.terminate = function () {
    _Scene_File_terminate.apply(this, arguments);
    Graphics.callGC();
}


// Window_SavefileList
Window_SavefileList.prototype.refresh = function() {
};

Window_SavefileList.prototype.cursorDown = function(wrap) {
    Window_Selectable.prototype.cursorDown.call(this, true);
};

Window_SavefileList.prototype.cursorUp = function(wrap) {
    Window_Selectable.prototype.cursorUp.call(this, true);
};

Window_SavefileList.prototype.cursorRight = function(wrap) {
    this.cursorDown(true);
};

Window_SavefileList.prototype.cursorLeft = function(wrap) {
    this.cursorUp(true);
};

})();
