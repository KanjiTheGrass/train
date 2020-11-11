//=============================================================================
// originalMenu.js
//=============================================================================

/*:
 * @plugindesc originalMenu.
 * @author Kanji the Grass
 *
 * @param backGroundImage
 * @default 1
 *
 * @param ImageWidth
 * @type number
 * @default 208
 *
 * @param ImageHeight
 * @type number
 * @default 48
 */

/*:ja
 * @plugindesc メニュー画面を独自のものにします。
 * @author 莞爾の草
 *
 * @param backGroundImage
 * @desc 背景に表示する画像名の変数IDです（画像はSystemに入れてください）。
 * @default 1
 *
 * @param ImageWidth
 * @desc コマンドの画像幅です。この値をいじっても画像の表示は変わりませんがクリックできる範囲は変わります。
 * @type number
 * @default 208
 *
 * @param ImageHeight
 * @desc コマンドの画像高です。コマンド間のスペースの大きさに影響します
 * @type number
 * @default 48
 *
 * @help
 * コマンドに使う画像名はimg/systemファイルにcommand0というような形式で保存してください。
 * (一番目のコマンドはcommand0、二番目はcommand1というように)
 * 
 * 後ろの本の画像もsystemファイルに入れ、画像名は指定の変数の中に文字列で格納して
 * 指定できます。
 * 変数の操作→オペランド「スクリプト」に "bgImage0" というように書くと代入できる。
 * （文字列は半角"で囲ってやる必要があります）
 */

(function() {
    var parameters = PluginManager.parameters('originalMenu');
    var bgImageId = String(parameters['backGroundImage'] || "bgImage0"),
    imageWidth = parseInt(parameters['ImageWidth'] || 208),
    imageHeight = parseInt(parameters['ImageHeight'] || 48);

    Window_MenuCommand.prototype.itemTextAlign = function() {
        return 'center';
    };

    Window_MenuCommand.prototype.windowWidth = function () {
        return imageWidth + this.standardPadding() * 2;
    }

    Window_MenuCommand.prototype.lineHeight = function() {
        return imageHeight;
    };

    Window_MenuCommand.prototype.drawItem = function(index) {};

    const _oldCreateBackground = Scene_Menu.prototype.createBackground;
    Scene_Menu.prototype.createBackground = function() {
        _oldCreateBackground.call(this);
        this._bgSprite = new Sprite(ImageManager.loadSystem($gameVariables.value(bgImageId)));
        this._bgSprite.x = Graphics.boxWidth / 2;
        this._bgSprite.y = Graphics.boxHeight / 2;
        this._bgSprite.opacity = 0;
        this._bgSprite.anchor.x = this._bgSprite.anchor.y = 0.5
        this.addChild(this._bgSprite);
    };

    const _oldCommandWindow = Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow = function() {
        _oldCommandWindow.call(this);
        this._commandWindow.visible = false
        this._commandWindow.x = (Graphics.boxWidth - this._commandWindow.width) / 2;
        this._commandWindow.y = (Graphics.boxHeight - this._commandWindow.height) / 2;
        this._commandSprites = [];
        this._comMax = this._commandWindow.maxItems()
        this._comCentral = parseInt(Graphics.boxWidth / 2);
        for (var i = 0; i < this._comMax; i++) {
            var sp = new Sprite(ImageManager.loadSystem("command" + i));
            sp.bitmap.smooth = true
            sp.x = i % 2 == 0 ? -400 : Graphics.boxWidth + 400;
            sp.kanjiSpecialFadeIn = 0
            sp.anchor.x = 0.5;
            sp.y = this._commandWindow.itemRect(i).y + this._commandWindow.y + 
                   this._commandWindow.standardPadding();
            this.addChild(sp);
            this._commandSprites.push(sp);
        }
    }

    const _oldUpdate = Scene_Menu.prototype.update;
    Scene_Menu.prototype.update = function() {
        _oldUpdate.call(this);
        if (this._bgSprite.opacity < 255) this._bgSprite.opacity += 28;

        var max = 14
        for (var i = 0; i < this._comMax; i++) {
            var sp = this._commandSprites[i];
            if (sp.kanjiSpecialFadeIn < max) {
                sp.x = (this._comCentral - sp.x) * (++sp.kanjiSpecialFadeIn / max) + sp.x;
            }
            if (this._commandWindow._index == i) {
                if (sp.opacity < 255) sp.opacity += 14;
                if (sp.scale.x < 1) sp.scale.x += 0.125
            }else{
                if (sp.opacity > 144) sp.opacity -= 14;
                if (sp.scale.x > 0.875) sp.scale.x -= 0.125
            }
        }
    };
    
    const _oldCreateGoldWindow = Scene_Menu.prototype.createGoldWindow;
    Scene_Menu.prototype.createGoldWindow = function() {
        _oldCreateGoldWindow.call(this);
        this._goldWindow.visible = false;
    };
    
    const _oldCreateStatusWindow = Scene_Menu.prototype.createStatusWindow;
    Scene_Menu.prototype.createStatusWindow = function() {
        _oldCreateStatusWindow.call(this);
        this._statusWindow.visible = false;
    };
})();