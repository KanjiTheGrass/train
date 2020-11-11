//=============================================================================
// equipAdjust.js
//=============================================================================
/*:
 * @plugindesc adjust the space of the item list of equip screen.
 * @author Kanji the Grass
 */

/*:ja
 * @plugindesc 装備アイテムの空欄をちょうどいいように調整します。
 * @author 莞爾の草
 */

(function () {
    const _Window_ItemList_makeItemList = Window_ItemList.prototype.makeItemList;
    Window_ItemList.prototype.makeItemList = function() {
        _Window_ItemList_makeItemList.call(this);
        const col = this.maxCols();
        if (this.includes(null) && col > 1) {
            var nullSize = this.maxItems() % col;
            if (!nullSize) nullSize = col;
            for (var i = 0; i < nullSize; i++) this._data.push(null);
        }
    };
})()