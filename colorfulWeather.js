//=============================================================================
// EnemyBook.js
//=============================================================================

/*:
 * @plugindesc Makes weather bitmap colorful.
 * @author Kanji the Grass
 * @param RainColorVariableID
 * @desc ID of Variable which stores color information of RAIN.
 * @type number
 * @default 6
 *
 * @param SnowColorVariableID
 * @desc ID of Variable which stores color information of SNOW.
 * @type number
 * @default 7
 *
 * @param StormColorVariableID
 * @desc ID of Variable which stores color information of STORM.
 * @type number
 * @default 8
 *
 */

/*:ja
 * @plugindesc 天候の画像の色を変更できるようにします
 * @author 莞爾の草
 *
 * @param RainColorVariableID
 * @desc 雨の色の色調を入れる変数IDです。
 * @type number
 * @default 6
 *
 * @param SnowColorVariableID
 * @desc 雪の色の色調を入れる変数IDです。
 * @type number
 * @default 7
 *
 * @param StormColorVariableID
 * @desc 嵐の色の色調を入れる変数IDです。
 * @type number
 * @default 8
 *
 * @help
 * イベントコマンド→変数の操作でウィンドウ下部にあるオペランドの
 * 「スクリプト」にCSSカラーコード※を入れることで天候の画像をその色に
 * することができます。
 *
 * ※カラーコードの書き方
 *　 "rgb(255,0,0)"
 *　 "#ff0000"
 *　 "#f00"
 * 上は全て赤になります。使いやすい形式をお使いください。
 * Googleでcolorpickerと検索するとこの形式で取得できます。
 * 
 * 色に透明度を加える場合
 *　 "rgba(255,0,0, 128)"
 *　 "#ff000088"
 *　 "#f008"
 * 透明度128で表示されます。
 * "red", "blue", "black", "white"等も使えます。
 */

(function() {
    var parameters = PluginManager.parameters('colorfulWeather');
    var rainId = parseInt(parameters['RainColorVariableID'] || 6),
    snowId = parseInt(parameters['SnowColorVariableID'] || 7), 
    stormId = parseInt(parameters['StormColorVariableID'] || 8);

    // Weather
    Weather.prototype._createBitmaps = function() {
        this._createRain();
        this._createStorm();
        this._createSnow();
    };

    Weather.prototype._createRain = function() {
        if (this._rainBitmap) {
            this._rainBitmap.clear()
        }else{
            this._rainBitmap = new Bitmap(1, 60);
        }
        var value = $gameVariables.value(rainId);
        this._rainBitmap.fillAll((typeof value) == "string" ? value : "white");
        $gameVariables._rainWeatherRefresh = false;
    };

    Weather.prototype._createStorm = function() {
        if (this._stormBitmap) {
            this._stormBitmap.clear()
        }else{
            this._stormBitmap = new Bitmap(2, 100);
        }
        var value = $gameVariables.value(stormId);
        this._stormBitmap.fillAll((typeof value) == "string" ? value : "white");
        $gameVariables._stormWeatherRefresh = false;
    };

    Weather.prototype._createSnow = function() {
        if (this._snowBitmap) {
            this._snowBitmap.clear()
        }else{
            this._snowBitmap = new Bitmap(9, 9);
        }
        var value = $gameVariables.value(snowId);
        this._snowBitmap.drawCircle(4, 4, 4, (typeof value) == "string" ? value : "white");
        $gameVariables._snowWeatherRefresh = false;
    };

    // Spriteset_Map
    const _oldUpdate = Spriteset_Map.prototype.update;
    Spriteset_Map.prototype.update = function() {
        if ($gameVariables._rainWeatherRefresh) this._weather._createRain();
        if ($gameVariables._snowWeatherRefresh) this._weather._createSnow();
        if ($gameVariables._stormWeatherRefresh) this._weather._createStorm();
        _oldUpdate.call(this);
    }

    // Game_Variables
    const _oldSetValue = Game_Variables.prototype.setValue;
    Game_Variables.prototype.setValue = function(variableId, value) {
        _oldSetValue.call(this, variableId, value)
        this._rainWeatherRefresh = variableId == rainId;
        this._snowWeatherRefresh = variableId == snowId;
        this._stormWeatherRefresh = variableId == stormId;
    };

})();
