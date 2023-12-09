//=============================================================================
// maxItems.js
//=============================================================================

/*:
 * @plugindesc アイテムの最大数を変更。
 * @author 莞爾の草
 *
 * @param maxItem
 * @text アイテムの最大数
 * @default 99
 * @min 1
 * @type number
 */
(function () {
    var plugin = PluginManager.parameters('maxItems');
    param = {};
    param.maxItem = Number(plugin["maxItem"] || 99);
    param.numberWidth = String(param.maxItem);
    plugin = null;
    
    Game_Party.prototype.maxItems = function(item) {
        return param.maxItem;
    };

    Window_ItemList.prototype.drawItemNumber = function(item, x, y, width) {
        if (this.needsNumber()) {
            this.drawText(':', x, y, width - this.textWidth(param.numberWidth), 'right');
            this.drawText($gameParty.numItems(item), x, y, width, 'right');
        }
    };
})()