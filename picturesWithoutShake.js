// ------------------------------------------------------
// picturesWithoutShake.js ver.1.00
// ------------------------------------------------------

/*:
 * @plugindesc Lets Pictures not move with screen-shake.
 * @author Kanji the Grass
 * 
 * @param noShakePictureId
 * @desc Specify some picture ID not-shaking. If specified nothing, all pictures don't shake.
 * @default []
 * @min 1
 * @type number[]
 * 
 * @help
 * Ordinary, all "pictures" displayed on the map / battle screen is in the 
 * same parent element as walking characters and the background of battle.
 * 
 * And when you set to shake the screen, the screen is going to shake by 
 * the X-index of the parent element with child elements.
 * 
 * If you use this plugin, specified pictures are going to moves in the 
 * opposite direction of parent element's shaking.
 * That's why pictures doesn't seem they move.
 * 
 * You can divided into some pictures that shake and 
 * others that don't shake.
 */


/*:ja
 * @plugindesc ピクチャが画面のシェイクに連動しないようにします。
 * @author 莞爾の草
 * 
 * @param noShakePictureId
 * @name シェイクしないピクチャID
 * @desc シェイクしないピクチャIDを数値で指定します。何も指定して
 * いないとすべてのピクチャIDがシェイクしなくなります。
 * @default []
 * @min 1
 * @type number[]
 * 
 * @help
 * マップ・戦闘画面に表示されるピクチャは歩行グラフィックや戦闘背景など
 * と同じ親要素の中にあり、画面がシェイクではその親要素のX座標を揺れ動か
 * しているため、連動して揺れ動くようになっています。
 * 
 * このプラグインではシェイクがかかったときに親要素が横に移動する移動分
 * だけ反対方向にピクチャを動かすことで動いてないように見せます。
 * 
 * シェイクするピクチャとしないピクチャで分けることが可能です。
 */

(function () {
	var param = PluginManager.parameters('picturesWithoutShake');
	param.noShakePictureId = eval(param['noShakePictureId']) || [];
	var pictureNeedShake = param.noShakePictureId.length === 0 || 
	param.noShakePictureId.map(function(str) { return parseInt(str) });

	const _Sprite_Picture_init = Sprite_Picture.prototype.initialize;
	Sprite_Picture.prototype.initialize = function(pictureId) {
		this.needShake = pictureNeedShake === true || pictureNeedShake.contains(pictureId);
		_Sprite_Picture_init.apply(this, arguments);
	};

	const _Sprite_Picture_update = Sprite_Picture.prototype.update;
	Sprite_Picture.prototype.update = function() {
		_Sprite_Picture_update.apply(this, arguments);
		if (this.visible && this.needShake) { this.updateShake() };
	};

	Sprite_Picture.prototype.updateShake = function () {
		this.x -= Math.round($gameScreen.shake());
	}
})()