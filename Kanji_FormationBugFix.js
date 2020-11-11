 /*:
 * @plugindesc このプラグインは最上部に入れてくださいm(_ _)m
 * @author 莞爾の草
 */
(function(){
    Spriteset_Battle.prototype.createActors = function() {
        this._actorSprites = [];
        for (var i = 0; i < 5; i++) {
            this._actorSprites[i] = new Sprite_Actor();
            this._battleField.addChild(this._actorSprites[i]);
        }
    };
})()